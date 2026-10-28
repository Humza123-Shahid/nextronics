// lib/mappers.ts
import type { ProductCard } from './api';

export type VerticalProductItem = {
    id: string;
    name: string;
    category: string;
    image: string;
    price: string;
    originalPrice?: string;
    onSale?: boolean;
    rating: number;
    reviewsCount: number;
};

const PLACEHOLDER_IMAGE = '/images/placeholder-product.png'; // put a file in /public/images

const formatPrice = (value: string | number) =>
    `$${Number(value).toFixed(2)}`;

export function toVerticalProductItem(p: ProductCard): VerticalProductItem {
    const price = Number(p.price);
    const compareAt = p.compare_at_price ? Number(p.compare_at_price) : null;
    const onSale = compareAt !== null && compareAt > price;

    return {
        id: p.slug,                                 // or String(p.id)
        name: p.name,
        category: p.category ?? 'Uncategorized',
        image: p.image ?? PLACEHOLDER_IMAGE,
        price: formatPrice(price),
        ...(onSale && {
            originalPrice: formatPrice(compareAt!),
            onSale: true,
        }),
        rating: Number(p.rating),
        reviewsCount: p.rating_count,
    };
}

export function chunk<T>(items: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size));
    }
    return result;
}