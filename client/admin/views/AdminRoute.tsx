// app/admin/(protected)/layout.tsx
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthCookie } from "../actions/auth";

const API = "http://127.0.0.1:8080";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    // const token = (await cookies()).get("access")?.value;
    const token = await getAuthCookie();
    if (!token) redirect("/admin/login");

    const res = await fetch(`${API}/api/admin/check/`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) redirect("/admin/login");

    return <>{children}</>;
}