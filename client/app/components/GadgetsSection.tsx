"use client";

import { useRef, useState, useEffect, useMemo, type MouseEvent } from "react";

import { useRouter } from 'next/navigation';
import { Space_Grotesk, Inter } from "next/font/google";
import { ShoppingCart, Heart, Eye, ArrowLeftRight, Star, Check } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import styles from "./GadgetsSection.module.css";
import { GADGET_TAB_EVENT, getGadgetTabFromHash, type GadgetTabId } from "../lib/gadgetsNav"; // adjust path

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["500", "700"],
    variable: "--font-heading",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-body",
});

type TabId = "popular" | "new" | "sale";

interface Tab {
    id: TabId;
    label: string;
}
export interface CategoryItem {
    id: number | string;
    name: string;
    slug: string;
    parent_id: string | number;
    description: string;
    image: string;
    is_active: boolean;
}
interface Product {
    id: string;
    name: string;
    price: number;
    compare_at_price: number | null;
    sales_count: number;
    category: number;
    oldPrice?: number;
    rating?: number;
    image: string;
    created_at: string;
}

const TABS: Tab[] = [
    { id: "popular", label: "Most Popular" },
    { id: "new", label: "New Arrival" },
    { id: "sale", label: "On Sale" },
];

// const PRODUCTS: Record<TabId, Product[]> = {
//     popular: [
//         { id: "p1", name: "Wireless Earbuds Pro", price: 89.0, rating: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZx0F8ZhiQlsE-oheaE5v-J2YPS5dlNcuIKyee4DJTZb4tsTdi_hXJPGwk&s=10" },
//         { id: "p2", name: "Smart Fitness Tracker", price: 56.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxk3MWzOc7jlcbJBBSCGchcWKdEBo7NZoz2FabSbIX-A&s=10" },
//         { id: "p3", name: "Portable Power Bank 20K", price: 41.0, oldPrice: 55.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvmnrYXKF5xBNzMHj3YQ32cOwRPAvkDXJnX24pfT4TzQ&s=10" },
//         { id: "p4", name: "Compact Action Camera", price: 87.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqnxGyhvv6RqSh_MUz-U4Nd1lRBJHdfgAjAD5Wq_uz7w&s=10" },
//         { id: "p5", name: "Noise-Cancelling Headset", price: 49.0, oldPrice: 78.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLI9vJ7LSf6uVwjPBkIcvtg2UPUTIIm4xr_q3dUfcLng&s=10" },
//         { id: "p6", name: "Smart Home Hub Mini", price: 77.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbSq7VSGAG-WUm1hv9CAApuwAAGEKCi4ORMzhFTz3i2Q&s=10" },
//         { id: "p7", name: "USB-C Fast Charger Kit", price: 84.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLJjMJtRzkkyZmJOv1W6JtxUPu5hEBm3GmSh0Cs3UjVQ&s=10" },
//         { id: "p8", name: "Mechanical Keyboard Compact", price: 66.0, image: "https://cdn.thewirecutter.com/wp-content/media/2025/12/BEST-COMPACT-MECHANICAL-KEYBOARDS-08547-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp" },
//     ],
//     new: [
//         { id: "n1", name: "Foldable Mini Drone", price: 129.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1rFG3gpabk_5i21aShVL42gkYC0hA6p7XwaLsQgT-CA&s" },
//         { id: "n2", name: "Smart LED Desk Lamp", price: 34.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOta0aHdxhPdjT1wZyNJd1N6jSwLQXlOS8od39wQxRw&s=10" },
//         { id: "n3", name: "Wireless Charging Stand", price: 28.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-jW7DOff7H-hK1eyDYNvebMcb8qUsT-JAOAHvlCDQ_w&s=10" },
//         { id: "n4", name: "4K Webcam Pro", price: 59.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ8SAJli-Yk3rQc1pdncgHm8Y5fK3eM3JyOz1YwZXYbQ&s" },
//         { id: "n5", name: "Smart Door Lock", price: 99.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVOznFKJ52EKBz356NpKL7AdgdeI86_y9fTyOwAguRdQ&s=10" },
//         { id: "n6", name: "Portable SSD 1TB", price: 95.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZXQ2h_o1Q2TKyQ8_Zst3PsPxFVon5RUcKoFcpD7I1nQ&s=10" },
//         { id: "n7", name: "Gaming Mouse RGB", price: 45.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsWL5wKuNBYIwLiyKB9G6Yt4JlH-lmGWuai4Drepe0rg&s=10" },
//         { id: "n8", name: "Smart Plug 4-Pack", price: 32.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSydo-F7EdKK8JhkKPlyhcU0YPw1HlGtIIQFzugyYDIQg&s=10" },
//     ],
//     sale: [
//         { id: "s1", name: "Bluetooth Smartwatch", price: 69.0, oldPrice: 99.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfxDgPpNpt5CKeEB9EErbVGKtNDnH_yZuyVWIqQuU_JQ&s=10" },
//         { id: "s2", name: "Noise-Isolating Earphones", price: 19.0, oldPrice: 29.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpIoaxNgfnC2VZWdAN3t_LeEiRb9hB-8Fj3CFmOjVHng&s=10" },
//         { id: "s3", name: "Portable Mini Projector", price: 149.0, oldPrice: 199.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS88E7Zj-u4FtArxc7L25iifDJ5McVBjxfzdVoz-TDWg&s=10" },
//         { id: "s4", name: "Wireless Charging Pad Trio", price: 35.0, oldPrice: 49.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Sa_nn__ptFgTTULv0opWywPgHtk4hyiIyotNnepowA&s=10" },
//         { id: "s5", name: "Smart Security Camera", price: 44.0, oldPrice: 64.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR62nHEJIO8HrMvV-SPw01nWlx-HDxS2HuPalUg57qD7w&s=10" },
//         { id: "s6", name: "Bluetooth Car Adapter", price: 15.0, oldPrice: 22.0, image: "https://m.media-amazon.com/images/I/71aeV36ZxsL.jpg" },
//         { id: "s7", name: "Ergonomic Wireless Mouse", price: 22.0, oldPrice: 30.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEsQe6XonjbMv7UjmRrlHrUGiANHwHynuYF3lGPNKplw&s=10" },
//         { id: "s8", name: "Universal Travel Adapter", price: 18.0, oldPrice: 25.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbAsuvqf6SE6-I-vmz2Evt8MlZoaxmi3rPM_LETv2MuA&s=10" },
//     ],
// };

