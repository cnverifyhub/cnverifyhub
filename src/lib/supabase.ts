import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
// If keys are missing, we export null to allow easy fallback to local static data
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper function to safely query Supabase with a fallback mechanism.
 * Usage: const { data } = await trySupabase(supabase.from('products').select('*'), localFallbackData);
 */
export async function trySupabase<T>(
    queryPromise: Promise<{ data: T | null; error: any }> | null,
    fallbackData: T
): Promise<T> {
    if (!supabase || !queryPromise) {
        return fallbackData; // No Supabase credentials, use local fallback
    }

    try {
        const { data, error } = await queryPromise;
        if (error || !data) {
            console.warn('Supabase query failed, using local fallback:', error?.message);
            return fallbackData;
        }
        return data as T;
    } catch (err) {
        console.error('Supabase connection error:', err);
        return fallbackData;
    }
}
