"use client";

import React from "react";
import { X, Eye, Package, Hash, DollarSign, Layers } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewOrderItemModal() {
    const { selectedOrderItemForView, setSelectedOrderItemForView } = useAdmin();

    if (!selectedOrderItemForView) return null;

    const item = selectedOrderItemForView;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Eye className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Order Item Details</h3>
                            <p className="text-xs text-[#8A99AD]">Item ID: #{item.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedOrderItemForView(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Details Grid */}
                <div className="mt-5 space-y-4 text-xs">
                    {/* Order Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F]/60 p-4">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD] mb-2 flex items-center gap-2">
                            <Hash className="h-3.5 w-3.5 text-blue-400" />
                            Order Info
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-white">
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">Order Number</span>
                                <span className="font-semibold text-sm">{item.order_number_display || `Order #${item.order}`}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">User Email</span>
                                <span className="font-mono text-xs">{item.user_email_display || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Product & Variant Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F]/60 p-4">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD] mb-2 flex items-center gap-2">
                            <Package className="h-3.5 w-3.5 text-blue-400" />
                            Product & Snapshot Info
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-white">
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">Snapshot Name</span>
                                <span className="font-bold text-sm">{item.product_name_snapshot}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">Snapshot SKU</span>
                                <span className="font-mono text-xs text-amber-400">{item.sku_snapshot}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">Linked Product ID</span>
                                <span>{item.product ? `#${item.product} (${item.product_name_display})` : "None"}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">Linked Variant SKU</span>
                                <span>{item.product_variant ? item.product_variant_label : "None"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Quantity */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F]/60 p-4">
                        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD] mb-2 flex items-center gap-2">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                            Pricing Breakdown
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-white">
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">Unit Price</span>
                                <span className="font-semibold">${Number(item.unit_price).toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">Quantity</span>
                                <span className="font-semibold">{item.quantity}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[10px]">Subtotal</span>
                                <span className="font-bold text-emerald-400 text-sm">
                                    ${Number(item.subtotal).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedOrderItemForView(null)}
                        className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}