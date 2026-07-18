'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AdminInventoryPage() {
    const [productId, setProductId] = useState('');
    const [credentialsText, setCredentialsText] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        setLoading(true);
        setMessage('');
        try {
            const lines = credentialsText.split('\n').filter(l => l.trim() !== '');
            const records = lines.map(line => {
                // assume CSV or plain text JSON. If plain text, wrap in an object
                let data = { raw: line };
                try { data = JSON.parse(line); } catch (e) { /* ignore */ }
                return {
                    product_id: productId,
                    credential_data: data,
                    status: 'available'
                };
            });

            if (records.length === 0) {
                setMessage('No valid records found');
                return;
            }

            const { error } = await supabase.from('inventory').insert(records);
            
            if (error) throw error;
            
            setMessage(`Successfully added ${records.length} credentials.`);
            setCredentialsText('');
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold">Product ID</label>
                    <input 
                        type="text" 
                        value={productId} 
                        onChange={(e) => setProductId(e.target.value)}
                        className="w-full bg-slate-800 rounded px-4 py-2 text-white border border-slate-700"
                        placeholder="e.g. wechat-aged-1yr"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold">Credentials (One per line, JSON or plain text)</label>
                    <textarea 
                        value={credentialsText}
                        onChange={(e) => setCredentialsText(e.target.value)}
                        className="w-full h-64 bg-slate-800 rounded px-4 py-2 text-white border border-slate-700 font-mono text-sm"
                        placeholder='{"username": "user1", "password": "pw1"}&#10;{"username": "user2", "password": "pw2"}'
                    />
                </div>
                <button 
                    onClick={handleUpload}
                    disabled={loading || !productId || !credentialsText}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
                >
                    {loading ? 'Uploading...' : 'Batch Upload'}
                </button>
                {message && <div className="mt-4 text-emerald-400 font-bold">{message}</div>}
            </div>
        </div>
    );
}
