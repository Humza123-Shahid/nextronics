"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddNotificationModal from "../components/AddNotificationModal";
import EditNotificationModal from "../components/EditNotificationModal";
import ViewNotificationModal from "../components/ViewNotificationModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function NotificationsView() {
    const {
        notifications,
        deleteNotification,
        setIsAddNotificationModalOpen,
        setSelectedNotificationForView,
        setSelectedNotificationForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [notificationToDelete, setNotificationToDelete] = useState<any | null>(null);

    const filteredNotifications = notifications.filter((n: any) => {
        const matchesType = selectedType === "All" || n.notification_type === selectedType;
        const matchesSearch =
            n.title?.toLowerCase().includes(search.toLowerCase()) ||
            n.message?.toLowerCase().includes(search.toLowerCase()) ||
            n.user_email?.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Notifications Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by title, message, or user email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Type Choice Select */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3 py-2 text-xs font-medium text-[#DEE4EE] focus:outline-none uppercase"
                        >
                            <option value="All">All Types</option>
                            <option value="system">System</option>
                            <option value="order">Order</option>
                            <option value="promo">Promotion</option>
                        </select>

                        <div className="flex items-center rounded-lg border border-[#2E3A47] bg-[#1C2434] p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode("table")}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-[#333A48] text-white" : "text-[#8A99AD] hover:text-white"
                                    }`}
                                title="Table view"
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-[#333A48] text-white" : "text-[#8A99AD] hover:text-white"
                                    }`}
                                title="Grid view"
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsAddNotificationModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Notification</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table / Grid Content View */}
            {viewMode === "table" ? (
                <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2E3A47] bg-[#1C2434]/50 text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD]">
                                    <th className="py-4 px-4 sm:px-6">Title & Message</th>
                                    <th className="py-4 px-4 sm:px-6">User Email</th>
                                    <th className="py-4 px-4 sm:px-6">Type</th>
                                    <th className="py-4 px-4 sm:px-6">Status</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredNotifications.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No notifications found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredNotifications.map((n: any) => {
                                        const typeBadge =
                                            n.notification_type === "order"
                                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                : n.notification_type === "promo"
                                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                    : "bg-slate-500/10 text-slate-300 border-slate-500/20";

                                        return (
                                            <tr key={n.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                                <td className="py-4 px-4 sm:px-6">
                                                    <div className="max-w-xs sm:max-w-md">
                                                        <p className="font-semibold text-white truncate text-xs sm:text-sm">
                                                            {n.title}
                                                        </p>
                                                        <p className="text-[11px] text-[#8A99AD] line-clamp-1">{n.message}</p>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 font-mono text-xs text-white">
                                                    {n.user_email || "N/A"}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase ${typeBadge}`}>
                                                        {n.notification_type}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${n.is_read
                                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                            }`}
                                                    >
                                                        {n.is_read ? "Read" : "Unread"}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedNotificationForView(n)}
                                                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                            title="View notification"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedNotificationForEdit(n)}
                                                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                            title="Edit notification"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNotificationToDelete(n)}
                                                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                            title="Delete notification"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredNotifications.map((n: any) => (
                        <div
                            key={n.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs text-[#8A99AD] mb-2">
                                    <span className="uppercase text-[10px] font-bold text-blue-400">{n.notification_type}</span>
                                    <span className={`text-[10px] font-bold ${n.is_read ? "text-emerald-400" : "text-amber-400"}`}>
                                        {n.is_read ? "READ" : "UNREAD"}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-white text-sm line-clamp-1">{n.title}</h4>
                                <p className="text-xs text-[#8A99AD] mt-1 line-clamp-3">{n.message}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                                <span className="text-[11px] text-[#8A99AD] font-mono truncate max-w-[120px]">
                                    {n.user_email || `User #${n.user}`}
                                </span>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedNotificationForView(n)}
                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedNotificationForEdit(n)}
                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNotificationToDelete(n)}
                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddNotificationModal />
            <EditNotificationModal />
            <ViewNotificationModal />

            <ConfirmDeleteModal
                isOpen={notificationToDelete !== null}
                onClose={() => setNotificationToDelete(null)}
                onConfirm={() => {
                    if (notificationToDelete) {
                        deleteNotification(notificationToDelete.id);
                    }
                }}
                title="Delete Notification"
                itemName={notificationToDelete?.title || ""}
                itemType="Notification"
            />
        </div>
    );
}