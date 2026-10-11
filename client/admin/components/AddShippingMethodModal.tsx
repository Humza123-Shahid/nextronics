"use client";

import React, { useState } from "react";
import { X, Plus, Truck } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AddShippingMethodModal() {
    const { isAddShippingMethodModalOpen, setIsAddShippingMethodModalOpen, addShippingMethod } = useAdmin();

    const [formData, setFormData] = useState({
        name: "",
        cost: "",
        estimated_days_min: "1",
        estimated_days_max: "5",
        is_active: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isAddShippingMethodModalOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const payload = {
                name: formData.name,
                cost: Number(formData.cost),
                estimated_days_min: Number(formData.estimated_days_min),
                estimated_days_max: Number(formData.estimated_days_max),
                is_active: formData.is_active,
            };

            if (addShippingMethod) {
                await addShippingMethod(payload);
            }

            setIsAddShippingMethodModalOpen(false);
        } catch (err: any) {
            console.error("Add Shipping Method Error:", err);
            setErrorMsg(err.message || "Failed to add shipping method.");
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
                            <Truck className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Add Shipping Method</h3>
                            <p className="text-xs text-[#8A99AD]">Create a new shipping option for fulfillment</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddShippingMethodModalOpen(false)}
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
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Method Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Standard, Express, Overnight"
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Cost ($) *</label>
                        <input
                            type="number"
                            step="0.01"
                            name="cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Min Est. Days *</label>
                            <input
                                type="number"
                                min="0"
                                name="estimated_days_min"
                                value={formData.estimated_days_min}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Max Est. Days *</label>
                            <input
                                type="number"
                                min="0"
                                name="estimated_days_max"
                                value={formData.estimated_days_max}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_active_add_shipping"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
                        />
                        <label htmlFor="is_active_add_shipping" className="text-white font-medium cursor-pointer">
                            Is Active
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setIsAddShippingMethodModalOpen(false)}
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
                            <span>{isSubmitting ? "Creating..." : "Create Method"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}