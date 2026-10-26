"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const formatGatewayResponseForInput = (resp: any): string => {
    if (!resp) return "";
    if (typeof resp === "string") return resp;
    if (typeof resp === "object") {
        try {
            return JSON.stringify(resp, null, 2);
        } catch {
            return "";
        }
    }
    return String(resp);
};

export default function EditPaymentModal() {
    const {
        selectedPaymentForEdit,
        setSelectedPaymentForEdit,
        orders,
        updatePayment,
        users
    } = useAdmin();

    const [formData, setFormData] = useState<any>({
        order: "",
        payment_method: "",
        transaction_id: "",
        amount: "",
        status: "pending",
        gateway_response: "",
        paid_at: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedPaymentForEdit) {
            const pay = selectedPaymentForEdit as any;

            const orderId =
                pay.order_id ??
                (typeof pay.order === "object" ? pay.order?.id : pay.order) ??
                "";

            let formattedPaidAt = "";
            if (pay.paid_at) {
                try {
                    formattedPaidAt = new Date(pay.paid_at).toISOString().slice(0, 16);
                } catch {
                    formattedPaidAt = pay.paid_at;
                }
            }

            setFormData({
                ...pay,
                order: orderId,
                payment_method: pay.payment_method || "",
                transaction_id: pay.transaction_id || "",
                amount: pay.amount ?? "",
                status: pay.status || "pending",
                gateway_response: formatGatewayResponseForInput(pay.gateway_response),
                paid_at: formattedPaidAt,
            });
        }
    }, [selectedPaymentForEdit]);

    if (!selectedPaymentForEdit) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let parsedGatewayResponse = formData.gateway_response;
            if (typeof formData.gateway_response === "string" && formData.gateway_response.trim()) {
                try {
                    parsedGatewayResponse = JSON.parse(formData.gateway_response);
                } catch {
                    parsedGatewayResponse = formData.gateway_response;
                }
            }

            const payload = {
                ...formData,
                order: Number(formData.order),
                payment_method: formData.payment_method,
                transaction_id: formData.transaction_id || null,
                amount: Number(formData.amount),
                status: formData.status,
                gateway_response: parsedGatewayResponse,
                paid_at: formData.paid_at ? new Date(formData.paid_at).toISOString() : null,
            };

            if (updatePayment) {
                await updatePayment(selectedPaymentForEdit.id, payload);
            }
            setSelectedPaymentForEdit(null);
        } catch (err) {
            console.error("Failed to update payment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Edit Payment</h3>
                            <p className="text-xs text-[#8A99AD]">ID: #{selectedPaymentForEdit.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentForEdit(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                    {/* Order Foreign Key */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Order *</label>
                        <select
                            name="order"
                            value={formData.order || ""}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Order</option>
                            {orders.map((ord: any) => {
                                const matchedUser = users.find((u) => String(u.id) === String(ord.user_id));
                                return (
                                    <option key={ord.id} value={ord.id}>
                                        {ord.order_number || `Order #${ord.id}`} ({matchedUser?.email || "Guest"})
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    {/* Payment Method & Transaction ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Payment Method *</label>
                            <input
                                type="text"
                                name="payment_method"
                                value={formData.payment_method || ""}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Transaction ID</label>
                            <input
                                type="text"
                                name="transaction_id"
                                value={formData.transaction_id || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Amount & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Amount ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="amount"
                                value={formData.amount || ""}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Status *</label>
                            <select
                                name="status"
                                value={formData.status || "pending"}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </div>

                    {/* Paid At */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Paid At</label>
                        <input
                            type="datetime-local"
                            name="paid_at"
                            value={formData.paid_at || ""}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Gateway Response */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Gateway Response (JSON Format)</label>
                        <textarea
                            name="gateway_response"
                            rows={3}
                            value={formData.gateway_response || ""}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white font-mono text-[11px] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Submit Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setSelectedPaymentForEdit(null)}
                            className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}