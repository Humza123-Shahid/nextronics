"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  pageName: string;
  parentName?: string;
  parentHref?: string;
}

export default function Breadcrumb({
  pageName,
  parentName = "Dashboard",
  parentHref = "/admin",
}: BreadcrumbProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold tracking-tight text-white">{pageName}</h2>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <li>
            <Link
              href={parentHref}
              className="flex items-center gap-1.5 text-[#8A99AD] hover:text-white transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>{parentName}</span>
            </Link>
          </li>
          <li className="text-[#8A99AD]">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-blue-400 font-semibold">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
}
