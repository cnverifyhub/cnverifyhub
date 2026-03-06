import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VIPTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface User {
    id: string;
    email: string;
    totalSpent: number;
    vipTier: VIPTier;
    createdAt: string;
}

interface UserState {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
    addSpending: (amount: number) => void;
    getTierProgress: () => { current: number, nextTarget: number, percentage: number };
}

const calculateTier = (spent: number): VIPTier => {
    if (spent >= 1000) return 'diamond';
    if (spent >= 500) return 'gold';
    if (spent >= 100) return 'silver';
    return 'bronze';
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,

            login: (email) => set({
                user: {
                    id: `USR-${Math.floor(Math.random() * 10000)}`,
                    email,
                    totalSpent: 0,
                    vipTier: 'bronze',
                    createdAt: new Date().toISOString()
                }
            }),

            logout: () => set({ user: null }),

            addSpending: (amount) => set((state) => {
                if (!state.user) return state;
                const newSpent = state.user.totalSpent + amount;
                return {
                    user: {
                        ...state.user,
                        totalSpent: newSpent,
                        vipTier: calculateTier(newSpent)
                    }
                };
            }),

            getTierProgress: () => {
                const state = get();
                const spent = state.user?.totalSpent || 0;

                if (spent >= 1000) return { current: spent, nextTarget: 1000, percentage: 100 };
                if (spent >= 500) return { current: spent, nextTarget: 1000, percentage: (spent / 1000) * 100 };
                if (spent >= 100) return { current: spent, nextTarget: 500, percentage: (spent / 500) * 100 };
                return { current: spent, nextTarget: 100, percentage: (spent / 100) * 100 };
            }
        }),
        {
            name: 'user-storage',
        }
    )
);
