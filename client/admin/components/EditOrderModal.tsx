"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function EditOrderModal() {
    const { selectedOrderForEdit, setSelectedOrderForEdit, updateOrder, users, addresses } = useAdmin();

    const [formData, setFormData] = useState<any>({
        user: "",
        status: "pending",
        payment_status: "unpaid",
        shipping_address: "",
        billing_address: "",
        subtotal: "0.00",
        discount_total: "0.00",
        shipping_total: "0.00",
        tax_total: "0.00",
        currency: "USD",
        notes: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedOrderForEdit) {
            const ord = selectedOrderForEdit as any;

            const userId = ord.user_id ?? (typeof ord.user === "object" ? ord.user?.id : ord.user) ?? "";
            const shipId = ord.shipping_address_id ?? (typeof ord.shipping_address === "object" ? ord.shipping_address?.id : ord.shipping_address) ?? "";
            const billId = ord.billing_address_id ?? (typeof ord.billing_address === "object" ? ord.billing_address?.id : ord.billing_address) ?? "";

            setFormData({
                ...ord,
                user: userId,
                shipping_address: shipId,
                billing_address: billId,
                subtotal: ord.subtotal ?? "0.00",
                discount_total: ord.discount_total ?? "0.00",
                shipping_total: ord.shipping_total ?? "0.00",
                tax_total: ord.tax_total ?? "0.00",
                currency: ord.currency ?? "USD",
                notes: ord.notes ?? "",
            });
        }
    }, [selectedOrderForEdit]);

    const grandTotal = useMemo(() => {
        const sub = parseFloat(formData.subtotal) || 0;
        const disc = parseFloat(formData.discount_total) || 0;
        const ship = parseFloat(formData.shipping_total) || 0;
        const tax = parseFloat(formData.tax_total) || 0;
        return Math.max(0, sub - disc + ship + tax).toFixed(2);
    }, [formData.subtotal, formData.discount_total, formData.shipping_total, formData.tax_total]);

    if (!selectedOrderForEdit) return null;

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
            const payload = {
                ...formData,
                user: formData.user ? Number(formData.user) : null,
                shipping_address: formData.shipping_address ? Number(formData.shipping_address) : null,
                billing_address: formData.billing_address ? Number(formData.billing_address) : null,
                subtotal: Number(formData.subtotal),
                discount_total: Number(formData.discount_total),
                shipping_total: Number(formData.shipping_total),
                tax_total: Number(formData.tax_total),
                grand_total: Number(grandTotal),
            };

            if (updateOrder) {
                await updateOrder(selectedOrderForEdit.id, payload);
            }
            setSelectedOrderForEdit(null);
        } catch (err) {
            console.error("Failed to update order:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const shippingAddresses = addresses.filter((a) => !a.address_type || a.address_type === "shipping");
    const billingAddresses = addresses.filter((a) => !a.address_type || a.address_type === "billing");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Edit Order</h3>
                            <p className="text-xs text-[#8A99AD]">Order Number: {selectedOrderForEdit.order_number || selectedOrderForEdit.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedOrderForEdit(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Customer Email</label>
                        <select
                            name="user"
                            value={formData.user || ""}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select User Email</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.email} {u.is_seller ? "(Seller)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Status</label>
                            <select
                                name="status"
                                value={formData.status || "pending"}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Payment Status</label>
                            <select
                                name="payment_status"
                                value={formData.payment_status || "unpaid"}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Currency</label>
                            <input
                                type="text"
                                name="currency"
                                value={formData.currency || "USD"}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Shipping Address</label>
                            <select
                                name="shipping_address"
                                value={formData.shipping_address || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select Shipping Address</option>
                                {shippingAddresses.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.full_name ? `${a.full_name}: ` : ""}{a.address_line1}{a.address_line2 ? `, ${a.address_line2}` : ""} ({a.city})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Billing Address</label>
                            <select
                                name="billing_address"
                                value={formData.billing_address || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select Billing Address</option>
                                {billingAddresses.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.full_name ? `${a.full_name}: ` : ""}{a.address_line1}{a.address_line2 ? `, ${a.address_line2}` : ""} ({a.city})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Subtotal</label>
                            <input
                                type="number"
                                step="0.01"
                                name="subtotal"
                                value={formData.subtotal || ""}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Discount</label>
                            <input
                                type="number"
                                step="0.01"
                                name="discount_total"
                                value={formData.discount_total || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Shipping</label>
                            <input
                                type="number"
                                step="0.01"
                                name="shipping_total"
                                value={formData.shipping_total || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Tax</label>
                            <input
                                type="number"
                                step="0.01"
                                name="tax_total"
                                value={formData.tax_total || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3 flex justify-between items-center">
                        <span className="text-xs text-[#8A99AD] font-medium">Calculated Grand Total:</span>
                        <span className="text-base font-bold text-emerald-400">${grandTotal} {formData.currency}</span>
                    </div>

                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Notes</label>
                        <textarea
                            name="notes"
                            rows={3}
                            value={formData.notes || ""}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setSelectedOrderForEdit(null)}
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