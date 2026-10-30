"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useInView,
    Variants,
} from "framer-motion";
import {
    Search,
    Heart,
    Shuffle,
    ShoppingCart,
    Star,
    SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";


interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category: number;
    price: number;
    compare_at_price?: number;
    rating: number;
    image: string;
    tag?: "SALE" | "NEW";
}
// const PRODUCTS: Product[] = [
//     { id: 1, name: "UltraBook Pro 14", category: "Computer & Laptop", price: 1199, oldPrice: 1399, rating: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3D5SqNz61h8803-dEgjP_9QtqBpXCk4dsbHj-PBJWDw&s=10", tag: "SALE" },
//     { id: 2, name: "Studio Wireless Headphones", category: "Audio", price: 199, rating: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYGxpZiFUrSUfNAoQYkZrjI_xfzux-t7RuutBrxjazvQ&s=10" },
//     { id: 3, name: "Nova X Smartphone", category: "Smartphone", price: 799, rating: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYxjkDx2NCBxFgIlGx4gkGaQiqGCPKONHlZQF8IQwTIg&s=10", tag: "NEW" },
//     { id: 4, name: "Mirrorless Camera 24MP", category: "Cameras", price: 949, oldPrice: 1099, rating: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaub1hYkZvCaoIU6lTCgIGid1LSkTFaOHu7QbUquPLCg&s=10", tag: "SALE" },
//     { id: 5, name: "Pulse Smart Watch", category: "Watches", price: 249, rating: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS55YHww88ZBsjCoQiPJFekOnG3nsJ8pzJIHjo1gMKT8w&s=10", tag: "NEW" },
//     { id: 6, name: "Console Controller Elite", category: "Video Games", price: 69, rating: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgoWqV1VTC9UFC96MlcoJ56wPewOnKRDyT8OWQ6dhCLw&s=10" },
//     { id: 7, name: "Boom Bluetooth Speaker", category: "Audio", price: 89, oldPrice: 119, rating: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3cT9dgE9AMGwVRMtluxwyTUv0iRZHKL9Of0T5cybh0g&s=10", tag: "SALE" },
//     { id: 8, name: '4K Smart TV 55"', category: "Home Appliances", price: 649, rating: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_W1pERFJT02jqUlJjDQ-6f0NlTqaFeRsfZsDkq_K8mA&s=10" },
//     { id: 9, name: "Gaming Laptop RX", category: "Computer & Laptop", price: 1499, rating: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlcerMjzsf8lbfFOmCe2nkzuTR8txDzxje_t2gGA6T8w&s=10", tag: "NEW" },
//     { id: 10, name: "Compact Earbuds", category: "Audio", price: 59, rating: 3, image: "https://png.pngtree.com/png-vector/20250429/ourmid/pngtree-stylish-white-wireless-earbuds-in-a-charging-case-on-transparent-background-png-image_16139566.png" },
//     { id: 11, name: "Nova Lite Smartphone", category: "Smartphone", price: 399, oldPrice: 449, rating: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyuVyXVj2A0VVhisxjytO6W4WvTWzeBemgsXjNqrJh2g&s=10", tag: "SALE" },
//     { id: 12, name: "Action Camera 5K", category: "Cameras", price: 329, rating: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbM58cWesd0HyoglUX9MeBjmS0Me4fWoRmt6NTsfdGpQ&s=10" },
// ];

type Sort = "default" | "price-asc" | "price-desc" | "rating";

