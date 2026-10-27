"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { setAuthCookie, deleteAuthCookie } from "../actions/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Package,
  DollarSign,
  Server,
  X,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();
  const {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebarCollapsed,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
    messages,
    unreadMessagesCount,
    searchQuery,
    setSearchQuery,
    setIsAddProductModalOpen,
    products,
    orders,

  } = useAdmin();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [parsed, setParsed] = useState<{ first_name?: string; last_name?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nextronics_auth_user");
      if (stored) setParsed(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to read auth user from localStorage", err);
    }
  }, []);
  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target as Node)) {
        setMessagesOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered search preview results
  // const searchResults = searchQuery.trim()
  //   ? {
  //     products: products
  //       .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  //       .slice(0, 3),
  //     orders: orders
  //       .filter(
  //         (o) =>
  //           o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //           o.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  //       )
  //       .slice(0, 3),
  //   }
  //   : null;
  function formatDateTime(isoString: string): string {
    const date = new Date(isoString);

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(',', '');
  }
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      // unread first
      if (a.is_read !== b.is_read) {
        return Number(a.is_read) - Number(b.is_read);
      }
      // within the same group, newest first
      return (
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
      );
    });
  }, [notifications]);
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[#2E3A47] bg-[#1C2434]/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md transition-colors dark:border-[#2E3A47] dark:bg-[#1C2434]/95">
      {/* Left side: Hamburger toggle + Search bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2E3A47] bg-[#24303F] text-[#8A99AD] hover:text-white lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={toggleSidebarCollapsed}
          className="hidden lg:flex h-10 w-10 items-center justify-center rounded-lg border border-[#2E3A47] bg-[#24303F] text-[#8A99AD] hover:text-white transition-colors"
          aria-label="Toggle sidebar width"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        {/* <div ref={searchRef} className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-[#8A99AD]" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] py-2.5 pl-10 pr-10 text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-[#8A99AD] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <span className="hidden sm:inline-block absolute right-3 rounded-md bg-[#1C2434] px-1.5 py-0.5 text-[11px] font-medium text-[#8A99AD] border border-[#2E3A47]">
                ⌘K
              </span>
            )}
          </div> */}

        {/* Quick Search Dropdown Preview */}
        {/* {searchFocused && searchResults && (
            <div className="absolute left-0 top-full mt-2 w-full rounded-xl border border-[#2E3A47] bg-[#1C2434] p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {searchResults.products.length === 0 && searchResults.orders.length === 0 ? (
                <p className="p-3 text-center text-xs text-[#8A99AD]">No results found for "{searchQuery}"</p>
              ) : (
                <div className="space-y-3">
                  {searchResults.products.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD] px-2">
                        Products ({searchResults.products.length})
                      </span>
                      <ul className="mt-1 space-y-1">
                        {searchResults.products.map((p) => (
                          <li key={p.id}>
                            <Link
                              href="/admin/products"
                              onClick={() => setSearchFocused(false)}
                              className="flex items-center justify-between rounded-lg p-2 text-xs text-white hover:bg-[#24303F] transition-colors"
                            >
                              <span className="truncate">{p.name}</span>
                              <span className="font-semibold text-blue-400">${p.price}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {searchResults.orders.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD] px-2">
                        Orders ({searchResults.orders.length})
                      </span>
                      <ul className="mt-1 space-y-1">
                        {searchResults.orders.map((o) => (
                          <li key={o.id}>
                            <Link
                              href="/admin/orders"
                              onClick={() => setSearchFocused(false)}
                              className="flex items-center justify-between rounded-lg p-2 text-xs text-white hover:bg-[#24303F] transition-colors"
                            >
                              <span>{o.orderNumber} — {o.customer.name}</span>
                              <span className="font-semibold text-emerald-400">${o.amount}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div> */}
      </div>

      {/* Right side: Actions, Theme Switch, Notifications, Messages, User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Add Product Button */}
        {/* <button
          type="button"
          onClick={() => setIsAddProductModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Product</span>
        </button> */}

        {/* TailAdmin Iconic Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Dark and Light Mode"
          className="relative flex h-9 w-16 items-center rounded-full bg-[#24303F] p-1 border border-[#2E3A47] transition-colors focus:outline-hidden"
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-transform duration-200 ${theme === "dark" ? "translate-x-7" : "translate-x-0"
              }`}
          >
            {theme === "dark" ? (
              <Moon className="h-3.5 w-3.5" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
          </div>
          <span className="sr-only">Toggle Theme</span>
        </button>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setMessagesOpen(false);
              setUserDropdownOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#2E3A47] bg-[#24303F] text-[#8A99AD] hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#1C2434]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl border border-[#2E3A47] bg-[#1C2434] shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-[#2E3A47] px-4 py-3">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-semibold text-white">Notifications</h5>
                  {unreadNotificationsCount > 0 && (
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                      {unreadNotificationsCount} New
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#2E3A47]/60">
                {/* {notifications.map((n) => ( */}
                {sortedNotifications.map((n) => (
                  n.notification_type == "system" &&
                  <div
                    key={n.id}
                    // onClick={() => markNotificationRead(Number(n.id))}
                    onClick={() => markNotificationRead(n.id!)}
                    className={`flex items-start gap-3 p-3.5 hover:bg-[#24303F] cursor-pointer transition-colors ${!n.is_read ? "bg-[#24303F]/50" : ""
                      }`}
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      {/* {n.notification_type === "order" ? (
                        <Package className="h-4 w-4" />
                      ) : n.notification_type === "stock" ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-emerald-400" />
                      )} */}
                      <Server className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                      <p className="text-[11px] text-[#8A99AD] line-clamp-2 mt-0.5">{n.message}</p>
                      {/* <span className="text-[10px] text-[#8A99AD]/70 mt-1 block">{n.created_at}</span> */}
                      <span className="text-[10px] text-[#8A99AD]/70 mt-1 block">{formatDateTime(n.created_at!)}</span>
                    </div>
                    {!n.is_read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages Dropdown */}
        <div ref={msgRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMessagesOpen(!messagesOpen);
              setNotificationOpen(false);
              setUserDropdownOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#2E3A47] bg-[#24303F] text-[#8A99AD] hover:text-white transition-colors"
            aria-label="View messages"
          >
            <MessageSquare className="h-5 w-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-[#1C2434]">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {messagesOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl border border-[#2E3A47] bg-[#1C2434] shadow-2xl z-50">
              <div className="border-b border-[#2E3A47] px-4 py-3 flex items-center justify-between">
                <h5 className="text-sm font-semibold text-white">Customer Messages</h5>
                <span className="text-xs text-[#8A99AD]">{messages.length} messages</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#2E3A47]/60">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start gap-3 p-3.5 hover:bg-[#24303F] cursor-pointer transition-colors"
                  >
                    <img
                      src={m.avatar}
                      alt={m.sender}
                      className="h-9 w-9 rounded-full object-cover shrink-0 border border-[#2E3A47]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{m.sender}</span>
                        <span className="text-[10px] text-[#8A99AD]">{m.time}</span>
                      </div>
                      <p className="text-[11px] text-[#8A99AD] line-clamp-1 mt-0.5">{m.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotificationOpen(false);
              setMessagesOpen(false);
            }}
            className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-[#24303F] transition-colors focus:outline-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Alex Morgan"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/50"
            />
            <div className="hidden text-left xl:block">
              {/* <span className="block text-sm font-medium text-white">Alex Morgan</span>
              <span className="block text-xs text-[#8A99AD]">Super Admin</span> */}
              <span className="block text-sm font-medium text-white">{parsed?.first_name || ""} {" "} {parsed?.last_name || ""}</span>
              <span className="block text-xs text-[#8A99AD]">Super Admin</span>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[#8A99AD] xl:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-xl border border-[#2E3A47] bg-[#1C2434] p-2 shadow-2xl z-50">
              <div className="border-b border-[#2E3A47] px-3 py-2 xl:hidden">
                <p className="text-sm font-semibold text-white">{parsed?.first_name || ""} {" "} {parsed?.last_name || ""}</p>
                <p className="text-xs text-[#8A99AD]">Super Admin</p>
              </div>

              <div className="space-y-1 py-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#DEE4EE] hover:bg-[#24303F] hover:text-white transition-colors"
                >
                  <User className="h-4 w-4 text-[#8A99AD]" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#DEE4EE] hover:bg-[#24303F] hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4 text-[#8A99AD]" />
                  <span>Store Settings</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[#DEE4EE] hover:bg-[#24303F] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="h-4 w-4 text-[#8A99AD]" />
                    <span>View Storefront</span>
                  </div>
                  <span className="text-[10px] text-blue-400">Live</span>
                </Link>
              </div>

              <div className="border-t border-[#2E3A47] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                    router.push("/");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
