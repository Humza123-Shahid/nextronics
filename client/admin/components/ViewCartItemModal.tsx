"use client";

import React from "react";
import { X, Edit, ShoppingCart } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { User } from "../types";

export default function ViewCartItemModal() {
    const {
        selectedCartItemForView,
        setSelectedCartItemForView,
        setSelectedCartItemForEdit,
        carts,
        productVariants,
        products,
        users,
    } = useAdmin();

    if (!selectedCartItemForView) return null;

    const item = selectedCartItemForView;

    // Resolve Cart details
    const matchedCart = carts.find((c) => Number(c.id) === Number(item.cart));
    //const userId = matchedCart?.user ? (typeof matchedCart.user === "object" ? matchedCart.user.id : matchedCart.user) : null;
    const userId = matchedCart?.user
        ? typeof matchedCart.user === "object"
            ? (matchedCart.user as User).id
            : matchedCart.user
        : null;
    const matchedUser = users.find((u) => Number(u.id) === Number(userId));

    // Resolve Variant details
    const matchedVariant = productVariants.find((v) => Number(v.id) === Number(item.product_variant));
    const prodId = matchedVariant?.product ? (typeof matchedVariant.product === "object" ? matchedVariant.product.id : matchedVariant.product) : null;
    const matchedProduct = products.find((p) => Number(p.id) === Number(prodId));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <ShoppingCart className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="text-lg font-bold tracking-tight text-white">
                                Cart Item #{item.id}
                            </h3>
                            <p className="text-xs text-[#8A99AD] font-mono">
                                Added: {item.added_at ? new Date(item.added_at).toLocaleString() : "N/A"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedCartItemForView(null)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-4 text-xs">
                    {/* Key Metric */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                        <span className="text-[10px] text-[#8A99AD] block uppercase font-medium">Quantity</span>
                        <span className="text-xl font-bold text-white mt-0.5 block">
                            {item.quantity} <span className="text-xs font-normal text-[#8A99AD]">units</span>
                        </span>
                    </div>

                    {/* Cart FK Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-2">
                        <span className="text-[#8A99AD] font-semibold uppercase block text-[10px] tracking-wider">
                            Parent Cart Information
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white">
                            <div>
                                <span className="text-[#8A99AD] block text-[11px]">Cart ID:</span>
                                <span className="font-medium">#{item.cart}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[11px]">Session Key:</span>
                                <span className="font-mono text-emerald-400">{matchedCart?.session_key || "N/A"}</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <span className="text-[#8A99AD] block text-[11px]">User Email:</span>
                                <span className="font-medium">{matchedUser?.email || "Guest / Unauthenticated"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Variant Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-2">
                        <span className="text-[#8A99AD] font-semibold uppercase block text-[10px] tracking-wider">
                            Product Variant Information
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white">
                            <div>
                                <span className="text-[#8A99AD] block text-[11px]">Product Name:</span>
                                <span className="font-medium text-blue-400">{matchedProduct?.name || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[11px]">SKU:</span>
                                <span className="font-mono">{matchedVariant?.sku || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[11px]">Price Override:</span>
                                <span>{matchedVariant?.price_override ? `$${matchedVariant.price_override}` : "None"}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block text-[11px]">Current Stock:</span>
                                <span>{matchedVariant?.stock_quantity ?? "N/A"} units</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedCartItemForView(null)}
                        className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const current = selectedCartItemForView;
                            setSelectedCartItemForView(null);
                            setSelectedCartItemForEdit(current);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Cart Item</span>
                    </button>
                </div>
            </div>
        </div>
    );
}