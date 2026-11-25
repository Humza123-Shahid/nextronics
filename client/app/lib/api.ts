// lib/api.ts
import type { CompareResponse } from '@/app/types/compare';
export interface ProductVariant {
    id: number;
    sku: string;
    price_override?: number;
    stock_quantity: number;
    image?: string;
    is_active: boolean;
}
export type ProductCard = {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    image: string | null;
    price: string;               // DRF returns decimals as strings
    compare_at_price: string | null;
    stock_quantity: number;
    // discount_percent: number;
    variants?: ProductVariant[];
    rating: string;
    rating_count: number;
    category: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function getSpecialHighlights(limit = 16): Promise<ProductCard[]> {
    const res = await fetch(
        `${API_URL}/api/products/special-highlights/?limit=${limit}`,
        { next: { revalidate: 300 } } // cache for 5 minutes
    );
    if (!res.ok) throw new Error('Failed to load special highlights');
    return res.json();
}

export async function fetchCompare(ids: number[]): Promise<CompareResponse> {
    const res = await fetch(`${API_URL}/api/compare/?ids=${ids.join(',')}`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? 'Could not load the comparison.');
    }
    return res.json();
}