// lib/slides.ts
import { getSpecialHighlights } from './api';
import { chunk, toVerticalProductItem, VerticalProductItem } from './mappers';

export async function getProductSlides(
    perSlide = 4,
    limit = 16
): Promise<VerticalProductItem[][]> {
    const products = await getSpecialHighlights(limit);
    return chunk(products.map(toVerticalProductItem), perSlide);
}