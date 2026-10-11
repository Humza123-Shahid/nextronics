"use client";

import React from "react";
import { X, Edit, Share2, ExternalLink } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewSocialModal() {
    const {
        selectedSocialForView,
        setSelectedSocialForView,
        setSelectedSocialForEdit,
    } = useAdmin();

    if (!selectedSocialForView) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Share2 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words max-w-full">
                                {selectedSocialForView.platformName || "Unnamed Platform"}
                            </h3>
                            <p className="text-xs text-[#8A99AD] font-mono truncate max-w-full">
                                ID: #{selectedSocialForView.id}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedSocialForView(null)}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-4 text-xs">
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3">
                        <div>
                            <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Platform Name</span>
                            <span className="text-white font-medium block">
                                {selectedSocialForView.platformName || "N/A"}
                            </span>
                        </div>

                        <div>
                            <span className="text-[#8A99AD] block mb-0.5 text-[11px]">URL</span>
                            {selectedSocialForView.url ? (
                                <a
                                    href={selectedSocialForView.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-400 hover:underline inline-flex items-center gap-1 font-mono break-all"
                                >
                                    {selectedSocialForView.url}
                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                </a>
                            ) : (
                                <span className="text-[#DEE4EE]">N/A</span>
                            )}
                        </div>

                        <div>
                            <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Created At</span>
                            <span className="text-[#DEE4EE] font-mono">
                                {selectedSocialForView.created_at
                                    ? new Date(selectedSocialForView.created_at).toLocaleString()
                                    : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedSocialForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const social = selectedSocialForView;
                            setSelectedSocialForView(null);
                            setSelectedSocialForEdit(social);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Social Link</span>
                    </button>
                </div>
            </div>
        </div>
    );
}