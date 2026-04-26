import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Creates an auth user and profile if they don't exist.
 * Used for auto-account creation during guest checkout.
 */
export async function createAutoUser(email: string, telegram?: string) {
    // 1. Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

    if (existingProfile) {
        return { userId: existingProfile.id, created: false };
    }

    // 2. Create Auth User
    // Generate a secure temporary password
    const tempPassword = `CNW-${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8).toUpperCase()}!`;
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm so they can login immediately
        user_metadata: { telegram, is_auto_generated: true, temp_password: tempPassword }
    });

    if (authError) {
        console.error('Auto-Account Auth Error:', authError.message);
        return { error: authError.message };
    }

    const userId = authData.user.id;

    // 3. Profile is created automatically by the DB trigger 'on_auth_user_created'
    // But we might want to update it with Telegram if provided
    if (telegram) {
        await supabaseAdmin
            .from('profiles')
            .update({ telegram })
            .eq('id', userId);
    }

    return { userId, created: true, tempPassword };
}
