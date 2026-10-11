"use client";

import React from "react";
import { X, Edit, CreditCard } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewPaymentModal() {
    const {
        selectedPaymentForView,
        setSelectedPaymentForView,
        setSelectedPaymentForEdit,
        orders,
    } = useAdmin();

    if (!selectedPaymentForView) return null;

    const payment = selectedPaymentForView as any;

    const orderId =
        payment.order_id ??
        (typeof payment.order === "object" ? payment.order?.id : payment.order);

    const matchedOrder = orders.find((o) => String(o.id) === String(orderId));
    const orderNumberDisplay = matchedOrder?.order_number || payment.order_number_display || `Order #${orderId}`;
    const userEmailDisplay = matchedOrder?.user_email || payment.user_email_display || "Guest / N/A";

    const statusBadge =
        payment.status === "success"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : payment.status === "pending"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : payment.status === "refunded"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20";

    const formatGatewayResponse = (resp: any) => {
        if (!resp) return null;
        if (typeof resp === "string") return resp;
        if (typeof resp === "object" && Object.keys(resp).length > 0) {
            return JSON.stringify(resp, null, 2);
        }
        return null;
    };

    const formattedGatewayResponse = formatGatewayResponse(payment.gateway_response);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <CreditCard className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words max-w-full">
                                    Payment #{payment.id}
                                </h3>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border uppercase ${statusBadge}`}
                                >
                                    {payment.status}
                                </span>
                            </div>

                            <p className="text-xs text-[#8A99AD] font-mono truncate max-w-full">
                                Method: {payment.payment_method} <span className="opacity-40">|</span> Tx ID: {payment.transaction_id || "N/A"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedPaymentForView(null)}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-5">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Amount Paid</span>
                            <span className="text-base sm:text-xl font-bold text-white mt-0.5 block truncate">
                                ${Number(payment.amount).toFixed(2)}
                            </span>
                        </div>

                        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
                            <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Associated Order</span>
                            <span className="text-sm font-semibold text-white mt-0.5 block truncate">
                                {orderNumberDisplay}
                            </span>
                            <span className="text-xs text-[#8A99AD] block truncate">{userEmailDisplay}</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3.5 sm:p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3 border-b border-[#2E3A47]/60 pb-3">
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Paid At</span>
                                <span className="text-white font-medium block">
                                    {payment.paid_at ? new Date(payment.paid_at).toLocaleString() : "N/A"}
                                </span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Created At</span>
                                <span className="text-white font-medium block">
                                    {payment.created_at ? new Date(payment.created_at).toLocaleString() : "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Gateway Response Display */}
                        {formattedGatewayResponse && (
                            <div className="pt-1">
                                <span className="text-[#8A99AD] font-semibold uppercase block mb-0.5 text-[10px] tracking-wider">
                                    Gateway Response
                                </span>
                                <pre className="rounded-lg border border-[#2E3A47] bg-[#1C2434] p-2.5 text-[#DEE4EE] font-mono text-[11px] overflow-x-auto">
                                    {formattedGatewayResponse}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const pay = selectedPaymentForView;
                            setSelectedPaymentForView(null);
                            setSelectedPaymentForEdit(pay);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Payment</span>
                    </button>
                </div>
            </div>
        </div>
    );
}