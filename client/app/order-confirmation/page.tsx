'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OrderHeader from './OrderHeader';
import Footer from '../components/Footer';
import { getAuthCookie } from '@/app/actions/auth';
import { CheckCircle2, Loader2, AlertCircle, ShoppingBag, Truck, MapPin, CreditCard, ArrowLeft } from 'lucide-react';

// --- Interfaces for Order Response ---
export interface OrderAddress {
    id: number;
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    address_type: string;
}

export interface OrderItem {
    id: number;
    product_name_snapshot: string;
    sku_snapshot: string;
    unit_price: number;
    quantity: number;
    image?: string;
}

export interface OrderDetails {
    id: number;
    order_number: string;
    email: string;
    phone: string;
    payment_method: string;
    shipping_address: OrderAddress;
    billing_address: OrderAddress;
    notes?: string;
    subtotal: number | string;
    shipping_total: number | string;
    grand_total: number | string;
    status: string;
    created_at: string;
    items?: OrderItem[];
}

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order_number');

    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const maskText = (text?: string) => {
        if (!text) return '';
        if (text.length <= 3) return '***';
        return `${text.slice(0, 2)}***${text.slice(-1)}`;
    };

    useEffect(() => {
        if (!orderNumber) {
            setError('No order number was provided.');
            setLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const token = await getAuthCookie();
                const guestSessionKey = localStorage.getItem('guest_session_key');

                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };

                if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
                    headers['Authorization'] = `Bearer ${token}`;
                } else if (guestSessionKey && guestSessionKey !== 'null' && guestSessionKey !== 'undefined') {
                    headers['X-Guest-Session-Key'] = guestSessionKey;
                }

                // Adjust API route depending on your backend endpoint (by order_number or lookup)
                const response = await fetch(`http://127.0.0.1:8080/api/orders/${orderNumber}/`, {
                    method: 'GET',
                    headers,
                });

                if (!response.ok) {
                    throw new Error('Failed to retrieve order details.');
                }

                const data = await response.json();
                setOrder(data);
            } catch (err: any) {
                setError(err.message || 'Unable to load order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderNumber]);
    useEffect(() => {
        console.log(order);

    }, [order]);
    // Loading State
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-black" />
                <p className="text-gray-500 text-sm font-medium">Fetching order confirmation details...</p>
            </div>
        );
    }

    // Error State
    if (error || !order) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="bg-red-50 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 text-red-600">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-500 mb-6 text-sm">{error || 'We could not locate the details for this order.'}</p>
                    <Link
                        href="/"
                        className="inline-block w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Success Header Banner */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Thank You for Your Order!</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Your order has been placed successfully. A confirmation email has been sent to{' '}
                    <span className="font-semibold text-gray-800">{maskText(order.email)}</span>.
                </p>

                <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200/60 text-sm font-medium text-gray-700">
                    <span>Order Number:</span>
                    <span className="font-mono font-bold text-black">{order.order_number}</span>
                </div>
            </div>

            {/* Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Order Details & Items Column */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Ordered Items List (if returned by backend) */}
                    {order.items && order.items.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-gray-500" />
                                Order Items
                            </h2>
                            <ul className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <li key={item.id} className="py-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.product_name_snapshot}
                                                    className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                    <ShoppingBag className="w-6 h-6" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{item.product_name_snapshot}</p>
                                                <p className="text-xs text-gray-500 font-mono">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">
                                            ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Address Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            Delivery & Billing Addresses
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                            {/* Shipping Address */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h3>
                                <p className="font-bold text-gray-900">{maskText(order.shipping_address?.full_name)}</p>
                                <p className="text-gray-600 mt-1">{maskText(order.shipping_address?.address_line1)}</p>
                                {order.shipping_address?.address_line2 && (
                                    <p className="text-gray-600">{maskText(order.shipping_address.address_line2)}</p>
                                )}
                                <p className="text-gray-600">
                                    {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
                                </p>
                                <p className="text-gray-600">{order.shipping_address?.country}</p>
                            </div>

                            {/* Billing Address */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing Address</h3>
                                <p className="font-bold text-gray-900">{maskText(order.billing_address?.full_name)}</p>
                                <p className="text-gray-600 mt-1">{maskText(order.billing_address?.address_line1)}</p>
                                {order.billing_address?.address_line2 && (
                                    <p className="text-gray-600">{maskText(order.billing_address.address_line2)}</p>
                                )}
                                <p className="text-gray-600">
                                    {order.billing_address?.city}, {order.billing_address?.state} {order.billing_address?.postal_code}
                                </p>
                                <p className="text-gray-600">{order.billing_address?.country}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary & Payment Side Column */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Payment Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">${Number(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fee</span>
                                <span className="font-medium text-gray-900">${Number(order.shipping_total).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                                <span>Grand Total</span>
                                <span>${Number(order.grand_total).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            <div className="flex items-center text-sm text-gray-700 space-x-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="font-medium capitalize">Payment Method:</span>
                                <span className="uppercase text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">
                                    {order.payment_method}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700 space-x-2">
                                <Truck className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">Phone:</span>
                                <span>{maskText(order.phone)}</span>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800 mt-2">
                                <span className="font-bold">Order Note:</span> {order.notes}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="w-full bg-black text-white font-medium py-3.5 rounded-xl hover:bg-gray-800 transition flex items-center justify-center space-x-2 shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
            <OrderHeader />
            <Suspense
                fallback={
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    </div>
                }
            >
                <OrderConfirmationContent />
            </Suspense>
            <Footer />
        </div>
    );
}