"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddCartModal from "../components/AddCartModal";
import EditCartModal from "../components/EditCartModal";
import ViewCartModal from "../components/ViewCartModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function CartsView() {
    const {
        carts,
        deleteCart,
        setIsAddCartModalOpen,
        setSelectedCartForView,
        setSelectedCartForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [cartToDelete, setCartToDelete] = useState<any | null>(null);

    const filteredCarts = carts.filter((c: any) => {
        const matchesSearch =
            c.user_email?.toLowerCase().includes(search.toLowerCase()) ||
            c.session_key?.toLowerCase().includes(search.toLowerCase()) ||
            String(c.id).includes(search);
        return matchesSearch;
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Carts Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by ID, User Email, or Session Key..."
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
                            onClick={() => setIsAddCartModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Cart</span>
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
                                    <th className="py-4 px-4 sm:px-6">Cart ID</th>
                                    <th className="py-4 px-4 sm:px-6">User Email</th>
                                    <th className="py-4 px-4 sm:px-6">Session Key</th>
                                    <th className="py-4 px-4 sm:px-6">Created At</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredCarts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No carts found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCarts.map((c: any) => (
                                        <tr key={c.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                            <td className="py-4 px-4 sm:px-6 font-semibold text-white text-xs">
                                                #{c.id}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-white">
                                                {c.user_email || "Guest"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#8A99AD]">
                                                {c.session_key || "—"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD]">
                                                {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedCartForView(c)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedCartForEdit(c)}
                                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                        title="Edit cart"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCartToDelete(c)}
                                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                        title="Delete cart"
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
                    {filteredCarts.map((c: any) => (
                        <div
                            key={c.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs text-[#8A99AD] font-mono mb-2">
                                    <span>Cart #{c.id}</span>
                                </div>
                                <h4 className="font-semibold text-white text-sm line-clamp-1">
                                    {c.user_email || "Guest User"}
                                </h4>
                                <p className="text-xs text-[#8A99AD] font-mono mt-1 line-clamp-1">
                                    Key: {c.session_key || "N/A"}
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                                <span className="text-[11px] text-[#8A99AD]">
                                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}
                                </span>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCartForView(c)}
                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCartForEdit(c)}
                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCartToDelete(c)}
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

            <AddCartModal />
            <EditCartModal />
            <ViewCartModal />

            <ConfirmDeleteModal
                isOpen={cartToDelete !== null}
                onClose={() => setCartToDelete(null)}
                onConfirm={() => {
                    if (cartToDelete) {
                        deleteCart(cartToDelete.id);
                    }
                }}
                title="Delete Cart"
                itemName={`Cart #${cartToDelete?.id || ""}`}
                itemType="Cart"
            />
        </div>
    );
}