"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Wishlist, WishlistItem, wishlistApi } from "../lib/wishlist";
import { notifyWishlistUpdated } from "../lib/wishlistSync";

const money = (v: string | number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(v));

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apply = (wl: Wishlist) => setItems(wl.items);

    const load = useCallback(async () => {
        try {
            setError(null);
            apply(await wishlistApi.get());
        } catch (err) {
            setError("Couldn't load your wishlist. Please try again.");
            console.log(err)
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);
    // const triggerWishlistUpdate = () => {
    //     window.dispatchEvent(new Event("wishlistUpdated"));
    // };
    async function remove(productId: number) {
        const prev = items;
        //setItems((cur) => cur.filter((i) => i.product.id !== productId)); // optimistic
        const nextItems = prev.filter((i) => i.product.id !== productId);
        setItems(nextItems);
        try {
            const updated = await wishlistApi.remove(productId);
            apply(updated);
            //triggerWishlistUpdate();
            notifyWishlistUpdated(updated?.count ?? nextItems.length);
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
            notifyWishlistUpdated(0);
            //triggerWishlistUpdate();
        } catch {
            setItems(prev);
        }
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl bg-white px-4 py-10 text-gray-900">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200" />
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl bg-white px-4 py-10 text-gray-900">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    My Wishlist <span className="font-medium text-gray-600">({items.length})</span>
                </h1>
                {items.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="rounded-md px-2.5 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {error && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}

            {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-12 text-center">
                    <p className="mb-4 text-base font-medium text-gray-700">Your wishlist is empty.</p>
                    <Link
                        href="/products"
                        className="inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Browse products
                    </Link>
                </div>
            ) : (
                <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {items.map(({ id, product: p }) => (
                        <li
                            key={id}
                            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <button
                                onClick={() => remove(p.id)}
                                aria-label={`Remove ${p.name} from wishlist`}
                                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                ✕
                            </button>

                            {p.discount_percent > 0 && (
                                <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                    -{p.discount_percent}%
                                </span>
                            )}

                            <Link href={`/products/${p.slug}`}>
                                <div className="aspect-square border-b border-gray-100 bg-gray-100">
                                    {p.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm font-medium text-gray-500">
                                            No image
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="space-y-1.5 p-3.5">
                                {p.category_name && (
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                                        {p.category_name}
                                    </p>
                                )}
                                <Link
                                    href={`/products/${p.slug}`}
                                    className="line-clamp-2 block text-sm font-semibold text-gray-900 hover:text-black hover:underline"
                                >
                                    {p.name}
                                </Link>
                                {p.rating_count > 0 && (
                                    <p className="text-xs font-medium text-amber-600">
                                        ★ {Number(p.rating).toFixed(1)}{" "}
                                        <span className="text-gray-600">({p.rating_count})</span>
                                    </p>
                                )}
                                <p className="flex items-baseline gap-2 pt-0.5">
                                    <span className="text-base font-bold text-gray-900">{money(p.price)}</span>
                                    {p.compare_at_price && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {money(p.compare_at_price)}
                                        </span>
                                    )}
                                </p>

                                <button
                                    disabled={!p.in_stock}
                                    onClick={() => {
                                        /* TODO: hook up your cart, e.g. addToCart(p.id) */
                                    }}
                                    className="mt-2 w-full rounded-lg bg-gray-900 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
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