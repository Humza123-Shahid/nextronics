"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function EditNotificationModal() {
    const {
        selectedNotificationForEdit,
        setSelectedNotificationForEdit,
        users,
        updateNotification,
    } = useAdmin();

    const [formData, setFormData] = useState({
        user: "",
        notification_type: "system" as 'order' | 'promo' | 'system',
        title: "",
        message: "",
        is_read: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (selectedNotificationForEdit) {
            const notif = selectedNotificationForEdit as any;
            const userId = notif.user_id ?? (typeof notif.user === "object" ? notif.user?.id : notif.user) ?? "";

            setFormData({
                user: String(userId),
                notification_type: notif.notification_type || "system",
                title: notif.title || "",
                message: notif.message || "",
                is_read: !!notif.is_read,
            });
        }
    }, [selectedNotificationForEdit]);

    if (!selectedNotificationForEdit) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const payload = {
                user: Number(formData.user),
                notification_type: formData.notification_type,
                title: formData.title,
                message: formData.message,
                is_read: formData.is_read,
            };

            await updateNotification(selectedNotificationForEdit.id!, payload);
            setSelectedNotificationForEdit(null);
        } catch (err: any) {
            console.error("Failed to update notification:", err);
            setErrorMsg(err.message || "Failed to update notification.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Edit Notification</h3>
                            <p className="text-xs text-[#8A99AD]">ID: #{selectedNotificationForEdit.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedNotificationForEdit(null)}
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
                    {/* User FK Select */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">User Email *</label>
                        <select
                            name="user"
                            value={formData.user}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select User Email</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.email} ({u.first_name || u.username || `ID: ${u.id}`})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Type Choice */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Notification Type *</label>
                        <select
                            name="notification_type"
                            value={formData.notification_type}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none uppercase"
                        >
                            <option value="system">System</option>
                            <option value="order">Order</option>
                            <option value="promo">Promotion</option>
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="mb-1 block text-[#8A99AD] font-medium">Message *</label>
                        <textarea
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Is Read Checkbox */}
                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_read_edit"
                            name="is_read"
                            checked={formData.is_read}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
                        />
                        <label htmlFor="is_read_edit" className="text-white font-medium cursor-pointer">
                            Mark as Read
                        </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                        <button
                            type="button"
                            onClick={() => setSelectedNotificationForEdit(null)}
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