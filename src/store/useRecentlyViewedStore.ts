import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  viewedAt: number;
}

interface RecentlyViewedStore {
  products: ViewedProduct[];
  addProduct: (product: Omit<ViewedProduct, 'viewedAt'>) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) => {
        set((state) => {
          // Remove if it already exists to put it at the front
          const filtered = state.products.filter((p) => p.id !== product.id);
          const newProduct = { ...product, viewedAt: Date.now() };
          
          // Keep only the last 10 viewed products
          const updated = [newProduct, ...filtered].slice(0, 10);
          return { products: updated };
        });
      },
      clearHistory: () => set({ products: [] }),
    }),
    {
      name: 'aura-recently-viewed-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
