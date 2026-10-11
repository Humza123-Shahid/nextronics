import type { Metadata } from "next";
import { AdminProvider } from "@/admin/context/AdminContext";
import Sidebar from "@/admin/components/Sidebar";
import Header from "@/admin/components/Header";

export const metadata: Metadata = {
  title: "TailAdmin — Nextronics Store Dashboard",
  description: "Responsive administrative panel and analytics for Nextronics electronics store.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="flex h-screen overflow-hidden bg-[#1A222C] text-[#DEE4EE]">
        {/* TailAdmin Responsive Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Top Header */}
          <Header />

          {/* Main View Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#1A222C]">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
