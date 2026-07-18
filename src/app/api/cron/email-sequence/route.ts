import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendT0WelcomeEmail, sendT1GuideEmail, sendT7ReviewEmail } from '@/lib/email';

export async function GET(req: Request) {
    try {
        // Find emails that need to be sent using admin client (bypasses RLS)
        const { data: emails, error } = await supabaseAdmin
            .from('order_emails')
            .select('*, orders(*)')
            .eq('status', 'pending')
            .limit(50);

        if (error || !emails) {
            return NextResponse.json({ error: error?.message }, { status: 500 });
        }

        const now = new Date();
        const emailsToSend = emails.filter(e => {
            if (!e.orders) return false;
            const orderDate = new Date(e.orders.created_at);
            const diffHours = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

            if (e.email_type === 't0_welcome') return true;
            if (e.email_type === 't1_guide' && diffHours >= 24) return true;
            if (e.email_type === 't7_review' && diffHours >= 168) return true;
            return false;
        });

        if (emailsToSend.length === 0) {
            return NextResponse.json({ success: true, sent: 0 });
        }

        for (const e of emailsToSend) {
            const recipient = e.recipient_email || e.orders?.email;
            if (!recipient) continue;

            try {
                if (e.email_type === 't0_welcome') {
                    // Fetch accounts from inventory
                    const { data: inv } = await supabaseAdmin
                        .from('inventory')
                        .select('credential_data')
                        .eq('delivered_to_order', e.order_id);
                    
                    const accounts = inv ? inv.map(i => JSON.stringify(i.credential_data)) : [];
                    await sendT0WelcomeEmail({
                        to: recipient,
                        publicId: e.orders?.id || e.order_id,
                        amount: Number(e.orders?.total_amount || 0),
                        accounts
                    });
                } else if (e.email_type === 't1_guide') {
                    await sendT1GuideEmail({
                        to: recipient,
                        publicId: e.orders?.id || e.order_id,
                    });
                } else if (e.email_type === 't7_review') {
                    // Find or create referral code
                    let referralCode = 'WELCOME5';
                    if (e.orders?.user_id) {
                        const { data: ref } = await supabaseAdmin
                            .from('referrals')
                            .select('referral_code')
                            .eq('referrer_user_id', e.orders.user_id)
                            .maybeSingle();
                        if (ref) {
                            referralCode = ref.referral_code;
                        } else {
                            // Create one
                            const newCode = `REF-${e.orders.user_id.slice(0, 8).toUpperCase()}`;
                            await supabaseAdmin.from('referrals').insert({
                                referrer_user_id: e.orders.user_id,
                                referral_code: newCode
                            });
                            referralCode = newCode;
                        }
                    }
                    await sendT7ReviewEmail({
                        to: recipient,
                        referralCode
                    });
                }

                // Update status to sent
                await supabaseAdmin
                    .from('order_emails')
                    .update({ status: 'sent', sent_at: new Date().toISOString() })
                    .eq('id', e.id);
            } catch (err: any) {
                console.error(`Error sending email ${e.id}:`, err);
                await supabaseAdmin
                    .from('order_emails')
                    .update({ status: 'failed' })
                    .eq('id', e.id);
            }
        }

        return NextResponse.json({ success: true, sent: emailsToSend.length });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