/* ---------- Motion variants ---------- */

const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

function buildCardVariants(reduceMotion: boolean) {
    return {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.97 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: reduceMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] as const },
        }),
    };
}

// Driven explicitly by ProductCard's isActive state (hover or keyboard focus).
const iconsGroupVariants = {
    rest: { transition: { staggerChildren: 0.03 } },
    hover: { transition: { staggerChildren: 0.05 } },
};

const iconBtnVariants = {
    rest: { opacity: 0, x: 8 },
    hover: { opacity: 1, x: 0 },
};

const addToCartVariants = {
    rest: { y: "100%" },
    hover: { y: "0%" },
};

function buildTitleVariants(reduceMotion: boolean) {
    return {
        container: {
            hidden: {},
            visible: { transition: reduceMotion ? {} : { staggerChildren: 0.05, delayChildren: 0.1 } },
        },
        word: {
            hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
            visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] as const } },
        },
    };
}

function buildRatingVariants(reduceMotion: boolean) {
    return {
        container: {
            hidden: {},
            visible: { transition: reduceMotion ? {} : { staggerChildren: 0.05 } },
        },
        star: {
            hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.4 },
            visible: { opacity: 1, scale: 1, transition: { duration: reduceMotion ? 0 : 0.25 } },
        },
    };
}