export default function ShopSection() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    // 1. Add state to hold your raw categories list from the DB
    const [dbCategories, setDbCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const shopRef = useRef<HTMLAnchorElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
        stiffness: 300,
        damping: 25,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
        stiffness: 300,
        damping: 25,
    });

    // Shine sweep follows cursor horizontally
    const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = shopRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // 2. Fetch both endpoints simultaneously using Promise.all
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch("http://127.0.0.1:8080/api/products/"),
                    fetch("http://127.0.0.1:8080/api/categories/") // Your category table API
                ]);

                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error("Failed to fetch shop data");
                }

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                setProducts(productsData);
                setDbCategories(categoriesData);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    // 3. Create a helper Map or lookup object to easily find category names by ID
    const categoryMap = useMemo(() => {
        const map = new Map<number, string>();
        dbCategories.forEach(cat => map.set(cat.id, cat.name));
        return map;
    }, [dbCategories]);

    // 4. Derive unique string names for your sidebar filter
    const categories = useMemo(() => {
        if (dbCategories.length === 0) return ["All"];
        return ["All", ...dbCategories.map(c => c.name).sort()];
    }, [dbCategories]);

    const categoryParam = searchParams.get("category");
    const category = categories.find((c) => c.toLowerCase() === categoryParam?.toLowerCase()) ?? "All";

    const setCategory = (c: string) => {
        router.replace(c === "All" ? pathname : `${pathname}?category=${encodeURIComponent(c)}`, {
            scroll: false,
        });
    };

    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<Sort>("default");
    const [maxPrice, setMaxPrice] = useState(15000);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // 5. Update filter logic to cross-reference the foreign key
    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = [...products].filter((p) => {
            // Find the string name belonging to this specific product's foreign key
            const productCategoryName = categoryMap.get(p.category) || "Uncategorized";

            return (
                (category === "All" || productCategoryName === category) &&
                p.price <= maxPrice &&
                (!q || p.name.toLowerCase().includes(q))
            );
        });

        if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
        if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
        if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
        return list;
    }, [products, category, categoryMap, query, sort, maxPrice]);
    const toggleWish = (id: number) =>
        setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

    // 5. Add loading and error layout state checks
    if (isLoading) return <div className="text-center py-20 font-semibold">Loading products...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-semibold">Error: {error}</div>;
    const handleProductClick = (productId: string) => {
        // Save the clicked product ID to localStorage
        localStorage.setItem("productID", productId);
    };
    return (
        <section className="bg-slate-50 dark:bg-[#090d18] text-slate-900 dark:text-slate-100 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[250px_1fr] gap-8">
                {/* ---- Sidebar ---- */}
                <aside className="lg:sticky lg:top-24 self-start">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen((o) => !o)}
                        aria-expanded={filtersOpen}
                        aria-controls="shop-filters"
                        className="lg:hidden w-full flex items-center justify-between rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4" /> Filters
                        </span>
                        <span className="text-xs text-slate-500">{category}</span>
                    </button>
                    <div id="shop-filters" className={`${filtersOpen ? "block" : "hidden"} lg:block space-y-8 mt-4 lg:mt-0`}>
                        <div>
                            <h2 className="text-sm font-bold mb-3">Categories</h2>
                            <ul className="flex lg:flex-col flex-wrap gap-2 lg:gap-0 lg:divide-y divide-slate-200 dark:divide-slate-800 lg:rounded-xl lg:border border-slate-200 dark:border-slate-800 lg:bg-white dark:lg:bg-[#0c101d] lg:overflow-hidden">
                                {categories.map((c) => (
                                    <li key={c}>
                                        <button
                                            type="button"
                                            onClick={() => setCategory(c)}
                                            aria-pressed={category === c}
                                            className={`w-full text-left px-4 py-2 text-xs font-semibold rounded-full lg:rounded-none border lg:border-0 ${category === c
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-cyan-400"
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <label htmlFor="price" className="flex justify-between text-sm font-bold mb-3">
                                Max price <span className="text-blue-600 dark:text-cyan-400">${maxPrice}</span>
                            </label>
                            <input
                                id="price"
                                type="range"
                                min={50}
                                max={1500}
                                step={50}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                        </div>
                    </div>
                </aside>

                {/* ---- Products ---- */}
                <div>
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <strong className="text-slate-900 dark:text-white">{visible.length}</strong> of {products.length} products
                        </p>
                        <div className="flex flex-col min-[480px]:flex-row gap-3">
                            <div className="flex flex-1 items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-blue-600 px-3">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products"
                                    aria-label="Search products"
                                    className="bg-transparent px-2 py-2 text-sm w-full min-w-0 sm:w-52 focus:outline-none"
                                />
                            </div>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as Sort)}
                                aria-label="Sort products"
                                className="w-full min-[480px]:w-auto rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                            >
                                <option value="default">Default sorting</option>
                                <option value="price-asc">Price: low to high</option>
                                <option value="price-desc">Price: high to low</option>
                                <option value="rating">Top rated</option>
                            </select>
                        </div>
                    </div>

                    {visible.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-16 text-center">
                            <p className="font-semibold">No products match these filters.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setCategory("All");
                                    setQuery("");
                                    setMaxPrice(1500);
                                }}
                                className="mt-3 text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-3 gap-5">
                            {visible.map((p) => {
                                // const Icon = p.icon;
                                const wished = wishlist.includes(p.id);
                                const productCategoryName = categoryMap.get(p.category) || "Uncategorized";
                                //localStorage.setItem("productID", String(p.id))
                                return (
                                    // <li
                                    //     key={p.id}
                                    //     className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101d] overflow-hidden flex flex-col"
                                    // >
                                    // <motion.li
                                    <motion.a
                                        key={p.id}
                                        // href={`/products/${String(p.id)}`}
                                        href={"/products"}
                                        onMouseDown={() => {
                                            // Fires immediately when any mouse button (left, right, or middle) is pressed down
                                            localStorage.setItem("productID", String(p.id));
                                        }}
                                        //onClick={() => handleProductClick(String(p.id))}
                                        whileHover={{ scale: 1.03, y: -4 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101d] overflow-hidden flex flex-col cursor-pointer hover:shadow-lg dark:hover:shadow-cyan-950/30 transition-shadow"
                                    >

                                        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                                            <img
                                                src={p.image}
                                                alt={p.name}

                                            />
                                            {/* {p.compare_at_price && (
                                                <span
                                                    className={`absolute top-3 left-3 z-10 text-[10px] font-black px-2 py-0.5 rounded bg-orange-500 text-white`}
                                                >
                                                    SALE
                                                </span>
                                            )} */}
                                            {p.compare_at_price! > 0 ?
                                                <span
                                                    className={`absolute top-3 left-3 z-10 text-[10px] font-black px-2 py-0.5 rounded bg-orange-500 text-white`}
                                                >
                                                    SALE
                                                </span>
                                                : null}

                                            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleWish(p.id)}
                                                    aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                                                    aria-pressed={wished}
                                                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow flex items-center justify-center hover:text-blue-600"
                                                >
                                                    <Heart className={`w-4 h-4 ${wished ? "fill-orange-500 text-orange-500" : ""}`} />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="Compare"
                                                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow flex items-center justify-center hover:text-blue-600"
                                                >
                                                    <Shuffle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col gap-2 flex-1">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{productCategoryName}</span>
                                            <h3 className="text-sm font-bold leading-snug">{p.name}</h3>
                                            <div className="flex" aria-label={`Rated ${p.rating} out of 5`}>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3.5 h-3.5 ${i < p.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-2">
                                                {/* <div className="flex items-baseline gap-2"> */}
                                                <div className="flex flex-col">
                                                    <span className="font-black text-blue-600 dark:text-cyan-400">${p.price}</span>
                                                    {/* {p.compare_at_price && (
                                                        <span className="text-xs text-slate-400 line-through">${p.compare_at_price}</span>
                                                    )} */}
                                                    {p.compare_at_price! > 0 ?
                                                        <span className="text-xs text-slate-400 line-through">${p.compare_at_price}</span>
                                                        : null}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2"
                                                >
                                                    <ShoppingCart className="w-3.5 h-3.5" /> Add to cart
                                                </button>
                                            </div>
                                        </div>
                                        {/* </li> */}
                                    </motion.a>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}