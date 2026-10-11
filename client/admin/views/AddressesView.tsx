"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddAddressModal from "../components/AddAddressModal";
import EditAddressModal from "../components/EditAddressModal";
import ViewAddressModal from "../components/ViewAddressModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function AddressesView() {
    const {
        addresses,
        users,
        deleteAddress,
        setIsAddAddressModalOpen,
        setSelectedAddressForView,
        setSelectedAddressForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [addressToDelete, setAddressToDelete] = useState<any | null>(null);

    const filteredAddresses = addresses.filter((a: any) => {
        const userId = a.user_id ?? (typeof a.user === "object" ? a.user?.id : a.user);
        const matchedUser = users.find((u) => String(u.id) === String(userId));
        const userEmail = matchedUser?.email || a.user_email || "";

        const matchesType = selectedType === "All" || a.address_type === selectedType;
        const matchesSearch =
            a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            a.city?.toLowerCase().includes(search.toLowerCase()) ||
            a.phone_number?.toLowerCase().includes(search.toLowerCase()) ||
            userEmail.toLowerCase().includes(search.toLowerCase());

        return matchesType && matchesSearch;
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Addresses Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by name, email, city or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Address Type Choice Select */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3 py-2 text-xs font-medium text-[#DEE4EE] focus:outline-none"
                        >
                            <option value="All">All Types</option>
                            <option value="shipping">Shipping</option>
                            <option value="billing">Billing</option>
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
                            onClick={() => setIsAddAddressModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Address</span>
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
                                    <th className="py-4 px-4 sm:px-6">Full Name</th>
                                    <th className="py-4 px-4 sm:px-6">User Email</th>
                                    <th className="py-4 px-4 sm:px-6">Type</th>
                                    <th className="py-4 px-4 sm:px-6">City / Country</th>
                                    <th className="py-4 px-4 sm:px-6">Phone</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredAddresses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No addresses found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAddresses.map((a: any) => {
                                        const userId = a.user_id ?? (typeof a.user === "object" ? a.user?.id : a.user);
                                        const matchedUser = users.find((u) => String(u.id) === String(userId));
                                        const userEmail = matchedUser?.email || a.user_email || "N/A";

                                        const badgeTypeStyle =
                                            a.address_type === "shipping"
                                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                : "bg-purple-500/10 text-purple-400 border-purple-500/20";

                                        return (
                                            <tr key={a.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                                <td className="py-4 px-4 sm:px-6">
                                                    <div>
                                                        <p className="font-semibold text-white truncate text-xs sm:text-sm">
                                                            {a.full_name}
                                                        </p>
                                                        {a.is_default && (
                                                            <span className="text-[10px] font-bold text-amber-400">Default Address</span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD] font-medium">
                                                    {userEmail}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase ${badgeTypeStyle}`}
                                                    >
                                                        {a.address_type}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-xs text-white">
                                                    {a.city}, {a.country}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD]">
                                                    {a.phone_number}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedAddressForView(a)}
                                                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                            title="View details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedAddressForEdit(a)}
                                                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                            title="Edit address"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setAddressToDelete(a)}
                                                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                            title="Delete address"
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
                    {filteredAddresses.map((a: any) => {
                        const userId = a.user_id ?? (typeof a.user === "object" ? a.user?.id : a.user);
                        const matchedUser = users.find((u) => String(u.id) === String(userId));
                        const userEmail = matchedUser?.email || a.user_email || "N/A";

                        return (
                            <div
                                key={a.id}
                                className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-xs text-[#8A99AD] mb-2">
                                        <span className="uppercase text-[10px] font-bold text-blue-400">{a.address_type}</span>
                                        {a.is_default && <span className="text-[10px] text-amber-400 font-bold">Default</span>}
                                    </div>
                                    <h4 className="font-semibold text-white text-sm truncate">{a.full_name}</h4>
                                    <p className="text-xs text-[#8A99AD] mt-1 truncate">{userEmail}</p>
                                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                                        {a.address_line1}, {a.city}, {a.state}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                                    <span className="text-xs text-[#8A99AD]">{a.phone_number}</span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedAddressForView(a)}
                                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedAddressForEdit(a)}
                                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAddressToDelete(a)}
                                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AddAddressModal />
            <EditAddressModal />
            <ViewAddressModal />

            <ConfirmDeleteModal
                isOpen={addressToDelete !== null}
                onClose={() => setAddressToDelete(null)}
                onConfirm={() => {
                    if (addressToDelete) {
                        deleteAddress(addressToDelete.id);
                    }
                }}
                title="Delete Address"
                itemName={addressToDelete?.full_name || ""}
                itemType="Address"
            />
        </div>
    );
}