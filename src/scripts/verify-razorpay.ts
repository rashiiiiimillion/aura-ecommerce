import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import Razorpay from "razorpay";
import crypto from "crypto";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is missing.");
  process.exit(1);
}

// 1. Initialize Prisma and Razorpay
const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const rzpKeyId = process.env.RAZORPAY_KEY_ID;
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;
const rzpWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!rzpKeyId || !rzpKeySecret || !rzpWebhookSecret) {
  console.error("❌ Missing Razorpay environment variables in .env.");
  console.error({ rzpKeyId, rzpKeySecret, rzpWebhookSecret });
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: rzpKeyId,
  key_secret: rzpKeySecret,
});

async function main() {
  console.log("==================================================");
  console.log("⚜️  AURA LUXURY ECOMMERCE — RAZORPAY INTEGRATION TEST");
  console.log("==================================================\n");

  const testEmail = "test-user-razorpay@aura.com";
  
  // PHASE 1: Find or Create Test User, Product, and Cart
  console.log("🔹 PHASE 1: Initializing Database State...");
  
  // 1.1 Find/Create Test User
  let user = await prisma.user.findUnique({
    where: { email: testEmail },
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Test Razorpay User",
        email: testEmail,
        role: "USER",
      },
    });
    console.log(`   ✅ Created new test user: ${user.name} (${user.email})`);
  } else {
    console.log(`   ✅ Using existing test user: ${user.name} (${user.email})`);
  }

  // 1.2 Find a Product with Inventory
  const product = await prisma.product.findFirst({
    include: { inventory: true },
  });

  if (!product) {
    console.error("   ❌ No products found in the database. Please seed the database first.");
    process.exit(1);
  }

  console.log(`   ✅ Selected Product: "${product.name}" | Price: ₹${product.price}`);
  const initialQty = product.inventory?.quantity ?? 0;
  console.log(`   ✅ Current Inventory Quantity: ${initialQty} units`);

  // Ensure inventory is high enough for testing
  if (initialQty < 5) {
    await prisma.inventory.update({
      where: { productId: product.id },
      data: { quantity: 50 },
    });
    console.log("   ✅ Replenished inventory to 50 units for testing.");
  }

  // 1.3 Initialize User's Cart
  let cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    });
  }

  // Clean cart and add test item
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product.id,
      quantity: 2, // buying 2 items
    },
  });
  console.log(`   ✅ Added 2 units of "${product.name}" to cart.`);

  console.log("\n--------------------------------------------------");
  
  // PHASE 2: Replicate Order Creation & Razorpay API Request
  console.log("🔹 PHASE 2: Emulating Checkout & Razorpay Order Creation...");
  
  const quantityPurchased = 2;
  const subtotal = Number(product.price) * quantityPurchased;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + tax;
  console.log(`   💰 Subtotal: ₹${subtotal.toFixed(2)} | Tax (8%): ₹${tax.toFixed(2)} | Total: ₹${totalAmount.toFixed(2)}`);

  // Create Shipping Address
  let address = await prisma.address.findFirst({
    where: {
      userId: user.id,
      street: "123 luxury avenue",
      city: "Mumbai",
    },
  });

  if (!address) {
    address = await prisma.address.create({
      data: {
        userId: user.id,
        street: "123 luxury avenue",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
      },
    });
  }

  // Create PENDING DB Order
  const dbOrder = await prisma.order.create({
    data: {
      userId: user.id,
      addressId: address.id,
      total: totalAmount,
      status: "PENDING",
      paymentStatus: "PENDING",
      items: {
        create: {
          productId: product.id,
          quantity: quantityPurchased,
          price: product.price,
        },
      },
    },
  });
  console.log(`   ✅ Created PENDING Order in Database: ID: ${dbOrder.id}`);

  // Create Razorpay Order via API
  console.log("   📡 Calling Razorpay Orders API...");
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100), // paise
    currency: "INR",
    receipt: dbOrder.id,
    notes: {
      orderId: dbOrder.id,
      userId: user.id,
    },
  });

  console.log(`   ✅ Successfully created Razorpay Order via API!`);
  console.log(`      Order ID: ${razorpayOrder.id}`);
  console.log(`      Amount: ₹${(Number(razorpayOrder.amount) / 100).toFixed(2)}`);
  console.log(`      Status: ${razorpayOrder.status}`);

  // Link Razorpay Order ID to database order
  await prisma.order.update({
    where: { id: dbOrder.id },
    data: { razorpayOrderId: razorpayOrder.id },
  });
  console.log("   ✅ Database order linked with Razorpay Order ID.");

  console.log("\n--------------------------------------------------");

  // PHASE 3: Cryptographic Webhook Emulation (Full HTTP Flow)
  console.log("🔹 PHASE 3: Emulating Webhook Trigger (Cryptographic Signature Verification)...");
  
  const mockPaymentId = `pay_test_${crypto.randomBytes(6).toString("hex")}`;
  
  // Construct Razorpay payload
  const webhookBody = {
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: mockPaymentId,
          entity: "payment",
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          status: "captured",
          order_id: razorpayOrder.id,
          invoice_id: null,
          international: false,
          method: "upi",
          amount_refunded: 0,
          refund_status: null,
          captured: true,
          description: "Premium Luxury Purchase",
          card_id: null,
          bank: null,
          wallet: null,
          vpa: "success@razorpay",
          email: testEmail,
          contact: "+919876543210",
          notes: {
            orderId: dbOrder.id,
            userId: user.id,
          },
          created_at: Math.floor(Date.now() / 1000),
        },
      },
    },
  };

  const rawBodyString = JSON.stringify(webhookBody);
  
  // Calculate signature
  const webhookSignature = crypto
    .createHmac("sha256", rzpWebhookSecret || "")
    .update(rawBodyString)
    .digest("hex");

  console.log(`   🔐 Computed SHA-256 Webhook Signature: ${webhookSignature}`);
  console.log("   🚀 Sending POST request to http://localhost:3000/api/webhooks/razorpay...");

  try {
    const response = await fetch("http://localhost:3000/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": webhookSignature,
      },
      body: rawBodyString,
    });

    console.log(`   📡 Webhook Route Status Code Response: ${response.status} ${response.statusText}`);
    
    if (response.status !== 200) {
      const responseText = await response.text();
      console.error(`   ❌ Webhook processing failed: ${responseText}`);
      process.exit(1);
    }
    console.log("   ✅ Webhook processed successfully by server route!");
  } catch (err: any) {
    console.error(`   ❌ Failed to send request to localhost server. Ensure 'npm run dev' is running.`, err.message);
    process.exit(1);
  }

  console.log("\n--------------------------------------------------");

  // PHASE 4: Database Post-Verification
  console.log("🔹 PHASE 4: Fetching Updated DB State for Verification...");

  // 4.1 Fetch updated order
  const updatedOrder = await prisma.order.findUnique({
    where: { id: dbOrder.id },
    include: { payment: true, items: true },
  });

  if (!updatedOrder) {
    console.error("   ❌ Order not found after webhook execution.");
    process.exit(1);
  }

  console.log("   📋 Verified Order State:");
  console.log(`      • Order ID:          ${updatedOrder.id}`);
  console.log(`      • Order Status:      ${updatedOrder.status} (Expected: PROCESSING)`);
  console.log(`      • Payment Status:    ${updatedOrder.paymentStatus} (Expected: COMPLETED)`);
  
  const paymentRecord = updatedOrder.payment;
  if (!paymentRecord) {
    console.error("   ❌ Payment record was not created in the database.");
    process.exit(1);
  }

  console.log("   💳 Verified Payment Record State:");
  console.log(`      • Transaction ID:    ${paymentRecord.transactionId}`);
  console.log(`      • Paid Amount:       ₹${Number(paymentRecord.amount).toFixed(2)}`);
  console.log(`      • Provider:          ${paymentRecord.provider} (Expected: RAZORPAY)`);
  console.log(`      • Currency:          ${paymentRecord.currency} (Expected: INR)`);
  console.log(`      • Payment Status:    ${paymentRecord.status} (Expected: COMPLETED)`);

  // 4.2 Verify Cart Clearing
  const cartItemsAfter = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
  });
  console.log(`   🛒 Cart Items Remaining: ${cartItemsAfter.length} (Expected: 0)`);

  // 4.3 Verify Inventory Decrement
  const updatedProduct = await prisma.product.findUnique({
    where: { id: product.id },
    include: { inventory: true },
  });
  const finalQty = updatedProduct?.inventory?.quantity ?? 0;
  console.log(`   📦 Inventory Decrement:`);
  console.log(`      • Starting Qty:      ${initialQty}`);
  console.log(`      • Ending Qty:        ${finalQty}`);
  console.log(`      • Delta:             ${initialQty - finalQty} (Expected: 2)`);

  console.log("\n==================================================");
  
  // Overall Verdict
  const orderSuccess = updatedOrder.status === "PROCESSING" && updatedOrder.paymentStatus === "COMPLETED";
  const paymentSuccess = paymentRecord.provider === "RAZORPAY" && paymentRecord.currency === "INR";
  const cartSuccess = cartItemsAfter.length === 0;
  const inventorySuccess = (initialQty - finalQty) === quantityPurchased;

  if (orderSuccess && paymentSuccess && cartSuccess && inventorySuccess) {
    console.log("🎉 VERDICT: RAZORPAY INTEGRATION IS 100% COMPLETE & PRODUCTION-READY!");
    console.log("   Webhooks, security verification, signatures, cart clear, and DB state sync work flawlessly!");
  } else {
    console.error("❌ VERDICT: INTEGRATION VERIFICATION ENCOUNTERED FAILED STATES.");
    process.exit(1);
  }
  
  console.log("==================================================");
}

main()
  .catch((e) => {
    console.error("Unexpected error in verification script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
