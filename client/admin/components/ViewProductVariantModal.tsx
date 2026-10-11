"use client";

import React from "react";
import { X, Edit, Layers } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewProductVariantModal() {
    const {
        selectedProductVariantForView,
        setSelectedProductVariantForView,
        setSelectedProductVariantForEdit,
        products,
        attributeValues,
    } = useAdmin();

    if (!selectedProductVariantForView) return null;

    const variant = selectedProductVariantForView as any;

    // Resolve Parent Product Name
    const prodId =
        variant.product_id ??
        (typeof variant.product === "object" ? variant.product?.id : variant.product);

    const matchedProduct = products.find((p) => Number(p.id) === Number(prodId));
    const resolvedProductName =
        matchedProduct?.name ||
        (typeof variant.product === "object" ? variant.product?.name : null) ||
        variant.product_name ||
        "N/A";

    // Resolve ManyToMany Attribute Values
    const rawAttrs: any[] = Array.isArray(variant.attribute_values)
        ? variant.attribute_values
        : [];

    const resolvedAttributeList = rawAttrs.map((item) => {
        if (typeof item === "object" && item !== null) {
            return `${item.attributeName}: ${item.value}`;
        }
        const matched = attributeValues.find((a) => Number(a.id) === Number(item));
        return matched ? `${matched.attributeName}: ${matched.value}` : `ID: ${item}`;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Layers className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words">
                                {resolvedProductName}
                            </h3>
                            <p className="text-xs text-[#8A99AD] font-mono truncate">
                                SKU: {variant.sku}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedProductVariantForView(null)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-5">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[11px] text-[#8A99AD] block uppercase font-medium">Price Override</span>
                            <span className="text-base sm:text-xl font-bold text-white mt-0.5 block truncate">
                                {variant.price_override ? `$${Number(variant.price_override).toFixed(2)}` : "Base Price"}
                            </span>
                        </div>

                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[11px] text-[#8A99AD] block uppercase font-medium">Stock Quantity</span>
                            <span className="text-base sm:text-xl font-bold text-white mt-0.5 block truncate">
                                {variant.stock_quantity} <span className="text-xs font-normal text-[#8A99AD]">units</span>
                            </span>
                        </div>

                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[11px] text-[#8A99AD] block uppercase font-medium">Status</span>
                            <span className={variant.is_active ? "text-emerald-400 font-semibold block mt-1" : "text-rose-400 font-semibold block mt-1"}>
                                {variant.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    {/* Image & Attribute Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-4 text-xs">
                        {variant.image && (
                            <div>
                                <span className="text-[#8A99AD] font-semibold uppercase block mb-1 text-[10px] tracking-wider">
                                    Variant Image
                                </span>
                                <img
                                    src={variant.image}
                                    alt={variant.sku}
                                    className="h-32 w-32 object-cover rounded-lg border border-[#2E3A47]"
                                />
                            </div>
                        )}

                        <div>
                            <span className="text-[#8A99AD] font-semibold uppercase block mb-2 text-[10px] tracking-wider">
                                Attributes
                            </span>
                            {resolvedAttributeList.length === 0 ? (
                                <p className="text-[#8A99AD] italic">No attribute values associated.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {resolvedAttributeList.map((attr, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center rounded-lg bg-[#1C2434] border border-[#2E3A47] px-3 py-1 text-xs text-white"
                                        >
                                            {attr}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedProductVariantForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const v = selectedProductVariantForView;
                            setSelectedProductVariantForView(null);
                            setSelectedProductVariantForEdit(v);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Variant</span>
                    </button>
                </div>
            </div>
        </div>
    );
}