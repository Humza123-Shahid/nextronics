"use client";

import React, { useState } from "react";
// import { MONTHLY_SALES_DATA, CATEGORY_METRICS } from "../data/mockData";
import { useAdmin } from "../context/AdminContext";

export function RevenueSalesChart() {
  const { setIsAddProductModalOpen, products, orders, views } = useAdmin();
  // const [period, setPeriod] = useState<"Day" | "Week" | "Month">("Month");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const validOrders = orders.filter(
    (order: any) =>
      (order.payment_status === "paid" || order.status === "delivered") &&

      order.status !== "cancelled" &&
      order.status !== "refunded"
  );
  // 1. Define all month names and get current date info (Year 2026)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth(); // 0-indexed (e.g., October is 9)

  // 2. Aggregate valid orders by month
  const monthlyMap: { [key: string]: { revenue: number; sales: number } } = {};
  monthNames.forEach((m) => {
    monthlyMap[m] = { revenue: 0, sales: 0 };
  });

  validOrders.forEach((order: any) => {
    const orderDate = new Date(order.placed_at || order.date);

    // Check if the order belongs to the current year
    if (orderDate.getFullYear() === currentYear) {
      const monthName = monthNames[orderDate.getMonth()];
      if (monthName && monthlyMap[monthName]) {
        const orderRevenue = Number(order.grand_total || 0);
        const orderSales = Number(order.subtotal || order.grand_total || 0);

        monthlyMap[monthName].revenue += orderRevenue;
        monthlyMap[monthName].sales += orderSales;
      }
    }
  });

  // 3. Filter to include ONLY previous months (exclude current month and future months)
  const previousMonths = monthNames.slice(0, currentMonthIndex);

  // 4. Convert map into the dynamic MONTHLY_SALES_DATA array format
  const MONTHLY_SALES_DATA = previousMonths.map((month) => ({
    month,
    revenue: monthlyMap[month].revenue,
    sales: monthlyMap[month].sales,
  }));


  const totalRevenue = validOrders.reduce(
    (sum: number, order: any) => sum + Number(order.grand_total || 0),
    0
  );

  const totalSalesAmount = validOrders.reduce(
    (sum: number, order: any) => sum + Number(order.subtotal || order.grand_total || 0),
    0
  );


  const peakValue = Math.max(
    ...MONTHLY_SALES_DATA.map((d) => Math.max(d.revenue, d.sales)),
    1000 // fallback minimum scale
  );
  const maxRevenue = Math.ceil(peakValue / 10000) * 10000 || 60000;

  // SVG Chart Dimensions
  //const maxRevenue = 60000;
  const chartHeight = 220;
  const chartWidth = 700;
  const paddingX = 40;
  const paddingY = 30;

  const pointsRevenue = MONTHLY_SALES_DATA.map((d, i) => {
    const x = paddingX + (i / (MONTHLY_SALES_DATA.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.revenue / maxRevenue) * (chartHeight - paddingY * 2);
    return { x, y, data: d };
  });

  const pointsSales = MONTHLY_SALES_DATA.map((d, i) => {
    const x = paddingX + (i / (MONTHLY_SALES_DATA.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.sales / maxRevenue) * (chartHeight - paddingY * 2);
    return { x, y, data: d };
  });

  const revenuePath = pointsRevenue.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ""
  );

  const revenueAreaPath = `${revenuePath} L ${pointsRevenue[pointsRevenue.length - 1].x} ${chartHeight - paddingY
    } L ${pointsRevenue[0].x} ${chartHeight - paddingY} Z`;

  const salesPath = pointsSales.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ""
  );

  return (
    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 sm:p-7.5 shadow-md">
      {/* Chart Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#2E3A47]">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">Sales & Revenue</h3>
          <p className="text-xs text-[#8A99AD] mt-0.5">Real-time revenue performance</p>
        </div>

        {/* <div className="flex flex-wrap items-center gap-3"> */}
        {/* Period selector */}
        {/* <div className="flex items-center rounded-lg bg-[#1C2434] p-1 border border-[#2E3A47]">
            {(["Day", "Week", "Month"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${period === p
                  ? "bg-[#333A48] text-white shadow-xs"
                  : "text-[#8A99AD] hover:text-white"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div> */}
      </div>

      {/* Legend Indicators */}
      <div className="flex flex-wrap items-center gap-6 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#3C50E0]" />
          <span className="text-xs text-[#8A99AD]">Total Revenue:</span>
          <span className="text-xs font-bold text-white">${totalRevenue.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#06B6D4]" />
          <span className="text-xs text-[#8A99AD]">Total Sales:</span>
          <span className="text-xs font-bold text-white">${totalSalesAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Interactive Responsive SVG Area Chart */}
      <div className="relative mt-2 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3C50E0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3C50E0" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#2E3A47"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#8A99AD"
                  fontSize="10"
                >
                  ${Math.round((maxRevenue * pct) / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={revenueAreaPath} fill="url(#revenueGradient)" />

          {/* Lines */}
          <path
            d={revenuePath}
            fill="none"
            stroke="#3C50E0"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={salesPath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5 3"
          />

          {/* Interactive dots & Month labels */}
          {pointsRevenue.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={chartHeight - paddingY}
                    stroke="#8A99AD"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Revenue Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#1C2434"
                  stroke="#3C50E0"
                  strokeWidth="3"
                  className="transition-all"
                />

                {/* Sales Dot */}
                <circle
                  cx={pointsSales[i].x}
                  cy={pointsSales[i].y}
                  r={isHovered ? 5 : 3.5}
                  fill="#1C2434"
                  stroke="#06B6D4"
                  strokeWidth="2.5"
                  className="transition-all"
                />

                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fill={isHovered ? "#FFFFFF" : "#8A99AD"}
                  fontSize="11"
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {pt.data.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            className="pointer-events-none absolute -top-2 rounded-lg border border-[#2E3A47] bg-[#1C2434] p-2.5 shadow-xl transition-all z-20 text-xs"
            style={{
              left: `${Math.min(Math.max(10, (hoveredIndex / (MONTHLY_SALES_DATA.length - 1)) * 100), 85)}%`,
            }}
          >
            <div className="font-semibold text-white mb-1">
              {MONTHLY_SALES_DATA[hoveredIndex].month} Overview
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Rev: ${MONTHLY_SALES_DATA[hoveredIndex].revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Sales: ${MONTHLY_SALES_DATA[hoveredIndex].sales.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfitAnalyticsChart() {
  const months = ["M", "T", "W", "T", "F", "S", "S"];
  const revenueValues = [44, 55, 41, 67, 22, 43, 65];
  const salesValues = [13, 23, 20, 8, 13, 27, 18];

  return (
    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 sm:p-7.5 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Profit Analytics</h3>
            <p className="text-xs text-[#8A99AD] mt-0.5">This week vs last week</p>
          </div>
          <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            Weekly
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs bg-[#3C50E0]" />
            <span className="text-xs text-[#8A99AD]">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs bg-[#80CAEE]" />
            <span className="text-xs text-[#8A99AD]">Revenue</span>
          </div>
        </div>

        {/* Bar comparison */}
        <div className="mt-6 flex h-48 items-end justify-between gap-2 pt-6">
          {months.map((day, idx) => {
            const revHeight = (revenueValues[idx] / 70) * 100;
            const salesHeight = (salesValues[idx] / 70) * 100;

            return (
              <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                <div className="flex items-end gap-1 w-full justify-center h-full">
                  <div
                    style={{ height: `${salesHeight}%` }}
                    className="w-3 rounded-t-xs bg-[#3C50E0] transition-all duration-500 hover:brightness-125"
                    title={`Sales: $${salesValues[idx]}k`}
                  />
                  <div
                    style={{ height: `${revHeight}%` }}
                    className="w-3 rounded-t-xs bg-[#80CAEE] transition-all duration-500 hover:brightness-125"
                    title={`Revenue: $${revenueValues[idx]}k`}
                  />
                </div>
                <span className="text-[11px] font-medium text-[#8A99AD]">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
interface DeviceStat {
  name: string;
  share: number;
  color: string;
}

const COLOR_MAP: Record<string, string> = {
  Desktop: "#3C50E0",
  Mobile: "#06B6D4",
  Tablet: "#10B981",
  Unknown: "#6B7280",
};
export function VisitorsDeviceChart() {

  // --- CALCULATIONS BASED SOLELY ON THE 'views' STATE ---
  const { views } = useAdmin();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0 = January, 11 = December)

  // 1. Filter views strictly for the current month & year
  const currentMonthViews = views.filter((visit) => {
    const visitDate = new Date(visit.visited_at!);
    return (
      visitDate.getFullYear() === currentYear &&
      visitDate.getMonth() === currentMonth
    );
  });

  // 2. Calculate total views for the current month
  const totalViews = currentMonthViews.length;

  // 3. Count occurrences per device type for the current month
  const deviceCounts: Record<string, number> = {};
  currentMonthViews.forEach((visit) => {
    const device = visit.device_type || "Unknown";
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
  });

  // 4. Map into your desired structure with calculated percentage shares
  const devices: DeviceStat[] = Object.keys(deviceCounts).map((deviceName) => {
    const count = deviceCounts[deviceName];
    const share = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;

    return {
      name: deviceName,
      share: share,
      color: COLOR_MAP[deviceName] || "#CBD5E1",
    };
  });

  // const devices = [
  //   { name: "Desktop", share: 58, color: "#3C50E0" },
  //   { name: "Mobile", share: 34, color: "#06B6D4" },
  //   { name: "Tablet", share: 8, color: "#10B981" },
  // ];

  return (
    <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-5 sm:p-7.5 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Visitors Analytics</h3>
            <p className="text-xs text-[#8A99AD] mt-0.5">By device distribution</p>
          </div>
          <span className="text-xs text-[#8A99AD]">Monthly</span>
        </div>

        {/* Circular Donut Diagram */}
        <div className="relative my-6 flex items-center justify-center">
          <svg className="h-44 w-44 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#1C2434"
              strokeWidth="12"
            />
            {/* Desktop Segment: 58% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#3C50E0"
              strokeWidth="12"
              strokeDasharray={`${58 * 2.387} ${100 * 2.387}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Mobile Segment: 34% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#06B6D4"
              strokeWidth="12"
              strokeDasharray={`${34 * 2.387} ${100 * 2.387}`}
              strokeDashoffset={`-${58 * 2.387}`}
              strokeLinecap="round"
            />
            {/* Tablet Segment: 8% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="12"
              strokeDasharray={`${8 * 2.387} ${100 * 2.387}`}
              strokeDashoffset={`-${(58 + 34) * 2.387}`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</span>
            <span className="text-[11px] text-[#8A99AD]">Total Visitors</span>
          </div>
        </div>

        {/* Legend with percentages */}
        <div className="space-y-2.5">
          {devices.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-white font-medium">{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{d.share}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
