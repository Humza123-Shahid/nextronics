"use client";

import React from "react";
import { X, Edit, Bell } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewNotificationModal() {
    const {
        selectedNotificationForView,
        setSelectedNotificationForView,
        setSelectedNotificationForEdit,
        users,
    } = useAdmin();

    if (!selectedNotificationForView) return null;

    const notif = selectedNotificationForView as any;
    const userId = notif.user_id ?? (typeof notif.user === "object" ? notif.user?.id : notif.user);
    const matchedUser = users.find((u) => String(u.id) === String(userId));
    const userEmail = matchedUser?.email || notif.user_email || (typeof notif.user === "object" ? notif.user?.email : "N/A");

    const typeBadge =
        notif.notification_type === "order"
            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
            : notif.notification_type === "promo"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-slate-500/10 text-slate-300 border-slate-500/20";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Bell className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words max-w-full">
                                    {notif.title}
                                </h3>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border uppercase ${typeBadge}`}>
                                    {notif.notification_type}
                                </span>
                            </div>
                            <p className="text-xs text-[#8A99AD] font-mono">
                                ID: #{notif.id}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedNotificationForView(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Details Content */}
                <div className="mt-5 space-y-4 text-xs">
                    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3 border-b border-[#2E3A47]/60 pb-3">
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Recipient Email</span>
                                <span className="text-white font-medium break-all block">{userEmail}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">User ID</span>
                                <span className="text-white font-mono block">{userId || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Read Status</span>
                                <span className={notif.is_read ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                                    {notif.is_read ? "Read" : "Unread"}
                                </span>
                            </div>
                            <div>
                                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Created At</span>
                                <span className="text-white block font-mono text-[11px]">
                                    {notif.created_at ? new Date(notif.created_at).toLocaleString() : "N/A"}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="text-[#8A99AD] font-semibold uppercase block mb-1 text-[10px] tracking-wider">
                                Message Body
                            </span>
                            <p className="text-[#DEE4EE] leading-relaxed whitespace-pre-wrap break-words rounded-lg border border-[#2E3A47] bg-[#1C2434] p-3 font-sans">
                                {notif.message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
                    <button
                        type="button"
                        onClick={() => setSelectedNotificationForView(null)}
                        className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const current = selectedNotificationForView;
                            setSelectedNotificationForView(null);
                            setSelectedNotificationForEdit(current);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Notification</span>
                    </button>
                </div>
            </div>
        </div>
    );
}