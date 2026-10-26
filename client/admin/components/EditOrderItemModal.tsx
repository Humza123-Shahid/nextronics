"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function EditOrderItemModal() {
    const {
        selectedOrderItemForEdit,
        setSelectedOrderItemForEdit,
        orders,
        products,
        productVariants,
        updateOrderItem,
        users
    } = useAdmin();

    const [formData, setFormData] = useState<any>({
        order: "",
        product: "",
        product_variant: "",
        product_name_snapshot: "",
        sku_snapshot: "",
        unit_price: "",
        quantity: "1",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedOrderItemForEdit) {
            const item = selectedOrderItemForEdit as any;
            const orderId = item.order_id ?? (typeof item.order === "object" ? item.order?.id : item.order) ?? "";
            const prodId = item.product_id ?? (typeof item.product === "object" ? item.product?.id : item.product) ?? "";
            const variantId = item.product_variant_id ?? (typeof item.product_variant === "object" ? item.product_variant?.id : item.product_variant) ?? "";

            setFormData({
                order: orderId,
                product: prodId,
                product_variant: variantId,
                product_name_snapshot: item.product_name_snapshot || "",
                sku_snapshot: item.sku_snapshot || "",
                unit_price: item.unit_price ?? "",
                quantity: item.quantity ?? 1,
            });
        }
    }, [selectedOrderItemForEdit]);

    if (!selectedOrderItemForEdit) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                order: Number(formData.order),
                product: formData.product ? Number(formData.product) : null,
                product_variant: formData.product_variant ? Number(formData.product_variant) : null,
                product_name_snapshot: formData.product_name_snapshot,
                sku_snapshot: formData.sku_snapshot,
                unit_price: Number(formData.unit_price),
                quantity: Number(formData.quantity),
            };

            if (updateOrderItem) {
                await updateOrderItem(selectedOrderItemForEdit.id, payload);
            }
            setSelectedOrderItemForEdit(null);
        } catch (err) {
            console.error("Failed to update order item:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculatedSubtotal = (
        (Number(formData.unit_price) || 0) * (Number(formData.quantity) || 0)
    ).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Edit Order Item</h3>
                            <p className="text-xs text-[#8A99AD]">Item ID: #{selectedOrderItemForEdit.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedOrderItemForEdit(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Order *</label>
                        <select
                            name="order"
                            value={formData.order}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Order</option>
                            {orders.map((o: any) => {
                                const matchedUser = users.find((u) => String(u.id) === String(o.user_id));
                                return (
                                    <option key={o.id} value={o.id}>
                                        {o.order_number} ({matchedUser?.email || "Guest"})
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Product</label>
                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select Product</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Product Variant</label>
                            <select
                                name="product_variant"
                                value={formData.product_variant}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select Variant</option>
                                {productVariants.map((v: any) => (
                                    <option key={v.id} value={v.id}>
                                        {v.sku} ({v.product_name || "Variant"})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Product Name Snapshot *</label>
                            <input
                                type="text"
                                name="product_name_snapshot"
                                value={formData.product_name_snapshot}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">SKU Snapshot *</label>
                            <input
                                type="text"
                                name="sku_snapshot"
                                value={formData.sku_snapshot}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Unit Price ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="unit_price"
                                value={formData.unit_price}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Quantity *</label>
                            <input
                                type="number"
                                min="1"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Subtotal ($)</label>
                            <input
                                type="text"
                                value={`$${calculatedSubtotal}`}
                                readOnly
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F]/50 px-3 py-2 text-emerald-400 font-bold focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setSelectedOrderItemForEdit(null)}
                            className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-amber-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}