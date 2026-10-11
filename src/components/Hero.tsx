"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  Clock,
  BadgePercent,
  ArrowRight,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { Vision2030Badge } from "./Vision2030Badge";

interface HeroProps {
  onOpenEnquiry?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onSelectCategory }) => {
  const heroFeatures = [
    {
      title: "Wide Product",
      subtitle: "Range",
      icon: Package,
    },
    {
      title: "Reliable",
      subtitle: "Supply Chain",
      icon: Truck,
    },
    {
      title: "Timely",
      subtitle: "Delivery",
      icon: Clock,
    },
    {
      title: "Competitive",
      subtitle: "Pricing",
      icon: BadgePercent,
    },
  ];

  // 9 Categories using authentic categories assets
  const categories = [
    {
      name: "Rice & Grains",
      slug: "rice-and-grains",
      image: "/categories/rice-and-grains.png",
    },
    {
      name: "Meat",
      slug: "meat",
      image: "/categories/meat.png",
    },
    {
      name: "Seafood",
      slug: "seafood",
      image: "/categories/seafood.png",
    },
    {
      name: "Poultry",
      slug: "poultry",
      image: "/categories/poultry.png",
    },
    {
      name: "Dairy",
      slug: "dairy",
      image: "/categories/dairy.png",
    },
    {
      name: "Edible Oils",
      slug: "edible-oils",
      image: "/categories/edible-oils.png",
    },
    {
      name: "Food Ingredients",
      slug: "food-ingredients",
      image: "/categories/food-ingredients.png",
    },
    {
      name: "Beverages",
      slug: "beverages",
      image: "/categories/beverages.png",
    },
    {
      name: "Fruits & Vegetables",
      slug: "fruits-and-vegetables",
      image: "/categories/fruits-and-vegetables.png",
    },
  ];

  const handleBuyProducts = () => {
    toast.success("Browsing ABCO Food Supply Catalog", {
      description: "Direct wholesale supply across the Kingdom of Saudi Arabia.",
    });
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryClick = (categoryName: string) => {
    toast.info(`Selected: ${categoryName}`, {
      description: "Showing available specifications and pricing.",
    });
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-white">
      {/* HERO BANNER - FULLY RESPONSIVE ACROSS MOBILE, TABLET & DESKTOP */}
      <div className="relative w-full min-h-[500px] md:min-h-[560px] lg:min-h-[620px] flex flex-col justify-between bg-white border-b border-slate-100">
        {/* Desktop / Tablet Background Image */}
        <div className="hidden md:block absolute inset-0 z-0">
          <Image
            src="/categories/hero.png"
            alt="ABCO Food Supply Supermarket Distribution"
            fill
            priority
            className="object-cover object-right lg:object-[85%_center]"
            sizes="100vw"
          />
        </div>

        {/* Vision 2030 Badge Top Right */}
        <div className="relative z-10 pt-4 px-4 md:hidden">
          <Vision2030Badge className="w-fit" />
        </div>
        <div className="hidden md:block absolute top-6 right-6 lg:right-16 z-10 drop-shadow-md">
          <Vision2030Badge />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 pt-4 sm:pt-8 md:pt-14">
          <div className="max-w-xl lg:max-w-2xl space-y-5 sm:space-y-6">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
              Your Trusted Partner for <br className="hidden sm:inline" />
              Quality <span className="text-brand-red">Food Supply</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
              Distributor of Imported & Locally Manufactured Food Products Across the Kingdom of Saudi Arabia.
            </p>

            {/* RESPONSIVE MOBILE IMAGE: Clearly visible on mobile & tablet */}
            <div className="block md:hidden relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-md border border-slate-200/90 my-5 bg-slate-50">
              <Image
                src="/categories/hero.png"
                alt="ABCO Food Supply Supermarket Distribution Operations"
                fill
                priority
                className="object-cover object-[80%_center]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* 4 Feature Badges with Red Outline Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl pt-1">
              {heroFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title + feat.subtitle}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-red-200/90 bg-white shadow-2xs hover:border-brand-red hover:shadow-xs transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50/80 border border-red-100 flex items-center justify-center shrink-0 group-hover:bg-brand-red transition-colors">
                      <Icon className="w-4.5 h-4.5 text-brand-red group-hover:text-white transition-colors" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {feat.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                        {feat.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 pb-10 sm:pb-16 md:pb-20">
              {/* Red Pill Button with Shopping Cart */}
              <button
                onClick={handleBuyProducts}
                className="bg-brand-red hover:bg-brand-red-dark text-white px-7 py-3.5 sm:py-4 rounded-full text-base font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Buy Any Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* White Pill Button with Clipboard/Enquire */}
              <button
                onClick={onOpenEnquiry}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-3.5 sm:py-4 rounded-full text-base font-bold tracking-wide shadow-sm hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ClipboardList className="w-5 h-5 text-slate-700" />
                <span>Enquire Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Space above categories */}
        <div className="h-4 sm:h-8" />
      </div>

      {/* HERO CATEGORIES SECTION (Smooth horizontal scroll on mobile, 9 columns on desktop) */}
      <div className="relative -mt-8 sm:-mt-12 md:-mt-16 z-20 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 pb-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/90 p-3 sm:p-5 overflow-hidden">
          <div className="flex lg:grid lg:grid-cols-9 gap-3 sm:gap-4 overflow-x-auto hide-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.slug}`}
                className="flex-shrink-0 w-32 sm:w-36 lg:w-auto group flex flex-col items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-brand-red/40 hover:bg-red-50/20 hover:shadow-md transition-all duration-200 cursor-pointer text-center bg-white"
              >
                {/* Large, clearly visible, unclipped food category image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mb-2.5 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50/90 border border-slate-200/80 p-2 shadow-2xs group-hover:scale-105 transition-all duration-300">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 640px) 112px, 120px"
                  />
                </div>

                {/* Clear Category Title Label */}
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors whitespace-nowrap leading-snug">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
