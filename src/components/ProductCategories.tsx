"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard, type ProductCardData } from "./ProductCard";
import { useSection } from "./SiteSectionsProvider";

interface ProductItem extends ProductCardData {
  featured_on_homepage?: boolean;
}

interface ProductCategoriesProps {
  onSelectCategory?: (category: string) => void;
  onEnquireProduct?: (subject: string) => void;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({ onEnquireProduct }) => {
  const content = useSection("products");
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Only fetch products explicitly flagged as featured_on_homepage
        const res = await fetch("/api/products?featured=true", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const flagged = json.data.filter((p: any) => p.featured_on_homepage === true);
            setFeaturedProducts(flagged.slice(0, 8));
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

  // While loading — render nothing
  if (loading) return null;

  // No products flagged as featured — hide entire section
  if (featuredProducts.length === 0) return null;

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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEnquire={() => onEnquireProduct?.(`${p.name} (${p.category_name})`)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
