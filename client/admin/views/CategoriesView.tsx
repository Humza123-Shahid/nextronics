"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddCategoryModal from "../components/AddCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import ViewCategoryModal from "../components/ViewCategoryModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function CategoriesView() {
  const {
    categories,
    deleteCategory,
    setIsAddCategoryModalOpen,
    setSelectedCategoryForView,
    setSelectedCategoryForEdit,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);

  const filteredCategories = categories.filter((c: any) => {
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "active" && c.is_active) ||
      (selectedStatus === "inactive" && !c.is_active);

    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.slug?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getParentName = (parentId: any) => {
    if (!parentId) return "Top Level";
    const parent = categories.find((cat: any) => Number(cat.id) === Number(parentId));
    return parent ? parent.name : "Top Level";
  };

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Categories Management" />

      {/* Filter and Actions Bar */}
      <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
            <input
              type="text"
              placeholder="Search by name, slug or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3 py-2 text-xs font-medium text-[#DEE4EE] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
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
                  <th className="py-4 px-4 sm:px-6">Category</th>
                  <th className="py-4 px-4 sm:px-6">Slug</th>
                  <th className="py-4 px-4 sm:px-6">Parent</th>
                  <th className="py-4 px-4 sm:px-6">Status</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#8A99AD]">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((c: any) => {
                    const parentId =
                      c.parent_id ?? (typeof c.parent === "object" ? c.parent?.id : c.parent);

                    return (
                      <tr key={c.id} className="hover:bg-[#1C2434]/60 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            {c.image && (
                              <img
                                src={typeof c.image === "string" ? c.image : URL.createObjectURL(c.image)}
                                alt={c.name}
                                className="h-8 w-8 rounded-lg object-cover border border-[#2E3A47]"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-white truncate text-xs sm:text-sm">
                                {c.name}
                              </p>
                              {c.description && (
                                <p className="text-[11px] text-[#8A99AD] line-clamp-1">{c.description}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 sm:px-6 font-mono text-xs text-[#8A99AD]">
                          {c.slug}
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-xs text-white">
                          {getParentName(parentId)}
                        </td>

                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase ${c.is_active
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              }`}
                          >
                            {c.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedCategoryForView(c)}
                              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedCategoryForEdit(c)}
                              className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                              title="Edit category"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCategoryToDelete(c)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                              title="Delete category"
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
          {filteredCategories.map((c: any) => {
            const parentId =
              c.parent_id ?? (typeof c.parent === "object" ? c.parent?.id : c.parent);

            return (
              <div
                key={c.id}
                className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8A99AD] font-mono mb-2">
                    <span>{getParentName(parentId)}</span>
                    <span
                      className={`uppercase text-[10px] font-bold ${c.is_active ? "text-emerald-400" : "text-rose-400"
                        }`}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white text-sm line-clamp-1">{c.name}</h4>
                  <p className="text-xs text-[#8A99AD] mt-1 line-clamp-2">{c.description || "No description"}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8A99AD] truncate max-w-[120px]">{c.slug}</span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryForView(c)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryForEdit(c)}
                      className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(c)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddCategoryModal />
      <EditCategoryModal />
      <ViewCategoryModal />

      <ConfirmDeleteModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) {
            deleteCategory(categoryToDelete.id);
          }
        }}
        title="Delete Category"
        itemName={categoryToDelete?.name || ""}
        itemType="Category"
      />
    </div>
  );
}