'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { pushToDataLayer } from '@/lib/gtm';

function ReviewForm() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!orderId) {
            toast.error('Missing order ID. Please use the link from your email.');
            return;
        }

        setLoading(true);

        try {
            // First, verify the order exists and is completed
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('status, product_id')
                .eq('id', orderId)
                .single();

            if (orderError || !order) {
                toast.error('Invalid order or order not found.');
                setLoading(false);
                return;
            }

            if (order.status !== 'completed') {
                toast.error('You can only review completed orders.');
                setLoading(false);
                return;
            }

            // Insert review
            const { error: insertError } = await supabase
                .from('reviews')
                .insert({
                    order_id: orderId,
                    product_id: order.product_id,
                    rating,
                    review_en: reviewText,
                    reviewer_name: name || 'Anonymous',
                    verified: true, // Auto-verifying since they have valid order_id
                });

            if (insertError) throw insertError;

            pushToDataLayer('review_submitted', { orderId, rating, reviewerName: name || 'Anonymous' });
            setSubmitted(true);
            toast.success('Thank you for your review!');
        } catch (error: any) {
            toast.error('Failed to submit review: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#060B18] pt-32 pb-16 px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-[#0D1526]/80 backdrop-blur-xl p-8 rounded-2xl border border-[#1E2D45] text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
                    <p className="text-[#7B91B0]">Your review has been successfully submitted and helps us improve our services.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060B18] pt-32 pb-16 px-4 flex items-center justify-center">
            <div className="max-w-md w-full bg-[#0D1526]/80 backdrop-blur-xl p-8 rounded-2xl border border-[#1E2D45]">
                <h1 className="text-2xl font-bold text-white mb-2">Leave a Review</h1>
                <p className="text-[#7B91B0] mb-8 text-sm">Tell us about your experience with CNVerifyHub.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#7B91B0] mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star className={`w-8 h-8 ${star <= rating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-[#1E2D45]'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#7B91B0] mb-2">Name (Optional)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Anonymous"
                            className="w-full bg-[#060B18] border border-[#1E2D45] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF0036] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#7B91B0] mb-2">Your Review</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                            rows={4}
                            placeholder="How was the account? Was the delivery fast?"
                            className="w-full bg-[#060B18] border border-[#1E2D45] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF0036] transition-colors resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF0036] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#FF0036]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#060B18] pt-32 pb-16 px-4 flex items-center justify-center">
                <div className="text-white text-sm font-bold animate-pulse">Loading Review Form...</div>
            </div>
        }>
            <ReviewForm />
        </Suspense>
    );
}
