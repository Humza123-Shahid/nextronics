"use client";

import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import { RevenueSalesChart, ProfitAnalyticsChart, VisitorsDeviceChart } from "../components/Charts";
import { CATEGORY_METRICS } from "../data/mockData";
import { TrendingUp, DollarSign, ShoppingCart, Percent, Globe, Users } from "lucide-react";

export default function AnalyticsView() {
  const channels = [
    { source: "Direct Traffic", visitors: "142,300", conversion: "4.8%", revenue: "$48,200", color: "bg-blue-500" },
    { source: "Google Organic Search", visitors: "98,120", conversion: "3.6%", revenue: "$32,150", color: "bg-cyan-500" },
    { source: "Social Media (Instagram/X)", visitors: "64,200", conversion: "2.9%", revenue: "$24,500", color: "bg-indigo-500" },
    { source: "Email Campaigns", visitors: "41,000", conversion: "5.4%", revenue: "$18,400", color: "bg-emerald-500" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Analytics & Reports" />

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#8A99AD]">
            <span>Conversion Rate</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-white">3.48%</h3>
          <span className="text-xs text-emerald-400 font-semibold">+0.6% vs last week</span>
        </div>

        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#8A99AD]">
            <span>Average Order Value</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-white">$482.10</h3>
          <span className="text-xs text-emerald-400 font-semibold">+4.2% vs last month</span>
        </div>

        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#8A99AD]">
            <span>Cart Abandonment</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-white">18.4%</h3>
          <span className="text-xs text-emerald-400 font-semibold">-2.1% improvement</span>
        </div>

        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#8A99AD]">
            <span>Lifetime Value (LTV)</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-white">$1,280</h3>
          <span className="text-xs text-emerald-400 font-semibold">+11.5% this quarter</span>
        </div>
      </div>

      {/* Row 2: Main Area Chart */}
      <div className="mb-6">
        <RevenueSalesChart />
      </div>

      {/* Row 3: Category Revenue Breakdown & Traffic Sources */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Category Share */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-6 shadow-md">
          <h3 className="text-xl font-bold tracking-tight text-white mb-1">Sales by Category</h3>
          <p className="text-xs text-[#8A99AD] mb-6">Category contribution to overall sales volume</p>

          <div className="space-y-4">
            {CATEGORY_METRICS.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">{c.name}</span>
                  <span className="text-[#8A99AD]">
                    ${c.revenue.toLocaleString()} ({c.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#1C2434] overflow-hidden">
                  <div
                    style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
                    className="h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acquisition Channels */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-6 shadow-md">
          <h3 className="text-xl font-bold tracking-tight text-white mb-1">Acquisition Channels</h3>
          <p className="text-xs text-[#8A99AD] mb-6">Traffic sources and conversion performance</p>

          <div className="space-y-4">
            {channels.map((ch) => (
              <div
                key={ch.source}
                className="flex items-center justify-between p-3 rounded-lg bg-[#1C2434]/50 border border-[#2E3A47]/60"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${ch.color}`} />
                  <div>
                    <h5 className="text-xs font-semibold text-white">{ch.source}</h5>
                    <span className="text-[11px] text-[#8A99AD]">{ch.visitors} visitors</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs font-bold text-white">{ch.revenue}</span>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {ch.conversion} conv.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
