import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.wishlistProduct.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  // Clean Users
  await prisma.user.deleteMany({
    where: { email: 'admin@aura.com' }
  });

  // Create Admin User
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@aura.com',
      password: hashedPassword,
      role: 'ADMIN',
    }
  });
  console.log('Created Admin User: admin@aura.com');

  // Categories
  const menCategory = await prisma.category.create({
    data: {
      name: "Men",
      slug: 'mens',
      description: 'Elevated essentials for the modern man.',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop',
    },
  });

  const womenCategory = await prisma.category.create({
    data: {
      name: "Women",
      slug: 'womens',
      description: 'Timeless elegance and contemporary silhouettes.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Refined details to complete your look.',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2038&auto=format&fit=crop',
    },
  });

  const footwearCategory = await prisma.category.create({
    data: {
      name: 'Footwear',
      slug: 'footwear',
      description: 'Impeccable craftsmanship for every step.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
    },
  });

  const essentialsCategory = await prisma.category.create({
    data: {
      name: 'Luxury Essentials',
      slug: 'essentials',
      description: 'The foundation of a premium wardrobe.',
      image: 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?q=80&w=1974&auto=format&fit=crop',
    },
  });

  // Products
  const products = [
    // WOMEN
    {
      name: 'Silk Evening Slip Dress',
      slug: 'silk-evening-slip-dress',
      description: 'A bias-cut masterpiece in heavy silk charmeuse. The fluid drape follows the bodys natural contours, falling to a graceful midi length. Complete with delicate spaghetti straps and a subtle cowl neckline.',
      price: 1200.00,
      images: [
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'
      ],
      categoryId: womenCategory.id,
      isFeatured: true,
      sku: 'W-DRSS-001',
      inventory: 25,
    },
    {
      name: 'Cashmere Ribbed Sweater',
      slug: 'cashmere-ribbed-sweater',
      description: 'Woven from exceptionally soft Mongolian cashmere. Features a slightly oversized fit, dropped shoulders, and a thick ribbed mock neck for ultimate winter luxury.',
      price: 420.00,
      comparePrice: 500.00,
      images: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop'
      ],
      categoryId: womenCategory.id,
      isFeatured: true,
      sku: 'W-SWTR-001',
      inventory: 75,
    },
    {
      name: 'Pleated Wool Trousers',
      slug: 'pleated-wool-trousers',
      description: 'High-waisted trousers tailored from virgin wool. Featuring sharp front pleats, side slash pockets, and a relaxed wide-leg silhouette.',
      price: 680.00,
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: womenCategory.id,
      isFeatured: false,
      sku: 'W-TRSR-001',
      inventory: 40,
    },
    {
      name: 'Alabaster Satin Column Gown',
      slug: 'alabaster-satin-column-gown',
      description: 'A sculptural evening gown cut from luminous satin with a clean column silhouette, internal corsetry, and a low architectural back. Designed for modern formal dressing without ornament.',
      price: 1480.00,
      images: [
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: womenCategory.id,
      isFeatured: true,
      sku: 'W-GOWN-001',
      inventory: 18,
    },
    {
      name: 'Double Face Camel Coat',
      slug: 'double-face-camel-coat',
      description: 'Hand-finished double-face wool and cashmere coat with a fluid wrap profile, detachable belt, and nearly invisible seams for a quiet, gallery-like silhouette.',
      price: 1890.00,
      images: [
        'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop'
      ],
      categoryId: womenCategory.id,
      isFeatured: true,
      sku: 'W-COAT-001',
      inventory: 22,
    },

    // MEN
    {
      name: 'Classic Wool Overcoat',
      slug: 'classic-wool-overcoat',
      description: 'Crafted from 100% premium Italian wool, this overcoat offers an unlined, relaxed silhouette perfect for transitional weather. Features include horn buttons, deep welt pockets, and a dramatic sweeping length.',
      price: 895.00,
      comparePrice: 1100.00,
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1760&auto=format&fit=crop',
      ],
      categoryId: menCategory.id,
      isFeatured: true,
      sku: 'M-COAT-001',
      inventory: 50,
    },
    {
      name: 'Tailored Linen Suit Jacket',
      slug: 'tailored-linen-suit-jacket',
      description: 'Unstructured and breathable. This linen-blend blazer features patch pockets, functioning button cuffs, and a soft shoulder line for a relaxed yet refined aesthetic.',
      price: 650.00,
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: menCategory.id,
      isFeatured: true,
      sku: 'M-JKT-001',
      inventory: 30,
    },
    {
      name: 'Merino Wool Polo',
      slug: 'merino-wool-polo',
      description: 'A refined take on the classic polo. Knit from ultra-fine Merino wool for a soft, breathable finish. Perfect for layering under a blazer or wearing solo.',
      price: 220.00,
      images: [
        'https://images.unsplash.com/photo-1626497764746-6dc36546b388?q=80&w=1926&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: menCategory.id,
      isFeatured: false,
      sku: 'M-POLO-001',
      inventory: 85,
    },
    {
      name: 'Midnight Velvet Dinner Jacket',
      slug: 'midnight-velvet-dinner-jacket',
      description: 'A sharply tailored evening jacket in deep black cotton velvet with satin peak lapels, soft canvassing, and a restrained single-button closure.',
      price: 1325.00,
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1971&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: menCategory.id,
      isFeatured: true,
      sku: 'M-DINNER-001',
      inventory: 16,
    },
    {
      name: 'Garment Dyed Suede Overshirt',
      slug: 'garment-dyed-suede-overshirt',
      description: 'A relaxed overshirt in supple goat suede, garment dyed for tonal depth and finished with concealed snaps and oversized utility pockets.',
      price: 980.00,
      images: [
        'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: menCategory.id,
      isFeatured: false,
      sku: 'M-SUEDE-001',
      inventory: 28,
    },

    // ACCESSORIES
    {
      name: 'Structured Leather Tote',
      slug: 'structured-leather-tote',
      description: 'Minimalist architecture meets daily functionality. Handcrafted from full-grain calfskin leather with hand-painted edges and solid brass hardware. Roomy enough for a 15-inch laptop.',
      price: 550.00,
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2038&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1915&auto=format&fit=crop'
      ],
      categoryId: accessoriesCategory.id,
      isFeatured: true,
      sku: 'A-BAG-001',
      inventory: 100,
    },
    {
      name: 'Oversized Silk Scarf',
      slug: 'oversized-silk-scarf',
      description: 'Woven in Como, Italy, this 100% silk twill scarf features a geometric abstract print with hand-rolled edges. A versatile statement piece.',
      price: 185.00,
      images: [
        'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: accessoriesCategory.id,
      isFeatured: false,
      sku: 'A-SCRF-001',
      inventory: 120,
    },
    {
      name: 'Acetate Sunglasses',
      slug: 'acetate-sunglasses',
      description: 'Chunky, angular frames carved from premium Italian acetate. Fitted with polarized CR-39 lenses offering 100% UV protection.',
      price: 295.00,
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2070&auto=format&fit=crop'
      ],
      categoryId: accessoriesCategory.id,
      isFeatured: true,
      sku: 'A-SUN-001',
      inventory: 60,
    },
    {
      name: 'Brushed Steel Signet Ring',
      slug: 'brushed-steel-signet-ring',
      description: 'A weighty signet ring in brushed stainless steel with softened edges and a mirror-polished interior. Minimal, durable, and intentionally unbranded.',
      price: 210.00,
      images: [
        'https://images.unsplash.com/photo-1603561596112-0a132b757442?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: accessoriesCategory.id,
      isFeatured: false,
      sku: 'A-RING-001',
      inventory: 90,
    },
    {
      name: 'Grained Leather Card Case',
      slug: 'grained-leather-card-case',
      description: 'Slim card case cut from full-grain leather with six slots, a central pocket, and hand-painted edges. Built for a jacket pocket, not a desk drawer.',
      price: 165.00,
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1915&auto=format&fit=crop'
      ],
      categoryId: accessoriesCategory.id,
      isFeatured: true,
      sku: 'A-CARD-001',
      inventory: 140,
    },

    // FOOTWEAR
    {
      name: 'Leather Chelsea Boots',
      slug: 'leather-chelsea-boots',
      description: 'The quintessential Chelsea boot, redefined. Featuring a sleek almond toe, stacked leather heel, and elasticized side panels. Crafted from smooth Italian calf leather.',
      price: 495.00,
      images: [
        'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: footwearCategory.id,
      isFeatured: true,
      sku: 'F-BOOT-001',
      inventory: 45,
    },
    {
      name: 'Minimalist Leather Sneakers',
      slug: 'minimalist-leather-sneakers',
      description: 'Handmade in Portugal, these low-top sneakers feature an entirely unbranded, pristine white leather upper set on a durable Margom rubber sole.',
      price: 250.00,
      comparePrice: 300.00,
      images: [
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop'
      ],
      categoryId: footwearCategory.id,
      isFeatured: false,
      sku: 'F-SNEAK-001',
      inventory: 150,
    },
    {
      name: 'Patent Leather Slingback Heel',
      slug: 'patent-leather-slingback-heel',
      description: 'A refined slingback pump in glossy patent leather with a pointed toe, sculpted kitten heel, and cushioned leather insole for evening-to-late-evening wear.',
      price: 620.00,
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1760&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: footwearCategory.id,
      isFeatured: true,
      sku: 'F-HEEL-001',
      inventory: 38,
    },
    {
      name: 'Handwelted Oxford Shoe',
      slug: 'handwelted-oxford-shoe',
      description: 'Cap-toe oxford shoes made from polished calf leather with closed lacing, handwelted construction, and a stacked leather sole.',
      price: 740.00,
      images: [
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: footwearCategory.id,
      isFeatured: false,
      sku: 'F-OXF-001',
      inventory: 34,
    },

    // ESSENTIALS
    {
      name: 'Supima Cotton Heavyweight Tee',
      slug: 'supima-cotton-heavyweight-tee',
      description: 'The perfect white tee. Knitted from ultra-dense 9oz Supima cotton for a structured, opaque drape that holds its shape wash after wash.',
      price: 85.00,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: essentialsCategory.id,
      isFeatured: false,
      sku: 'E-TEE-001',
      inventory: 300,
    },
    {
      name: 'Organic Cotton Oxford Shirt',
      slug: 'organic-cotton-oxford-shirt',
      description: 'A timeless button-down tailored from substantial organic cotton oxford cloth. Designed with a casual unlined collar and a slightly relaxed fit.',
      price: 145.00,
      images: [
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop'
      ],
      categoryId: essentialsCategory.id,
      isFeatured: true,
      sku: 'E-SHRT-001',
      inventory: 200,
    },
    {
      name: 'Italian Loopback Sweatshirt',
      slug: 'italian-loopback-sweatshirt',
      description: 'Dense loopback cotton fleece with a relaxed boxy shape, ribbed side panels, and a dry handfeel that makes the everyday layer feel intentional.',
      price: 195.00,
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618354691551-44de113f0164?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: essentialsCategory.id,
      isFeatured: true,
      sku: 'E-SWEAT-001',
      inventory: 160,
    },
    {
      name: 'Sea Island Cotton Socks',
      slug: 'sea-island-cotton-socks',
      description: 'Fine-gauge dress socks knitted from Sea Island cotton with reinforced toe and heel, soft ribbing, and a clean calf-length profile.',
      price: 48.00,
      images: [
        'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1974&auto=format&fit=crop'
      ],
      categoryId: essentialsCategory.id,
      isFeatured: false,
      sku: 'E-SOCK-001',
      inventory: 260,
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        categoryId: product.categoryId,
        isFeatured: product.isFeatured,
        inventory: {
          create: {
            quantity: product.inventory,
            sku: product.sku,
          }
        }
      }
    });
  }

  console.log('Database seeding completed. Total products:', products.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
