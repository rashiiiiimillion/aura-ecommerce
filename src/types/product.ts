export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  categoryId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  isFeatured: boolean;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
  } | null;
  inventory?: {
    id: string;
    productId: string;
    quantity: number;
    sku: string;
  } | null;
}
