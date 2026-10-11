"use client";

import React, { useState } from "react";
import { X, Plus, Layers } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AddProductVariantModal() {
    const {
        isAddProductVariantModalOpen,
        setIsAddProductVariantModalOpen,
        products,
        attributeValues,
        addProductVariant,
    } = useAdmin();

    const [formData, setFormData] = useState({
        product: "",
        sku: "",
        price_override: "",
        stock_quantity: "0",
        is_active: true,
    });

    const [selectedAttributeValues, setSelectedAttributeValues] = useState<number[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isAddProductVariantModalOpen) return null;

    // Group AttributeValues by attributeName
    const groupedAttributes = attributeValues.reduce((acc, current) => {
        const key = current.attributeName;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(current);
        return acc;
    }, {} as Record<string, typeof attributeValues>);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedAttributeValues((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            // Use FormData to support image uploading as well as multi-select attributes
            const payload = new FormData();
            payload.append("product", formData.product);
            payload.append("sku", formData.sku);
            payload.append("stock_quantity", formData.stock_quantity);
            payload.append("is_active", String(formData.is_active));

            if (formData.price_override) {
                payload.append("price_override", formData.price_override);
            }

            selectedAttributeValues.forEach((val) => {
                payload.append("attribute_values", String(val));
            });

            if (imageFile) {
                payload.append("image", imageFile);
            }

            if (addProductVariant) {
                await addProductVariant(payload);
            }

            setIsAddProductVariantModalOpen(false);
        } catch (err: any) {
            console.error("Add Product Variant Error:", err);
            setErrorMsg(err.message || "Failed to add variant. Check backend validations.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Add New Product Variant</h3>
                            <p className="text-xs text-[#8A99AD]">Create a specific variation for a product</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddProductVariantModalOpen(false)}
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
                    {/* Row 1: Parent Product & SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Product *</label>
                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select Parent Product</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">SKU *</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Row 2: Price Override, Stock, Active */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Price Override ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price_override"
                                value={formData.price_override}
                                onChange={handleInputChange}
                                placeholder="Leave blank to use base price"
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Stock Quantity *</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                            <input
                                type="checkbox"
                                id="is_active_variant"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
                            />
                            <label htmlFor="is_active_variant" className="text-white font-medium cursor-pointer">
                                Is Active
                            </label>
                        </div>
                    </div>

                    {/* Row 3: Image File */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Variant Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                    </div>

                    {/* Row 4: Attribute Values Selection */}
                    <div className="pt-2">
                        <label className="mb-2 block text-[#8A99AD] font-semibold text-xs uppercase tracking-wider">
                            Attribute Values (Select Many)
                        </label>
                        <div className="space-y-4 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 max-h-60 overflow-y-auto">
                            {Object.keys(groupedAttributes).length === 0 ? (
                                <p className="text-[#8A99AD] italic text-xs">No attribute values available.</p>
                            ) : (
                                Object.entries(groupedAttributes).map(([attrName, items]) => (
                                    <div key={attrName} className="space-y-2 border-b border-[#2E3A47]/50 pb-3 last:border-0 last:pb-0">
                                        <span className="font-bold text-blue-400 block text-xs">{attrName}</span>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {items.map((item) => (
                                                <label
                                                    key={item.id}
                                                    className="flex items-center gap-2 text-white bg-[#1C2434] p-2 rounded-lg border border-[#2E3A47] cursor-pointer hover:border-blue-500/50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAttributeValues.includes(item.id)}
                                                        onChange={() => handleCheckboxChange(item.id)}
                                                        className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
                                                    />
                                                    <span>{item.value}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setIsAddProductVariantModalOpen(false)}
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
                            <span>{isSubmitting ? "Creating..." : "Create Variant"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}