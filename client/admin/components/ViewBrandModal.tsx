"use client";

import React from "react";
import { X, Edit, Award } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewBrandModal() {
    const {
        selectedBrandForView,
        setSelectedBrandForView,
        setSelectedBrandForEdit,
    } = useAdmin();

    if (!selectedBrandForView) return null;

    const brand = selectedBrandForView;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Award className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words max-w-full">
                                {brand.name}
                            </h3>
                            <p className="text-xs text-[#8A99AD] font-mono truncate max-w-full">
                                Slug: {brand.slug || "N/A"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedBrandForView(null)}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-5">
                    {/* Logo Section */}
                    <div className="flex justify-center p-4 rounded-xl border border-[#2E3A47] bg-[#24303F]">
                        {brand.logo ? (
                            <img
                                src={typeof brand.logo === "string" ? brand.logo : URL.createObjectURL(brand.logo)}
                                alt={brand.name}
                                className="max-h-32 object-contain rounded-lg"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-[#8A99AD] py-6">
                                <Award className="h-10 w-10 mb-1 opacity-40" />
                                <span className="text-xs font-mono">No Logo Uploaded</span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3.5 sm:p-4 space-y-3 text-xs">
                        <div>
                            <span className="text-[#8A99AD] font-semibold uppercase block mb-1 text-[10px] tracking-wider">
                                Description
                            </span>
                            <p className="text-[#DEE4EE] leading-relaxed break-words whitespace-pre-wrap">
                                {brand.description || "No description provided."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedBrandForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const b = selectedBrandForView;
                            setSelectedBrandForView(null);
                            setSelectedBrandForEdit(b);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Brand</span>
                    </button>
                </div>
            </div>
        </div>
    );
}