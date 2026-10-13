"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
export default function EditCategoryModal() {
  const {
    selectedCategoryForEdit,
    setSelectedCategoryForEdit,
    categories,
    updateCategory,
  } = useAdmin();

  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    parent: "",
    description: "",
    image: null as File | string | null,
    is_active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCategoryForEdit) {
      const cat = selectedCategoryForEdit as any;
      const parentId =
        cat.parent_id ??
        (typeof cat.parent === "object" ? cat.parent?.id : cat.parent) ??
        "";

      setFormData({
        name: cat.name || "",
        slug: cat.slug || "",
        parent: parentId,
        description: cat.description || "",
        image: cat.image || null,
        is_active: cat.is_active ?? true,
      });
    }
  }, [selectedCategoryForEdit]);

  if (!selectedCategoryForEdit) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev: any) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      //if (formData.slug) payload.append("slug", formData.slug);
      const finalSlug = formData.slug.trim() ? formData.slug.trim() : generateSlug(formData.name);
      payload.append("slug", finalSlug);
      if (formData.parent) payload.append("parent", formData.parent);
      else payload.append("parent", "");
      payload.append("description", formData.description || "");
      payload.append("is_active", String(formData.is_active));

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      if (updateCategory) {
        await updateCategory(selectedCategoryForEdit.id, payload as any);
      }
      setSelectedCategoryForEdit(null);
    } catch (err) {
      console.error("Failed to update category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Category</h3>
              <p className="text-xs text-[#8A99AD]">ID: #{selectedCategoryForEdit.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategoryForEdit(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Row 1: Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Parent Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Parent Category</label>
              <select
                name="parent"
                value={formData.parent}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">None (Top Level Category)</option>
                {categories
                  .filter((c: any) => Number(c.id) !== Number(selectedCategoryForEdit.id))
                  .map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-4 sm:pt-5">
              <input
                type="checkbox"
                id="is_active_cat_edit"
                name="is_active"
                checked={!!formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
              />
              <label htmlFor="is_active_cat_edit" className="text-white font-medium cursor-pointer">
                Is Active
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1 block text-[#8A99AD] font-medium">Category Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-1.5 text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none"
            />
            {typeof formData.image === "string" && formData.image && (
              <p className="mt-1 text-[11px] text-[#8A99AD] truncate">Current: {formData.image}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-[#8A99AD] font-medium">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
            <button
              type="button"
              onClick={() => setSelectedCategoryForEdit(null)}
              className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}