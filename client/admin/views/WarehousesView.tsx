"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid, Warehouse as WarehouseIcon } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddWarehouseModal from "../components/AddWarehouseModal";
import EditWarehouseModal from "../components/EditWarehouseModal";
import ViewWarehouseModal from "../components/ViewWarehouseModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function WarehousesView() {
    const {
        warehouses,
        deleteWarehouse,
        setIsAddWarehouseModalOpen,
        setSelectedWarehouseForView,
        setSelectedWarehouseForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [warehouseToDelete, setWarehouseToDelete] = useState<any | null>(null);

    const filteredWarehouses = (warehouses || []).filter((w: any) => {
        const query = search.toLowerCase();
        return (
            w.name?.toLowerCase().includes(query) ||
            w.address?.toLowerCase().includes(query) ||
            w.city?.toLowerCase().includes(query) ||
            w.country?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Warehouses Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by name, address, city, or country..."
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
                            onClick={() => setIsAddWarehouseModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Warehouse</span>
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
                                    <th className="py-4 px-4 sm:px-6">Warehouse Name</th>
                                    <th className="py-4 px-4 sm:px-6">Address</th>
                                    <th className="py-4 px-4 sm:px-6">City</th>
                                    <th className="py-4 px-4 sm:px-6">Country</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredWarehouses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No warehouses found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredWarehouses.map((w: any) => (
                                        <tr key={w.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                                                        <WarehouseIcon className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-semibold text-white truncate text-xs sm:text-sm">
                                                        {w.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD]">
                                                {w.address}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-white">
                                                {w.city}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-white font-medium">
                                                {w.country}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedWarehouseForView(w)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedWarehouseForEdit(w)}
                                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                        title="Edit warehouse"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setWarehouseToDelete(w)}
                                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                        title="Delete warehouse"
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
                    {filteredWarehouses.map((w: any) => (
                        <div
                            key={w.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                                        <WarehouseIcon className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-semibold text-white text-sm line-clamp-1">{w.name}</h4>
                                </div>
                                <p className="text-xs text-[#8A99AD] line-clamp-2 mb-1">{w.address}</p>
                                <p className="text-xs text-white font-medium">{w.city}, {w.country}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedWarehouseForView(w)}
                                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedWarehouseForEdit(w)}
                                    className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setWarehouseToDelete(w)}
                                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddWarehouseModal />
            <EditWarehouseModal />
            <ViewWarehouseModal />

            <ConfirmDeleteModal
                isOpen={warehouseToDelete !== null}
                onClose={() => setWarehouseToDelete(null)}
                onConfirm={() => {
                    if (warehouseToDelete) {
                        deleteWarehouse(warehouseToDelete.id);
                    }
                }}
                title="Delete Warehouse"
                itemName={warehouseToDelete?.name || ""}
                itemType="Warehouse"
            />
        </div>
    );
}