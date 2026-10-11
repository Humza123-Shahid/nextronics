"use client";

import React from "react";
import { X, Edit, Tag } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewAttributeValueModal() {
    const {
        selectedAttributeValueForView,
        setSelectedAttributeValueForView,
        setSelectedAttributeValueForEdit,
    } = useAdmin();

    if (!selectedAttributeValueForView) return null;

    const attrVal = selectedAttributeValueForView;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Tag className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words">
                                {attrVal.attributeName}: {attrVal.value}
                            </h3>
                            <p className="text-xs text-[#8A99AD] font-mono truncate">
                                ID: #{attrVal.id}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedAttributeValueForView(null)}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-4">
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Attribute Name</span>
                                <span className="text-white font-medium block">{attrVal.attributeName}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Value</span>
                                <span className="text-white font-medium block">{attrVal.value}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedAttributeValueForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const item = selectedAttributeValueForView;
                            setSelectedAttributeValueForView(null);
                            setSelectedAttributeValueForEdit(item);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Attribute Value</span>
                    </button>
                </div>
            </div>
        </div>
    );
}