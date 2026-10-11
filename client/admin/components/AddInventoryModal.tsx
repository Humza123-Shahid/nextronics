"use client";

import React, { useState } from "react";
import { X, Plus, Boxes } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AddInventoryModal() {
    const {
        isAddInventoryModalOpen,
        setIsAddInventoryModalOpen,
        productVariants,
        warehouses,
        addInventory,
    } = useAdmin();

    const [formData, setFormData] = useState({
        product_variant: "",
        warehouse: "",
        quantity: "0",
        reserved_quantity: "0",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isAddInventoryModalOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const payload = {
                product_variant: Number(formData.product_variant),
                warehouse: Number(formData.warehouse),
                quantity: Number(formData.quantity) || 0,
                reserved_quantity: Number(formData.reserved_quantity) || 0,
            };

            if (addInventory) {
                await addInventory(payload);
            }

            setIsAddInventoryModalOpen(false);
            setFormData({
                product_variant: "",
                warehouse: "",
                quantity: "0",
                reserved_quantity: "0",
            });
        } catch (err: any) {
            console.error("Add Inventory Error:", err);
            setErrorMsg(err.message || "Failed to add inventory record.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Boxes className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Add Inventory Entry</h3>
                            <p className="text-xs text-[#8A99AD]">Assign variant stock to a warehouse</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddInventoryModalOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {errorMsg && (
                    <div className="mt-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-mono break-words">
                        {errorMsg}
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                    {/* Product Variant Select */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Product Variant *</label>
                        <select
                            name="product_variant"
                            value={formData.product_variant}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Variant (Name & SKU)</option>
                            {productVariants.map((v: any) => {
                                // Find parent product name if attached
                                const parentName =
                                    v.product_name ||
                                    (typeof v.product === "object" ? v.product?.name : null) ||
                                    "";

                                return (
                                    <option key={v.id} value={v.id}>
                                        {parentName ? `${parentName} (${v.sku})` : v.sku}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Warehouse *</label>
                        <select
                            name="warehouse"
                            value={formData.warehouse}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Warehouse</option>
                            {warehouses.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name} ({w.city})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Row 2: Quantity & Reserved Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Quantity *</label>
                            <input
                                type="number"
                                min="0"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Reserved Quantity</label>
                            <input
                                type="number"
                                min="0"
                                name="reserved_quantity"
                                value={formData.reserved_quantity}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setIsAddInventoryModalOpen(false)}
                            className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            <span>{isSubmitting ? "Adding..." : "Add Inventory"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}