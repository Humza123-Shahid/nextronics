"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function TopProducts() {
  const { products } = useAdmin();

  // Sort by salesCount descending
  const topProducts = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 sm:p-7.5 shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">Top Selling Products</h3>
          <p className="text-xs text-[#8A99AD] mt-0.5">Top revenue contributors this month</p>
        </div>
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline"
        >
          <span>View All</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-[#2E3A47]/60 mt-2">
        {topProducts.map((p, idx) => (
          <div
            key={p.id}
            className="flex items-center justify-between py-3.5 hover:bg-[#1C2434]/40 px-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-bold text-[#8A99AD] w-4">{idx + 1}.</span>
              <img
                src={p.image}
                alt={p.name}
                className="h-10 w-10 rounded-lg object-contain bg-[#1C2434] p-1 border border-[#2E3A47] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-white truncate">{p.name}</p>
                <span className="text-[11px] text-[#8A99AD]">{p.category}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="block text-xs sm:text-sm font-bold text-white">
                ${(p.price * p.salesCount).toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-400">
                {p.salesCount} sold
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
