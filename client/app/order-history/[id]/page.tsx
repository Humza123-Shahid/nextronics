"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuthCookie } from '@/app/actions/auth';
import {
    ArrowLeft,
    Check,
    Clock,
    PackageCheck,
    Package,
    MapPin,
    CreditCard,
    Phone,
    User,
    FileText,
    XCircle,
    Loader2,
} from "lucide-react";

interface StatusHistoryItem {
    id: number;
    status: string;
    status_display: string;
    notes: string;
    created_at: string;
}

interface OrderItem {
    id: number;
    product_name: string;
    product_image?: string;
    variant: string;
    unit_price: string;
    quantity: number;
}

interface Address {
    full_name: string;
    phone_number: string;
    address_line1: string;
    city: string;
    postal_code: string;
    country: string;
}

interface OrderDetail {
    id: number;
    order_number: string;
    status: string;
    status_display: string;
    payment_status: string;
    payment_status_display: string;
    payment_method_display: string;
    subtotal: string;
    discount_total: string;
    shipping_total: string;
    tax_total: string;
    grand_total: string;
    currency: string;
    notes: string;
    placed_at: string;
    shipping_address: Address;
    items: OrderItem[];
    status_history: StatusHistoryItem[];
}

const ALL_STEPS = [
    { key: "pending", label: "Pending", desc: "Order placed" },
    { key: "confirmed", label: "Confirmed", desc: "Verified" },
    { key: "processing", label: "Processing", desc: "Packing items" },
    { key: "shipped", label: "Shipped", desc: "Dispatched" },
    { key: "delivered", label: "Delivered", desc: "Completed" },
];

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const orderId = params?.id;

    useEffect(() => {
        if (!orderId) return;
        const fetchOrderDetails = async () => {
            try {
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
                // Replace with your Django API endpoint: fetch(`/api/orders/${orderId}/`)
                // fetch(`http://127.0.0.1:8080/api/order-details/${orderId}/`)
                //     .then((res) => res.json())
                //     .then((data) => {
                //         setOrder(data);
                //         setLoading(false);
                //     })
                //     .catch(() => setLoading(false));
                const response = await fetch(`http://127.0.0.1:8080/api/order-details/${orderId}/`, {
                    method: 'GET',
                    headers,
                });

                if (!response.ok) {
                    throw new Error('Failed to retrieve order details.');
                }

                const data = await response.json();
                setOrder(data);
                setLoading(false);
            } catch (err: any) {
                //setError(err.message || 'Unable to load order details.');
            } finally {
                //setLoading(false);
            }
        }
        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
                <button
                    onClick={() => router.push("/orders")}
                    className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Order History
                </button>
            </div>
        );
    }

    // Map history logs into a lookup table for quick timestamp referencing
    const historyMap = new Map<string, string>();
    order.status_history?.forEach((h) => {
        historyMap.set(
            h.status,
            new Date(h.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
            " (" +
            new Date(h.created_at).toLocaleDateString([], { month: "short", day: "numeric" }) +
            ")"
        );
    });

    const currentStepIndex = ALL_STEPS.findIndex((s) => s.key === order.status);
    const isTerminalNegative = order.status === "cancelled" || order.status === "refunded";

    return (
        <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header & Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <button
                            onClick={() => router.push("/orders")}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Orders
                        </button>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Order #{order.order_number}
                            </h1>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                                {order.status_display}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on {new Date(order.placed_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {order.status === "pending" && (
                            <button className="px-4 py-2 text-sm font-medium text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition">
                                Cancel Order
                            </button>
                        )}
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
                        >
                            <FileText className="w-4 h-4" />
                            Invoice
                        </button>
                    </div>
                </div>

                {/* Dynamic Status Progress Tracker */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6">
                    <div className="pb-6 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-900">Order Progress</h2>
                        <p className="text-sm text-gray-500">Live updates recorded from order status history</p>
                    </div>

                    {isTerminalNegative ? (
                        <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                            <div>
                                <p className="font-semibold text-sm capitalize">Order has been {order.status}</p>
                                <p className="text-xs text-rose-600 mt-0.5">
                                    This order is closed and will not proceed further through standard fulfillment.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                            {ALL_STEPS.map((step, index) => {
                                const isCompleted =
                                    currentStepIndex !== -1 && index <= currentStepIndex;
                                const isCurrent = step.key === order.status;
                                const timestamp = historyMap.get(step.key);

                                return (
                                    <div
                                        key={step.key}
                                        className="relative flex md:flex-col items-start md:items-center md:text-center gap-3.5 md:gap-2"
                                    >
                                        {/* Connector line for desktop view */}
                                        {index < ALL_STEPS.length - 1 && (
                                            <div
                                                className={`hidden md:block absolute top-4 left-1/2 w-full h-0.5 -z-0 ${currentStepIndex !== -1 && index < currentStepIndex
                                                    ? "bg-emerald-500"
                                                    : "bg-gray-200"
                                                    }`}
                                            />
                                        )}

                                        <div
                                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${isCompleted
                                                ? "bg-emerald-500 text-white shadow-sm"
                                                : "bg-gray-100 text-gray-400 border border-gray-200"
                                                } ${isCurrent ? "ring-4 ring-emerald-100 scale-110" : ""}`}
                                        >
                                            {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Clock className="w-4 h-4" />}
                                        </div>

                                        <div>
                                            <p className={`text-sm font-semibold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                                {step.label}
                                            </p>
                                            <p className="text-xs text-gray-500">{step.desc}</p>
                                            {timestamp && <p className="text-[11px] font-medium text-emerald-600 mt-0.5">{timestamp}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Content Section: Items + Summary / Addresses */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <PackageCheck className="w-5 h-5 text-indigo-600" />
                                Items Ordered ({order.items?.length})
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-200/70 overflow-hidden shrink-0 flex items-center justify-center">
                                            {item.product_image ? (
                                                <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.product_name}</h3>
                                            {item.variant && (
                                                <span className="inline-block mt-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md">
                                                    {item.variant}
                                                </span>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1.5">
                                                Qty: <span className="font-semibold text-gray-800">{item.quantity}</span> × {order.currency}{" "}
                                                {Number(item.unit_price).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-gray-900">
                                            {order.currency} {(Number(item.unit_price) * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        {order.shipping_address && (
                            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-3">
                                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-indigo-600" />
                                    Delivery Address
                                </h2>
                                <div className="text-sm text-gray-600 space-y-2 pt-1">
                                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        {order.shipping_address.full_name}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {order.shipping_address.phone_number}
                                    </p>
                                    <p className="leading-relaxed pl-6 text-gray-500">
                                        {order.shipping_address.address_line1}, {order.shipping_address.city} (
                                        {order.shipping_address.postal_code}), {order.shipping_address.country}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-3">
                            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                                Payment Info
                            </h2>
                            <div className="flex items-center justify-between text-sm pt-1">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium text-gray-900">{order.payment_method_display}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span
                                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${order.payment_status === "paid"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-amber-100 text-amber-800"
                                        }`}
                                >
                                    {order.payment_status_display}
                                </span>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-3">
                            <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
                            <div className="space-y-2 text-sm pt-1">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{order.currency} {Number(order.subtotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Fee</span>
                                    <span>{order.currency} {Number(order.shipping_total).toLocaleString()}</span>
                                </div>
                                {Number(order.discount_total) > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Discount</span>
                                        <span>- {order.currency} {Number(order.discount_total).toLocaleString()}</span>
                                    </div>
                                )}
                                {Number(order.tax_total) > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>{order.currency} {Number(order.tax_total).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-indigo-600">
                                        {order.currency} {Number(order.grand_total).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}