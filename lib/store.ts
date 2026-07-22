import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  variant: string;
  duration: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, variant: string) => void;
  updateQuantity: (id: number, variant: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface WishlistStore {
  items: number[];
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.id === item.id && i.variant === item.variant
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.variant === item.variant
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id, variant) => {
        set({ items: get().items.filter((i) => !(i.id === id && i.variant === variant)) });
      },
      updateQuantity: (id, variant, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, variant);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id && i.variant === variant ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "premshop-cart" }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (id) => {
        const items = get().items;
        if (items.includes(id)) {
          set({ items: items.filter((i) => i !== id) });
        } else {
          set({ items: [...items, id] });
        }
      },
      isWishlisted: (id) => get().items.includes(id),
    }),
    { name: "premshop-wishlist" }
  )
);
