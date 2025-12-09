import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  product_type?: 'download' | 'access_code' | 'subscription' | 'service';
  delivery_method?: 'email' | 'instant' | 'manual';
  image_url?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItems = get().items;
        const existingIndex = existingItems.findIndex(
          i => i.product_id === item.product_id
        );

        if (existingIndex >= 0) {
          const updated = [...existingItems];
          updated[existingIndex].quantity += item.quantity || 1;
          set({ items: updated });
        } else {
          set({ items: [...existingItems, { ...item, quantity: item.quantity || 1 }] });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter(i => i.product_id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.product_id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);


