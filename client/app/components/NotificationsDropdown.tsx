"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck } from "lucide-react";
import { api } from "@/admin/services/api";
import { AuthUser } from "../context/AuthContext";
import { Notification } from "@/admin/types";
// interface Notification {
//     id: string;
//     user_id: string;
//     title: string;
//     message: string;
//     is_read: boolean;
//     notification_type: string;
//     created_at?: string;
// }

function formatDateTime(isoString: string): string {
    const date = new Date(isoString);

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).replace(',', '');
}

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    // Example state for notifications (Replace with API fetch logic if needed)
    // const [notifications, setNotifications] = useState<Notification[]>([
    //     { id: "1", title: "Order Shipped", message: "Your order #1284 has been shipped.", read: false, time: "10m ago" },
    //     { id: "2", title: "Flash Sale!", message: "Get 40% off on all audio gadgets today.", read: false, time: "1h ago" },
    // ]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("nextronics_auth_user");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.id) {
                    setUser(parsed);
                }
            }
        } catch (e) {
            console.error("Failed to recover auth state from localStorage:", e);
        }
    }, []);
    // Close dropdown on click outside
    useEffect(() => {
        async function fetchNotifications() {

            const data = await api.get<Notification[]>("/notifications/");

            setNotifications(data);
        }
        fetchNotifications();
    }, []);
    useEffect(() => {
        console.log(notifications)
    }, [notifications]);
    const unreadCount = notifications.filter((n) => !n.is_read && n.user === user?.id && n.notification_type !== "system").length;

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        // setNotifications((prev) =>
        //     prev.map((n) => (String(n.id) === id ? { ...n, is_read: true } : n))
        // );
        await api.patch<Notification>(`/notifications/${id}/`, { is_read: true });
        setNotifications((prev) => prev.map((n) => (String(n.id) === id ? { ...n, is_read: true } : n)));
    };

    const markAllAsRead = async () => {
        // setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        const unread = notifications.filter((n) => !n.is_read);
        if (!unread.length) return;

        // optimistic update
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

        try {


            // wait for ALL requests to finish
            const results = await Promise.allSettled(
                unread.map((n) =>
                    api.patch<Notification>(`/notifications/${n.id}/`, { is_read: true })
                )
            );

            // roll back only the ones that failed
            const failedIds = unread
                .filter((_, i) => results[i].status === "rejected")
                .map((n) => n.id);

            if (failedIds.length) {
                console.error("Failed to mark some notifications as read:", failedIds);
                setNotifications((prev) =>
                    prev.map((n) => (failedIds.includes(n.id) ? { ...n, is_read: false } : n))
                );
            }
        } catch (err: any) {
            console.error("Failed to mark all notifications as read:", err);
        }
    };

    return (
        <div className="relative flex items-center" ref={dropdownRef}>
            {/* Trigger Icon Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-1.5 sm:p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 stroke-[1.75px]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow animate-badge-pop">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu - Responsive layout fix applied here */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 sm:w-96 rounded-2xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden text-xs"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 font-bold text-[10px]">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-slate-400">No notifications yet</div>
                            ) : (
                                notifications.map((item) => (
                                    item.notification_type !== "system" && Number(item.user) === user?.id &&
                                    <div
                                        key={item.id}
                                        onClick={() => markAsRead(String(item.id))}
                                        className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start ${item.is_read
                                            ? "bg-transparent text-slate-600 dark:text-slate-400"
                                            : "bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-slate-200 font-medium"
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.is_read ? "bg-transparent" : "bg-blue-600"}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-bold truncate">{item.title}</p>
                                                {/* <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span> */}
                                                <span className="text-[10px] text-slate-400 shrink-0">{formatDateTime(item.created_at!)}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                                {item.message}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
