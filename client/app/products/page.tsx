"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductHeader from "./ProductHeader";
import Footer from "../components/Footer";
import { Metadata } from 'next';
import { Star, ShoppingBag, CheckCircle, XCircle, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
// import { Product } from "@/admin/types";
import { type Product, type Category, type Brand } from "../components/data";

// Fetch single product data from Django API
// async function getProduct(id: number): Promise<Product | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:8080/api/products/${id}/`, {
//       next: { revalidate: 60 }, // Revalidate dynamic cache every 60 seconds
//     });

//     if (!res.ok) return null;
//     return await res.json();
//   } catch (error) {
//     return null;
//   }
// }
// async function getCategory(catId?: number): Promise<Category | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:8080/api/categories/${catId}/`, {
//       next: { revalidate: 60 }, // Revalidate dynamic cache every 60 seconds
//     });

//     if (!res.ok) return null;
//     return await res.json();
//   } catch (error) {
//     return null;
//   }
// }
// async function getBrand(brandId?: number): Promise<Brand | null> {
//   try {
//     const res = await fetch(`http://127.0.0.1:8080/api/brands/${brandId}/`, {
//       next: { revalidate: 60 }, // Revalidate dynamic cache every 60 seconds
//     });

//     if (!res.ok) return null;
//     return await res.json();
//   } catch (error) {
//     return null;
//   }
// }
// // Generate SEO Metadata dynamically using Django attributes
// export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
//   const product = await getProduct(params.id);
//   if (!product) return {};

//   return {
//     title: product.meta_title || product.name,
//     description: product.meta_description || product.short_description || product.description,
//   };
// }

// export default async function ProductDetailPage({ params }: { params: { id: string } }) {
export default function ProductDetailage() {

  ////const product = await getProduct(params.id);
  // const productId = localStorage.getItem("productID");
  // const product = await getProduct(Number(productId));
  // const category = await getCategory(Number(product?.category));
  // const brand = await getBrand(Number(product?.brand));
  // if (!product) {
  //   console.log(product)
  //   return;
  //   //notFound();
  //   //console.log(product)
  // }
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const productId = localStorage.getItem("productID");
        if (!productId) {
          router.push('/'); // Redirect home if no ID in storage
          return;
        }

        // 1. Fetch Product
        const prodRes = await fetch(`http://127.0.0.1:8080/api/products/${productId}/`);
        if (!prodRes.ok) {
          setLoading(false);
          return;
        }
        const prodData: Product = await prodRes.json();
        setProduct(prodData);

        // 2. Fetch Category & Brand in parallel if IDs exist
        const fetches = [];
        if (prodData.category) {
          fetches.push(
            fetch(`http://127.0.0.1:8080/api/categories/${prodData.category}/`)
              .then(res => res.ok ? res.json() : null)
              .then(data => setCategory(data))
          );
        }
        if (prodData.brand) {
          fetches.push(
            fetch(`http://127.0.0.1:8080/api/brands/${prodData.brand}/`)
              .then(res => res.ok ? res.json() : null)
              .then(data => setBrand(data))
          );
        }
        await Promise.all(fetches);
      } catch (error) {
        console.error("Failed to load product details", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-red-500">Product not found.</div>;
  }
  const price = Number(product.price);
  const compareAt = product.compare_at_price ? Number(product.compare_at_price) : null;
  const isInStock = product.stock_quantity! > 0;

  return (
    <>
      <ProductHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-gray-900 min-h-screen rounded-3xl"> */}
        {/* Breadcrumb Navigation */}
        {/* <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          {product.category && (
            <> */}
        {/* <Link href={`/categories/${product.category.slug}`} className="hover:text-gray-900">
              {product.category.name} */}
        {/* <Link href={`/categories/${category?.slug}`} className="hover:text-gray-900">
                {category?.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav> */}

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Product Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              {product.image ? (
                // <Image
                //   // src={product.image}
                //   src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8080${product.image}`}
                //   alt={product.name}
                //   fill
                //   priority
                //   className="object-cover"
                // />
                <img
                  src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8080${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Purchasing */}
          <div className="flex flex-col gap-6">
            {/* Title & Brand */}
            <div>
              {product.brand && (
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1 block">
                  {brand?.name}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(Number(product.rating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {Number(product.rating).toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">({product.rating_count} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">${price.toFixed(2)}</span>
              {compareAt && compareAt > price && (
                <span className="text-lg text-gray-400 line-through">${compareAt.toFixed(2)}</span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 text-sm leading-relaxed border-t border-b border-gray-100 py-4">
                {product.short_description}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm font-medium">
              {isInStock ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-emerald-700">In Stock ({product.stock_quantity} available)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                disabled={!isInStock}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                disabled={!isInStock}
                className="flex-1 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                Buy Now
              </button>
            </div>

            {/* Value Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-500" />
                <span>Fast & reliable shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-500" />
                <span>Secure checkout guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description & Key Specifications */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Detailed Description */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Product Overview</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {product.description || 'No detailed description provided for this product.'}
              </p>
            </div>

            {/* Attributes & Specifications Table */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit space-y-4">
              <h3 className="font-semibold text-gray-900">Specifications</h3>

              <dl className="divide-y divide-gray-200 text-sm">
                {product.weight_kg && (
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-gray-500">Weight</dt>
                    <dd className="font-medium text-gray-900">{product.weight_kg} kg</dd>
                  </div>
                )}

                {product.dimensions && (
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-gray-500">Dimensions (L×W×H)</dt>
                    <dd className="font-medium text-gray-900">
                      {product.dimensions.l ?? '-'} x {product.dimensions.w ?? '-'} x {product.dimensions.h ?? '-'} cm
                    </dd>
                  </div>
                )}

                {/* Dynamic Django JSONField Attributes */}
                {product.attributes &&
                  Object.entries(product.attributes).map(([key, val]) => (
                    <div key={key} className="py-2.5 flex justify-between capitalize">
                      <dt className="text-gray-500">{key.replace('_', ' ')}</dt>
                      <dd className="font-medium text-gray-900">{val}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}