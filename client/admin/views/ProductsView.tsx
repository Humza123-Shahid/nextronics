"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import ViewProductModal from "../components/ViewProductModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function ProductsView() {
  const {
    products,
    deleteProduct,
    setIsAddProductModalOpen,
    setSelectedProductForView,
    setSelectedProductForEdit,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const filteredProducts = products.filter((p: any) => {
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Products Management" />

      {/* Filter and Actions Bar */}
      <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
            <input
              type="text"
              placeholder="Search by name, SKU or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Choice Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3 py-2 text-xs font-medium text-[#DEE4EE] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <div className="flex items-center rounded-lg border border-[#2E3A47] bg-[#1C2434] p-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-[#333A48] text-white" : "text-[#8A99AD] hover:text-white"
                  }`}
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-[#333A48] text-white" : "text-[#8A99AD] hover:text-white"
                  }`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View */}
      {viewMode === "table" ? (
        <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2E3A47] bg-[#1C2434]/50 text-[11px] font-semibold uppercase tracking-wider text-[#8A99AD]">
                  <th className="py-4 px-4 sm:px-6">Product</th>
                  <th className="py-4 px-4 sm:px-6">SKU</th>
                  <th className="py-4 px-4 sm:px-6">Price</th>
                  <th className="py-4 px-4 sm:px-6">Stock</th>
                  <th className="py-4 px-4 sm:px-6">Status</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#8A99AD]">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p: any) => {
                    const statusBadge =
                      p.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : p.status === "draft"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20";

                    return (
                      <tr key={p.id} className="hover:bg-[#1C2434]/60 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div>
                            <p className="font-semibold text-white truncate text-xs sm:text-sm">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#8A99AD]">{p.slug}</p>
                          </div>
                        </td>

                        <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#8A99AD]">
                          {p.sku}
                        </td>

                        <td className="py-4 px-4 sm:px-6 font-bold text-white">
                          ${Number(p.price).toFixed(2)}
                          {p.compare_at_price && (
                            <span className="ml-1.5 text-[11px] font-normal text-[#8A99AD] line-through">
                              ${Number(p.compare_at_price).toFixed(2)}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-xs text-white">
                          {p.stock_quantity} units
                        </td>

                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase ${statusBadge}`}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedProductForView(p)}
                              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedProductForEdit(p)}
                              className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                              title="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p: any) => (
            <div
              key={p.id}
              className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8A99AD] font-mono mb-2">
                  <span>{p.sku}</span>
                  <span className="uppercase text-[10px] font-bold text-blue-400">{p.status}</span>
                </div>
                <h4 className="font-semibold text-white text-sm line-clamp-1">{p.name}</h4>
                <p className="text-xs text-[#8A99AD] mt-1 line-clamp-2">{p.short_description || p.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-white">${Number(p.price).toFixed(2)}</span>
                  <span className="block text-[10px] text-[#8A99AD]">{p.stock_quantity} in stock</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedProductForView(p)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProductForEdit(p)}
                    className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductToDelete(p)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddProductModal />
      <EditProductModal />
      <ViewProductModal />

      <ConfirmDeleteModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
          }
        }}
        title="Delete Product"
        itemName={productToDelete?.name || ""}
        itemType="Product"
      />
    </div>
  );
}