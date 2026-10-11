"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid, Share2, ExternalLink } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddSocialModal from "../components/AddSocialModal";
import EditSocialModal from "../components/EditSocialModal";
import ViewSocialModal from "../components/ViewSocialModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function SocialsView() {
    const {
        socials,
        deleteSocial,
        setIsAddSocialModalOpen,
        setSelectedSocialForView,
        setSelectedSocialForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [socialToDelete, setSocialToDelete] = useState<any | null>(null);

    const filteredSocials = socials.filter((s: any) => {
        const searchLower = search.toLowerCase();
        const matchesPlatform = s.platformName?.toLowerCase().includes(searchLower);
        const matchesUrl = s.url?.toLowerCase().includes(searchLower);
        return matchesPlatform || matchesUrl;
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Social Links Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by platform name or URL..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center rounded-lg border border-[#2E3A47] bg-[#1C2434] p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode("table")}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-[#333A48] text-white" : "text-[#8A99AD] hover:text-white"
                                    }`}
                                title="Table view"
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-[#333A48] text-white" : "text-[#8A99AD] hover:text-white"
                                    }`}
                                title="Grid view"
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsAddSocialModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Social Link</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main View */}
            {viewMode === "table" ? (
                <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2E3A47] bg-[#1C2434]/50 text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD]">
                                    <th className="py-4 px-4 sm:px-6">Platform Name</th>
                                    <th className="py-4 px-4 sm:px-6">URL</th>
                                    <th className="py-4 px-4 sm:px-6">Created At</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredSocials.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No social links found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSocials.map((s: any) => (
                                        <tr key={s.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                                        <Share2 className="h-4 w-4" />
                                                    </div>
                                                    <p className="font-semibold text-white truncate text-xs sm:text-sm">
                                                        {s.platformName || "N/A"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#8A99AD]">
                                                {s.url ? (
                                                    <a
                                                        href={s.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-400 hover:underline inline-flex items-center gap-1.5"
                                                    >
                                                        <span className="max-w-[280px] sm:max-w-[360px] truncate">{s.url}</span>
                                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD] font-mono">
                                                {s.created_at ? new Date(s.created_at).toLocaleDateString() : "N/A"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedSocialForView(s)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedSocialForEdit(s)}
                                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                        title="Edit social link"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSocialToDelete(s)}
                                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                        title="Delete social link"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredSocials.length === 0 ? (
                        <div className="col-span-full rounded-xl border border-[#2E3A47] bg-[#24303F] p-8 text-center text-xs text-[#8A99AD]">
                            No social links found.
                        </div>
                    ) : (
                        filteredSocials.map((s: any) => (
                            <div
                                key={s.id}
                                className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-xs text-[#8A99AD] font-mono mb-3">
                                        <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                                            <Share2 className="h-4 w-4" />
                                            {s.platformName || "Unnamed"}
                                        </span>
                                        <span className="text-[10px] text-[#8A99AD]">#{s.id}</span>
                                    </div>

                                    <div className="mt-2">
                                        <span className="text-[10px] text-[#8A99AD] uppercase block mb-1">Target URL</span>
                                        {s.url ? (
                                            <a
                                                href={s.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-blue-400 hover:underline break-all inline-flex items-center gap-1 font-mono"
                                            >
                                                <span className="line-clamp-2">{s.url}</span>
                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <p className="text-xs text-[#DEE4EE]">N/A</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                                    <span className="text-[10px] text-[#8A99AD] font-mono">
                                        {s.created_at ? new Date(s.created_at).toLocaleDateString() : ""}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedSocialForView(s)}
                                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="View details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedSocialForEdit(s)}
                                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                            title="Edit social link"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSocialToDelete(s)}
                                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                            title="Delete social link"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modals */}
            <AddSocialModal />
            <EditSocialModal />
            <ViewSocialModal />

            {/* Delete Modal */}
            <ConfirmDeleteModal
                isOpen={socialToDelete !== null}
                onClose={() => setSocialToDelete(null)}
                onConfirm={() => {
                    if (socialToDelete) {
                        deleteSocial(socialToDelete.id);
                    }
                }}
                title="Delete Social Link"
                itemName={socialToDelete?.platformName || socialToDelete?.url || `ID #${socialToDelete?.id}`}
                itemType="Social"
            />
        </div>
    );
}