/* ---------- Sidebar with pointer-tilt ---------- */

function SidebarImage({ reduceMotion }: { reduceMotion: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

    function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
        if (reduceMotion || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={ref}
            className={styles.sidebarImage}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 600 }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <img src="https://wpthemes.themehunk.com/electro-mania-v2/wp-content/uploads/sites/240/2022/06/New-Project.png" alt="Gadgets category" loading="lazy" />
        </motion.div>
    );
}

/* ---------- Product card ---------- */

function ProductCard({ product, index, reduceMotion }: { product: Product; index: number; reduceMotion: boolean }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Add a ref to target the image element
    const imgRef = useRef<HTMLImageElement>(null);
    const addTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();
    // Check if image is already cached on mount/update
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setImgLoaded(true);
        }
    }, [product.image]);

    function handleAddToCart() {
        setIsAdded(true);
        if (addTimeout.current) clearTimeout(addTimeout.current);
        addTimeout.current = setTimeout(() => setIsAdded(false), 1600);
    }
    const handleClick = () => {
        localStorage.setItem("productID", String(product.id))
        // Perform any custom logic here
        router.push('/products');
    };
    return (
        <motion.article
            custom={index}
            variants={buildCardVariants(reduceMotion)}
            //href={"/products"} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -4 }}
            onHoverStart={() => setIsActive(true)}
            onHoverEnd={() => setIsActive(false)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            className={styles.card}
        >
            <div className={styles.cardImage}>
                {/* {product.oldPrice && ( */}
                {product.compare_at_price && (
                    <motion.span
                        className={styles.saleBadge}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.3, delay: index * 0.045 + 0.2, ease: "backOut" }}
                    >
                        Sale
                    </motion.span>
                )}

                {!imgLoaded && <div className={styles.imgShimmer} aria-hidden="true" />}
                <img
                    ref={imgRef}
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    style={{ opacity: imgLoaded ? 1 : 0 }}
                />

                <motion.div
                    className={styles.cardIcons}
                    variants={iconsGroupVariants}
                    initial="rest"
                    animate={isActive ? "hover" : "rest"}
                >
                    <motion.button
                        variants={iconBtnVariants}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        aria-pressed={isLiked}
                        aria-label={`${isLiked ? "Remove" : "Add"} ${product.name} ${isLiked ? "from" : "to"} wishlist`}
                        className={styles.iconBtn}
                        onClick={() => setIsLiked((v) => !v)}
                    >
                        <motion.span
                            animate={{ scale: isLiked ? [1, 1.4, 1] : 1 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            style={{ display: "flex" }}
                        >
                            <Heart size={16} fill={isLiked ? "var(--sale)" : "none"} stroke={isLiked ? "var(--sale)" : "currentColor"} />
                        </motion.span>
                    </motion.button>

                    <motion.button variants={iconBtnVariants} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} type="button" onClick={handleClick} aria-label={`Quick view ${product.name}`} className={styles.iconBtn}>
                        <Eye size={16} />
                    </motion.button>

                    <motion.button variants={iconBtnVariants} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} type="button" aria-label={`Compare ${product.name}`} className={styles.iconBtn}>
                        <ArrowLeftRight size={16} />
                    </motion.button>
                </motion.div>

                <motion.button
                    variants={addToCartVariants}
                    initial="rest"
                    animate={isActive ? "hover" : "rest"}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className={styles.addToCart}
                    onClick={handleAddToCart}
                    disabled={isAdded}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isAdded ? (
                            <motion.span
                                key="added"
                                className={styles.addToCartInner}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                            >
                                <Check size={15} />
                                Added
                            </motion.span>
                        ) : (
                            <motion.span
                                key="default"
                                className={styles.addToCartInner}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                            >
                                <ShoppingCart size={15} />
                                Add to cart
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            <div className={styles.cardInfo}>
                <h3 className={styles.cardName}>{product.name}</h3>
                <div className={styles.priceRow}>
                    {/* {product.oldPrice && ( */}
                    {product.compare_at_price && (
                        <span className={styles.oldPriceWrap}>
                            <span className={styles.oldPrice}>${product.compare_at_price.toFixed(2)}</span>
                            <motion.span
                                className={styles.oldPriceStrike}
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={reduceMotion ? { duration: 0 } : { duration: 0.35, delay: index * 0.045 + 0.3, ease: "easeOut" }}
                            />
                        </span>
                    )}
                    <span className={styles.price}>${product.price.toFixed(2)}</span>
                </div>
                {/* {product.rating && ( */}
                {product.rating! > 0 ? (
                    <motion.div
                        className={styles.rating}
                        aria-label={`Rated ${product.rating} out of 5`}
                        variants={buildRatingVariants(reduceMotion).container}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <motion.span key={i} variants={buildRatingVariants(reduceMotion).star} style={{ display: "flex" }}>
                                <Star size={13} className={i < (product.rating as number) ? styles.starFilled : styles.starEmpty} />
                            </motion.span>
                        ))}
                    </motion.div>
                ) : null
                }
            </div>
        </motion.article>
    );
}

