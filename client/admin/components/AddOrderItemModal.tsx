"use client";

import React, { useState } from "react";
import { X, Plus, ShoppingBag } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AddOrderItemModal() {
    const {
        isAddOrderItemModalOpen,
        setIsAddOrderItemModalOpen,
        orders,
        products,
        productVariants,
        addOrderItem,
    } = useAdmin();

    const [formData, setFormData] = useState({
        order: "",
        product: "",
        product_variant: "",
        product_name_snapshot: "",
        sku_snapshot: "",
        unit_price: "",
        quantity: "1",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isAddOrderItemModalOpen) return null;

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prodId = e.target.value;
        const selectedProd = products.find((p) => String(p.id) === String(prodId));

        setFormData((prev) => ({
            ...prev,
            product: prodId,
            product_name_snapshot: selectedProd ? selectedProd.name : prev.product_name_snapshot,
            sku_snapshot: selectedProd ? selectedProd.sku : prev.sku_snapshot,
            unit_price: selectedProd ? String(selectedProd.price) : prev.unit_price,
        }));
    };

    const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const variantId = e.target.value;
        const selectedVariant = productVariants.find((v) => String(v.id) === String(variantId));

        if (selectedVariant) {
            setFormData((prev) => ({
                ...prev,
                product_variant: variantId,
                sku_snapshot: selectedVariant.sku,
                ...(selectedVariant.price_override && {
                    unit_price: String(selectedVariant.price_override),
                }),
            }));
        } else {
            setFormData((prev) => ({ ...prev, product_variant: "" }));
        }
    };

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
            const payload: any = {
                order: Number(formData.order),
                product: formData.product ? Number(formData.product) : null,
                product_variant: formData.product_variant ? Number(formData.product_variant) : null,
                product_name_snapshot: formData.product_name_snapshot,
                sku_snapshot: formData.sku_snapshot,
                unit_price: Number(formData.unit_price),
                quantity: Number(formData.quantity),
            };

            if (addOrderItem) {
                await addOrderItem(payload);
            }
            setFormData({
                order: "",
                product: "",
                product_variant: "",
                product_name_snapshot: "",
                sku_snapshot: "",
                unit_price: "",
                quantity: "1",
            })
            setIsAddOrderItemModalOpen(false);
        } catch (err: any) {
            console.error("Add OrderItem Error:", err);
            setErrorMsg(err.message || "Failed to add order item. Check validations.");
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Add Order Item</h3>
                            <p className="text-xs text-[#8A99AD]">Attach item to an existing order</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddOrderItemModalOpen(false)}
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

                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                    {/* Order Foreign Key Choice */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Order *</label>
                        <select
                            name="order"
                            value={formData.order}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Order (Order Number - Email)</option>
                            {orders.map((o: any) => (
                                <option key={o.id} value={o.id}>
                                    {o.order_number} ({o.user_email || "Guest"})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product & Variant Choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Product</label>
                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleProductChange}
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
                                onChange={handleVariantChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select Variant (SKU - Product)</option>
                                {productVariants.map((v: any) => (
                                    <option key={v.id} value={v.id}>
                                        {v.sku} ({v.product_name || "Variant"})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Snapshots */}
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

                    {/* Price, Quantity, Calculated Subtotal */}
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

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setIsAddOrderItemModalOpen(false)}
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
                            <span>{isSubmitting ? "Adding..." : "Add Order Item"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}