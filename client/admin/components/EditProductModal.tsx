"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

// Helper to format dimensions object or string into readable "L x W x H" format
const formatDimensionsForInput = (dims: any): string => {
  if (!dims) return "";
  if (typeof dims === "string") return dims;
  if (typeof dims === "object") {
    const l = dims.l ?? dims.length ?? "";
    const w = dims.w ?? dims.width ?? "";
    const h = dims.h ?? dims.height ?? "";
    if (l || w || h) {
      return `${l}${l ? " x " : ""}${w}${w ? " x " : ""}${h}`.replace(/\s*x\s*$/, "");
    }
    return JSON.stringify(dims);
  }
  return String(dims);
};

// Helper to format JSON attributes into readable string
const formatAttributesForInput = (attrs: any): string => {
  if (!attrs) return "";
  if (typeof attrs === "string") return attrs;
  if (typeof attrs === "object") {
    try {
      return JSON.stringify(attrs, null, 2);
    } catch {
      return "";
    }
  }
  return String(attrs);
};

export default function EditProductModal() {
  const {
    selectedProductForEdit,
    setSelectedProductForEdit,
    categories,
    brands,
    updateProduct,
  } = useAdmin();

  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    sku: "",
    category: "",
    brand: "",
    price: "",
    compare_at_price: "",
    cost_price: "",
    stock_quantity: "",
    tax_class: "standard",
    weight_kg: "",
    dimensions: "",
    status: "active",
    is_active: true,
    is_featured: false,
    short_description: "",
    description: "",
    attributes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProductForEdit) {
      const prod = selectedProductForEdit as any;

      // Extract Category & Brand IDs cleanly
      const catId =
        prod.category_id ??
        (typeof prod.category === "object" ? prod.category?.id : prod.category) ??
        "";

      const brandId =
        prod.brand_id ??
        (typeof prod.brand === "object" ? prod.brand?.id : prod.brand) ??
        "";

      setFormData({
        ...prod,
        category: catId,
        brand: brandId,
        price: prod.price ?? "",
        compare_at_price: prod.compare_at_price ?? "",
        cost_price: prod.cost_price ?? "",
        stock_quantity: prod.stock_quantity ?? 0,
        weight_kg: prod.weight_kg ?? "",
        // Formatted to avoid [object Object]
        dimensions: formatDimensionsForInput(prod.dimensions),
        attributes: formatAttributesForInput(prod.attributes),
      });
    }
  }, [selectedProductForEdit]);

  if (!selectedProductForEdit) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Safely parse JSON attributes if provided as text
      let parsedAttributes = formData.attributes;
      if (typeof formData.attributes === "string" && formData.attributes.trim()) {
        try {
          parsedAttributes = JSON.parse(formData.attributes);
        } catch {
          // Fall back to original string if not valid JSON
          parsedAttributes = formData.attributes;
        }
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
        cost_price: formData.cost_price ? Number(formData.cost_price) : null,
        stock_quantity: Number(formData.stock_quantity),
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
        attributes: parsedAttributes,
      };

      if (updateProduct) {
        await updateProduct(selectedProductForEdit.id, payload);
      }
      setSelectedProductForEdit(null);
    } catch (err) {
      console.error("Failed to update product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E3A47]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Product</h3>
              <p className="text-xs text-[#8A99AD]">ID: #{selectedProductForEdit.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedProductForEdit(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Row 1: Name, Slug, SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
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
                value={formData.slug || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku || ""}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Category</label>
              <select
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Brand</label>
              <select
                name="brand"
                value={formData.brand || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Compare At ($)</label>
              <input
                type="number"
                step="0.01"
                name="compare_at_price"
                value={formData.compare_at_price || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="cost_price"
                value={formData.cost_price || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Stock</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity ?? ""}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Tax Class, Weight & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Tax Class</label>
              <input
                type="text"
                name="tax_class"
                value={formData.tax_class || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                name="weight_kg"
                value={formData.weight_kg || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Dimensions</label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions || ""}
                onChange={handleInputChange}
                placeholder="L x W x H"
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Status & Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Status</label>
              <select
                name="status"
                value={formData.status || "active"}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={!!formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
              />
              <label htmlFor="is_active" className="text-white font-medium cursor-pointer">
                Is Active
              </label>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={!!formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
              />
              <label htmlFor="is_featured" className="text-white font-medium cursor-pointer">
                Featured
              </label>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="mb-1 block text-[#8A99AD] font-medium">Short Description</label>
            <textarea
              name="short_description"
              rows={2}
              value={formData.short_description || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="mb-1 block text-[#8A99AD] font-medium">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Attributes */}
          <div>
            <label className="mb-1 block text-[#8A99AD] font-medium">Attributes (JSON Format)</label>
            <textarea
              name="attributes"
              rows={3}
              value={formData.attributes || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white font-mono text-[11px] focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit & Cancel Actions */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
            <button
              type="button"
              onClick={() => setSelectedProductForEdit(null)}
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