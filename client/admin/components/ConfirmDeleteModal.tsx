"use client";

import React from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  itemType: "Product" | "Order" | "Customer" | "Category" | "Brand" | "User" | "Testimonial" | "Address" | "Product Variant" | "Attribute Value" | "Notification" | "Warehouse" | "Inventory" | "Cart" | "Cart Item" | "Order Item" | "Payment" | "Shipping Method" | "Social" | "Shipment";
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#1C2434] p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="mt-1 text-xs text-[#8A99AD] leading-relaxed">
              Are you sure you want to permanently delete this {itemType.toLowerCase()}:{" "}
              <strong className="text-white font-semibold">"{itemName}"</strong>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#2E3A47]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#2E3A47] bg-[#24303F] px-4 py-2 text-xs font-semibold text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete {itemType}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
