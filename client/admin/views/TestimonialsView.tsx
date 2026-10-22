"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit, Eye, List, Grid, Star } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import AddTestimonialModal from "../components/AddTestimonialModal";
import EditTestimonialModal from "../components/EditTestimonialModal";
import ViewTestimonialModal from "../components/ViewTestimonialModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAdmin } from "../context/AdminContext";

export default function TestimonialsView() {
    const {
        testimonials,
        fetchTestimonials,
        deleteTestimonial,
        setIsAddTestimonialModalOpen,
        setSelectedTestimonialForView,
        setSelectedTestimonialForEdit,
    } = useAdmin();

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const [search, setSearch] = useState("");
    const [selectedRating, setSelectedRating] = useState("All");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [testimonialToDelete, setTestimonialToDelete] = useState<any | null>(null);

    const filteredTestimonials = testimonials.filter((t: any) => {
        const matchesRating = selectedRating === "All" || String(t.rating) === selectedRating;
        const matchesSearch =
            t.patientName?.toLowerCase().includes(search.toLowerCase()) ||
            t.profession?.toLowerCase().includes(search.toLowerCase()) ||
            t.comment?.toLowerCase().includes(search.toLowerCase());
        return matchesRating && matchesSearch;
    });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Testimonials Management" />

            {/* Filter and Actions Bar */}
            <div className="mb-6 rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 sm:p-6 shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A99AD]" />
                        <input
                            type="text"
                            placeholder="Search by patient name, profession or comment..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#2E3A47] bg-[#1C2434] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-[#8A99AD] focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Rating Filter */}
                        <select
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(e.target.value)}
                            className="rounded-lg border border-[#2E3A47] bg-[#1C2434] px-3 py-2 text-xs font-medium text-[#DEE4EE] focus:outline-none"
                        >
                            <option value="All">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
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
                            onClick={() => setIsAddTestimonialModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Testimonial</span>
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
                                    <th className="py-4 px-4 sm:px-6">Patient Name</th>
                                    <th className="py-4 px-4 sm:px-6">Profession</th>
                                    <th className="py-4 px-4 sm:px-6">Rating</th>
                                    <th className="py-4 px-4 sm:px-6">Comment</th>
                                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2E3A47]/60 text-sm">
                                {filteredTestimonials.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-xs text-[#8A99AD]">
                                            No testimonials found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTestimonials.map((t: any) => (
                                        <tr key={t.id} className="hover:bg-[#1C2434]/60 transition-colors">
                                            <td className="py-4 px-4 sm:px-6 font-semibold text-white text-xs sm:text-sm">
                                                {t.patientName}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-[#8A99AD]">
                                                {t.profession || "—"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                                    <span className="text-xs font-semibold text-white">{t.rating}</span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-xs text-[#DEE4EE] max-w-xs truncate">
                                                {t.comment || "—"}
                                            </td>

                                            <td className="py-4 px-4 sm:px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedTestimonialForView(t)}
                                                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedTestimonialForEdit(t)}
                                                        className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors"
                                                        title="Edit testimonial"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setTestimonialToDelete(t)}
                                                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                                        title="Delete testimonial"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTestimonials.map((t: any) => (
                        <div
                            key={t.id}
                            className="rounded-xl border border-[#2E3A47] bg-[#24303F] p-4 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs text-[#8A99AD] mb-2">
                                    <span className="font-semibold text-white text-sm">{t.patientName}</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                        <span className="text-xs text-white font-bold">{t.rating}</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-[#8A99AD]">{t.profession || "No Profession"}</p>
                                <p className="text-xs text-[#DEE4EE] mt-2 line-clamp-3">{t.comment}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#2E3A47] flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTestimonialForView(t)}
                                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTestimonialForEdit(t)}
                                    className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTestimonialToDelete(t)}
                                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddTestimonialModal />
            <EditTestimonialModal />
            <ViewTestimonialModal />

            <ConfirmDeleteModal
                isOpen={testimonialToDelete !== null}
                onClose={() => setTestimonialToDelete(null)}
                onConfirm={() => {
                    if (testimonialToDelete) {
                        deleteTestimonial(testimonialToDelete.id);
                    }
                }}
                title="Delete Testimonial"
                itemName={testimonialToDelete?.patientName || ""}
                itemType="Testimonial"
            />
        </div>
    );
}