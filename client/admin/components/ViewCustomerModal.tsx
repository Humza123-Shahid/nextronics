"use client";

import React from "react";
import { X, Edit, User, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, UserCheck, UserX } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewCustomerModal() {
  const { selectedCustomerForView, setSelectedCustomerForView, setSelectedCustomerForEdit } = useAdmin();

  if (!selectedCustomerForView) return null;

  const customer = selectedCustomerForView;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
          <h3 className="text-xl font-bold tracking-tight text-white">Customer Profile</h3>
          <button
            type="button"
            onClick={() => setSelectedCustomerForView(null)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="mt-6 flex flex-col items-center text-center">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="h-20 w-20 rounded-full object-cover border-2 border-blue-500 shadow-lg shadow-blue-500/20"
          />
          <h4 className="mt-3 text-lg font-bold text-white">{customer.name}</h4>
          <span className="text-xs text-[#8A99AD]">{customer.email}</span>

          <span
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
              customer.status === "Active"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
            }`}
          >
            {customer.status === "Active" ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
            {customer.status}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 text-center">
            <span className="text-[11px] text-[#8A99AD] block">Total Orders</span>
            <span className="text-xl font-bold text-white mt-1 block">{customer.totalOrders}</span>
          </div>

          <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 text-center">
            <span className="text-[11px] text-[#8A99AD] block">Total Spent</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">
              ${customer.totalSpend.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-white">
            <Phone className="h-4 w-4 text-blue-400 shrink-0" />
            <span>{customer.phone || "No phone provided"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-white">
            <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{customer.location || "No address provided"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#8A99AD]">
            <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
            <span>Joined on {customer.joinDate}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#2E3A47]">
          <button
            type="button"
            onClick={() => setSelectedCustomerForView(null)}
            className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-5 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              const c = customer;
              setSelectedCustomerForView(null);
              setSelectedCustomerForEdit(c);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
