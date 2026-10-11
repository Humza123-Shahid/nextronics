"use client";

import React, { useState } from "react";
import { X, Plus, ShoppingBag } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AddCartModal() {
    const { isAddCartModalOpen, setIsAddCartModalOpen, users, addCart } = useAdmin();

    const [formData, setFormData] = useState({
        user: "",
        session_key: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isAddCartModalOpen) return null;

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
                user: formData.user ? Number(formData.user) : null,
                session_key: formData.session_key.trim() || null,
            };

            if (addCart) {
                await addCart(payload);
            }

            setIsAddCartModalOpen(false);
            setFormData({ user: "", session_key: "" });
        } catch (err: any) {
            console.error("Add Cart Error:", err);
            setErrorMsg(err.message || "Failed to create cart.");
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
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Add New Cart</h3>
                            <p className="text-xs text-[#8A99AD]">Create a cart for a user or a guest session</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddCartModalOpen(false)}
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
                        <label className="mb-1 block text-[#8A99AD] font-medium">User Email</label>
                        <select
                            name="user"
                            value={formData.user}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Guest Cart (No User Selected)</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.email} ({u.username})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Session Key (Guest Session)</label>
                        <input
                            type="text"
                            name="session_key"
                            value={formData.session_key}
                            onChange={handleInputChange}
                            placeholder="e.g. sess_abc123xyz"
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none font-mono"
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setIsAddCartModalOpen(false)}
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
                            <span>{isSubmitting ? "Creating..." : "Create Cart"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}