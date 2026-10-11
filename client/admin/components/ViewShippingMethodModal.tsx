"use client";

import React from "react";
import { X, Truck, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewShippingMethodModal() {
    const { selectedShippingMethodForView, setSelectedShippingMethodForView } = useAdmin();

    if (!selectedShippingMethodForView) return null;

    const item = selectedShippingMethodForView;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Truck className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{item.name}</h3>
                            <p className="text-xs text-[#8A99AD]">Shipping Method Details</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedShippingMethodForView(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Details Grid */}
                <div className="mt-6 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4">
                            <div className="flex items-center gap-2 text-[#8A99AD] mb-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium">Shipping Cost</span>
                            </div>
                            <p className="text-lg font-bold text-white">${Number(item.cost).toFixed(2)}</p>
                        </div>

                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4">
                            <div className="flex items-center gap-2 text-[#8A99AD] mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">Estimated Delivery</span>
                            </div>
                            <p className="text-lg font-bold text-white">
                                {item.estimated_days_min} - {item.estimated_days_max} days
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 flex items-center justify-between">
                        <span className="font-medium text-[#8A99AD]">Status</span>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border uppercase ${item.is_active
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                }`}
                        >
                            {item.is_active ? (
                                <>
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Active
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-3.5 w-3.5" />
                                    Inactive
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex justify-end pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedShippingMethodForView(null)}
                        className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-5 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}