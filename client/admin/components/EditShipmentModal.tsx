"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const formatISOToDatetimeLocal = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
        const d = new Date(isoString);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    } catch {
        return "";
    }
};

export default function EditShipmentModal() {
    const {
        selectedShipmentForEdit,
        setSelectedShipmentForEdit,
        orders,
        shippingMethods,
        updateShipment,
    } = useAdmin();

    const [formData, setFormData] = useState<any>({
        order: "",
        shipping_method: "",
        carrier: "",
        tracking_number: "",
        status: "pending",
        shipped_at: "",
        delivered_at: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedShipmentForEdit) {
            const shp = selectedShipmentForEdit as any;

            const orderId =
                shp.order_id ??
                (typeof shp.order === "object" ? shp.order?.id : shp.order) ??
                "";

            const methodId =
                shp.shipping_method_id ??
                (typeof shp.shipping_method === "object" ? shp.shipping_method?.id : shp.shipping_method) ??
                "";

            setFormData({
                ...shp,
                order: orderId,
                shipping_method: methodId,
                carrier: shp.carrier || "",
                tracking_number: shp.tracking_number || "",
                status: shp.status || "pending",
                shipped_at: formatISOToDatetimeLocal(shp.shipped_at),
                delivered_at: formatISOToDatetimeLocal(shp.delivered_at),
            });
        }
    }, [selectedShipmentForEdit]);

    if (!selectedShipmentForEdit) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
                order: Number(formData.order),
                shipping_method: formData.shipping_method ? Number(formData.shipping_method) : null,
                carrier: formData.carrier.trim(),
                tracking_number: formData.tracking_number.trim(),
                shipped_at: formData.shipped_at ? new Date(formData.shipped_at).toISOString() : null,
                delivered_at: formData.delivered_at ? new Date(formData.delivered_at).toISOString() : null,
            };

            if (updateShipment) {
                await updateShipment(selectedShipmentForEdit.id, payload);
            }
            setSelectedShipmentForEdit(null);
        } catch (err) {
            console.error("Failed to update shipment:", err);
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
                            <h3 className="text-lg font-bold text-white">Edit Shipment</h3>
                            <p className="text-xs text-[#8A99AD]">ID: #{selectedShipmentForEdit.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedShipmentForEdit(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
                    {/* Row 1: Order & Shipping Method */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                {orders.map((ord) => (
                                    <option key={ord.id} value={ord.id}>
                                        {ord.order_number} ({ord.user_email || "Guest"})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Shipping Method</label>
                            <select
                                name="shipping_method"
                                value={formData.shipping_method || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select Shipping Method</option>
                                {shippingMethods.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Carrier & Tracking Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Carrier</label>
                            <input
                                type="text"
                                name="carrier"
                                value={formData.carrier || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Tracking Number</label>
                            <input
                                type="text"
                                name="tracking_number"
                                value={formData.tracking_number || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Row 3: Status */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Status</label>
                        <select
                            name="status"
                            value={formData.status || "pending"}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>

                    {/* Row 4: Shipped At & Delivered At */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Shipped At</label>
                            <input
                                type="datetime-local"
                                name="shipped_at"
                                value={formData.shipped_at || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[#8A99AD] font-medium">Delivered At</label>
                            <input
                                type="datetime-local"
                                name="delivered_at"
                                value={formData.delivered_at || ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Submit & Cancel Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setSelectedShipmentForEdit(null)}
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