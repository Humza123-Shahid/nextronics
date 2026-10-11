import Link from "next/link";
import { Cpu, Mail, PhoneCall, MapPin } from "lucide-react";

const SHOP_LINKS = [
    { name: "Computer & Laptop", href: "#computer-laptop" },
    { name: "Smartphone", href: "#smartphone" },
    { name: "Audio", href: "#audio" },
    { name: "Cameras", href: "#cameras" },
    { name: "Watches", href: "#watches" },
];

const HELP_LINKS = [
    { name: "About Us", href: "#about" },
    { name: "FAQ", href: "#faqs" },
    { name: "Contact", href: "#contact-us" },
    { name: "Privacy Policy", href: "#privacy-policy" },
];

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5">
                            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-cyan-400" />
                            </div>
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">NEXTRONICS</span>
                    </Link>
                    <p className="max-w-xs">
                        Laptops, phones, audio and smart gadgets from brands you trust, delivered to your door.
                    </p>
                </div>

                <nav aria-label="Shop">
                    <h3 className="text-white font-bold mb-4">Shop</h3>
                    <ul className="space-y-2">
                        {SHOP_LINKS.map((l) => (
                            <li key={l.name}>
                                <Link href={l.href} className="hover:text-cyan-400">{l.name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label="Help">
                    <h3 className="text-white font-bold mb-4">Help</h3>
                    <ul className="space-y-2">
                        {HELP_LINKS.map((l) => (
                            <li key={l.name}>
                                <Link href={l.href} className="hover:text-cyan-400">{l.name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <h3 className="text-white font-bold mb-4">Get in touch</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2.5">
                            <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
                            <a href="tel:+1800090098" className="hover:text-cyan-400">+1800090098</a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                            <a href="mailto:support@nextronics.com" className="hover:text-cyan-400">support@nextronics.com</a>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>123 Market Street, Your City</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs flex flex-col sm:flex-row gap-2 justify-between">
                    <p>&copy; {new Date().getFullYear()} Nextronics. All rights reserved.</p>
                    <p>Free delivery on orders over $99</p>
                </div>
            </div>
        </footer>
    );
}