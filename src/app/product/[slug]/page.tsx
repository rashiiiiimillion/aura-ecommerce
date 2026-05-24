import { getProductBySlug, getProductSlugs } from "@/actions/product";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/features/product/image-gallery";
import { ProductInfo } from "@/components/features/product/product-info";
import { RelatedProducts } from "@/components/features/product/related-products";
import { RecentlyViewed } from "@/components/features/product/recently-viewed";

export async function generateStaticParams() {
  const result = await getProductSlugs();
  const products = "success" in result && result.data ? result.data : [];

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const result = await getProductBySlug(params.slug);
  const product = 'success' in result ? result.data : null;

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Aura`,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const result = await getProductBySlug(params.slug);
  const product = 'success' in result ? result.data : null;

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 mb-16 md:mb-24">
          <ImageGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} />
        </div>
        
        <div className="border-t border-border/50 pt-16">
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
          <RecentlyViewed
            product={{
              id: product.id,
              name: product.name,
              price: Number(product.price),
              image: product.images[0] || "/placeholder.svg",
              slug: product.slug,
            }}
          />
        </div>
      </div>
    </div>
  );
}
