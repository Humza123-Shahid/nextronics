"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddProductVariantModal from "../components/AddProductVariantModal";
import EditProductVariantModal from "../components/EditProductVariantModal";
import ViewProductVariantModal from "../components/ViewProductVariantModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function ProductVariantsView() {
    const {
        productVariants,
        deleteProductVariant,
        setIsAddProductVariantModalOpen,
        setSelectedProductVariantForView,
        setSelectedProductVariantForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [variantToDelete, setVariantToDelete] = useState<any | null>(null);

    const filteredVariants = productVariants.filter((v: any) => {
        const matchesStatus =
            selectedStatus === "All" ||
            (selectedStatus === "active" && v.is_active) ||
            (selectedStatus === "inactive" && !v.is_active);

        const matchesSearch =
            v.sku?.toLowerCase().includes(search.toLowerCase()) ||
            v.product_name?.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Product Variants Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by SKU or Product Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3 py-2 text-xs font-medium text-[#DEE4EE] focus:outline-none"
                        >
                            <option value="All">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

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
                            onClick={() => setIsAddProductVariantModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Variant</span>
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
                                    <th className="py-4 px-4 sm:px-6">Product</th>
                                    <th className="py-4 px-4 sm:px-6">SKU</th>
                                    <th className="py-4 px-4 sm:px-6">Price Override</th>
                                    <th className="py-4 px-4 sm:px-6">Stock</th>
                                    <th className="py-4 px-4 sm:px-6">Status</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredVariants.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No variants found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVariants.map((v: any) => {
                                        return (
                                            <tr key={v.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                                <td className="py-4 px-4 sm:px-6">
                                                    <p className="font-semibold text-white truncate text-xs sm:text-sm">
                                                        {v.product_name}
                                                    </p>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#8A99AD]">
                                                    {v.sku}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 font-bold text-white">
                                                    {v.price_override ? `$${Number(v.price_override).toFixed(2)}` : "—"}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-xs text-white">
                                                    {v.stock_quantity} units
                                                </td>

                                                <td className="py-4 px-4 sm:px-6">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase ${v.is_active
                                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                            }`}
                                                    >
                                                        {v.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedProductVariantForView(v)}
                                                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                            title="View details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedProductVariantForEdit(v)}
                                                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                            title="Edit variant"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setVariantToDelete(v)}
                                                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                            title="Delete variant"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredVariants.map((v: any) => (
                        <div
                            key={v.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs text-[#8A99AD] font-mono mb-2">
                                    <span>{v.sku}</span>
                                    <span className={`uppercase text-[10px] font-bold ${v.is_active ? "text-emerald-400" : "text-rose-400"}`}>
                                        {v.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-white text-sm line-clamp-1">{v.product_name}</h4>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                                <div>
                                    <span className="text-base font-bold text-white">
                                        {v.price_override ? `$${Number(v.price_override).toFixed(2)}` : "Base Price"}
                                    </span>
                                    <span className="block text-[10px] text-[#8A99AD]">{v.stock_quantity} in stock</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProductVariantForView(v)}
                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProductVariantForEdit(v)}
                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setVariantToDelete(v)}
                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddProductVariantModal />
            <EditProductVariantModal />
            <ViewProductVariantModal />

            <ConfirmDeleteModal
                isOpen={variantToDelete !== null}
                onClose={() => setVariantToDelete(null)}
                onConfirm={() => {
                    if (variantToDelete) {
                        deleteProductVariant(variantToDelete.id);
                    }
                }}
                title="Delete Product Variant"
                itemName={variantToDelete?.sku || ""}
                itemType="Product Variant"
            />
        </div>
    );
}