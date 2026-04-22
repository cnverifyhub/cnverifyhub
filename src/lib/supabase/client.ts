import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otgewrynnrqmtsyvlzrj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === 'production') {
        console.warn('[Supabase] Environment variables missing. Database interactions will fail.');
    }
}

// Create a single supabase client for interacting with your database
// Using createBrowserClient automatically syncs the auth session to cookies
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
