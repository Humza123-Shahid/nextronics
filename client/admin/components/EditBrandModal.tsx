"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3, Upload } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};
export default function EditBrandModal() {
    const {
        selectedBrandForEdit,
        setSelectedBrandForEdit,
        updateBrand,
    } = useAdmin();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (selectedBrandForEdit) {
            setFormData({
                name: selectedBrandForEdit.name || "",
                slug: selectedBrandForEdit.slug || "",
                description: selectedBrandForEdit.description || "",
            });
            setLogoPreview(
                typeof selectedBrandForEdit.logo === "string"
                    ? selectedBrandForEdit.logo
                    : null
            );
            setLogoFile(null);
        }
    }, [selectedBrandForEdit]);

    if (!selectedBrandForEdit) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const payload = new FormData();
            payload.append("name", formData.name);
            //payload.append("slug", formData.slug);
            const finalSlug = formData.slug.trim() ? formData.slug.trim() : generateSlug(formData.name);
            payload.append("slug", finalSlug);
            payload.append("description", formData.description);
            if (logoFile) {
                payload.append("logo", logoFile);
            }

            if (updateBrand) {
                await updateBrand(selectedBrandForEdit.id, payload);
            }
            setSelectedBrandForEdit(null);
        } catch (err: any) {
            console.error("Failed to update brand:", err);
            setErrorMsg(err.message || "Failed to update brand.");
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Edit Brand</h3>
                            <p className="text-xs text-[#8A99AD]">ID: #{selectedBrandForEdit.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedBrandForEdit(null)}
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
                    {/* Row 1: Name & Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Brand Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Logo Field */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Brand Logo</label>
                        <div className="flex items-center gap-4">
                            {logoPreview && (
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="h-14 w-14 rounded-lg border border-[#2E3A47] object-cover"
                                />
                            )}
                            <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-dashed border-[#2E3A47] bg-[#24303F] p-3 text-[#8A99AD] hover:border-blue-500 hover:text-white transition-colors">
                                <Upload className="h-4 w-4" />
                                <span>{logoFile ? logoFile.name : "Change Logo Image"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Submit & Cancel Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setSelectedBrandForEdit(null)}
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