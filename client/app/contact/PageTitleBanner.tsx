import Link from "next/link";

interface Props {
    title: string;
    crumbs?: { name: string; href: string }[];
    image?: string;
}

const DEFAULT_IMAGE =
    "https://ecommet.xyz/assets/front/img/user/7f0100c0740e07566272ca43d00d6b6c26e79c00.png";

export default function PageTitleBanner({
    title,
    crumbs = [{ name: "Home", href: "/" }],
    image = DEFAULT_IMAGE,
}: Props) {
    return (
        <section
            className="relative bg-slate-900 bg-cover bg-bottom bg-no-repeat"
            style={{ backgroundImage: `url("${image}")` }}
        >
            {/* keeps text readable on any banner image */}
            <div className="absolute inset-0 bg-slate-950/55" aria-hidden="true" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 text-left">
                <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl font-black tracking-tight text-white break-words">{title}</h1>
                <nav aria-label="Breadcrumb" className="mt-3">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                        {crumbs.map((c) => (
                            <li key={c.name} className="flex items-center gap-2">
                                <Link href={c.href} className="hover:text-cyan-300">
                                    {c.name}
                                </Link>
                                <span aria-hidden="true" className="text-slate-400">/</span>
                            </li>
                        ))}
                        <li aria-current="page" className="font-semibold text-cyan-300">
                            {title}
                        </li>
                    </ol>
                </nav>
            </div>
        </section>
    );
}