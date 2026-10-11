"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // OPTION 1: Skip tracking entirely for internal admin dashboard pages
        if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
            return;
        }

        /* 
        // OPTION 2: UNCOMMENT BELOW IF YOU ONLY WANT TO TRACK THE HOME PAGE EXCLUSIVELY*/
        if (pathname !== "/") {
            return;
        }


        let sessionKey = localStorage.getItem("guest_session_key");
        if (!sessionKey) {
            sessionKey = "guest_" + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("guest_session_key", sessionKey);
        }

        const fullPath = searchParams.toString()
            ? `${pathname}?${searchParams.toString()}`
            : pathname;

        fetch("http://127.0.0.1:8080/api/page-visits/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: fullPath,
                session_key: sessionKey,
            }),
        }).catch((err) => console.error("Analytics ping failed:", err));

    }, [pathname, searchParams]);

    return null;
}
