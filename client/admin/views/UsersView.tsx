"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid, CheckCircle2, XCircle } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import ViewUserModal from "../components/ViewUserModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function UsersView() {
    const {
        users,
        deleteUser,
        setIsAddUserModalOpen,
        setSelectedUserForView,
        setSelectedUserForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [userToDelete, setUserToDelete] = useState<any | null>(null);

    const filteredUsers = users.filter((u: any) => {
        const matchesRole =
            roleFilter === "All" ||
            (roleFilter === "seller" && u.is_seller) ||
            (roleFilter === "verified" && u.is_verified);

        const matchesSearch =
            u.username?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.phone_number?.toLowerCase().includes(search.toLowerCase());

        return matchesRole && matchesSearch;
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Users Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by username, email or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3 py-2 text-xs font-medium text-[#DEE4EE] focus:outline-none"
                        >
                            <option value="All">All Users</option>
                            <option value="seller">Sellers Only</option>
                            <option value="verified">Verified Only</option>
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
                            onClick={() => setIsAddUserModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add User</span>
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
                                    <th className="py-4 px-4 sm:px-6">User</th>
                                    <th className="py-4 px-4 sm:px-6">Phone</th>
                                    <th className="py-4 px-4 sm:px-6">Verified</th>
                                    <th className="py-4 px-4 sm:px-6">Seller</th>
                                    <th className="py-4 px-4 sm:px-6">DOB</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u: any) => (
                                        <tr key={u.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                            <td className="py-4 px-4 sm:px-6">
                                                <div>
                                                    <p className="font-semibold text-white truncate text-xs sm:text-sm">
                                                        {u.username}
                                                    </p>
                                                    <p className="text-[11px] text-[#8A99AD]">{u.email}</p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#8A99AD]">
                                                {u.phone_number || "—"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6">
                                                {u.is_verified ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 className="h-3 w-3" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400 border border-rose-500/20">
                                                        <XCircle className="h-3 w-3" /> Unverified
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-white">
                                                {u.is_seller ? (
                                                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                                                        Seller
                                                    </span>
                                                ) : (
                                                    <span className="text-[#8A99AD]">Buyer</span>
                                                )}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD]">
                                                {u.date_of_birth || "—"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedUserForView(u)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedUserForEdit(u)}
                                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                        title="Edit user"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setUserToDelete(u)}
                                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                        title="Delete user"
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
                    {filteredUsers.map((u: any) => (
                        <div
                            key={u.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs text-[#8A99AD] font-mono mb-2">
                                    <span>#{u.id}</span>
                                    {u.is_seller && (
                                        <span className="uppercase text-[10px] font-bold text-amber-400">Seller</span>
                                    )}
                                </div>
                                <h4 className="font-semibold text-white text-sm line-clamp-1">{u.username}</h4>
                                <p className="text-xs text-[#8A99AD] mt-1 truncate">{u.email}</p>
                                <p className="text-xs text-[#8A99AD] mt-1">{u.phone_number || "No phone"}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                                <div>
                                    <span
                                        className={`text-[10px] font-semibold uppercase ${u.is_verified ? "text-emerald-400" : "text-rose-400"
                                            }`}
                                    >
                                        {u.is_verified ? "Verified" : "Unverified"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUserForView(u)}
                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUserForEdit(u)}
                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUserToDelete(u)}
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

            <AddUserModal />
            <EditUserModal />
            <ViewUserModal />

            <ConfirmDeleteModal
                isOpen={userToDelete !== null}
                onClose={() => setUserToDelete(null)}
                onConfirm={() => {
                    if (userToDelete) {
                        deleteUser(userToDelete.id);
                    }
                }}
                title="Delete User"
                itemName={userToDelete?.username || userToDelete?.email || ""}
                itemType="User"
            />
        </div>
    );
}