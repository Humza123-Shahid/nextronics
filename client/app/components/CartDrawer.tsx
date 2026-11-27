"use client";

import { useEffect } from "react";
import Link from "next/link";
import { getAuthCookie } from "@/app/actions/auth";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { type Cart } from "../types/cart"; // Adjust import path to match your Cart type


interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cart: Cart | null;
    onUpdateQty?: (itemId: number, newQty: number) => void;
    onRemoveItem?: (itemId: number) => void;
}

export default function CartDrawer({
    isOpen,
    onClose,
    cart,
    onUpdateQty,
    onRemoveItem,
}: CartDrawerProps) {
    const items = cart?.items || [];

    // Lock background scroll when drawer is open
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);
    const triggerCartUpdate = () => {
        window.dispatchEvent(new Event("cartUpdated"));
    };
    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
            return;
        }

        //setUpdatingId(itemId);
        try {
            const token = await getAuthCookie();
            const guestSessionKey = localStorage.getItem('guest_session_key');

            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            // Strictly check that the token is a valid, non-empty string
            if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
                headers['Authorization'] = `Bearer ${token}`;
            } else if (guestSessionKey && guestSessionKey !== 'null' && guestSessionKey !== 'undefined') {
                headers['X-Guest-Session-Key'] = guestSessionKey;
            }
            const response = await fetch(`http://127.0.0.1:8080/api/cart-items/${itemId}/`, {
                method: 'PATCH',
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                //     'Content-Type': 'application/json'
                // },
                headers: headers,
                body: JSON.stringify({ quantity: newQuantity }),
                // credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to update quantity.');
            //await fetchCart();
            triggerCartUpdate();
        } catch (err: any) {
            alert(err.message || 'Could not update quantity.');
        } finally {
            //setUpdatingId(null);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        //  setUpdatingId(itemId);
        try {
            const token = await getAuthCookie();
            const guestSessionKey = localStorage.getItem('guest_session_key');

            const headers: Record<string, string> = {};

            // Strictly check that the token is a valid, non-empty string
            if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
                headers['Authorization'] = `Bearer ${token}`;
            } else if (guestSessionKey && guestSessionKey !== 'null' && guestSessionKey !== 'undefined') {
                headers['X-Guest-Session-Key'] = guestSessionKey;
            }
            const response = await fetch(`http://127.0.0.1:8080/api/cart-items/${itemId}/`, {
                method: 'DELETE',
                // credentials: 'include',
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                // }
                headers: headers
            });

            if (!response.ok) throw new Error('Failed to remove item.');
            //await fetchCart();
            triggerCartUpdate();
        } catch (err: any) {
            alert(err.message || 'Could not remove item.');
        } finally {
            // setUpdatingId(null);
        }
    };

    if (!isOpen) return null;

    const subtotal = items.reduce((sum, item) => {
        const unitPrice = Number(item.product_variant_detail.price_override ?? item.product_variant_detail.product_detail.price);
        return sum + unitPrice * item.quantity;
    }, 0);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-Over Panel (Responsive width + 100dvh for mobile browsers) */}
            <aside className="relative z-10 w-full max-w-md bg-white h-[100dvh] flex flex-col shadow-2xl">
                {/* Sticky Header */}
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-900">
                            Your Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close cart"
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Middle Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                            <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="font-medium text-gray-900">Your cart is empty</p>
                            <p className="text-sm mt-1">Add items to see them here.</p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const prod = item.product_variant_detail.product_detail;
                            const imgSrc = item.product_variant_detail.image || prod.image;
                            const unitPrice = Number(item.product_variant_detail.price_override ?? prod.price);

                            return (
                                <div
                                    key={item.id}
                                    className="flex gap-3.5 pb-4 border-b border-gray-100 last:border-none"
                                >
                                    <img
                                        src={
                                            imgSrc
                                                ? imgSrc.startsWith("http")
                                                    ? imgSrc
                                                    : `http://127.0.0.1:8080${imgSrc}`
                                                : "/placeholder.png"
                                        }
                                        alt={prod.name}
                                        className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                                            {prod.name}
                                        </h4>
                                        {item.product_variant_detail.attribute_summary && (
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.product_variant_detail.attribute_summary}
                                            </p>
                                        )}
                                        <p className="text-sm font-bold text-gray-900 mt-1">
                                            ${(unitPrice * item.quantity).toFixed(2)}
                                        </p>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg h-8">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="px-2 text-gray-600 disabled:opacity-40"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="px-2.5 text-xs font-semibold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 text-gray-600"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* {onRemoveItem && ( */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.id)}
                                                aria-label="Remove item"
                                                className="text-gray-400 hover:text-red-600 p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            {/* )} */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Sticky Footer */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-3">
                        <div className="flex items-center justify-between text-base font-bold text-gray-900">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Shipping and taxes calculated at checkout.
                        </p>
                        <Link
                            href="/cart"
                            onClick={onClose}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </aside>
        </div>
    );
}
