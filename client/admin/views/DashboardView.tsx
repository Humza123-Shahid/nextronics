"use client";

import React from "react";
import Link from "next/link";
import { Plus, ArrowUpRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import MetricCard from "../components/MetricCard";
import { RevenueSalesChart, ProfitAnalyticsChart, VisitorsDeviceChart } from "../components/Charts";
// import OrdersTable from "../components/OrdersTable";
import TopProducts from "../components/TopProducts";
import AddProductModal from "../components/AddProductModal";
// import OrderDetailsModal from "../components/OrderDetailsModal";
import EditOrderModal from "../components/EditOrderModal";
import { INITIAL_METRICS } from "../data/mockData";
import { useAdmin } from "../context/AdminContext";

export default function DashboardView() {
  const { setIsAddProductModalOpen, products, orders, views } = useAdmin();
  const now = new Date();

  // 1. Get date boundaries
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const validRevenueOrders = orders.filter(
    (o) => o.payment_status === "paid" || o.status === "delivered"
  );
  // const validActiverOrders = orders.filter(
  //   (o) => o.status === "pending" || o.status === "confirmed" || o.status === "shipped" || o.status === "processing" && (new Date(o.placed_at) >= startOfThisMonth && new Date(o.placed_at) <= now))
  const validActiverOrders = orders.filter((o) => {
    // 1. Ensure placed_at exists before doing anything else
    if (!o.placed_at) return false;

    const orderDate = new Date(o.placed_at);

    // 2. Group status choices using parentheses so && applies to all of them
    const hasActiveStatus =
      o.status === "pending" ||
      o.status === "confirmed" ||
      o.status === "shipped" ||
      o.status === "processing";

    const isWithinDateRange =
      orderDate >= startOfThisMonth &&
      orderDate <= now;

    return hasActiveStatus && isWithinDateRange;
  });

  const calculateMonthlyViewChange = (views: any[]) => {
    const now = new Date();

    // 1. Get date boundaries
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    console.log(startOfThisMonth, startOfLastMonth, endOfLastMonth)
    let thisMonthView = 0;
    let lastMonthView = 0;

    // 2. Loop through views once for performance
    views.forEach(view => {
      // Replace 'createdAt' with your actual date field name
      const viewDate = new Date(view.visited_at);
      //console.log(viewDate)
      if (viewDate >= startOfThisMonth && viewDate <= now) {
        thisMonthView += 1;
      } else if (viewDate >= startOfLastMonth && viewDate <= endOfLastMonth) {
        lastMonthView += 1;
      }
    });
    console.log(lastMonthView, thisMonthView)
    // 3. Calculate differences
    const absoluteChange = thisMonthView - lastMonthView;
    let percentageChangeView = 0
    if (absoluteChange >= 0) {
      percentageChangeView = lastMonthView === 0
        ? (thisMonthView > 0 ? 100 : 0)
        : (absoluteChange / lastMonthView) * 100;
    }
    else {
      console.log(lastMonthView, thisMonthView)
      const positiveChange = lastMonthView - thisMonthView

      percentageChangeView = thisMonthView === 0
        ? (lastMonthView > 0 ? 100 : 0)
        : (positiveChange / thisMonthView) * 100;
    }
    console.log(percentageChangeView);
    // Handle division by zero if last month had 0 revenue
    if (percentageChangeView > 100) {
      percentageChangeView = 100;
    }
    const isViewPositive = thisMonthView > lastMonthView;
    return {
      thisMonthView,
      lastMonthView,
      absoluteChange,
      percentageChangeView: percentageChangeView.toFixed(1) + "%",
      isViewPositive,
    };
  };

  // --- How to use it inside your component ---
  const { thisMonthView, percentageChangeView, isViewPositive } = calculateMonthlyViewChange(views);
  const calculateMonthlyOrderChange = (orders: any[]) => {
    const validActiverOrders = orders.filter(
      (o) => o.status === "pending" || o.status === "confirmed" || o.status === "shipped" || o.status === "processing")
    const now = new Date();

    // 1. Get date boundaries
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    console.log(startOfThisMonth, startOfLastMonth, endOfLastMonth)
    let thisMonthOrderCount = 0;
    let lastMonthOrderCount = 0;

    // 2. Loop through orders once for performance
    validActiverOrders.forEach(order => {
      // Replace 'createdAt' with your actual date field name
      const orderDate = new Date(order.placed_at);
      console.log(orderDate)
      if (orderDate >= startOfThisMonth && orderDate <= now) {
        thisMonthOrderCount += 1;
      } else if (orderDate >= startOfLastMonth && orderDate <= endOfLastMonth) {
        lastMonthOrderCount += 1;
      }
    });
    console.log(thisMonthOrderCount, lastMonthOrderCount)
    // 3. Calculate differences
    const absoluteChange = thisMonthOrderCount - lastMonthOrderCount;
    let percentageChangeCount = 0
    if (absoluteChange >= 0) {
      percentageChangeCount = thisMonthOrderCount === 0
        ? (lastMonthOrderCount > 0 ? 100 : 0)
        : (absoluteChange / thisMonthOrderCount) * 100;
    }
    else {
      console.log(lastMonthOrderCount, thisMonthOrderCount)
      const positiveChange = lastMonthOrderCount - thisMonthOrderCount

      percentageChangeCount = lastMonthOrderCount === 0
        ? (thisMonthOrderCount > 0 ? 100 : 0)
        : (positiveChange / lastMonthOrderCount) * 100;
    }
    console.log(percentageChangeCount);
    // Handle division by zero if last month had 0 revenue
    if (percentageChangeCount > 100) {
      percentageChangeCount = 100;
    }
    const isOrderCountPositive = thisMonthOrderCount >= lastMonthOrderCount;
    return {
      thisMonthOrderCount,
      lastMonthOrderCount,
      absoluteChange,
      percentageChangeOrder: percentageChangeCount.toFixed(1) + "%",
      isOrderCountPositive,
    };
  };

  // --- How to use it inside your component ---
  const { thisMonthOrderCount, percentageChangeOrder, isOrderCountPositive } = calculateMonthlyOrderChange(orders);
  const calculateMonthlyRevenueChange = (orders: any[]) => {
    const now = new Date();

    // 1. Get date boundaries
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    console.log(startOfThisMonth, startOfLastMonth, endOfLastMonth)
    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;

    // 2. Loop through orders once for performance
    orders.forEach(order => {
      // Replace 'createdAt' with your actual date field name
      const orderDate = new Date(order.placed_at);
      console.log(orderDate)
      if (orderDate >= startOfThisMonth && orderDate <= now) {
        thisMonthRevenue += Number(order.grand_total || 0) || 0;
      } else if (orderDate >= startOfLastMonth && orderDate <= endOfLastMonth) {
        lastMonthRevenue += Number(order.grand_total || 0) || 0;
      }
    });
    console.log(lastMonthRevenue, thisMonthRevenue)
    // 3. Calculate differences
    const absoluteChange = thisMonthRevenue - lastMonthRevenue;
    let percentageChange = 0
    if (absoluteChange >= 0) {
      percentageChange = lastMonthRevenue === 0
        ? (thisMonthRevenue > 0 ? 100 : 0)
        : (absoluteChange / lastMonthRevenue) * 100;
    }
    else {
      console.log(lastMonthRevenue, thisMonthRevenue)
      const positiveChange = lastMonthRevenue - thisMonthRevenue

      percentageChange = thisMonthRevenue === 0
        ? (lastMonthRevenue > 0 ? 100 : 0)
        : (positiveChange / thisMonthRevenue) * 100;
    }
    console.log(percentageChange);
    // Handle division by zero if last month had 0 revenue

    const isrevenuePositive = thisMonthRevenue > lastMonthRevenue;
    if (percentageChange > 100) {
      percentageChange = 100;
    }
    return {
      thisMonthRevenue,
      lastMonthRevenue,
      absoluteChange,
      percentageChange: percentageChange.toFixed(1) + "%",
      isrevenuePositive,
    };
  };

  // --- How to use it inside your component ---
  const { thisMonthRevenue, percentageChange, isrevenuePositive } = calculateMonthlyRevenueChange(validRevenueOrders);


  const calculateMonthlyProductChange = (products: any[]) => {
    const now = new Date();

    // 1. Get date boundaries
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    console.log(startOfThisMonth, startOfLastMonth, endOfLastMonth)
    let thisMonthCount = 0;
    let lastMonthCOunt = 0;

    // 2. Loop through orders once for performance
    products.forEach(product => {
      // Replace 'createdAt' with your actual date field name
      const productDate = new Date(product.created_at);
      console.log(productDate)
      if (productDate >= startOfThisMonth && productDate <= now) {
        thisMonthCount += 1;
      } else if (productDate >= startOfLastMonth && productDate <= endOfLastMonth) {
        lastMonthCOunt += 1;
      }
    });
    console.log(thisMonthCount, lastMonthCOunt)
    // 3. Calculate differences
    const absoluteChange = thisMonthCount - lastMonthCOunt;
    let percentageChangeCount = 0
    if (absoluteChange >= 0) {
      percentageChangeCount = thisMonthCount === 0
        ? (lastMonthCOunt > 0 ? 100 : 0)
        : (absoluteChange / thisMonthCount) * 100;
    }
    else {
      console.log(lastMonthCOunt, thisMonthCount)
      const positiveChange = lastMonthCOunt - thisMonthCount

      percentageChangeCount = lastMonthCOunt === 0
        ? (thisMonthCount > 0 ? 100 : 0)
        : (positiveChange / lastMonthCOunt) * 100;
    }
    console.log(percentageChangeCount);
    // Handle division by zero if last month had 0 revenue

    const isCountPositive = thisMonthCount > lastMonthCOunt;
    if (percentageChangeCount > 100) {
      percentageChangeCount = 100;
    }
    return {
      thisMonthCount,
      lastMonthCOunt,
      absoluteChange,
      percentageChangeCount: percentageChangeCount.toFixed(1) + "%",
      isCountPositive,
    };
  };
  const { thisMonthCount, percentageChangeCount, isCountPositive } = calculateMonthlyProductChange(products);

  // Dynamic metrics from current state
  // const totalRevenue = orders
  //   .filter((o) => o.payment_status === "paid" || o.status === "delivered")
  //   .reduce((sum, o) => sum + o.grand_total, 0);
  const totalRevenue = validRevenueOrders.reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
  // const totalViews = views.reduce((sum, o) => sum + Number(o.grand_total || 0), 0);

  const dynamicMetrics = [
    {
      id: "views",
      title: "Total Views",
      value: `${views.length}`,
      numericValue: views.length,
      change: percentageChangeView,
      isPositive: isViewPositive,
      period: "vs last month",
      subtext: "+14% unique visitors",
    },
    {
      id: "profit",
      title: "Total Revenue",
      // value: `$${(totalRevenue > 0 ? totalRevenue : 45200).toLocaleString("en-US", {
      value: `$${totalRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      numericValue: totalRevenue,
      change: percentageChange,
      // change: "8.2%",
      isPositive: isrevenuePositive,
      period: "vs last month",
      subtext: "+22% online orders",
    },
    {
      id: "products",
      title: "Total Products",
      value: `${products.length}`,
      numericValue: products.length,
      // change: "4.1%",
      change: percentageChangeCount,
      isPositive: isCountPositive,
      period: "in catalog",
      subtext: "8 categories active",
    },
    {
      id: "users",
      title: "Active Orders",
      value: `${validActiverOrders.length}`,
      numericValue: validActiverOrders.length,
      change: percentageChangeOrder,
      isPositive: isOrderCountPositive,
      period: "this month",
      subtext: "99.4% fulfillment",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Title & Breadcrumb */}
      <Breadcrumb pageName="eCommerce Dashboard" />

      {/* Top Welcome / Announcement Banner */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-xs">
                Welcome back, Alex!
              </span>
              <span className="flex items-center gap-1 text-xs text-blue-100">
                <ShieldCheck className="h-3.5 w-3.5" /> Nextronics System Healthy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              TailAdmin Store Overview
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              Your electronics storefront revenue is up by <strong className="text-white">8.2%</strong> this week. There are <strong className="text-white">12 new orders</strong> requiring fulfillment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-700 shadow-md hover:bg-blue-50 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </button>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-900/60 border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-900/80 transition-all"
            >
              <span>View Orders</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4 mb-6">
        {dynamicMetrics.map((stat) => (
          <MetricCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Row 2: Sales & Revenue Area Chart + Profit Analytics */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6">
        <div className="col-span-12 xl:col-span-8">
          <RevenueSalesChart />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <ProfitAnalyticsChart />
        </div>
      </div>

      {/* Row 3: Visitors Device Breakdown + Top Products */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6">
        <div className="col-span-12 xl:col-span-5">
          <VisitorsDeviceChart />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <TopProducts />
        </div>
      </div>

      {/* Row 4: Full Recent Orders Table */}
      {/* <div className="mb-6">
        <OrdersTable limit={5} />
      </div> */}

      {/* Modals */}
      <AddProductModal />
      <EditOrderModal />
      {/* <OrderDetailsModal /> */}
    </div>
  );
}
