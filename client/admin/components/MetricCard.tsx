"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Eye, ShoppingBag, Package, Users } from "lucide-react";
import { MetricStat } from "../types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  views: Eye,
  profit: ShoppingBag,
  products: Package,
  users: Users,
};

const ACCENTS: Record<string, { bg: string; text: string }> = {
  views: { bg: "bg-blue-500/10", text: "text-blue-400" },
  profit: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  products: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
  users: { bg: "bg-amber-500/10", text: "text-amber-400" },
};

export default function MetricCard({ stat }: { stat: MetricStat }) {
  const Icon = ICONS[stat.id] || Eye;
  const accent = ACCENTS[stat.id] || ACCENTS.views;

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#2E3A47] bg-[#24303F] p-6 shadow-md transition-all hover:border-[#3C50E0]/50 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full ${accent.bg} ${accent.text}`}>
          <Icon className="h-6 w-6" />
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            stat.isPositive
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
          }`}
        >
          {stat.isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {stat.change}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold tracking-tight text-white">{stat.value}</h4>
          <span className="text-xs font-medium text-[#8A99AD]">{stat.title}</span>
        </div>

        <span className="text-[11px] text-[#8A99AD]/80">{stat.period}</span>
      </div>
    </div>
  );
}
