"use client";

import React from "react";
import { X, Edit, Truck } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewShipmentModal() {
    const {
        selectedShipmentForView,
        setSelectedShipmentForView,
        setSelectedShipmentForEdit,
        orders,
        shippingMethods,
        users,
    } = useAdmin();

    if (!selectedShipmentForView) return null;

    const shipment = selectedShipmentForView as any;

    // Resolve Foreign Key Objects
    const orderId =
        shipment.order_id ??
        (typeof shipment.order === "object" ? shipment.order?.id : shipment.order);

    const shippingMethodId =
        shipment.shipping_method_id ??
        (typeof shipment.shipping_method === "object" ? shipment.shipping_method?.id : shipment.shipping_method);

    const matchedOrder = orders.find((o) => Number(o.id) === Number(orderId));
    const matchedShippingMethod = shippingMethods.find((sm) => Number(sm.id) === Number(shippingMethodId));

    const userId = matchedOrder?.user_id ?? (typeof matchedOrder?.user === "object" ? (matchedOrder.user as any)?.id : matchedOrder?.user);
    const matchedUser = users.find((u) => Number(u.id) === Number(userId));

    const orderNumberDisplay = matchedOrder?.order_number || shipment.order_number_display || `Order #${orderId}`;
    const userEmailDisplay = matchedUser?.email || shipment.user_email_display || "Guest / N/A";
    const shippingMethodNameDisplay = matchedShippingMethod?.name || shipment.shipping_method_name_display || "N/A";

    const statusBadge =
        shipment.status === "delivered"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : shipment.status === "in_transit"
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                : shipment.status === "returned"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20";

    const formatDate = (isoStr?: string | null) => {
        if (!isoStr) return "N/A";
        try {
            return new Date(isoStr).toLocaleString();
        } catch {
            return isoStr;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Truck className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words max-w-full">
                                    Shipment #{shipment.id}
                                </h3>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border uppercase ${statusBadge}`}
                                >
                                    {shipment.status?.replace("_", " ")}
                                </span>
                            </div>

                            <p className="text-xs text-[#8A99AD] font-mono truncate max-w-full">
                                Tracking #: {shipment.tracking_number || "N/A"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedShipmentForView(null)}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-5">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Carrier</span>
                            <span className="text-base font-bold text-white mt-0.5 block truncate">
                                {shipment.carrier || "N/A"}
                            </span>
                        </div>

                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Shipping Method</span>
                            <span className="text-base font-bold text-slate-300 mt-0.5 block truncate">
                                {shippingMethodNameDisplay}
                            </span>
                        </div>
                    </div>

                    {/* Relational & Date Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3.5 sm:p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-[#2E3A47]/60 pb-3">
                            <div className="min-w-0">
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Order Number</span>
                                <span className="text-white font-medium truncate block font-mono">
                                    {orderNumberDisplay}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Customer Email</span>
                                <span className="text-white font-medium truncate block">
                                    {userEmailDisplay}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="min-w-0">
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Shipped At</span>
                                <span className="text-white font-medium truncate block">
                                    {formatDate(shipment.shipped_at)}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Delivered At</span>
                                <span className="text-white font-medium truncate block">
                                    {formatDate(shipment.delivered_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedShipmentForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const shp = selectedShipmentForView;
                            setSelectedShipmentForView(null);
                            if (setSelectedShipmentForEdit) setSelectedShipmentForEdit(shp);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Shipment</span>
                    </button>
                </div>
            </div>
        </div>
    );
}