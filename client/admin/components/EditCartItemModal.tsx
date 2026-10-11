"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { User } from "../types";

export default function EditCartItemModal() {
    const {
        selectedCartItemForEdit,
        setSelectedCartItemForEdit,
        carts,
        productVariants,
        products,
        users,
        updateCartItem,
    } = useAdmin();

    const [formData, setFormData] = useState({
        cart: "",
        product_variant: "",
        quantity: "1",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedCartItemForEdit) {
            setFormData({
                cart: String(selectedCartItemForEdit.cart || ""),
                product_variant: String(selectedCartItemForEdit.product_variant || ""),
                quantity: String(selectedCartItemForEdit.quantity || 1),
            });
        }
    }, [selectedCartItemForEdit]);

    if (!selectedCartItemForEdit) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await updateCartItem(selectedCartItemForEdit.id, {
                cart: Number(formData.cart),
                product_variant: Number(formData.product_variant),
                quantity: Number(formData.quantity),
            });
            setSelectedCartItemForEdit(null);
        } catch (err) {
            console.error("Failed to update cart item:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Edit Cart Item</h3>
                            <p className="text-xs text-[#8A99AD]">Item ID: #{selectedCartItemForEdit.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedCartItemForEdit(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                    {/* Cart FK Selection */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Cart *</label>
                        <select
                            name="cart"
                            value={formData.cart}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Cart</option>
                            {carts.map((c) => {
                                //const userId = typeof c.user === "object" ? c.user?.id : c.user;
                                const userId = typeof c.user === "object" && c.user !== null ? (c.user as User).id : c.user;
                                const userObj = users.find((u) => Number(u.id) === Number(userId));
                                const userEmail = userObj?.email || "Guest / No Email";
                                const sessionKey = c.session_key || "No Session Key";

                                return (
                                    <option key={c.id} value={c.id}>
                                        Cart #{c.id} — Session: {sessionKey} | Email: {userEmail}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Product Variant FK Selection */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Product Variant *</label>
                        <select
                            name="product_variant"
                            value={formData.product_variant}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Product Variant</option>
                            {productVariants.map((v) => {
                                const prodId = typeof v.product === "object" ? v.product?.id : v.product;
                                const parentProd = products.find((p) => Number(p.id) === Number(prodId));
                                const prodName = parentProd?.name || "Product";
                                return (
                                    <option key={v.id} value={v.id}>
                                        {prodName} — SKU: {v.sku} (Stock: {v.stock_quantity})
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Quantity */}
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

                    {/* Submit & Cancel Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setSelectedCartItemForEdit(null)}
                            className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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