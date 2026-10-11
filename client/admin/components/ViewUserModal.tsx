"use client";

import React from "react";
import { X, Edit, User, CheckCircle2, XCircle } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewUserModal() {
    const {
        selectedUserForView,
        setSelectedUserForView,
        setSelectedUserForEdit,
    } = useAdmin();

    if (!selectedUserForView) return null;

    const user = selectedUserForView;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <User className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words max-w-full">
                                    {user.username}
                                </h3>
                                {user.is_seller && (
                                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                                        Seller
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-[#8A99AD] font-mono truncate max-w-full">
                                ID: #{user.id} <span className="opacity-40">|</span> Email: {user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedUserForView(null)}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-4 text-xs">
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3 border-b border-[#2E3A47]/60 pb-3">
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">First Name</span>
                                <span className="text-white font-medium block">{user.first_name || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Last Name</span>
                                <span className="text-white font-medium block">{user.last_name || "N/A"}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-b border-[#2E3A47]/60 pb-3">
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Phone Number</span>
                                <span className="text-white font-medium block">{user.phone_number || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Date of Birth</span>
                                <span className="text-white font-medium block">{user.date_of_birth || "N/A"}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-b border-[#2E3A47]/60 pb-3">
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Is Verified</span>
                                <span className="flex items-center gap-1 font-medium mt-0.5">
                                    {user.is_verified ? (
                                        <span className="text-emerald-400 inline-flex items-center gap-1">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                                        </span>
                                    ) : (
                                        <span className="text-rose-400 inline-flex items-center gap-1">
                                            <XCircle className="h-3.5 w-3.5" /> No
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Role</span>
                                <span className="text-white font-medium block">
                                    {user.is_seller ? "Seller / Buyer" : "Buyer"}
                                </span>
                            </div>
                        </div>

                        {/* <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Created At</span>
                                <span className="text-white font-medium block">
                                    {user.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}
                                </span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Updated At</span>
                                <span className="text-white font-medium block">
                                    {user.updated_at ? new Date(user.updated_at).toLocaleString() : "N/A"}
                                </span>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedUserForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const u = selectedUserForView;
                            setSelectedUserForView(null);
                            setSelectedUserForEdit(u);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit User</span>
                    </button>
                </div>
            </div>
        </div>
    );
}