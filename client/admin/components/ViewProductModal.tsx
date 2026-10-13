"use client";

import React from "react";
import { X, Edit, Package } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function ViewProductModal() {
  const {
    selectedProductForView,
    setSelectedProductForView,
    setSelectedProductForEdit,
    categories,
    brands,
  } = useAdmin();

  if (!selectedProductForView) return null;

  const product = selectedProductForView as any;

  // Resolve Category ID from possible fields
  const catId =
    product.category_id ??
    (typeof product.category === "object" ? product.category?.id : product.category);

  // Resolve Brand ID from possible fields
  const brandId =
    product.brand_id ??
    (typeof product.brand === "object" ? product.brand?.id : product.brand);

  // Dynamic Lookup against Categories and Brands arrays
  const matchedCategory = categories.find((c) => Number(c.id) === Number(catId));
  const matchedBrand = brands.find((b) => Number(b.id) === Number(brandId));

  const resolvedCategoryName =
    matchedCategory?.name ||
    (typeof product.category === "object" ? product.category?.name : null) ||
    product.category_name ||
    "Uncategorized";

  const resolvedBrandName =
    matchedBrand?.name ||
    (typeof product.brand === "object" ? product.brand?.name : null) ||
    product.brand_name ||
    "N/A";

  const statusBadge =
    product.status === "active"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : product.status === "draft"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-rose-500/10 text-rose-400 border-rose-500/20";

  // Safely stringify dimensions if returned as an object { h, l, w }
  const formatDimensions = (dims: any) => {
    if (!dims) return "N/A";
    if (typeof dims === "string") return dims;
    if (typeof dims === "object") {
      const { l, w, h, length, width, height } = dims;
      const len = l ?? length ?? "";
      const wid = w ?? width ?? "";
      const hei = h ?? height ?? "";
      if (len || wid || hei) {
        return `${len}${len ? "x" : ""}${wid}${wid ? "x" : ""}${hei}`.replace(/x$/, "");
      }
      return JSON.stringify(dims);
    }
    return String(dims);
  };

  // Safely format Attributes Display
  const formatAttributes = (attrs: any) => {
    if (!attrs) return null;
    if (typeof attrs === "string") return attrs;
    if (typeof attrs === "object" && Object.keys(attrs).length > 0) {
      return JSON.stringify(attrs, null, 2);
    }
    return null;
  };

  const formattedAttributes = formatAttributes(product.attributes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2E3A47] bg-[#1C2434] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2E3A47] gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Package className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white break-words max-w-full">
                  {product.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border uppercase ${statusBadge}`}
                  >
                    {product.status}
                  </span>
                  {product.is_featured && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#8A99AD] font-mono truncate max-w-full">
                SKU: {product.sku} <span className="opacity-40">|</span> Slug: {product.slug || "N/A"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedProductForView(null)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-[#8A99AD] hover:bg-[#24303F] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          {product.image && (
            <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3 flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 rounded-lg object-cover border border-[#2E3A47]"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-[#8A99AD] block text-[11px]">Product Image URL</span>
                <a href={product.image} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-xs truncate block font-mono">
                  {product.image}
                </a>
              </div>
            </div>
          )}
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
              <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Price</span>
              <span className="text-base sm:text-xl font-bold text-white mt-0.5 block truncate">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>
            <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
              <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Sales Count</span>
              <span className="text-base sm:text-xl font-bold text-white mt-0.5 block truncate">
                {product.sales_count ?? 0} <span className="text-xs font-normal text-[#8A99AD]">sold</span>
              </span>
            </div>
            <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
              <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Compare At</span>
              <span className="text-base sm:text-xl font-bold text-slate-300 mt-0.5 block truncate">
                {product.compare_at_price ? `$${Number(product.compare_at_price).toFixed(2)}` : "—"}
              </span>
            </div>

            <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
              <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Cost Price</span>
              <span className="text-base sm:text-xl font-bold text-slate-300 mt-0.5 block truncate">
                {product.cost_price ? `$${Number(product.cost_price).toFixed(2)}` : "—"}
              </span>
            </div>

            <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3">
              <span className="text-[10px] sm:text-[11px] text-[#8A99AD] block uppercase font-medium">Stock</span>
              <span className="text-base sm:text-xl font-bold text-white mt-0.5 block truncate">
                {product.stock_quantity} <span className="text-xs font-normal text-[#8A99AD]">units</span>
              </span>
            </div>
          </div>

          {/* FK & Extended Details */}
          <div className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-3.5 sm:p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-[#2E3A47]/60 pb-3">
              <div className="min-w-0">
                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Category</span>
                <span className="text-white font-medium truncate block">
                  {resolvedCategoryName}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Brand</span>
                <span className="text-white font-medium truncate block">
                  {resolvedBrandName}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Tax Class</span>
                <span className="text-white font-medium truncate block uppercase">
                  {product.tax_class || "Standard"}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Weight</span>
                <span className="text-white font-medium truncate block">
                  {product.weight_kg ? `${product.weight_kg} kg` : "N/A"}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Dimensions</span>
                <span className="text-white font-medium truncate block">
                  {formatDimensions(product.dimensions)}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[#8A99AD] block mb-0.5 text-[11px]">Is Active</span>
                <span className={product.is_active ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                  {product.is_active ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Descriptions & Attributes */}
            <div className="space-y-3 pt-1">
              {product.short_description && (
                <div>
                  <span className="text-[#8A99AD] font-semibold uppercase block mb-0.5 text-[10px] tracking-wider">
                    Short Description
                  </span>
                  <p className="text-[#DEE4EE] leading-relaxed break-words">
                    {product.short_description}
                  </p>
                </div>
              )}

              <div>
                <span className="text-[#8A99AD] font-semibold uppercase block mb-0.5 text-[10px] tracking-wider">
                  Description
                </span>
                <p className="text-[#DEE4EE] leading-relaxed break-words">
                  {product.description || "No full description provided."}
                </p>
              </div>

              {formattedAttributes && (
                <div>
                  <span className="text-[#8A99AD] font-semibold uppercase block mb-0.5 text-[10px] tracking-wider">
                    Attributes
                  </span>
                  <pre className="rounded-lg border border-[#2E3A47] bg-[#1C2434] p-2.5 text-[#DEE4EE] font-mono text-[11px] overflow-x-auto">
                    {formattedAttributes}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E3A47]">
          <button
            type="button"
            onClick={() => setSelectedProductForView(null)}
            className="flex-1 sm:flex-none rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2.5 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              const p = selectedProductForView;
              setSelectedProductForView(null);
              setSelectedProductForEdit(p);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}