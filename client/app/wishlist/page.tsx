"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Wishlist, WishlistItem, wishlistApi } from "../lib/wishlist";

const money = (v: string | number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(Number(v));

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apply = (wl: Wishlist) => setItems(wl.items);

    const load = useCallback(async () => {
        try {
            setError(null);
            apply(await wishlistApi.get());
        } catch {
            setError("Couldn't load your wishlist. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function remove(productId: number) {
        const prev = items;
        setItems((cur) => cur.filter((i) => i.product.id !== productId)); // optimistic
        try {
            apply(await wishlistApi.remove(productId));
        } catch {
            setItems(prev);
            setError("Couldn't remove that item.");
        }
    }

    async function clearAll() {
        if (!confirm("Remove all items from your wishlist?")) return;
        const prev = items;
        setItems([]);
        try {
            apply(await wishlistApi.clear());
        } catch {
            setItems(prev);
        }
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200" />
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    My Wishlist <span className="text-gray-500">({items.length})</span>
                </h1>
                {items.length > 0 && (
                    <button onClick={clearAll} className="text-sm text-red-600 hover:underline">
                        Clear all
                    </button>
                )}
            </div>

            {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            {items.length === 0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                    <p className="mb-4 text-gray-600">Your wishlist is empty.</p>
                    <Link href="/products" className="rounded-lg bg-black px-5 py-2 text-white">
                        Browse products
                    </Link>
                </div>
            ) : (
                <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {items.map(({ id, product: p }) => (
                        <li key={id} className="group relative overflow-hidden rounded-xl border bg-white">
                            <button
                                onClick={() => remove(p.id)}
                                aria-label={`Remove ${p.name} from wishlist`}
                                className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-gray-600 shadow hover:text-red-600"
                            >
                                ✕
                            </button>

                            {p.discount_percent > 0 && (
                                <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-0.5 text-xs text-white">
                                    -{p.discount_percent}%
                                </span>
                            )}

                            <Link href={`/products/${p.slug}`}>
                                <div className="aspect-square bg-gray-100">
                                    {p.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400">No image</div>
                                    )}
                                </div>
                            </Link>

                            <div className="space-y-1 p-3">
                                {p.category_name && <p className="text-xs text-gray-500">{p.category_name}</p>}
                                <Link href={`/products/${p.slug}`} className="line-clamp-2 font-medium hover:underline">
                                    {p.name}
                                </Link>
                                {p.rating_count > 0 && (
                                    <p className="text-xs text-amber-600">
                                        ★ {Number(p.rating).toFixed(1)} <span className="text-gray-500">({p.rating_count})</span>
                                    </p>
                                )}
                                <p className="flex items-baseline gap-2">
                                    <span className="font-semibold">{money(p.price)}</span>
                                    {p.compare_at_price && (
                                        <span className="text-sm text-gray-400 line-through">{money(p.compare_at_price)}</span>
                                    )}
                                </p>

                                <button
                                    disabled={!p.in_stock}
                                    onClick={() => {
                                        /* TODO: hook up your cart, e.g. addToCart(p.id) */
                                    }}
                                    className="mt-2 w-full rounded-lg bg-black py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                    {p.in_stock ? "Add to cart" : "Out of stock"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}