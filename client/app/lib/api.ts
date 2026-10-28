// lib/api.ts
export type ProductCard = {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    image: string | null;
    price: string;               // DRF returns decimals as strings
    compare_at_price: string | null;
    // discount_percent: number;
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