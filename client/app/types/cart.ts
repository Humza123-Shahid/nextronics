export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number; // Base price
    image: string | null;
    stock_quantity: number;
}

export interface ProductVariant {
    id: number;
    product_detail: Product;
    sku: string;
    price_override: number | null;
    stock_quantity: number;
    image: string | null;
    attribute_summary?: string; // e.g., "Red / XL"
}

export interface CartItem {
    id: number;
    cart: number; // Foreign Key ID pointing to Cart
    product_variant_detail: ProductVariant;
    quantity: number;
    added_at: string;
}
export interface Cart {
    id: number;
    user: number | null;
    session_key: string | null;
    items: CartItem[]; // Accessed via related_name='items' from CartItem
    created_at: string;
    updated_at: string;
}