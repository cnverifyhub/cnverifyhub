import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductById } from '@/data/products';

export interface CartItem {
    productId: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (productId: string, quantity: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setIsOpen: (isOpen: boolean) => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (productId: string, quantity: number) => {
                set((state) => {
                    const existingItem = state.items.find((item: CartItem) => item.productId === productId);
                    if (existingItem) {
                        return {
                            items: state.items.map((item: CartItem) =>
                                item.productId === productId
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            )
                        };
                    }
                    return { items: [...state.items, { productId, quantity }] };
                });
                get().setIsOpen(true);
            },

            removeItem: (productId: string) => {
                set((state) => ({
                    items: state.items.filter((item: CartItem) => item.productId !== productId)
                }));
            },

            updateQuantity: (productId: string, quantity: number) => {
                set((state) => ({
                    items: state.items.map((item: CartItem) =>
                        item.productId === productId
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    )
                }));
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            setIsOpen: (isOpen: boolean) => set({ isOpen }),

            getTotal: () => {
                const subtotal = get().items.reduce((total: number, item: CartItem) => {
                    const product = getProductById(item.productId);
                    if (!product) return total;

                    const qty = item.quantity;
                    let price = product.price.single;
                    if (qty >= 200) price = product.price.bulk200;
                    else if (qty >= 50) price = product.price.bulk50;
                    else if (qty >= 10) price = product.price.bulk10;

                    return total + (price * qty);
                }, 0);

                if (subtotal >= 100) {
                    return subtotal - 15;
                }

                return subtotal;
            },

            getItemCount: () => {
                return get().items.reduce((count: number, item: CartItem) => count + item.quantity, 0);
            }
        }),
        {
            name: 'cnwepro-cart',
            partialize: (state) => ({ items: state.items })
        }
    )
);
