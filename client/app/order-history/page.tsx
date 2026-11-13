"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from "next/navigation";
import { getAuthCookie } from '@/app/actions/auth';
import { Package, ChevronRight, Calendar, CreditCard, User } from "lucide-react";

// TypeScript interfaces matching your Django API response
interface OrderItem {
    id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    price: string;
}

interface Order {
    id: string;
    order_number: string;
    placed_at: string;
    // total_amount: string;
    grand_total: number | string;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    customer_name?: string; // Useful for Admin view
    access_token?: string;  // Useful for Guest view
    items: OrderItem[];
}

interface OrderCardsProps {
    orders: Order[];
    isAdmin?: boolean;
}

// export default function OrderCardList({ orders, isAdmin = false }: OrderCardsProps) {
export default function OrderCardList() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[] | null>(null);
    //   const [loading, setLoading] = useState<boolean>(true);
    //   const [error, setError] = useState<string | null>(null);
    useEffect(() => {


        const fetchOrderDetails = async () => {
            try {
                //setLoading(true);
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
                const response = await fetch(`http://127.0.0.1:8080/api/orders/`, {
                    method: 'GET',
                    headers,
                });

                if (!response.ok) {
                    throw new Error('Failed to retrieve order details.');
                }

                const data = await response.json();
                setOrders(data);
            } catch (err: any) {
                //setError(err.message || 'Unable to load order details.');
            } finally {
                //setLoading(false);
            }
        };

        fetchOrderDetails();
    }, []);

    // Navigate to the single order detail page
    const handleCardClick = (order: Order) => {
        // if (isAdmin) {
        //     router.push(`/admin/orders/${order.id}`);
        // } else if (order.access_token) {
        //     // Append token if viewing as a guest
        //     router.push(`/orders/${order.id}?token=${order.access_token}`);
        // } else {
        //     router.push(`/orders/${order.id}`);
        // }
    };

    // Helper for status badge colors
    const getStatusBadge = (status: Order["status"]) => {
        const styles = {
            PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
            PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
            SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
            DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-200",
            CANCELLED: "bg-red-100 text-red-800 border-red-200",
        };

        return (
            <span
                className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status] || "bg-gray-100 text-gray-800"
                    }`}
            >
                {status}
            </span>
        );
    };

    if (orders?.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    When orders are placed, they will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders?.map((order) => (
                <div
                    key={order.id}
                    onClick={() => handleCardClick(order)}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer overflow-hidden"
                >
                    {/* Card Header: Order Metadata */}
                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider">Order ID</p>
                                <p className="font-mono font-semibold text-gray-900">
                                    #{order.order_number}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" /> Date Placed
                                </p>
                                <p className="font-medium text-gray-800">
                                    {new Date(order.placed_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider flex items-center gap-1">
                                    <CreditCard className="w-3.5 h-3.5" /> Total
                                </p>
                                <p className="font-semibold text-gray-900">${order.grand_total}</p>
                            </div>

                            {/* Show customer name only if viewed by Admin */}
                            {/* {isAdmin && order.customer_name && (
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" /> Customer
                                    </p>
                                    <p className="font-medium text-gray-800">{order.customer_name}</p>
                                </div>
                            )} */}
                        </div>

                        {/* Status Badge & Action Arrow */}
                        <div className="flex items-center gap-3">
                            {getStatusBadge(order.status)}
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Card Body: Product Thumbnails & Names */}
                    <div className="p-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 overflow-x-auto">
                            {order.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-center gap-3 min-w-max">
                                    <img
                                        src={item.product_image || "/placeholder-tech.png"}
                                        alt={item.product_name}
                                        className="w-14 h-14 object-cover rounded-lg border border-gray-200 bg-gray-50"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[180px]">
                                            {item.product_name}
                                        </p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}

                            {/* If an order has more than 3 electronics items, show a "+X more" badge */}
                            {order.items.length > 3 && (
                                <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                                    +{order.items.length - 3} more
                                </div>
                            )}
                        </div>

                        <span className="hidden sm:inline-block text-sm font-medium text-blue-600 group-hover:underline shrink-0">
                            View Details
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
