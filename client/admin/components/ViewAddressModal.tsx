"use client";

import React from "react";
import { X, Edit, MapPin } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewAddressModal() {
    const {
        selectedAddressForView,
        setSelectedAddressForView,
        setSelectedAddressForEdit,
        users,
    } = useAdmin();

    if (!selectedAddressForView) return null;

    const addr = selectedAddressForView as any;

    const userId = addr.user_id ?? (typeof addr.user === "object" ? addr.user?.id : addr.user);
    const matchedUser = users.find((u) => String(u.id) === String(userId));
    const resolvedEmail = matchedUser?.email || (typeof addr.user === "object" ? addr.user?.email : "N/A");

    const badgeTypeStyle =
        addr.address_type === "shipping"
            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
            : "bg-purple-500/10 text-purple-400 border-purple-500/20";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <MapPin className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-bold tracking-tight text-white break-words">
                                    {addr.full_name}
                                </h3>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border uppercase ${badgeTypeStyle}`}
                                >
                                    {addr.address_type}
                                </span>
                                {addr.is_default && (
                                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                                        Default
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[#8A99AD] truncate">
                                User: <span className="text-white font-medium">{resolvedEmail}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedAddressForView(null)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-4 text-xs">
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3">
                        <div>
                            <span className="text-[#8A99AD] text-[11px] block">Phone Number</span>
                            <span className="text-white font-medium">{addr.phone_number}</span>
                        </div>

                        <div>
                            <span className="text-[#8A99AD] text-[11px] block">Address Line 1</span>
                            <span className="text-white font-medium">{addr.address_line1}</span>
                        </div>

                        {addr.address_line2 && (
                            <div>
                                <span className="text-[#8A99AD] text-[11px] block">Address Line 2</span>
                                <span className="text-white font-medium">{addr.address_line2}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#2E3A47]/60">
                            <div>
                                <span className="text-[#8A99AD] text-[10px] uppercase block">City</span>
                                <span className="text-white font-medium">{addr.city}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] text-[10px] uppercase block">State</span>
                                <span className="text-white font-medium">{addr.state}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] text-[10px] uppercase block">Postal Code</span>
                                <span className="text-white font-medium">{addr.postal_code}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] text-[10px] uppercase block">Country</span>
                                <span className="text-white font-medium">{addr.country}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedAddressForView(null)}
                        className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const a = selectedAddressForView;
                            setSelectedAddressForView(null);
                            setSelectedAddressForEdit(a);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Address</span>
                    </button>
                </div>
            </div>
        </div>
    );
}