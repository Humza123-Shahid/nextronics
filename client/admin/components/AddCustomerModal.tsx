"use client";

import React, { useState } from "react";
import { X, Plus, User, Mail, Phone, MapPin } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AddCustomerModal() {
  const { isAddCustomerModalOpen, setIsAddCustomerModalOpen, addCustomer } = useAdmin();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  if (!isAddCustomerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addCustomer({
      name,
      email,
      phone: phone || "+1 (555) 000-0000",
      location: location || "New York, USA",
      status,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    });

    setIsAddCustomerModalOpen(false);
    // Reset
    setName("");
    setEmail("");
    setPhone("");
    setLocation("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">Add New Customer</h3>
              <p className="text-xs text-[#8A99AD] mt-0.5">Register a customer profile</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddCustomerModalOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jessica Taylor"
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jessica.t@example.com"
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">Location / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Boston, USA"
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">Account Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2E3A47]">
            <button
              type="button"
              onClick={() => setIsAddCustomerModalOpen(false)}
              className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-5 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Register Customer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
