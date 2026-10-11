"use client";

import React, { useState } from "react";
import { Search, Mail, Phone, MapPin, UserCheck, UserX, Plus, Eye, Edit, Trash2 } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddCustomerModal from "../components/AddCustomerModal";
import EditCustomerModal from "../components/EditCustomerModal";
import ViewCustomerModal from "../components/ViewCustomerModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";
import { Customer } from "../types";

export default function CustomersView() {
  const {
    customers,
    deleteCustomer,
    setIsAddCustomerModalOpen,
    setSelectedCustomerForView,
    setSelectedCustomerForEdit,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Customer Directory" />

      {/* Filter and Actions Bar */}
      <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
            <input
              type="text"
              placeholder="Search by customer name, email or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#DEE4EE] focus:outline-hidden"
            >
              <option value="All">All Customers</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            <button
              type="button"
              onClick={() => setIsAddCustomerModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2E3A47] bg-[#1C2434]/50 text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD]">
                <th className="py-4.5 px-4 sm:px-6">Customer</th>
                <th className="py-4.5 px-4 sm:px-6">Contact & Location</th>
                <th className="py-4.5 px-4 sm:px-6">Orders</th>
                <th className="py-4.5 px-4 sm:px-6">Total Spend</th>
                <th className="py-4.5 px-4 sm:px-6">Status</th>
                <th className="py-4.5 px-4 sm:px-6">Joined Date</th>
                <th className="py-4.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8A99AD]">
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#1C2434]/60 transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="h-10 w-10 rounded-full object-cover border border-[#2E3A47]"
                        />
                        <div>
                          <p className="font-semibold text-white text-xs sm:text-sm">{cust.name}</p>
                          <span className="text-[11px] text-[#8A99AD]">{cust.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Location */}
                    <td className="py-4 px-4 sm:px-6 text-xs text-[#DEE4EE]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-white">
                          <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span>{cust.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8A99AD]">
                          <Phone className="h-3 w-3 text-[#8A99AD] shrink-0" />
                          <span>{cust.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Orders count */}
                    <td className="py-4 px-4 sm:px-6 font-semibold text-white text-xs sm:text-sm">
                      {cust.totalOrders} orders
                    </td>

                    {/* Total Spend */}
                    <td className="py-4 px-4 sm:px-6 font-bold text-emerald-400 text-xs sm:text-sm">
                      ${cust.totalSpend.toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          cust.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}
                      >
                        {cust.status === "Active" ? (
                          <UserCheck className="h-3 w-3" />
                        ) : (
                          <UserX className="h-3 w-3" />
                        )}
                        {cust.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD] whitespace-nowrap">
                      {cust.joinDate}
                    </td>

                    {/* Actions: View, Edit, Delete */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerForView(cust)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                          title="View customer profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerForEdit(cust)}
                          className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                          title="Edit customer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(cust)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                          title="Delete customer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modals */}
      <AddCustomerModal />
      <EditCustomerModal />
      <ViewCustomerModal />

      {/* Confirmation Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={customerToDelete !== null}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          if (customerToDelete) {
            deleteCustomer(customerToDelete.id);
          }
        }}
        title="Delete Customer"
        itemName={customerToDelete?.name || ""}
        itemType="Customer"
      />
    </div>
  );
}
