"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard, type ProductCardData } from "./ProductCard";
import { useSection } from "./SiteSectionsProvider";

interface ProductItem extends ProductCardData {
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
  onEnquireProduct?: (subject: string) => void;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({ onSelectCategory, onEnquireProduct }) => {
  const content = useSection("products");
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
              {content.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {content.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {content.subtitle}
            </p>
          </div>

          <Link
            href="/products"
            className="self-start md:self-auto bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-md transition-all flex items-center gap-2 group cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{content.buttonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Products Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-bold">
            Loading products...
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 8).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onEnquire={() => onEnquireProduct?.(`${p.name} (${p.category_name})`)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
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
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors">
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
