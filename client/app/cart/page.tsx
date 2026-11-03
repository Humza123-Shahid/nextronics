'use client';

import React, { useState, useEffect } from 'react';
import { getAuthCookie } from "@/app/actions/auth";
import Image from 'next/image';
import CartHeader from "./CartHeader";
import Footer from "../components/Footer";
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';

// --- TypeScript Interfaces based on Django Models ---
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
    product: Product;
    sku: string;
    price_override: number | null;
    stock_quantity: number;
    image: string | null;
    attribute_summary?: string; // e.g., "Red / XL"
}

export interface CartItem {
    id: number;
    cart: number; // Foreign Key ID pointing to Cart
    product_variant: ProductVariant;
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

export default function CartPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const triggerCartUpdate = () => {
        window.dispatchEvent(new Event("cartUpdated"));
    };
    // --- Fetch Cart from Django REST API ---
    const fetchCart = async () => {
        try {
            setLoading(true);
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
            // const response = await fetch('/api/cart/', {
            //     credentials: 'include', // Needed for session/cookie auth (guest or logged-in user)
            // });
            const response = await fetch('http://127.0.0.1:8080/api/carts/', {
                method: 'GET',
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                //     'Content-Type': 'application/json'
                // }
                headers: headers,
            });

            if (!response.ok) throw new Error('Failed to fetch cart.');
            // const data: Cart = await response.json();
            const data = await response.json();
            console.log(data);
            // setCart(data);
            // const userCart = Array.isArray(data) ? data[0] : data.results?.[0];
            const userCart = Array.isArray(data) ? data[0] : data;
            setCart(userCart || null);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);
    useEffect(() => {
        console.log(cart);
    }, [cart]);
    // --- API Handlers for Cart Items ---
    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
            return;
        }

        setUpdatingId(itemId);
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
            await fetchCart();
            triggerCartUpdate();
        } catch (err: any) {
            alert(err.message || 'Could not update quantity.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        setUpdatingId(itemId);
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
            await fetchCart();
            triggerCartUpdate();
        } catch (err: any) {
            alert(err.message || 'Could not remove item.');
        } finally {
            setUpdatingId(null);
        }
    };

    // --- Price Calculations ---
    // cart.items references the related_name='items' from CartItem model
    const items = cart?.items || [];
    const subtotal = items.reduce((sum, item) => {
        const variant = item.product_variant;
        const effectivePrice = variant.price_override ?? variant.product.price;
        return sum + Number(effectivePrice) * item.quantity;
    }, 0);

    // const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15.0;
    const shipping = subtotal > 0 ? 100 : 0;
    const total = subtotal + shipping;

    // --- Loading State ---
    if (loading && !cart) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        );
    }
    console.log(items);
    // --- Empty Cart State ---
    if (!items.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        You haven't added any products to your cart yet.
                    </p>
                    <Link
                        href="/"
                        className="inline-block w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <CartHeader />
            <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Continue Shopping
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            Shopping Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})
                        </h1>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Cart Items List */}
                        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {items.map((item) => {
                                    const variant = item.product_variant;
                                    const product = variant.product;
                                    const itemPrice = variant.price_override ?? product.price;
                                    const imageUrl = product.image || variant.image || '/placeholder.png';
                                    const isUpdating = updatingId === item.id;
                                    console.log(product);
                                    return (
                                        <li
                                            key={item.id}
                                            className={`p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center transition ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                                        >
                                            {/* Image */}
                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                {/* <Image */}
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    //fill
                                                    //className="object-cover"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Variant & Product Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        {product.name}
                                                    </h3>
                                                    {variant.attribute_summary && (
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {variant.attribute_summary}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                                                        SKU: {variant.sku}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-bold text-gray-900 mt-2 sm:mt-0">
                                                    ${Number(itemPrice).toFixed(2)}
                                                </div>
                                            </div>

                                            {/* Quantity Modifiers & Remove Button */}
                                            <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 transition rounded-l-lg"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="px-3 text-sm font-medium text-gray-800">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= (product.stock_quantity || 0)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 transition rounded-r-lg"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm border-b border-gray-100 pb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Estimated Shipping</span>
                                    <span className="font-medium text-gray-900">
                                        {/* {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} */}
                                        {`$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-base font-bold text-gray-900 my-4">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button className="w-full bg-black text-white font-medium py-3.5 rounded-xl hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                                Proceed to Checkout
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}