"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddInventoryModal from "../components/AddInventoryModal";
import EditInventoryModal from "../components/EditInventoryModal";
import ViewInventoryModal from "../components/ViewInventoryModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function InventoriesView() {
    const {
        inventories,
        deleteInventory,
        setIsAddInventoryModalOpen,
        setSelectedInventoryForView,
        setSelectedInventoryForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [inventoryToDelete, setInventoryToDelete] = useState<any | null>(null);

    const filteredInventories = inventories.filter((inv: any) => {
        const variantLabel = inv.product_variant_label || inv.product_variant_sku || "";
        const warehouseName = inv.warehouse_name || "";
        const query = search.toLowerCase();

        return (
            variantLabel.toLowerCase().includes(query) ||
            warehouseName.toLowerCase().includes(query)
        );
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Inventory Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by SKU or Warehouse..."
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
                            onClick={() => setIsAddInventoryModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Inventory</span>
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
                                    <th className="py-4 px-4 sm:px-6">Product / Variant SKU</th>
                                    <th className="py-4 px-4 sm:px-6">Warehouse</th>
                                    <th className="py-4 px-4 sm:px-6">Quantity</th>
                                    <th className="py-4 px-4 sm:px-6">Reserved</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredInventories.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No inventory records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventories.map((inv: any) => (
                                        <tr key={inv.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                            <td className="py-4 px-4 sm:px-6 text-xs text-white">
                                                <div className="font-semibold">{inv.product_name || "Variant Item"}</div>
                                                <div className="text-[11px] font-mono text-[#8A99AD]">
                                                    SKU: {inv.product_variant_sku || inv.product_variant}
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-[#DEE4EE]">
                                                {inv.warehouse_name || `Warehouse #${inv.warehouse}`}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 font-bold text-white">
                                                {inv.quantity} <span className="text-xs font-normal text-[#8A99AD]">units</span>
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-amber-400 font-semibold">
                                                {inv.reserved_quantity} units
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedInventoryForView(inv)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedInventoryForEdit(inv)}
                                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                        title="Edit inventory"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setInventoryToDelete(inv)}
                                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                        title="Delete inventory"
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
                    {filteredInventories.map((inv: any) => (
                        <div
                            key={inv.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                            <div>
                                <div>
                                    <h4 className="font-semibold text-white text-sm line-clamp-1">
                                        {inv.product_name || `Variant #${inv.product_variant}`}
                                    </h4>
                                    <div className="text-xs text-[#8A99AD] font-mono mt-0.5">
                                        SKU: <span className="text-blue-400">{inv.product_variant_sku}</span>
                                    </div>
                                </div>
                                <h4 className="font-semibold text-white text-sm line-clamp-1">
                                    {inv.warehouse_name}
                                </h4>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                                <div>
                                    <span className="text-base font-bold text-white">{inv.quantity} in stock</span>
                                    <span className="block text-[10px] text-amber-400">{inv.reserved_quantity} reserved</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedInventoryForView(inv)}
                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedInventoryForEdit(inv)}
                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setInventoryToDelete(inv)}
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

            <AddInventoryModal />
            <EditInventoryModal />
            <ViewInventoryModal />

            <ConfirmDeleteModal
                isOpen={inventoryToDelete !== null}
                onClose={() => setInventoryToDelete(null)}
                onConfirm={() => {
                    if (inventoryToDelete) {
                        deleteInventory(inventoryToDelete.id);
                    }
                }}
                title="Delete Inventory Record"
                itemName={`SKU: ${inventoryToDelete?.product_variant_sku || inventoryToDelete?.id}`}
                itemType="Inventory"
            />
        </div>
    );
}