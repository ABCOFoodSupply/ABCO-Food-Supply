"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Sparkles, MessageCircle } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  category_slug: string;
  category_name: string;
  image: string;
  origin?: string;
  storage_type?: string;
  moq?: string;
  packaging?: string;
  description?: string;
  featured_on_homepage?: boolean;
}

interface CategoryItem {
  id: string;
  slug: string;
  title: string;
  image: string;
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { id: "c-1", slug: "rice-and-grains", title: "Rice & Grains", image: "/categories/rice-and-grains.png" },
  { id: "c-2", slug: "meat", title: "Meat", image: "/categories/meat.png" },
  { id: "c-3", slug: "seafood", title: "Seafood", image: "/categories/seafood.png" },
  { id: "c-4", slug: "poultry", title: "Poultry", image: "/categories/poultry.png" },
  { id: "c-5", slug: "dairy", title: "Dairy Products", image: "/categories/dairy.png" },
  { id: "c-6", slug: "edible-oils", title: "Edible Oils", image: "/categories/edible-oils.png" },
];

interface ProductCategoriesProps {
  onSelectCategory?: (category: string) => void;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({ onSelectCategory }) => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [categoriesFallback, setCategoriesFallback] = useState<CategoryItem[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Fetch featured products with featured=true tag
        const prodRes = await fetch("/api/products?featured=true", { cache: "no-store" });
        if (prodRes.ok) {
          const prodJson = await prodRes.json();
          if (prodJson.success && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
            setFeaturedProducts(prodJson.data);
            setLoading(false);
            return;
          }
        }

        // 2. If no products have featured_on_homepage enabled yet, fetch all products and show first 6
        const allProdRes = await fetch("/api/products", { cache: "no-store" });
        if (allProdRes.ok) {
          const allJson = await allProdRes.json();
          if (allJson.success && Array.isArray(allJson.data) && allJson.data.length > 0) {
            // Check if any product has featured flag
            const flagged = allJson.data.filter((p: any) => p.featured_on_homepage === true);
            if (flagged.length > 0) {
              setFeaturedProducts(flagged);
            } else {
              // Show first 6 products as initial showcase
              setFeaturedProducts(allJson.data.slice(0, 6));
            }
            setLoading(false);
            return;
          }
        }

        // 3. Fallback to categories list if no products exist
        const catRes = await fetch("/api/categories", { cache: "no-store" });
        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson.success && Array.isArray(catJson.data) && catJson.data.length > 0) {
            setCategoriesFallback(
              catJson.data.slice(0, 6).map((c: any) => ({
                id: c.id,
                slug: c.slug,
                title: c.name,
                image: c.image || "/categories/rice-and-grains.png",
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Failed to load featured products for home page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section id="products" className="py-16 md:py-24 bg-slate-50/60 w-full border-t border-slate-200/60">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-red" />
              OUR PRODUCTS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Wide Range of Imported &amp; Locally Manufactured Food Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Featured wholesale commodities ready for HORECA, commercial catering, and retail distribution across Saudi Arabia.
            </p>
          </div>

          <Link
            href="/products"
            className="self-start md:self-auto bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-md transition-all flex items-center gap-2 group cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Products Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-bold">
            Loading products...
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="group rounded-3xl overflow-hidden border border-slate-200/90 hover:border-brand-red/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white"
              >
                <div>
                  {/* Product Image */}
                  <Link
                    href={`/products/${p.category_slug}/${p.id}`}
                    className="relative aspect-square w-full overflow-hidden bg-slate-50 p-3 flex items-center justify-center block border-b border-slate-100"
                  >
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-3 group-hover:scale-108 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-slate-300 m-auto" />
                    )}

                    {/* Featured Pill */}
                    {p.featured_on_homepage && (
                      <span className="absolute top-2.5 left-2.5 bg-brand-red text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        Featured
                      </span>
                    )}

                    {p.storage_type && (
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                        {p.storage_type}
                      </span>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 space-y-1.5">
                    <Link
                      href={`/products?category=${p.category_slug}`}
                      className="text-[11px] font-black uppercase tracking-wider text-brand-red hover:underline block truncate"
                    >
                      {p.category_name}
                    </Link>

                    <Link
                      href={`/products/${p.category_slug}/${p.id}`}
                      className="text-sm font-bold text-slate-900 group-hover:text-brand-red transition-colors line-clamp-1 block leading-snug"
                      title={p.name}
                    >
                      {p.name}
                    </Link>

                    {p.moq && (
                      <p className="text-[11px] text-slate-500 font-medium">
                        MOQ: <strong className="text-slate-800">{p.moq}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${p.category_slug}/${p.id}`}
                    className="flex-1 text-center py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    Details
                  </Link>
                  <a
                    href={`https://wa.me/966572995987?text=${encodeURIComponent(`Hello ABCO Food Supply, I would like to enquire about ${p.name} (${p.category_name}).`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shrink-0 transition-transform hover:scale-105 shadow-2xs"
                    title="WhatsApp Inquiry"
                    aria-label={`WhatsApp Inquiry for ${p.name}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Categories Fallback Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {categoriesFallback.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group rounded-3xl overflow-hidden border border-slate-200/90 hover:border-brand-red/50 hover:shadow-xl transition-all duration-300 flex flex-col bg-white"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-2 flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain p-3 group-hover:scale-108 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <div className="p-3 text-center border-t border-slate-100 bg-white">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors line-clamp-1">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
