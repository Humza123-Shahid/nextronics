import ShopHeader from "./ShopHeader";
import PageTitleBanner from "./PageTitleBanner";
import ShopSection from "./ShopSection";
import Footer from "../components/Footer";
import { Suspense } from "react";

export const metadata = {
    title: "Shop | Nextronics",
};

export default function ShopPage() {
    return (
        <>
            <ShopHeader />
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