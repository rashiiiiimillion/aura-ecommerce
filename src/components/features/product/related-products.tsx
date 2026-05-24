import { getProducts } from "@/actions/product";
import { ProductCard } from "@/components/features/catalog/product-card";
import { SerializedProduct } from "@/types/product";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const result = await getProducts({ categoryId, take: 4 });
  const products = 'success' in result ? result.data.filter((p: SerializedProduct) => p.id !== currentProductId) : [];

  if (!products || products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-heading font-light uppercase tracking-wide">
          You May Also Like
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.slice(0, 4).map((product: SerializedProduct) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
