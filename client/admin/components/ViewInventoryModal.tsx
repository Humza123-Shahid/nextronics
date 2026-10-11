"use client";

import React from "react";
import { X, Edit, Boxes } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewInventoryModal() {
    const {
        selectedInventoryForView,
        setSelectedInventoryForView,
        setSelectedInventoryForEdit,
        productVariants,
        warehouses,
    } = useAdmin();

    if (!selectedInventoryForView) return null;

    const inv = selectedInventoryForView as any;

    // Resolve Foreign Key IDs
    const variantId =
        inv.product_variant_id ??
        (typeof inv.product_variant === "object" ? inv.product_variant?.id : inv.product_variant);

    const warehouseId =
        inv.warehouse_id ??
        (typeof inv.warehouse === "object" ? inv.warehouse?.id : inv.warehouse);

    // Dynamic Lookup
    const matchedVariant = productVariants.find((v) => Number(v.id) === Number(variantId));
    const matchedWarehouse = warehouses.find((w) => Number(w.id) === Number(warehouseId));

    const resolvedVariantSku =
        matchedVariant?.sku ||
        (typeof inv.product_variant === "object" ? inv.product_variant?.sku : null) ||
        inv.product_variant_sku ||
        `Variant #${variantId}`;

    const resolvedWarehouseName =
        matchedWarehouse?.name ||
        (typeof inv.warehouse === "object" ? inv.warehouse?.name : null) ||
        inv.warehouse_name ||
        `Warehouse #${warehouseId}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Boxes className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words">
                                Inventory Record #{inv.id}
                            </h3>
                            <p className="text-xs text-[#8A99AD] font-mono truncate">
                                Updated: {inv.updated_at ? new Date(inv.updated_at).toLocaleString() : "N/A"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedInventoryForView(null)}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-5">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Quantity</span>
                            <span className="text-base sm:text-xl font-bold text-white mt-0.5 block truncate">
                                {inv.quantity} <span className="text-xs font-normal text-[#8A99AD]">units</span>
                            </span>
                        </div>

                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Reserved</span>
                            <span className="text-base sm:text-xl font-bold text-amber-400 mt-0.5 block truncate">
                                {inv.reserved_quantity} <span className="text-xs font-normal text-[#8A99AD]">units</span>
                            </span>
                        </div>
                    </div>

                    {/* FK Relational Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Product Variant</span>
                                <span className="text-white font-medium block">
                                    {inv.product_variant_label || resolvedVariantSku}
                                </span>
                                {inv.product_variant_sku && (
                                    <span className="text-[10px] text-[#8A99AD] font-mono block mt-0.5">
                                        SKU: {inv.product_variant_sku}
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Warehouse</span>
                                <span className="text-white font-medium block">{resolvedWarehouseName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedInventoryForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const current = selectedInventoryForView;
                            setSelectedInventoryForView(null);
                            setSelectedInventoryForEdit(current);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Inventory</span>
                    </button>
                </div>
            </div>
        </div>
    );
}