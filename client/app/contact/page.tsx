import ContactHeader from "./ContactHeader";
import PageTitleBanner from "./PageTitleBanner";
import ContactSection from "./ContactSection";
import { Suspense } from "react";
import Footer from "../components/Footer";

export const metadata = {
    title: "Contact | Nextronics",
};

export default function COntactPage() {
    return (
        <>
            <ContactHeader />
            <main>
                <PageTitleBanner title="Contact" crumbs={[{ name: "Home", href: "/" }]} />
                <Suspense fallback={null}>
                    <ContactSection />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}