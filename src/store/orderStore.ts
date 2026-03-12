import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled';

export interface OrderItem {
    productId: string;
    quantity: number;
    priceAtTime: number;
}

export interface Order {
    id: string; // The public custom Order ID (e.g., CNW-...)
    email: string;
    cryptoType: string;
    txid: string; // Transaction Hash
    status: OrderStatus;
    txVerified: boolean; // Whether blockchain verification passed
    verificationDetails?: {
        amount: string;
        from: string;
        to: string;
        token: string;
        timestamp: number;
        confirmed: boolean;
    };
    createdAt: string;
    items: OrderItem[];
    totalAmount: number;
    deliveredAccounts: string[]; // E.g., ["Account1: Pass1", "Account2: Pass2"]
}

interface OrderState {
    orders: Order[];
    addOrder: (order: Omit<Order, 'status' | 'deliveredAccounts' | 'txVerified'> & { txVerified?: boolean; verificationDetails?: Order['verificationDetails'] }) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    deliverAccountsToOrder: (orderId: string, accounts: string[]) => void;
    getOrderById: (orderId: string, email?: string) => Order | undefined;
    getAllOrders: () => Order[];

    // Auth state for Admin panel strictly inside browser local storage
    isAdminAuthenticated: boolean;
    loginAdmin: (password: string) => boolean;
    logoutAdmin: () => void;
}

// Hardcoded frontend password for the static Netlify export (NOT SECURE for production backends, but works for local static builds to prevent casual snooping)
const MOCK_ADMIN_PASS = "admin888";

export const useOrderStore = create<OrderState>()(
    persist(
        ((set: any, get: any): OrderState => ({
            orders: [],
            isAdminAuthenticated: false,

            addOrder: (orderData) => {
                const newOrder: Order = {
                    ...orderData,
                    status: orderData.txVerified ? 'paid' : 'pending',
                    txVerified: orderData.txVerified || false,
                    deliveredAccounts: []
                };
                set((state: OrderState) => ({
                    orders: [newOrder, ...state.orders]
                }));
            },

            updateOrderStatus: (orderId: string, status: OrderStatus) => {
                set((state: OrderState) => ({
                    orders: state.orders.map(order =>
                        order.id === orderId ? { ...order, status } : order
                    )
                }));
            },

            deliverAccountsToOrder: (orderId: string, accounts: string[]) => {
                set((state: OrderState) => ({
                    orders: state.orders.map(order =>
                        order.id === orderId ? {
                            ...order,
                            deliveredAccounts: accounts,
                            status: 'completed' // Auto-complete when accounts are sent
                        } : order
                    )
                }));
            },

            getOrderById: (orderId: string, email?: string) => {
                const state = get();
                const order = state.orders.find((o: Order) => o.id === orderId);

                if (!order) return undefined;

                // If email is provided, verify it (used for client portal)
                if (email && order.email.toLowerCase() !== email.toLowerCase()) {
                    return undefined;
                }

                return order;
            },

            getAllOrders: () => {
                return get().orders;
            },

            loginAdmin: (password: string) => {
                if (password === MOCK_ADMIN_PASS) {
                    set({ isAdminAuthenticated: true });
                    return true;
                }
                return false;
            },

            logoutAdmin: () => {
                set({ isAdminAuthenticated: false });
            }
        })),
        {
            name: 'cnwepro-orders-db',
            // Only persist orders to local storage. Don't indefinitely persist admin auth session without re-login.
            partialize: (state: OrderState) => ({
                orders: state.orders
            })
        }
    )
);
