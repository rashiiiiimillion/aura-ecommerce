import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

interface CartStore {
  items: CartItem[];
  directCheckoutItem: CartItem | null;
  hasHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDirectCheckoutItem: (item: CartItem | null) => void;
  clearDirectCheckout: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      directCheckoutItem: null,
      hasHydrated: false,
      setDirectCheckoutItem: (item) => set({ directCheckoutItem: item }),
      clearDirectCheckout: () => set({ directCheckoutItem: null }),
      addItem: (newItem) => {
        set((state) => {
          // Check if item with same ID and variant already exists
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.variant?.size === newItem.variant?.size && item.variant?.color === newItem.variant?.color
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }
          
          return { items: [...state.items, { ...newItem, id: Math.random().toString(36).substring(7) }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'aura-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
