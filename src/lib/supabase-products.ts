import { supabase } from './supabase';
import { Product } from '@/types';

/**
 * Centralized mapper to convert Supabase DB row to Product interface.
 * Handles snake_case to camelCase conversion and legacy structure mapping.
 * Forces numeric types for all pricing fields to prevent dynamic page runtime errors.
 */
export function mapDbProductToProduct(row: any): Product {
  if (!row) return null as any;

  // Helper to safely parse numbers
  const parsePrice = (val: any) => {
    if (val === null || val === undefined || val === '') return null;
    const num = parseFloat(String(val));
    return isNaN(num) || num <= 0 ? null : num;
  };

  const product = {
    ...row,
    category: row.category?.toLowerCase() || row.category_id?.toLowerCase() || 'other',
    
    // Explicitly parse flat price fields
    price_usdt: parsePrice(row.price_usdt || row.price_single),
    price_bulk_10: parsePrice(row.price_bulk_10 || row.price_bulk10),
    price_bulk_50: parsePrice(row.price_bulk_50 || row.price_bulk50),
    price_bulk_200: parsePrice(row.price_bulk_200 || row.price_bulk200),
    price_old_usdt: parsePrice(row.price_old_usdt || row.original_price_single),
    
    // Unified name/tierName mapping
    tierName: {
      zh: row.name_zh || row.tier_name_zh || row.tierName?.zh || '',
      en: row.name_en || row.tier_name_en || row.tierName?.en || ''
    },
    name: {
      zh: row.name_zh || row.tier_name_zh || row.tierName?.zh || '',
      en: row.name_en || row.tier_name_en || row.tierName?.en || ''
    },
    // Unified description mapping
    description: {
      zh: row.description_zh || row.description?.zh || '',
      en: row.description_en || row.description?.en || ''
    },
    // Unified pricing structure
    price: {
      single: parsePrice(row.price_usdt || row.price_single) || 0,
      bulk10: parsePrice(row.price_bulk_10 || row.price_bulk10) || parsePrice(row.price_usdt || row.price_single) || 0,
      bulk50: parsePrice(row.price_bulk_50 || row.price_bulk50) || parsePrice(row.price_usdt || row.price_single) || 0,
      bulk200: parsePrice(row.price_bulk_200 || row.price_bulk200) || parsePrice(row.price_usdt || row.price_single) || 0,
      originalPrice: (row.price_old_usdt || row.original_price_single) ? {
        single: parsePrice(row.price_old_usdt || row.original_price_single),
        bulk10: parsePrice(row.price_old_bulk_10 || row.original_price_bulk10) || parsePrice(row.price_old_usdt || row.original_price_single),
        bulk50: parsePrice(row.price_old_bulk_50 || row.original_price_bulk50) || parsePrice(row.price_old_usdt || row.original_price_single),
        bulk200: parsePrice(row.price_old_bulk_200 || row.original_price_bulk200) || parsePrice(row.price_old_usdt || row.original_price_single),
      } : undefined
    },
    // camelCase aliases
    stockCount: row.stock_count ?? row.stockCount ?? 0,
    sortOrder: row.sort_order ?? row.sortOrder ?? 0,
    soldCount: row.sold_count ?? row.soldCount ?? 0,
    reviewCount: row.review_count ?? row.reviewCount ?? 0,
    
    // Pass through metadata if it exists
    ...(row.metadata || {})
  };

  return product;
}

/**
 * ADMIN: GET all products (including inactive)
 */
export async function getAllProducts() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
  return (data || []).map(mapDbProductToProduct);
}

/**
 * STOREFRONT: GET public products (live site)
 */
export async function getPublicProducts() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_published', true)
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching public products:', error);
    return [];
  }
  return (data || []).map(mapDbProductToProduct);
}

/**
 * STOREFRONT: GET single public product
 */
export async function getPublicProductById(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .eq('is_published', true)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching product by ID:', error);
    return null;
  }
  
  return mapDbProductToProduct(data);
}

/**
 * STOREFRONT: GET featured/popular products
 */
export async function getPublicPopularProducts() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_published', true)
    .eq('popular', true)
    .order('sort_order', { ascending: true })
    .limit(20);
  
  if (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
  return (data || []).map(mapDbProductToProduct);
}

/**
 * STOREFRONT: GET products by category (case-insensitive)
 */
export async function getPublicProductsByCategory(category: string): Promise<Product[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized in getPublicProductsByCategory');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, is_published')
      .ilike('category', category)
      .eq('is_active', true)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(`[Supabase Error] Error fetching products for ${category}:`, error);
      return [];
    }

    return (data || []).map(mapDbProductToProduct);
  } catch (err) {
    console.error(`[Supabase Exception] Unexpected error fetching products for ${category}:`, err);
    return [];
  }
}

/**
 * ADMIN: Update full product
 */
export async function updateProduct(id: string, payload: Partial<Product>) {
  if (!supabase) return null;
  
  // Strip computed/readonly fields before update
  const { 
    id: _, 
    price_cny: __, 
    price_old_cny: ___, 
    created_at: ____, 
    updated_at: _____, 
    ...updateData 
  } = payload as any;
  
  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  return data as Product;
}

/**
 * ADMIN: Quick update stock
 */
export async function quickUpdateStock(id: string, stockCount: number) {
  if (!supabase) return;
  
  const { error } = await supabase
    .from('products')
    .update({ stock_count: stockCount })
    .eq('id', id);
    
  if (error) {
    console.error('Error quick updating stock:', error);
    throw error;
  }
}
