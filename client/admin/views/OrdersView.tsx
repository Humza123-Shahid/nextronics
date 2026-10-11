"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddOrderModal from "../components/AddOrderModal";
import EditOrderModal from "../components/EditOrderModal";
import ViewOrderModal from "../components/ViewOrderModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function OrdersView() {
    const {
        orders,
        users,
        addresses,
        deleteOrder,
        setIsAddOrderModalOpen,
        setSelectedOrderForModal,
        setSelectedOrderForEdit,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [orderToDelete, setOrderToDelete] = useState<any | null>(null);

    const filteredOrders = orders.filter((o: any) => {
        const matchesStatus = selectedStatus === "All" || o.status === selectedStatus;
        const searchLower = search.toLowerCase();

        const userId = o.user_id ?? (typeof o.user === "object" ? o.user?.id : o.user);
        const matchedUser = users.find((u) => String(u.id) === String(userId));
        const email = matchedUser?.email || (typeof o.user === "object" ? o.user?.email : "");

        const matchesSearch =
            (o.order_number && o.order_number.toLowerCase().includes(searchLower)) ||
            String(o.id).toLowerCase().includes(searchLower) ||
            email.toLowerCase().includes(searchLower);

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Orders Management" />

            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by order number or customer email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3 py-2 text-xs font-medium text-[#DEE4EE] focus:outline-none"
                        >
                            <option value="All">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
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
                            onClick={() => setIsAddOrderModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Order</span>
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === "table" ? (
                <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2E3A47] bg-[#1C2434]/50 text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD]">
                                    <th className="py-4 px-4 sm:px-6">Order</th>
                                    <th className="py-4 px-4 sm:px-6">User Email</th>
                                    <th className="py-4 px-4 sm:px-6">Shipping Address</th>
                                    <th className="py-4 px-4 sm:px-6">Grand Total</th>
                                    <th className="py-4 px-4 sm:px-6">Status</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No orders found in database.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((o: any) => {
                                        const userId = o.user_id ?? (typeof o.user === "object" ? o.user?.id : o.user);
                                        const shipId = o.shipping_address_id ?? (typeof o.shipping_address === "object" ? o.shipping_address?.id : o.shipping_address);

                                        const matchedUser = users.find((u) => String(u.id) === String(userId));
                                        const matchedShip = addresses.find((a) => String(a.id) === String(shipId));

                                        const userEmail = matchedUser?.email || (typeof o.user === "object" ? o.user?.email : "Guest");
                                        const shipDisplay = matchedShip
                                            ? `${matchedShip.full_name ? `${matchedShip.full_name}: ` : ""}${matchedShip.address_line1}${matchedShip.address_line2 ? `, ${matchedShip.address_line2}` : ""}`
                                            : "N/A";

                                        const statusBadge =
                                            o.status === "delivered" || o.status === "confirmed"
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : o.status === "pending" || o.status === "processing"
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20";

                                        return (
                                            <tr key={o.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                                <td className="py-4 px-4 sm:px-6">
                                                    <p className="font-semibold text-white truncate text-xs sm:text-sm font-mono">
                                                        #{o.order_number || o.id}
                                                    </p>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-xs text-white">
                                                    {userEmail}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD] truncate max-w-[200px]">
                                                    {shipDisplay}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 font-bold text-white">
                                                    ${Number(o.grand_total || 0).toFixed(2)}
                                                </td>

                                                <td className="py-4 px-4 sm:px-6">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase ${statusBadge}`}
                                                    >
                                                        {o.status}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4 sm:px-6 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedOrderForModal(o)}
                                                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                            title="View details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedOrderForEdit(o)}
                                                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                            title="Edit order"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setOrderToDelete(o)}
                                                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                            title="Delete order"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredOrders.map((o: any) => {
                        const userId = o.user_id ?? (typeof o.user === "object" ? o.user?.id : o.user);
                        const matchedUser = users.find((u) => String(u.id) === String(userId));
                        const userEmail = matchedUser?.email || (typeof o.user === "object" ? o.user?.email : "Guest");

                        return (
                            <div
                                key={o.id}
                                className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-xs text-[#8A99AD] font-mono mb-2">
                                        <span>#{o.order_number || o.id}</span>
                                        <span className="uppercase text-[10px] font-bold text-blue-400">{o.status}</span>
                                    </div>
                                    <h4 className="font-semibold text-white text-sm truncate">{userEmail}</h4>
                                    <p className="text-xs text-[#8A99AD] mt-1">Payment: {o.payment_status || "unpaid"}</p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                                    <span className="text-base font-bold text-emerald-400">
                                        ${Number(o.grand_total || 0).toFixed(2)}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedOrderForModal(o)}
                                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedOrderForEdit(o)}
                                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOrderToDelete(o)}
                                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AddOrderModal />
            <EditOrderModal />
            <ViewOrderModal />

            <ConfirmDeleteModal
                isOpen={orderToDelete !== null}
                onClose={() => setOrderToDelete(null)}
                onConfirm={() => {
                    if (orderToDelete) {
                        deleteOrder(orderToDelete.id);
                    }
                }}
                title="Delete Order"
                itemName={orderToDelete?.order_number || String(orderToDelete?.id || "")}
                itemType="Order"
            />
        </div>
    );
}