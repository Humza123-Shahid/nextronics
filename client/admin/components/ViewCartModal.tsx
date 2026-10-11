"use client";

import React from "react";
import { X, ShoppingBag } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewCartModal() {
    const { selectedCartForView, setSelectedCartForView, users } = useAdmin();

    if (!selectedCartForView) return null;

    const cart = selectedCartForView as any;
    const userId = cart.user_id ?? (typeof cart.user === "object" ? cart.user?.id : cart.user);
    const matchedUser = users.find((u) => Number(u.id) === Number(userId));

    const resolvedUserEmail =
        matchedUser?.email ||
        (typeof cart.user === "object" ? cart.user?.email : null) ||
        cart.user_email ||
        "Guest User";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <ShoppingBag className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words">
                                Cart #{cart.id}
                            </h3>
                            <p className="text-xs text-[#8A99AD]">
                                User: <span className="text-white font-medium">{resolvedUserEmail}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedCartForView(null)}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content Details */}
                <div className="mt-5 space-y-4 text-xs">
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3">
                        <div>
                            <span className="text-[#8A99AD] block mb-0.5 text-[11px] uppercase font-semibold">
                                User Email
                            </span>
                            <span className="text-white font-medium">{resolvedUserEmail}</span>
                        </div>

                        <div>
                            <span className="text-[#8A99AD] block mb-0.5 text-[11px] uppercase font-semibold">
                                Session Key
                            </span>
                            <span className="text-white font-mono">{cart.session_key || "N/A"}</span>
                        </div>

                        <div>
                            <span className="text-[#8A99AD] block mb-0.5 text-[11px] uppercase font-semibold">
                                Created At
                            </span>
                            <span className="text-white font-medium">
                                {cart.created_at ? new Date(cart.created_at).toLocaleString() : "N/A"}
                            </span>
                        </div>

                        <div>
                            <span className="text-[#8A99AD] block mb-0.5 text-[11px] uppercase font-semibold">
                                Updated At
                            </span>
                            <span className="text-white font-medium">
                                {cart.updated_at ? new Date(cart.updated_at).toLocaleString() : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}