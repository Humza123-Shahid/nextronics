"use client";

import React, { useState } from "react";
import { X, Plus, MessageSquarePlus, Star } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AddTestimonialModal() {
    const { isAddTestimonialModalOpen, setIsAddTestimonialModalOpen, addTestimonial } = useAdmin();

    const [formData, setFormData] = useState({
        patientName: "",
        profession: "",
        rating: 5,
        comment: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isAddTestimonialModalOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "rating" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const payload = {
                patientName: formData.patientName.trim(),
                profession: formData.profession.trim() || null,
                rating: Number(formData.rating),
                comment: formData.comment.trim() || null,
            };

            if (addTestimonial) {
                await addTestimonial(payload);
            }

            setIsAddTestimonialModalOpen(false);
            setFormData({ patientName: "", profession: "", rating: 5, comment: "" });
        } catch (err: any) {
            console.error("Add Testimonial Error:", err);
            setErrorMsg(err.message || "Failed to add testimonial.");
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
                            <MessageSquarePlus className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Add New Testimonial</h3>
                            <p className="text-xs text-[#8A99AD]">Fill details to add patient testimonial</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddTestimonialModalOpen(false)}
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
                    {/* Patient Name */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Patient Name *</label>
                        <input
                            type="text"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Profession & Rating */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Profession</label>
                            <input
                                type="text"
                                name="profession"
                                value={formData.profession}
                                onChange={handleInputChange}
                                placeholder="e.g. Software Engineer"
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Rating (1 to 5) *</label>
                            <select
                                name="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value={5}>5 - Excellent</option>
                                <option value={4}>4 - Very Good</option>
                                <option value={3}>3 - Good</option>
                                <option value={2}>2 - Fair</option>
                                <option value={1}>1 - Poor</option>
                            </select>
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Comment</label>
                        <textarea
                            name="comment"
                            rows={4}
                            value={formData.comment}
                            onChange={handleInputChange}
                            placeholder="Write the patient's testimonial here..."
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setIsAddTestimonialModalOpen(false)}
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
                            <span>{isSubmitting ? "Creating..." : "Create Testimonial"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}