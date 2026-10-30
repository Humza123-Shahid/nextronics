'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

// TypeScript Interfaces based on your Django Models
export interface ProductVariant {
    id: number;
    product_name: string;
    variant_name: string; // e.g., "Size: M, Color: Blue"
    price: number;
    image_url: string;
    stock: number;
}

export interface CartItemType {
    id: number;
    cart_id: number;
    product_variant: ProductVariant;
    quantity: number;
    added_at: string;
}

// Mock initial data reflecting your Django Cart & CartItem structure
const initialCartItems: CartItemType[] = [
    {
        id: 1,
        cart_id: 101,
        quantity: 2,
        added_at: '2026-10-30T10:00:00Z',
        product_variant: {
            id: 201,
            product_name: 'Classic Cotton T-Shirt',
            variant_name: 'Size: L | Color: Black',
            price: 29.99,
            image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop',
            stock: 10,
        },
    },
    {
        id: 2,
        cart_id: 101,
        quantity: 1,
        added_at: '2026-10-30T11:15:00Z',
        product_variant: {
            id: 202,
            product_name: 'Minimalist Sneakers',
            variant_name: 'Size: 42 | Color: White',
            price: 89.50,
            image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop',
            stock: 5,
        },
    },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);

    // Handlers for quantity changes and removal
    const updateQuantity = (id: number, delta: number) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter((item): item is CartItemType => item !== null)
        );
    };

    const removeItem = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Price Calculations
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product_variant.price * item.quantity,
        0
    );
    const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15.0;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link
                        href="/"
                        className="inline-block w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Navigation / Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Store
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Shopping Cart ({cartItems.length})
                    </h1>
                    {/* </h1> */}
                </div>

                {/* Cart Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Cart Items List */}
                    <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                                    {/* Product Image */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                        <Image
                                            src={item.product_variant.image_url}
                                            alt={item.product_variant.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {item.product_variant.product_name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {item.product_variant.variant_name}
                                            </p>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900 mt-2 sm:mt-0">
                                            ${item.product_variant.price.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Quantity Controls & Remove */}
                                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 transition rounded-l-lg"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="px-3 text-sm font-medium text-gray-800">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 transition rounded-r-lg"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
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
                                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
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
    // </div>
    );
}