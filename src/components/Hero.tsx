"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { Vision2030Badge } from "./Vision2030Badge";
import { getHomePageCmsData, fetchHomePageCmsFromDb, DEFAULT_HOMEPAGE_CMS, HomePageCmsData } from "@/lib/cmsData";
import { useSection } from "./SiteSectionsProvider";
import { getIcon } from "@/lib/iconRegistry";

interface HeroProps {
  onOpenEnquiry?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onSelectCategory }) => {
  const [cmsData, setCmsData] = React.useState<HomePageCmsData>(DEFAULT_HOMEPAGE_CMS);
  // Hero images render only once cached or DB data is known, so the built-in default image never flashes first
  const [heroReady, setHeroReady] = React.useState(false);

  React.useEffect(() => {
    // 1. Initial cached load (getHomePageCmsData returns the DEFAULT object itself when nothing is cached)
    const cached = getHomePageCmsData();
    setCmsData(cached);
    if (cached !== DEFAULT_HOMEPAGE_CMS) setHeroReady(true);

    // 2. Background sync from Supabase DB for Hero & Partners
    fetchHomePageCmsFromDb().then((dbData) => {
      if (dbData) {
        setCmsData((prev) => ({
          ...prev,
          hero: dbData.hero,
          clientsPartners: dbData.clientsPartners,
        }));
      }
      setHeroReady(true);
    });

    // 3. Sync real categories directly from unified DB /api/categories
    fetch("/api/categories?homepage=true")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCmsData((prev) => ({
            ...prev,
            quickCategories: json.data.map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              image: c.image,
            })),
          }));
        }
      })
      .catch((err) => console.warn("Failed to load dynamic categories in Hero:", err));

    // 4. Real-time event listener for instant updates
    const handleCmsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<HomePageCmsData>;
      if (customEvent.detail) {
        setCmsData(customEvent.detail);
        setHeroReady(true);
      }
    };
    window.addEventListener("afs_cms_updated", handleCmsUpdate);
    return () => window.removeEventListener("afs_cms_updated", handleCmsUpdate);
  }, []);
  const heroFeatures = useSection("heroBadges").items;

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

  // Category strip: arrows enable only when there is more to scroll that way
  const catStripRef = React.useRef<HTMLDivElement>(null);
  const [catScroll, setCatScroll] = React.useState({ left: false, right: false });

  const updateCatArrows = React.useCallback(() => {
    const el = catStripRef.current;
    if (!el) return;
    setCatScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  React.useEffect(() => {
    updateCatArrows();
    window.addEventListener("resize", updateCatArrows);
    return () => window.removeEventListener("resize", updateCatArrows);
  }, [updateCatArrows, cmsData.quickCategories]);

  const scrollCats = (dir: -1 | 1) => {
    const el = catStripRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
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
          {heroReady && (
            <Image
              key={cmsData.hero.heroImage}
              src={cmsData.hero.heroImage || "/categories/hero.png"}
              alt="ABCO Food Supply Supermarket Distribution"
              fill
              priority
              className="object-cover object-right lg:object-[85%_center]"
              sizes="100vw"
            />
          )}
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
              {cmsData.hero.titleLine1} <br className="hidden sm:inline" />
              <span className="text-brand-red">{cmsData.hero.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
              {cmsData.hero.subtitle}
            </p>

            {/* RESPONSIVE MOBILE IMAGE: Clearly visible on mobile & tablet */}
            <div
              className={`block md:hidden relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-md border border-slate-200/90 my-5 bg-slate-100 ${
                heroReady ? "" : "animate-pulse"
              }`}
            >
              {heroReady && (
              <Image
                key={cmsData.hero.mobileHeroImage || cmsData.hero.heroImage}
                src={cmsData.hero.mobileHeroImage || cmsData.hero.heroImage || "/categories/hero.png"}
                alt="ABCO Food Supply Supermarket Distribution Operations"
                fill
                priority
                className={`object-cover ${
                  cmsData.hero.mobileHeroImage && cmsData.hero.mobileHeroImage !== cmsData.hero.heroImage
                    ? ""
                    : "object-[80%_center]"
                }`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              )}
            </div>

            {/* 4 Feature Badges - Fully Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl pt-1">
              {heroFeatures.map((feat, i) => {
                const Icon = getIcon(feat.icon);
                return (
                  <div
                    key={`${feat.value}-${i}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-red-200/90 bg-white shadow-2xs hover:border-brand-red hover:shadow-xs transition-all group min-w-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50/80 border border-red-100 flex items-center justify-center shrink-0 group-hover:bg-brand-red transition-colors">
                      <Icon className="w-4 h-4 text-brand-red group-hover:text-white transition-colors" />
                    </div>
                    <div className="leading-tight min-w-0">
                      <p className="text-xs sm:text-sm font-black text-slate-900 break-words">
                        {feat.value}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium break-words">
                        {feat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 pb-10 sm:pb-16 md:pb-20">
              {/* Button 1: Configured via CMS */}
              {cmsData.hero.button1Link?.startsWith("/") ? (
                <Link
                  href={cmsData.hero.button1Link}
                  className="bg-brand-red hover:bg-brand-red-dark text-white px-7 py-3.5 sm:py-4 rounded-full text-base font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{cmsData.hero.button1Text || "Buy Any Products"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={handleBuyProducts}
                  className="bg-brand-red hover:bg-brand-red-dark text-white px-7 py-3.5 sm:py-4 rounded-full text-base font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{cmsData.hero.button1Text || "Buy Any Products"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {/* Button 2: Configured via CMS */}
              {cmsData.hero.button2Link?.startsWith("/") ? (
                <Link
                  href={cmsData.hero.button2Link}
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-3.5 sm:py-4 rounded-full text-base font-bold tracking-wide shadow-sm hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ClipboardList className="w-5 h-5 text-slate-700" />
                  <span>{cmsData.hero.button2Text || "Enquire Now"}</span>
                </Link>
              ) : (
                <button
                  onClick={onOpenEnquiry}
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-3.5 sm:py-4 rounded-full text-base font-bold tracking-wide shadow-sm hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ClipboardList className="w-5 h-5 text-slate-700" />
                  <span>{cmsData.hero.button2Text || "Enquire Now"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Space above categories */}
        <div className="h-4 sm:h-8" />
      </div>

      {/* HERO CATEGORIES SECTION (Dynamic from DB) */}
      <div className="relative -mt-8 sm:-mt-12 md:-mt-16 z-20 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 pb-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/90 p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wider text-brand-red">Browse</p>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Shop by Category</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/products" className="hidden sm:inline-flex text-xs font-bold text-brand-red hover:underline mr-1">
                View All
              </Link>
              {([-1, 1] as const).map((dir) => {
                const enabled = dir === -1 ? catScroll.left : catScroll.right;
                const Icon = dir === -1 ? ChevronLeft : ChevronRight;
                return (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => scrollCats(dir)}
                    disabled={!enabled}
                    aria-label={dir === -1 ? "Previous categories" : "Next categories"}
                    className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-brand-red hover:border-brand-red disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-200 disabled:cursor-default flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strip */}
          <div className="relative">
            <div
              ref={catStripRef}
              onScroll={updateCatArrows}
              className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1"
            >
              {cmsData.quickCategories.map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group snap-start shrink-0 w-[30%] min-w-[100px] sm:w-32 lg:w-36 flex flex-col items-center text-center"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 group-hover:border-brand-red/50 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 30vw, 144px"
                    />
                  </div>
                  <span className="mt-2.5 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Edge fades */}
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent transition-opacity ${
                catScroll.left ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity ${
                catScroll.right ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
