"use client";
import { useState, useEffect } from 'react';
import { getAuthCookie } from "@/app/actions/auth";
import { type Cart } from "../types/cart";

import CartDrawer from "../components/CartDrawer";
import ShopHeader from "./ShopHeader";
import PageTitleBanner from "./PageTitleBanner";
import ShopSection from "./ShopSection";
import Footer from "../components/Footer";
import { Suspense } from "react";
import CommonHeader from "../components/CommonHeader";

// export const metadata = {
//     title: "Shop | Nextronics",
// };

export default function ShopPage() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState<Cart | null>(null);
    const fetchCart = async () => {
        try {
            const token = await getAuthCookie();
            const guestSessionKey = localStorage.getItem("guest_session_key");
            const headers: Record<string, string> = { "Content-Type": "application/json" };

            if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
                headers["Authorization"] = `Bearer ${token}`;
            } else if (guestSessionKey && guestSessionKey !== "null" && guestSessionKey !== "undefined") {
                headers["X-Guest-Session-Key"] = guestSessionKey;
            }

            const res = await fetch('http://127.0.0.1:8080/api/carts/', {
                method: 'GET',
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                //     'Content-Type': 'application/json'
                // }
                headers: headers,
            });
            if (res.ok) {
                const data = await res.json();
                setCart(Array.isArray(data) ? data[0] : data);
            }
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        }
    };
    useEffect(() => {
        fetchCart();
    }, [])
    return (
        <>
            {/* <ShopHeader /> */}
            <CommonHeader onCartClick={() => setIsCartOpen(true)} />
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
            />
            <main>
                <PageTitleBanner title="Shop" crumbs={[{ name: "Home", href: "/" }]} />
                <Suspense fallback={null}>
                    <ShopSection />
                </Suspense>
            </main>
            <Footer />

        </>
    );
}