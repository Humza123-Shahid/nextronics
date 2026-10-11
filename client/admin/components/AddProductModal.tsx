"use client";

import React, { useState } from "react";
import { X, Plus, PackagePlus } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

// Converts a string like "35.5 x 24.8 x 1.68" or JSON into a valid JSON object for Django
const parseDimensionsInput = (input: string) => {
  if (!input || !input.trim()) return null;

  // Try parsing direct JSON
  try {
    return JSON.parse(input);
  } catch {
    // Fallback: Parse dimensions in format "L x W x H" or "L * W * H"
    const parts = input.split(/[\s*xX]+/).map((num) => parseFloat(num.trim())).filter((val) => !isNaN(val));
    if (parts.length >= 3) {
      return { l: parts[0], w: parts[1], h: parts[2] };
    }
    if (parts.length === 2) {
      return { l: parts[0], w: parts[1] };
    }
    return { raw: input };
  }
};

export default function AddProductModal() {
  const { isAddProductModalOpen, setIsAddProductModalOpen, categories, brands, addProduct } = useAdmin();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    category: "",
    brand: "",
    price: "",
    compare_at_price: "",
    cost_price: "",
    stock_quantity: "0",
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAddProductModalOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Safely parse JSON attributes
      let parsedAttributes = null;
      if (formData.attributes.trim()) {
        try {
          parsedAttributes = JSON.parse(formData.attributes);
        } catch {
          parsedAttributes = formData.attributes;
        }
      }

      // Build payload matching Django REST framework specs
      const payload: any = {
        name: formData.name,
        slug: formData.slug.trim() || undefined,
        sku: formData.sku,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity) || 0,
        status: formData.status,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        tax_class: formData.tax_class || "standard",
        short_description: formData.short_description || "",
        description: formData.description || "",
      };

      // Foreign Keys (pass number or null)
      if (formData.category) payload.category = Number(formData.category);
      if (formData.brand) payload.brand = Number(formData.brand);

      // Optional Numeric Fields
      if (formData.compare_at_price) payload.compare_at_price = Number(formData.compare_at_price);
      if (formData.cost_price) payload.cost_price = Number(formData.cost_price);
      if (formData.weight_kg) payload.weight_kg = Number(formData.weight_kg);

      // Formatted Objects
      if (formData.dimensions) payload.dimensions = parseDimensionsInput(formData.dimensions);
      if (parsedAttributes) payload.attributes = parsedAttributes;

      if (addProduct) {
        await addProduct(payload);
      }

      setIsAddProductModalOpen(false);
    } catch (err: any) {
      console.error("Add Product Error:", err);
      setErrorMsg(err.message || "Failed to add product. Check backend validations.");
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Product</h3>
              <p className="text-xs text-[#8A99AD]">Fill details to add product to catalog</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddProductModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-mono break-words">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Row 1: Name, Slug, SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Product Name *</label>
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
                placeholder="auto-generated if empty"
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
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
                value={formData.category}
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
                value={formData.brand}
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
              <label className="mb-1 block text-[#8A99AD] font-medium">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
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
                value={formData.compare_at_price}
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
                value={formData.cost_price}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Stock *</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Tax, Weight & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Tax Class</label>
              <input
                type="text"
                name="tax_class"
                value={formData.tax_class}
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
                value={formData.weight_kg}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Dimensions</label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="35.5 x 24.8 x 1.68"
                className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Status & Checks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2">
            <div>
              <label className="mb-1 block text-[#8A99AD] font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
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
                id="is_active_add"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
              />
              <label htmlFor="is_active_add" className="text-white font-medium cursor-pointer">
                Is Active
              </label>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="is_featured_add"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-[#2E3A47] bg-[#24303F] text-blue-600 focus:ring-0"
              />
              <label htmlFor="is_featured_add" className="text-white font-medium cursor-pointer">
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
              value={formData.short_description}
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
              value={formData.description}
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
              value={formData.attributes}
              onChange={handleInputChange}
              placeholder='{"color": "space black", "ram": "32GB"}'
              className="w-full rounded-lg border border-[#2E3A47] bg-[#24303F] px-3 py-2 text-white font-mono text-[11px] focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(false)}
              className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{isSubmitting ? "Creating..." : "Create Product"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}