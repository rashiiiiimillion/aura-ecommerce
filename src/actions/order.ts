"use server";

import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { handleActionError, AppError } from "@/lib/utils/errors";
import { CartItem } from "@/store/useCartStore";
import crypto from "crypto";

/**
 * Creates a Razorpay order and a PENDING database order.
 * Returns the Razorpay order ID + key for the frontend checkout popup.
 */
export async function createRazorpayOrder(items: CartItem[], shippingAddress: {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AppError("Authentication required for checkout", 401);
    }

    // 1. Inventory Validation & Price Check
    const productIds = items.map(item => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { inventory: true }
    });

    for (const item of items) {
      const dbProduct = dbProducts.find((p: any) => p.id === item.productId);
      if (!dbProduct) throw new AppError(`Product ${item.name} not found`, 404);
      if (dbProduct.inventory && dbProduct.inventory.quantity < item.quantity) {
        throw new AppError(`Insufficient inventory for ${item.name}`, 400);
      }
    }

    // 2. Calculate totals (INR)
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    // 3. Create PENDING Order in DB
    const order = await prisma.$transaction(async (tx: any) => {
      // Create or get address
      let address = await tx.address.findFirst({
        where: {
          userId,
          street: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
        },
      });

      if (!address) {
        address = await tx.address.create({
          data: {
            userId,
            street: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
        });
      }

      return tx.order.create({
        data: {
          userId,
          addressId: address.id,
          total,
          status: "PENDING",
          paymentStatus: "PENDING",
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    });

    // 4. Create Razorpay Order
    // Razorpay expects amount in smallest currency unit (paise for INR)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: order.id,
      notes: {
        orderId: order.id,
        userId: userId,
      },
    });

    // 5. Link the Razorpay order ID to our DB order
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return {
      success: true,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID!,
      amount: Math.round(total * 100),
      currency: "INR",
      orderId: order.id,
      prefill: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: shippingAddress.email,
        contact: shippingAddress.phone || "",
      },
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Verifies the Razorpay payment signature after the frontend popup closes.
 * On success: marks order as PROCESSING/COMPLETED, creates payment record,
 * decrements inventory, clears cart.
 */
export async function verifyPaymentSignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

    // 1. Verify signature using HMAC SHA256
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new AppError("Payment verification failed — invalid signature", 400);
    }

    // 2. Find the order by Razorpay order ID
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { items: true },
    });

    if (!order) {
      throw new AppError("Order not found for the given payment", 404);
    }

    if (order.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    // Prevent double-processing
    if (order.paymentStatus === "COMPLETED") {
      return { success: true, orderId: order.id };
    }

    // 3. Update order + create payment + decrement inventory + clear cart
    await prisma.$transaction(async (tx: any) => {
      // Update Order Status
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          paymentStatus: "COMPLETED",
        },
      });

      // Create Payment Record
      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: Number(order.total),
          currency: "INR",
          provider: "RAZORPAY",
          transactionId: razorpay_payment_id,
          status: "COMPLETED",
        },
      });

      // Decrement Inventory
      for (const item of order.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear server-side Cart
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    return handleActionError(error);
  }
}