/* ---------- Section ---------- */

export default function GadgetsSection() {
    const [activeTab, setActiveTab] = useState<TabId>("popular");
    const reduceMotion = useReducedMotion();
    useEffect(() => {
        const handler = (e: Event) => {
            setActiveTab((e as CustomEvent<GadgetTabId>).detail);
        };
        window.addEventListener(GADGET_TAB_EVENT, handler);
        return () => window.removeEventListener(GADGET_TAB_EVENT, handler);
    }, []);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    // const [filteredProducts, setFilteredProducts] = useState<Record<TabId, Product[]>>({
    //     popular: [],
    //     new: [],
    //     sale: [],
    // });
    //let gadgetsCategory: CategoryItem;
    //const [gadgetsCategory, setGadgetsCategory] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loading2, setLoading2] = useState<boolean>(true);
    const [error2, setError2] = useState<string | null>(null);
    // const prevA = useRef(products);
    // const prevB = useRef(categories);
    useEffect(() => {
        // Replace this URL with your actual Django API endpoint
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8080/api/categories/");
                console.log(response);
                if (!response.ok) {
                    throw new Error("Failed to fetch categories data");
                }
                const data = await response.json();
                console.log(data);
                setCategories(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8080/api/products/");
                console.log(response);
                if (!response.ok) {
                    throw new Error("Failed to fetch products data");
                }
                const data = await response.json();
                // console.log(data);
                // setProducts(data);
                // API returns decimals as strings ("89.00"), so convert them to numbers
                const normalized: Product[] = (Array.isArray(data) ? data : data.results ?? []).map((p: any) => ({
                    ...p,
                    price: Number(p.price),
                    compare_at_price: p.compare_at_price != null ? Number(p.compare_at_price) : null,
                    rating: p.rating != null ? Number(p.rating) : undefined,
                    sales_count: Number(p.sales_count ?? 0),
                }));

                setProducts(normalized);
            } catch (err: any) {
                setError2(err.message || "An error occurred");
            } finally {
                setLoading2(false);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);
    // useEffect(() => {
    //     const aChanged = prevA.current !== products;
    //     const bChanged = prevB.current !== categories;

    //     if (aChanged && bChanged) {
    //         console.log("Both valueA AND valueB changed!");
    //         gadgetsCategory = categories.find(c => c.name === "Gadgets")!;
    //         //setGadgetsCategory(gadgetsCategory);
    //         const gadgetProducts = gadgetsCategory
    //             ? products.filter(p => p.category_id === gadgetsCategory.id)
    //             : [];
    //         const gadgets_popular = gadgetProducts.sort((a, b) => b.sales_count - a.sales_count || b.rating! - a.rating!).slice(0, 8);
    //         const gadgets_new = gadgetProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);
    //         const gadgets_sale = gadgetProducts.filter(p => p.compare_at_price !== null && p.compare_at_price > p.price).slice(0, 8);
    //         setFilteredProducts(prev => ({
    //             ...prev,
    //             popular: [...prev["popular"], gadgets_popular]! as Product[],
    //             new: [...prev["new"], gadgets_new]! as Product[],
    //             sale: [...prev["sale"], gadgets_sale]! as Product[],
    //         }));
    //     }

    //     // 3. Always update the refs at the end of the effect so they stay current
    //     prevA.current = products;
    //     prevB.current = categories;

    // }, [categories, products]);
    const filteredProducts = useMemo<Record<TabId, Product[]>>(() => {
        const gadgets = categories.find((c) => c.name === "Gadgets");
        if (!gadgets) return { popular: [], new: [], sale: [] };

        const gadgetProducts = products.filter(
            (p) => String(p.category) === String(gadgets.id)
        );
        console.log(gadgetProducts)
        return {
            popular: [...gadgetProducts]
                .sort((a, b) => b.sales_count - a.sales_count || (b.rating ?? 0) - (a.rating ?? 0))
                .slice(0, 8),
            new: [...gadgetProducts]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 8),
            sale: gadgetProducts
                .filter((p) => p.compare_at_price != null && p.compare_at_price > p.price)
                .slice(0, 8),
        };
    }, [categories, products]);
    // useEffect(() => {
    //     console.log(filteredProducts)
    // }, [filteredProducts]);
    // useEffect(() => {
    //     const tab = getGadgetTabFromHash();
    //     if (!tab) return;
    //     setActiveTab(tab);
    //     // small delay so layout/fonts/images settle before we scroll
    //     const t = setTimeout(() => {
    //         document.getElementById("gadgets")?.scrollIntoView({ behavior: "smooth", block: "start" });
    //     }, 150);
    //     return () => clearTimeout(t);
    // }, [products]);
    // Cross-page navigation (ShopHeader.tsx on /shop landing on "/#on-sale" etc.)
    useEffect(() => {
        const tab = getGadgetTabFromHash();
        if (!tab) return;
        setActiveTab(tab);
        // small delay so layout/fonts/images settle before we scroll
        const t = setTimeout(() => {
            document.getElementById("gadgets")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return () => clearTimeout(t);
    }, []);

    return (


        <section
            id="gadgets"
            style={{ scrollMarginTop: 90 }}
            className={`${styles.section} ${spaceGrotesk.variable} ${inter.variable}`}>
            <div className={styles.inner}>
                <div className={styles.sidebar}>
                    <SidebarImage reduceMotion={!!reduceMotion} />

                    <motion.h2 className={styles.sidebarTitle} variants={buildTitleVariants(!!reduceMotion).container} initial="hidden" animate="visible">
                        {"Gadgets".split("").map((letter, i) => (
                            <motion.span key={i} variants={buildTitleVariants(!!reduceMotion).word} style={{ display: "inline-block" }}>
                                {letter}
                            </motion.span>
                        ))}
                    </motion.h2>
                </div>

                <div className={styles.content}>
                    <div className={styles.tabs} role="tablist" aria-label="Gadget categories">
                        {TABS.map((tab) => (
                            <motion.button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                whileTap={{ scale: 0.94 }}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabUnderline"
                                        className={styles.activeUnderline}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={gridVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={styles.grid}
                            role="tabpanel"
                        >
                            {/* {PRODUCTS[activeTab].map((product, i) => (
                                <ProductCard key={product.id} product={product} index={i} reduceMotion={!!reduceMotion} />
                            ))} */}
                            {filteredProducts[activeTab].map((product, i) => (
                                <ProductCard key={product.id} product={product} index={i} reduceMotion={!!reduceMotion} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}