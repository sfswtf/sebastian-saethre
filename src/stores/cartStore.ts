import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  merch_id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image_url?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (merchId: string, size?: string, color?: string) => void;
  updateQuantity: (merchId: string, quantity: number, size?: string, color?: string) => void;
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
        const key = `${item.merch_id}-${item.size || ''}-${item.color || ''}`;
        const existingIndex = existingItems.findIndex(
          i => `${i.merch_id}-${i.size || ''}-${i.color || ''}` === key
        );

        if (existingIndex >= 0) {
          const updated = [...existingItems];
          updated[existingIndex].quantity += item.quantity || 1;
          set({ items: updated });
        } else {
          set({ items: [...existingItems, { ...item, quantity: item.quantity || 1 }] });
        }
      },
      removeItem: (merchId, size, color) => {
        const key = `${merchId}-${size || ''}-${color || ''}`;
        set({
          items: get().items.filter(
            i => `${i.merch_id}-${i.size || ''}-${i.color || ''}` !== key
          ),
        });
      },
      updateQuantity: (merchId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(merchId, size, color);
          return;
        }
        const key = `${merchId}-${size || ''}-${color || ''}`;
        set({
          items: get().items.map(item =>
            `${item.merch_id}-${item.size || ''}-${item.color || ''}` === key
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
