"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid, Award } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddBrandModal from "../components/AddBrandModal";
import EditBrandModal from "../components/EditBrandModal";
import ViewBrandModal from "../components/ViewBrandModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function BrandsView() {
    const {
        brands,
        deleteBrand,
        setIsAddBrandModalOpen,
        setSelectedBrandForView,
        setSelectedBrandForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [brandToDelete, setBrandToDelete] = useState<any | null>(null);

    const filteredBrands = brands.filter((b: any) => {
        return (
            b.name?.toLowerCase().includes(search.toLowerCase()) ||
            b.slug?.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Brands Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by name or slug..."
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
                            onClick={() => setIsAddBrandModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Brand</span>
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
                                    <th className="py-4 px-4 sm:px-6">Logo</th>
                                    <th className="py-4 px-4 sm:px-6">Brand Name</th>
                                    <th className="py-4 px-4 sm:px-6">Slug</th>
                                    <th className="py-4 px-4 sm:px-6">Description</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredBrands.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No brands found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBrands.map((b: any) => (
                                        <tr key={b.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                            <td className="py-4 px-4 sm:px-6">
                                                {b.logo ? (
                                                    <img
                                                        src={typeof b.logo === "string" ? b.logo : URL.createObjectURL(b.logo)}
                                                        alt={b.name}
                                                        className="h-10 w-10 rounded-lg object-cover border border-[#2E3A47]"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-[#1C2434] border border-[#2E3A47] flex items-center justify-center text-[#8A99AD]">
                                                        <Award className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6">
                                                <p className="font-semibold text-white truncate text-xs sm:text-sm">
                                                    {b.name}
                                                </p>
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#8A99AD]">
                                                {b.slug || "—"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD] max-w-xs truncate">
                                                {b.description || "—"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedBrandForView(b)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedBrandForEdit(b)}
                                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                        title="Edit brand"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setBrandToDelete(b)}
                                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                        title="Delete brand"
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
                    {filteredBrands.map((b: any) => (
                        <div
                            key={b.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    {b.logo ? (
                                        <img
                                            src={typeof b.logo === "string" ? b.logo : URL.createObjectURL(b.logo)}
                                            alt={b.name}
                                            className="h-12 w-12 rounded-lg object-cover border border-[#2E3A47]"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-lg bg-[#1C2434] border border-[#2E3A47] flex items-center justify-center text-[#8A99AD]">
                                            <Award className="h-6 w-6" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-white text-sm line-clamp-1">{b.name}</h4>
                                        <p className="text-xs text-[#8A99AD] font-mono">{b.slug || "—"}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-[#8A99AD] line-clamp-3">{b.description || "No description provided."}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedBrandForView(b)}
                                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedBrandForEdit(b)}
                                    className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBrandToDelete(b)}
                                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddBrandModal />
            <EditBrandModal />
            <ViewBrandModal />

            <ConfirmDeleteModal
                isOpen={brandToDelete !== null}
                onClose={() => setBrandToDelete(null)}
                onConfirm={() => {
                    if (brandToDelete) {
                        deleteBrand(brandToDelete.id);
                    }
                }}
                title="Delete Brand"
                itemName={brandToDelete?.name || ""}
                itemType="Brand"
            />
        </div>
    );
}