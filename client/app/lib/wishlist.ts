export type WishlistProduct = {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    sku: string;
    price: string;
    compare_at_price: string | null;
    discount_percent: number;
    image: string | null;
    rating: string;
    rating_count: number;
    stock_quantity: number;
    in_stock: boolean;
    category_name: string | null;
};

export type WishlistItem = {
    id: number;
    product: WishlistProduct;
    added_at: string;
};

export type Wishlist = {
    id: number | null;
    items: WishlistItem[];
    count: number;
};

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        ...init,
        credentials: "include", // send the guest sessionid cookie
        headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
}

export const wishlistApi = {
    get: () => request<Wishlist>("/api/wishlist/"),
    ids: () => request<{ product_ids: number[] }>("/api/wishlist/ids/"),
    add: (productId: number) =>
        request<Wishlist>("/api/wishlist/items/", {
            method: "POST",
            body: JSON.stringify({ product_id: productId }),
        }),
    remove: (productId: number) =>
        request<Wishlist>(`/api/wishlist/items/${productId}/`, { method: "DELETE" }),
    toggle: (productId: number) =>
        request<{ added: boolean; count: number }>("/api/wishlist/toggle/", {
            method: "POST",
            body: JSON.stringify({ product_id: productId }),
        }),
    clear: () => request<Wishlist>("/api/wishlist/clear/", { method: "DELETE" }),
};