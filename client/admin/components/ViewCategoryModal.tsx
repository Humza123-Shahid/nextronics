"use client";

import React from "react";
import { X, Edit, Folder } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewCategoryModal() {
  const {
    selectedCategoryForView,
    setSelectedCategoryForView,
    setSelectedCategoryForEdit,
    categories,
  } = useAdmin();

  if (!selectedCategoryForView) return null;

  const category = selectedCategoryForView as any;

  // Resolve Parent ID and Name
  const parentId =
    category.parent_id ??
    (typeof category.parent === "object" ? category.parent?.id : category.parent);

  const parentCat = categories.find((c: any) => Number(c.id) === Number(parentId));
  const resolvedParentName =
    parentCat?.name ||
    (typeof category.parent === "object" ? category.parent?.name : null) ||
    "None (Top Level)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Folder className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words max-w-full">
                  {category.name}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border uppercase ${category.is_active
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-xs text-[#8A99AD] font-mono truncate max-w-full">
                Slug: {category.slug || "N/A"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedCategoryForView(null)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          {category.image && (
            <div className="overflow-hidden rounded-xl border border-[#2E3A47] bg-[#24303F] max-h-48 flex justify-center items-center">
              <img
                src={typeof category.image === "string" ? category.image : URL.createObjectURL(category.image)}
                alt={category.name}
                className="object-contain h-full w-full max-h-48"
              />
            </div>
          )}

          <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 border-b border-[#2E3A47]/60 pb-3">
              <div>
                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Parent Category</span>
                <span className="text-white font-medium block truncate">{resolvedParentName}</span>
              </div>
              {/* <div>
                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Subcategories Count</span>
                <span className="text-white font-medium block truncate">
                  {Array.isArray(category.children) ? category.children.length : 0}
                </span>
              </div> */}
            </div>

            <div>
              <span className="text-[#8A99AD] font-semibold uppercase block mb-1 text-[10px] tracking-wider">
                Description
              </span>
              <p className="text-[#DEE4EE] leading-relaxed break-words">
                {category.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
          <button
            type="button"
            onClick={() => setSelectedCategoryForView(null)}
            className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              const cat = selectedCategoryForView;
              setSelectedCategoryForView(null);
              setSelectedCategoryForEdit(cat);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Category</span>
          </button>
        </div>
      </div>
    </div>
  );
}