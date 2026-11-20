import { getAuthCookie } from "@/app/actions/auth";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

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

// async function request<T>(url: string, init: RequestInit = {}): Promise<T> {

//     const res = await fetch(`${BASE_URL}${url}`, {
//         ...init,
//         //credentials: "include", // send the guest sessionid cookie
//         headers: { "Content-Type": "application/json", ...(init.headers || {}) },
//     });
//     if (!res.ok) throw new Error(`Request failed: ${res.status}`);
//     return res.json();
// }
async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
    const sessionKey = localStorage.getItem('guest_session_key') || '';
    const token = await getAuthCookie();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(init.headers as Record<string, string> || {}),
    };

    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Build JSON body with session_key included
    let existingBody: Record<string, unknown> = {};
    if (typeof init.body === 'string' && init.body.trim()) {
        try {
            existingBody = JSON.parse(init.body);
        } catch {
            // If init.body isn't valid JSON, fall back to just session_key
        }
    }

    const body = JSON.stringify({
        ...existingBody,
        session_key: sessionKey,
    });
    let res;
    if (init.method == "GET") {
        headers['X-Guest-Session-Key'] = sessionKey;
        res = await fetch(`${BASE_URL}${url}`, {
            ...init,
            method: init.method ?? 'GET', // Ensure method supports a body if not explicitly set
            headers
        });
    }
    else {
        console.log("hereinpost")
        res = await fetch(`${BASE_URL}${url}`, {
            ...init,
            method: init.method ?? 'POST', // Ensure method supports a body if not explicitly set
            headers,
            body,
        });
    }


    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
}

export const wishlistApi = {

    get: () => request<Wishlist>("/api/wishlist/", {
        method: "GET"
    }),
    ids: () => request<{ product_ids: number[] }>("/api/wishlist/ids/", {
        method: "GET"
    }),
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