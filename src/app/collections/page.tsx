import { getProducts } from "@/actions/product";
import { CollectionsClient } from "@/components/features/catalog/collections-client";

export const metadata = {
  title: "Collections | Aura Luxury",
  description: "Explore our premium collection of luxury apparel and accessories.",
};

export default async function CollectionsPage(props: {
  searchParams: Promise<{ category?: string; featured?: string }>;
}) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams.category;
  const isFeatured = searchParams.featured === "true";

  const result = await getProducts({
    categorySlug,
    isFeatured,
  });
  const products = 'success' in result ? result.data : [];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <CollectionsClient 
          products={products || []} 
          categorySlug={categorySlug}
          isFeatured={isFeatured}
        />
      </div>
    </div>
  );
}
