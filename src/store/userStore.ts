import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';

export type VIPTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface User {
    id: string;
    email: string;
    totalSpent: number;
    vipTier: VIPTier;
    createdAt: string;
    isAuthenticated: boolean; // true = Supabase Auth, false = local-only
}

interface UserState {
    user: User | null;
    loading: boolean;
    login: (email: string) => void;
    loginWithSupabase: (email: string, password: string) => Promise<{ error?: string }>;
    signupWithSupabase: (email: string, password: string) => Promise<{ error?: string; needsVerification?: boolean }>;
    logout: () => void;
    syncWithSupabase: () => Promise<void>;
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
            loading: false,

            // Legacy local login (email-only, no password)
            login: (email) => set({
                user: {
                    id: `USR-${Math.floor(Math.random() * 10000)}`,
                    email,
                    totalSpent: 0,
                    vipTier: 'bronze',
                    createdAt: new Date().toISOString(),
                    isAuthenticated: false,
                }
            }),

            // Supabase Auth login
            loginWithSupabase: async (email, password) => {
                set({ loading: true });
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                
                if (error) {
                    set({ loading: false });
                    return { error: error.message };
                }

                if (data.session) {
                    set({
                        user: {
                            id: data.session.user.id,
                            email: data.session.user.email || email,
                            totalSpent: 0,
                            vipTier: 'bronze',
                            createdAt: data.session.user.created_at || new Date().toISOString(),
                            isAuthenticated: true,
                        },
                        loading: false,
                    });
                    // Sync profile data
                    get().syncWithSupabase();
                }

                return {};
            },

            // Supabase Auth signup
            signupWithSupabase: async (email, password) => {
                set({ loading: true });
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL
                            ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
                            : typeof window !== 'undefined'
                                ? `${window.location.origin}/auth/callback`
                                : undefined,
                    }
                });

                set({ loading: false });

                if (error) {
                    return { error: error.message };
                }

                // If session exists immediately, user is auto-confirmed
                if (data.session) {
                    set({
                        user: {
                            id: data.session.user.id,
                            email: data.session.user.email || email,
                            totalSpent: 0,
                            vipTier: 'bronze',
                            createdAt: new Date().toISOString(),
                            isAuthenticated: true,
                        }
                    });
                    return {};
                }

                return { needsVerification: true };
            },

            // Sync with Supabase profile data
            syncWithSupabase: async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    set((state) => ({
                        user: state.user ? {
                            ...state.user,
                            totalSpent: profile.total_spent || 0,
                            vipTier: calculateTier(profile.total_spent || 0),
                        } : null,
                    }));
                }
            },

            logout: () => {
                supabase.auth.signOut();
                set({ user: null });
            },

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
