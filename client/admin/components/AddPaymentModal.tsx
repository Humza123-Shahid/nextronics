"use client";

import React, { useState } from "react";
import { X, Plus, CreditCard } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AddPaymentModal() {
    const { isAddPaymentModalOpen, setIsAddPaymentModalOpen, orders, addPayment } = useAdmin();

    const [formData, setFormData] = useState({
        order: "",
        payment_method: "",
        transaction_id: "",
        amount: "",
        status: "pending",
        gateway_response: "",
        paid_at: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isAddPaymentModalOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            let parsedGatewayResponse = null;
            if (formData.gateway_response.trim()) {
                try {
                    parsedGatewayResponse = JSON.parse(formData.gateway_response);
                } catch {
                    parsedGatewayResponse = formData.gateway_response;
                }
            }

            const payload: any = {
                order: Number(formData.order),
                payment_method: formData.payment_method,
                transaction_id: formData.transaction_id || null,
                amount: Number(formData.amount),
                status: formData.status,
                gateway_response: parsedGatewayResponse,
                paid_at: formData.paid_at ? new Date(formData.paid_at).toISOString() : null,
            };

            if (addPayment) {
                await addPayment(payload);
            }

            setIsAddPaymentModalOpen(false);
        } catch (err: any) {
            console.error("Add Payment Error:", err);
            setErrorMsg(err.message || "Failed to create payment record.");
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Add New Payment</h3>
                            <p className="text-xs text-[#8A99AD]">Record a transaction for an existing order</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddPaymentModalOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {errorMsg && (
                    <div className="mt-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-mono break-words">
                        {errorMsg}
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                    {/* Order Foreign Key */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Order *</label>
                        <select
                            name="order"
                            value={formData.order}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select Order</option>
                            {orders.map((ord: any) => (
                                <option key={ord.id} value={ord.id}>
                                    {ord.order_number || `Order #${ord.id}`} ({ord.user_email || "Guest"})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Method & Transaction ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Payment Method *</label>
                            <input
                                type="text"
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleInputChange}
                                placeholder="e.g. Credit Card, PayPal, Stripe"
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Transaction ID</label>
                            <input
                                type="text"
                                name="transaction_id"
                                value={formData.transaction_id}
                                onChange={handleInputChange}
                                placeholder="Unique gateway transaction ID"
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
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </div>

                    {/* Paid At DateTime */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Paid At</label>
                        <input
                            type="datetime-local"
                            name="paid_at"
                            value={formData.paid_at}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Gateway Response (JSON) */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Gateway Response (JSON Format)</label>
                        <textarea
                            name="gateway_response"
                            rows={3}
                            value={formData.gateway_response}
                            onChange={handleInputChange}
                            placeholder='{"status": "captured", "auth_code": "123456"}'
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white font-mono text-[11px] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setIsAddPaymentModalOpen(false)}
                            className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            <span>{isSubmitting ? "Creating..." : "Create Payment"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}