import ContactHeader from "./ContactHeader";
import PageTitleBanner from "./PageTitleBanner";
import ContactSection from "./ContactSection";
import { Suspense } from "react";

export const metadata = {
    title: "Contact | Nextronics",
};

export default function ShopPage() {
    return (
        <>
            <ContactHeader />
            <main>
                <PageTitleBanner title="Contact" crumbs={[{ name: "Home", href: "/" }]} />
                <Suspense fallback={null}>
                    <ContactSection />
                </Suspense>
            </main>

        </>
    );
}