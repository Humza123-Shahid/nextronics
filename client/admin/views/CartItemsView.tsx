"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddCartItemModal from "../components/AddCartItemModal";
import EditCartItemModal from "../components/EditCartItemModal";
import ViewCartItemModal from "../components/ViewCartItemModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function CartItemsView() {
    const {
        cartItems,
        deleteCartItem,
        setIsAddCartItemModalOpen,
        setSelectedCartItemForView,
        setSelectedCartItemForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [itemToDelete, setItemToDelete] = useState<any | null>(null);

    const filteredItems = cartItems.filter((item: any) => {
        const searchLower = search.toLowerCase();
        const cartLabel = item.cart_display_label?.toLowerCase() || "";
        const variantLabel = item.product_variant_label?.toLowerCase() || "";
        const itemId = String(item.id);

        return (
            cartLabel.includes(searchLower) ||
            variantLabel.includes(searchLower) ||
            itemId.includes(searchLower)
        );
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Cart Items Management" />

            {/* Modals */}
            <AddCartItemModal />
            <EditCartItemModal />
            <ViewCartItemModal />
            {itemToDelete && (
                // <ConfirmDeleteModal
                //   title="Delete Cart Item"
                //   message={`Are you sure you want to delete Cart Item #${itemToDelete.id}?`}
                //   onConfirm={async () => {
                //     await deleteCartItem(itemToDelete.id);
                //     setItemToDelete(null);
                //   }}
                //   onCancel={() => setItemToDelete(null)}
                // />
                <ConfirmDeleteModal
                    isOpen={itemToDelete !== null}
                    onClose={() => setItemToDelete(null)}
                    onConfirm={() => {
                        if (itemToDelete) {
                            deleteCartItem(itemToDelete.id);
                        }
                    }}
                    title="Delete Cart Item"
                    itemName={`Cart Item #${itemToDelete?.id || ""}`}
                    itemType="Cart Item"
                />
            )}

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by Cart Session/Email, Product SKU or Item ID..."
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
                            onClick={() => setIsAddCartItemModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Cart Item</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table View */}
            {viewMode === "table" ? (
                <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2E3A47] bg-[#1C2434]/50 text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD]">
                                    <th className="py-4 px-4 sm:px-6">ID</th>
                                    <th className="py-4 px-4 sm:px-6">Cart</th>
                                    <th className="py-4 px-4 sm:px-6">Product Variant</th>
                                    <th className="py-4 px-4 sm:px-6">Quantity</th>
                                    <th className="py-4 px-4 sm:px-6">Added At</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47] text-xs font-medium text-white">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-[#8A99AD]">
                                            No cart items found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-[#1C2434]/30 transition-colors">
                                            <td className="py-4 px-4 sm:px-6 font-mono text-[#8A99AD]">#{item.id}</td>
                                            <td className="py-4 px-4 sm:px-6 max-w-xs truncate">
                                                {item.cart_display_label || `Cart #${item.cart}`}
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 text-blue-400 font-medium max-w-xs truncate">
                                                {item.product_variant_label || `Variant #${item.product_variant}`}
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 font-bold">{item.quantity}</td>
                                            <td className="py-4 px-4 sm:px-6 text-[#8A99AD]">
                                                {item.added_at ? new Date(item.added_at).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedCartItemForView(item)}
                                                        className="p-1.5 rounded-lg text-[#8A99AD] hover:bg-[#1C2434] hover:text-white transition-colors"
                                                        title="View Item"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedCartItemForEdit(item)}
                                                        className="p-1.5 rounded-lg text-[#8A99AD] hover:bg-[#1C2434] hover:text-amber-400 transition-colors"
                                                        title="Edit Item"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemToDelete(item)}
                                                        className="p-1.5 rounded-lg text-[#8A99AD] hover:bg-[#1C2434] hover:text-rose-400 transition-colors"
                                                        title="Delete Item"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item: any) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 shadow-md flex flex-col justify-between space-y-4"
                        >
                            <div>
                                <div className="flex items-center justify-between border-b border-[#2E3A47] pb-3 mb-3">
                                    <span className="font-mono text-xs text-[#8A99AD]">Item #{item.id}</span>
                                    <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-400">
                                        Qty: {item.quantity}
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-[#8A99AD] block text-[10px] uppercase font-medium">
                                            Product Variant
                                        </span>
                                        <p className="text-white font-medium truncate">
                                            {item.product_variant_label || `Variant #${item.product_variant}`}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-[#8A99AD] block text-[10px] uppercase font-medium">
                                            Cart Owner
                                        </span>
                                        <p className="text-slate-300 truncate">
                                            {item.cart_display_label || `Cart #${item.cart}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2E3A47]">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCartItemForView(item)}
                                    className="p-1.5 rounded-lg text-[#8A99AD] hover:bg-[#1C2434] hover:text-white transition-colors"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCartItemForEdit(item)}
                                    className="p-1.5 rounded-lg text-[#8A99AD] hover:bg-[#1C2434] hover:text-amber-400 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setItemToDelete(item)}
                                    className="p-1.5 rounded-lg text-[#8A99AD] hover:bg-[#1C2434] hover:text-rose-400 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}