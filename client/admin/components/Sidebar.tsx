"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  ShoppingCart,
  ShoppingBag,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
  X,
  Cpu,
  Layers,
  Sparkles,
  Award,
  Grid2x2,
  List,
  MapPinHouse,
  WarehouseIcon,
  Boxes,
  Box,
  Quote,
  Share2,
  Tags,
  Bell,
  Truck,
  Container,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Box },
  { name: "Product Variants", href: "/admin/productvariants", icon: Grid2x2 },
  { name: "Attribute Values", href: "/admin/attributevalues", icon: Tags },
  { name: "Brands", href: "/admin/brands", icon: Award },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Orders", href: "/admin/orders", icon: ClipboardList, badge: "New", badgeColor: "bg-blue-500 text-white" },
  { name: "Order Items", href: "/admin/orderitems", icon: Package },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Shipping Methods", href: "/admin/shippingmethods", icon: Truck },
  { name: "Shipments", href: "/admin/shipments", icon: Container },
  { name: "Users", href: "/admin/users", icon: Users },
  // { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Addresses", href: "/admin/addresses", icon: MapPinHouse },
  { name: "Warehouses", href: "/admin/warehouses", icon: WarehouseIcon },
  { name: "Carts", href: "/admin/carts", icon: ShoppingCart },
  { name: "Cart Items", href: "/admin/cartitems", icon: ShoppingBag },
  { name: "Inventories", href: "/admin/inventories", icon: Boxes },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { name: "Socials", href: "/admin/socials", icon: Share2 },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const SECONDARY_NAV_ITEMS: NavItem[] = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Live Storefront", href: "/", icon: Store, badge: "Live", badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    products,
    categories,
  } = useAdmin();

  const isCurrent = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close Sidebar"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") setSidebarOpen(false);
          }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col bg-[#1C2434] text-[#DEE4EE] transition-all duration-300 ease-in-out lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${sidebarCollapsed ? "lg:w-20" : "lg:w-72.5"} w-72.5 border-r border-[#2E3A47] shadow-xl`}
      >
        {/* Sidebar Header / Brand Logo */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#2E3A47]">
          <Link
            href="/admin"
            className="flex items-center gap-3 group focus:outline-hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-md shadow-blue-500/20">
              <Cpu className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-white">Nextronics</span>
                  <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-blue-400 border border-blue-500/30">
                    TAILADMIN
                  </span>
                </div>
                <span className="text-xs text-[#8A99AD]">Store Management</span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white lg:hidden transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          {/* Main Menu Section */}
          <div className="mb-6">
            {!sidebarCollapsed && (
              <h3 className="mb-3 px-3 text-xs font-semibold tracking-wider text-[#8A99AD] uppercase">
                Menu
              </h3>
            )}
            <ul className="space-y-1.5">
              {MAIN_NAV_ITEMS.map((item) => {
                const active = isCurrent(item.href);
                const Icon = item.icon;
                const dynamicBadge =
                  item.name === "Products"
                    ? `${products.length}`
                    : item.name === "Categories"
                      ? `${categories.length}`
                      : item.badge;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={`group relative flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${active
                        ? "bg-[#333A48] text-white shadow-xs font-semibold"
                        : "text-[#DEE4EE] hover:bg-[#24303F] hover:text-white"
                        } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-blue-500" />
                      )}
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${active ? "text-blue-400" : "text-[#8A99AD] group-hover:text-white"
                          }`}
                      />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 truncate">{item.name}</span>
                          {dynamicBadge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.badgeColor || "bg-[#24303F] text-[#8A99AD]"
                                }`}
                            >
                              {dynamicBadge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Others / Settings Section */}
          <div className="pt-2">
            {!sidebarCollapsed && (
              <h3 className="mb-3 px-3 text-xs font-semibold tracking-wider text-[#8A99AD] uppercase">
                Others
              </h3>
            )}
            <ul className="space-y-1.5">
              {SECONDARY_NAV_ITEMS.map((item) => {
                const active = isCurrent(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={`group relative flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${active
                        ? "bg-[#333A48] text-white shadow-xs"
                        : "text-[#DEE4EE] hover:bg-[#24303F] hover:text-white"
                        } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${active ? "text-blue-400" : "text-[#8A99AD] group-hover:text-white"
                          }`}
                      />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${item.badgeColor || "bg-[#24303F] text-[#8A99AD]"
                                }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Upgrade / Pro Banner or System Info (TailAdmin characteristic widget) */}
        {!sidebarCollapsed && (
          <div className="mx-4 mb-4 rounded-xl bg-gradient-to-br from-blue-900/40 via-[#24303F] to-indigo-950/50 p-4 border border-blue-500/20 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Nextronics v2.4</h4>
            <p className="mt-1 text-xs text-[#8A99AD] leading-relaxed">
              TailAdmin Pro Dashboard activated with real-time analytics.
            </p>
          </div>
        )}

        {/* Desktop Collapse Toggle Button */}
        <div className="hidden lg:flex items-center justify-between border-t border-[#2E3A47] px-4 py-3">
          {!sidebarCollapsed && (
            <span className="text-xs text-[#8A99AD]">Collapse Sidebar</span>
          )}
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors ${sidebarCollapsed ? "mx-auto" : ""
              }`}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
