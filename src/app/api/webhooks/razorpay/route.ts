import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "@/lib/emails";

/**
 * Razorpay Webhook Handler
 * Listens for `payment.captured` and `payment.failed` events.
 * Verifies webhook signature and updates order/payment/inventory accordingly.
 *
 * Configure this URL in Razorpay Dashboard → Webhooks:
 *   POST /api/webhooks/razorpay
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("x-razorpay-signature");

  if (!signature) {
    return new NextResponse("Missing webhook signature", { status: 400 });
  }

  // 1. Verify Webhook Signature
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("Razorpay webhook signature verification failed");
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // 2. Parse event
  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const eventType = event.event;
  const payment = event.payload?.payment?.entity;

  if (!payment) {
    return new NextResponse("No payment entity in event", { status: 400 });
  }

  const razorpayOrderId = payment.order_id;
  const razorpayPaymentId = payment.id;

  // 3. Handle payment events
  if (eventType === "payment.captured") {
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId },
      include: { items: true },
    });

    if (!order) {
      console.error(`Order not found for Razorpay order: ${razorpayOrderId}`);
      return new NextResponse("Order not found", { status: 404 });
    }

    // Skip if already processed (idempotency)
    if (order.paymentStatus === "COMPLETED") {
      return new NextResponse(null, { status: 200 });
    }

    await prisma.$transaction(async (tx) => {
      // Update Order Status
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          paymentStatus: "COMPLETED",
        },
      });

      // Create Payment Record (if not already created by verifyPaymentSignature)
      const existingPayment = await tx.payment.findUnique({
        where: { orderId: order.id },
      });

      if (!existingPayment) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            amount: (payment.amount || 0) / 100,
            currency: (payment.currency || "inr").toUpperCase(),
            provider: "RAZORPAY",
            transactionId: razorpayPaymentId,
            status: "COMPLETED",
          },
        });
      }

      // Decrement Inventory
      for (const item of order.items) {
        const inventory = await tx.inventory.findUnique({
          where: { productId: item.productId },
        });
        if (inventory && inventory.quantity >= item.quantity) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Clear Cart
      const userId = order.userId;
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    });

    // Send Confirmation Email (async, outside transaction)
    try {
      const email = payment.email || payment.notes?.email;
      if (email) {
        const orderWithItems = await prisma.order.findUnique({
          where: { id: order.id },
          include: { items: { include: { product: true } } },
        });

        if (orderWithItems) {
          await sendOrderConfirmationEmail({
            to: email,
            orderId: orderWithItems.id,
            total: Number(orderWithItems.total),
            items: orderWithItems.items,
          });
        }
      }
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the webhook for email errors
    }
  } else if (eventType === "payment.failed") {
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId },
    });

    if (order && order.paymentStatus !== "COMPLETED") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
          status: "CANCELLED",
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
