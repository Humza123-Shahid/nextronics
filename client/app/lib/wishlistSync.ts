// lib/wishlistSync.ts
export const WISHLIST_EVENT = "wishlistUpdated";
export const WISHLIST_STORAGE_KEY = "wishlist_updated_at";

export function notifyWishlistUpdated(count?: number) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent(WISHLIST_EVENT, { detail: { count } })
    );

    // Triggers the "storage" event in other open browser tabs
    localStorage.setItem(WISHLIST_STORAGE_KEY, String(Date.now()));
}