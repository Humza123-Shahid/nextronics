"use client";

import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import {
  Store,
  Bell,
  Shield,
  Key,
  Save,
  CheckCircle,
  Globe,
  Mail,
  Phone,
  DollarSign,
} from "lucide-react";

export default function SettingsView() {
  const [storeName, setStoreName] = useState("Nextronics Official");
  const [supportEmail, setSupportEmail] = useState("support@nextronics.com");
  const [currency, setCurrency] = useState("USD ($)");
  const [timezone, setTimezone] = useState("UTC-05:00 (Eastern Time)");
  const [orderNotification, setOrderNotification] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumb pageName="Store Settings" />

      {savedSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">Settings successfully updated and saved.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile Section */}
        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-6 shadow-md">
          <div className="flex items-center gap-3 pb-4 border-b border-[#2E3A47]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Store Information</h3>
              <p className="text-xs text-[#8A99AD]">General details visible on customer invoices</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">
                Customer Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="CAD ($)">CAD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">
                Operating Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-hidden"
              >
                <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time)</option>
                <option value="UTC+00:00 (London/GMT)">UTC+00:00 (London/GMT)</option>
                <option value="UTC+06:00 (Dhaka)">UTC+06:00 (Dhaka)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Preference */}
        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-6 shadow-md">
          <div className="flex items-center gap-3 pb-4 border-b border-[#2E3A47]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
              <p className="text-xs text-[#8A99AD]">Control alerts sent to administrators</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1C2434]/60 border border-[#2E3A47]">
              <div>
                <span className="block text-sm font-semibold text-white">
                  Instant New Order Alerts
                </span>
                <span className="text-xs text-[#8A99AD]">
                  Receive immediate browser & email push when customer completes purchase
                </span>
              </div>
              <input
                type="checkbox"
                checked={orderNotification}
                onChange={(e) => setOrderNotification(e.target.checked)}
                className="h-5 w-5 rounded-md border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1C2434]/60 border border-[#2E3A47]">
              <div>
                <span className="block text-sm font-semibold text-white">
                  Low Inventory Warnings
                </span>
                <span className="text-xs text-[#8A99AD]">
                  Trigger alert when any electronics product drops below 10 units in stock
                </span>
              </div>
              <input
                type="checkbox"
                checked={lowStockAlert}
                onChange={(e) => setLowStockAlert(e.target.checked)}
                className="h-5 w-5 rounded-md border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-6 shadow-md">
          <div className="flex items-center gap-3 pb-4 border-b border-[#2E3A47]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Security & API Keys</h3>
              <p className="text-xs text-[#8A99AD]">Authentication and connection credentials</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1C2434]/60 border border-[#2E3A47]">
              <div>
                <span className="block text-sm font-semibold text-white">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-xs text-emerald-400">
                  {twoFactorAuth ? "Currently active & protecting administrative logins" : "Disabled"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#333A48]"
              >
                {twoFactorAuth ? "Disable" : "Enable"}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#DEE4EE] mb-1.5">
                Stripe / Payment Webhook Secret
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="whsec_9a8df7a8s7d8f76a54f89dsa76f5ds"
                  className="flex-1 rounded-lg border border-[#2E3A47] bg-[#1C2434] px-4 py-2.5 text-xs font-mono text-[#8A99AD] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => alert("API key copied to clipboard!")}
                  className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3.5 py-2.5 text-xs font-semibold text-blue-400 hover:bg-[#24303F]"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
