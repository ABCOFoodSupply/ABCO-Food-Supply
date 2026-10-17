"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  X,
  ChevronRight,
  ThermometerSnowflake,
  ShieldCheck,
  Globe2,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { ProductCard } from "@/components/ProductCard";
import type { SubCategoryItem } from "@/data/subcategories";

// ─── Types (DB Schema) ────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  category_slug: string;
  category_name: string;
  image: string;
  origin: string;
  storage_type: string;
  moq: string;
  packaging: string;
  shelf_life: string;
  certification: string;
  description: string;
  specs: Record<string, string>;
  created_at?: string;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  show_on_homepage: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subCategoryParam = searchParams.get("subCategory");
  const searchParam = searchParams.get("search") || searchParams.get("q");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, SubCategoryItem[]>>({});
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [selectedStorage, setSelectedStorage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");

  // Pagination
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch Data ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes, subRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/subcategories"),
        ]);
        const prodJson = await prodRes.json();
        const catJson = await catRes.json();
        const subJson = await subRes.json();

        setProducts(prodJson.data || []);
        setCategories(catJson.data || []);
        if (subJson.success && subJson.data) {
          setSubcategoriesMap(subJson.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Sync URL param → category, subcategory & search filters ────────────────
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }

    if (subCategoryParam) {
      setSelectedSubCategory(subCategoryParam);
    } else {
      setSelectedSubCategory("all");
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [categoryParam, subCategoryParam, searchParam]);

  // Current category subcategories
  const currentSubcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    return subcategoriesMap[selectedCategory] || [];
  }, [selectedCategory, subcategoriesMap]);

  // ── Category pill strip: arrows show only when there is more to scroll ──
  const pillsRef = useRef<HTMLDivElement>(null);
  const [pillScroll, setPillScroll] = useState({ left: false, right: false });

  const updatePillArrows = useCallback(() => {
    const el = pillsRef.current;
    if (!el) return;
    setPillScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updatePillArrows();
    window.addEventListener("resize", updatePillArrows);
    return () => window.removeEventListener("resize", updatePillArrows);
  }, [updatePillArrows, categories]);

  // Keep the selected pill centred in the strip
  useEffect(() => {
    const el = pillsRef.current;
    const active = el?.querySelector<HTMLElement>('[data-active="true"]');
    if (!el || !active) return;
    el.scrollTo({ left: active.offsetLeft - el.clientWidth / 2 + active.offsetWidth / 2, behavior: "smooth" });
  }, [selectedCategory, categories]);

  const scrollPills = (dir: -1 | 1) => {
    const el = pillsRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedSubCategory("all");
    if (typeof window !== "undefined") {
      if (slug === "all") {
        window.history.pushState(null, "", "/products");
      } else {
        window.history.pushState(null, "", `/products?category=${slug}`);
      }
    }
  };

  const handleSubCategorySelect = (subSlug: string) => {
    setSelectedSubCategory(subSlug);
    if (typeof window !== "undefined") {
      if (subSlug === "all") {
        window.history.pushState(null, "", `/products?category=${selectedCategory}`);
      } else {
        window.history.pushState(
          null,
          "",
          `/products?category=${selectedCategory}&subCategory=${subSlug}`
        );
      }
    }
  };

  // ── Unique origins ────────────────────────────────────────────────────────
  const origins = useMemo(() => {
    const list = new Set(products.map((p) => p.origin));
    return ["all", ...Array.from(list)];
  }, [products]);

  // ── Filtered & Sorted Products ────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.specs &&
            Object.values(product.specs).some((val) =>
              String(val).toLowerCase().includes(searchQuery.toLowerCase())
            ));

        const matchesCategory =
          selectedCategory === "all" || product.category_slug === selectedCategory;

        // Subcategory match — checks specs slug, specs name, or variety name match
        let matchesSubCategory = true;
        if (selectedCategory !== "all" && selectedSubCategory !== "all") {
          const targetSub = currentSubcategories.find((s) => s.slug === selectedSubCategory);
          const subName = targetSub?.name?.toLowerCase() || selectedSubCategory.replace(/-/g, " ");

          const productSubName = ((product.specs?.["Sub Category"]) || "").toLowerCase();
          const productSubSlug = ((product.specs?.["Sub-Category Slug"]) || "").toLowerCase();
          const nameLower = product.name.toLowerCase();
          const descLower = (product.description || "").toLowerCase();

          // Primary: direct slug/name match in specs
          // Secondary: product name or description mentions the subcategory
          // Tertiary: any of the subcategory's variety names appear in product name
          matchesSubCategory =
            productSubSlug === selectedSubCategory ||
            productSubName === subName ||
            nameLower.includes(subName) ||
            descLower.includes(subName) ||
            (targetSub?.varieties &&
              targetSub.varieties.some((v) =>
                nameLower.includes(v.toLowerCase().split("(")[0].trim())
              )) ||
            false;
        }

        const matchesOrigin =
          selectedOrigin === "all" || (product.origin || "") === selectedOrigin;

        const matchesStorage =
          selectedStorage === "all" ||
          (selectedStorage === "ambient" && (product.storage_type || "") === "Ambient") ||
          (selectedStorage === "chilled" && (product.storage_type || "").includes("Chilled")) ||
          (selectedStorage === "frozen" && (product.storage_type || "").includes("Frozen"));

        return matchesSearch && matchesCategory && matchesSubCategory && matchesOrigin && matchesStorage;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSubCategory,
    currentSubcategories,
    selectedOrigin,
    selectedStorage,
    sortBy,
  ]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory, selectedOrigin, selectedStorage, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setSelectedOrigin("all");
    setSelectedStorage("all");
    setSortBy("recommended");
    setCurrentPage(1);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/products");
    }
  };

  const handleOpenProductEnquiry = (product: Product) => {
    setEnquirySubject(`${product.name} (${product.category_name})`);
    setIsEnquiryModalOpen(true);
  };

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSubCategory !== "all" ? 1 : 0) +
    (selectedOrigin !== "all" ? 1 : 0) +
    (selectedStorage !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const selectedCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <main className="min-h-screen bg-slate-50/70 flex flex-col">
      <Header onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href="/products"
            onClick={() => handleCategorySelect("all")}
            className={`transition-colors font-medium ${selectedCategory === "all" ? "text-slate-900 font-bold" : "hover:text-brand-red"}`}
          >
            Products Catalog
          </Link>
          {selectedCategory !== "all" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => handleSubCategorySelect("all")}
                className={`transition-colors font-medium ${selectedSubCategory === "all" ? "text-slate-900 font-bold" : "hover:text-brand-red text-slate-500"}`}
              >
                {selectedCategoryObj?.name || selectedCategory}
              </button>
            </>
          )}
          {selectedSubCategory !== "all" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">
                {currentSubcategories.find((s) => s.slug === selectedSubCategory)?.name || selectedSubCategory}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200/90 py-8 sm:py-12 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl space-y-2.5">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-red" />
              WHOLESALE B2B FOOD SUPPLY
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {selectedCategory === "all"
                ? "Product Catalog & Bulk Supply"
                : `${selectedCategoryObj?.name || "Category"} Wholesale Supply`}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed">
              {selectedCategory === "all"
                ? "Browse our comprehensive portfolio of imported and locally manufactured food commodities. Select a category below to explore its subcategories and specialized varieties."
                : selectedCategoryObj?.description ||
                  `Explore premium grades, packaging formats, and customized bulk orders for ${selectedCategoryObj?.name}.`}
            </p>
          </div>

          {/* Category Pills (scrollable strip with arrows) */}
          <div className="relative mt-6">
            <div
              ref={pillsRef}
              onScroll={updatePillArrows}
              className="relative flex items-center gap-2.5 overflow-x-auto hide-scrollbar py-2"
            >
              <button
                data-active={selectedCategory === "all"}
                onClick={() => handleCategorySelect("all")}
                className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-brand-red text-white shadow-md shadow-brand-red/25"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  data-active={selectedCategory === cat.slug}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCategory === cat.slug
                      ? "bg-brand-red text-white shadow-md shadow-brand-red/25"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{cat.name}</span>
                  {subcategoriesMap[cat.slug]?.length ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        selectedCategory === cat.slug
                          ? "bg-white/25 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {subcategoriesMap[cat.slug].length} sub
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            {/* Edge fades */}
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent transition-opacity duration-200 ${
                pillScroll.left ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent transition-opacity duration-200 ${
                pillScroll.right ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Arrows */}
            <button
              type="button"
              onClick={() => scrollPills(-1)}
              aria-label="Scroll categories left"
              tabIndex={pillScroll.left ? 0 : -1}
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:text-brand-red hover:border-brand-red/40 flex items-center justify-center transition-all cursor-pointer ${
                pillScroll.left ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollPills(1)}
              aria-label="Scroll categories right"
              tabIndex={pillScroll.right ? 0 : -1}
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:text-brand-red hover:border-brand-red/40 flex items-center justify-center transition-all cursor-pointer ${
                pillScroll.right ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* ── Subcategories Buttons Bar: Basmati & Non-Basmati ── */}
          {selectedCategory !== "all" && currentSubcategories.length > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                {selectedCategoryObj?.name} Types:
              </span>
              <button
                onClick={() => handleSubCategorySelect("all")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedSubCategory === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All {selectedCategoryObj?.name}
              </button>
              {currentSubcategories.map((sub) => {
                const isSelected = selectedSubCategory === sub.slug;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubCategorySelect(isSelected ? "all" : sub.slug)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-brand-red text-white shadow-md shadow-brand-red/25 ring-2 ring-brand-red/20"
                        : "bg-white border border-slate-200 text-slate-800 hover:border-brand-red/50 hover:text-brand-red shadow-2xs"
                    }`}
                  >
                    <span>{sub.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog */}
      <section className="py-8 sm:py-12 w-full flex-1">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                  <SlidersHorizontal className="w-5 h-5 text-brand-red" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-red text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-brand-red hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">Category</label>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === "all" ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        selectedCategory === cat.slug ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] ${selectedCategory === cat.slug ? "text-white/80" : "text-slate-400"}`}>
                        {products.filter((p) => p.category_slug === cat.slug).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter (If active category has subcategories) */}
              {selectedCategory !== "all" && currentSubcategories.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-red block">
                    Sub-Category
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleSubCategorySelect("all")}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSubCategory === "all"
                          ? "bg-brand-red text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      All {selectedCategoryObj?.name}
                    </button>
                    {currentSubcategories.map((sub) => (
                      <button
                        key={sub.slug}
                        onClick={() => handleSubCategorySelect(sub.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          selectedSubCategory === sub.slug
                            ? "bg-brand-red text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{sub.name}</span>
                        {selectedSubCategory === sub.slug && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">Storage Condition</label>
                <div className="space-y-1">
                  {[
                    { val: "all", label: "All Storage Types" },
                    { val: "ambient", label: "Ambient (Dry)" },
                    { val: "chilled", label: "Chilled (+4°C)" },
                    { val: "frozen", label: "Frozen (-18°C)" },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setSelectedStorage(val)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        selectedStorage === val ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <ThermometerSnowflake className="w-3.5 h-3.5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Origin Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">Country of Origin</label>
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red font-bold"
                >
                  {origins.map((o) => (
                    <option key={o} value={o}>{o === "all" ? "All Countries" : o}</option>
                  ))}
                </select>
              </div>
            </aside>

            {/* Products Area */}
            <div className="lg:col-span-9 space-y-5">
              {/* Search + Sort + Mobile filter trigger */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products, varieties (1121, Sella, IR64...), origin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red font-bold"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                  </select>

                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-brand-red text-white text-[9px] flex items-center justify-center font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <span className="text-xs text-slate-600 font-bold px-2 hidden sm:block">
                    <strong className="text-slate-900">{filteredProducts.length}</strong> products
                  </span>
                </div>
              </div>

              {/* Active Filter Pills Bar */}
              {(selectedSubCategory !== "all" || selectedOrigin !== "all" || selectedStorage !== "all" || searchQuery) && (
                <div className="flex items-center gap-2 flex-wrap text-xs bg-slate-100/70 p-2.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Active:</span>

                  {selectedSubCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold">
                      Sub: {currentSubcategories.find((s) => s.slug === selectedSubCategory)?.name || selectedSubCategory}
                      <button onClick={() => handleSubCategorySelect("all")} className="hover:opacity-80">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedOrigin !== "all" && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 px-3 py-1 rounded-full text-xs font-bold">
                      Origin: {selectedOrigin}
                      <button onClick={() => setSelectedOrigin("all")} className="hover:opacity-80">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedStorage !== "all" && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 px-3 py-1 rounded-full text-xs font-bold">
                      Storage: {selectedStorage}
                      <button onClick={() => setSelectedStorage("all")} className="hover:opacity-80">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 px-3 py-1 rounded-full text-xs font-bold">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="hover:opacity-80">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleResetFilters}
                    className="ml-auto text-xs font-bold text-brand-red hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Loading state */}
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEnquire={() => handleOpenProductEnquiry(product)}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80">
                      <p className="text-xs sm:text-sm text-slate-500 font-medium order-2 sm:order-1">
                        Showing{" "}
                        <span className="font-bold text-slate-900">
                          {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-bold text-slate-900">
                          {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-slate-900">
                          {filteredProducts.length}
                        </span>{" "}
                        products
                      </p>

                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        <button
                          onClick={() => {
                            setCurrentPage((p) => Math.max(1, p - 1));
                            window.scrollTo({ top: 300, behavior: "smooth" });
                          }}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all cursor-pointer"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">Prev</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            return (
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1
                            );
                          })
                          .reduce<(number | string)[]>((acc, page, idx, arr) => {
                            if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                              acc.push("...");
                            }
                            acc.push(page);
                            return acc;
                          }, [])
                          .map((item, idx) => {
                            if (item === "...") {
                              return (
                                <span
                                  key={`ellipsis-${idx}`}
                                  className="px-2 py-1 text-slate-400 text-xs font-bold"
                                >
                                  ...
                                </span>
                              );
                            }
                            const pageNum = item as number;
                            const isActive = pageNum === currentPage;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => {
                                  setCurrentPage(pageNum);
                                  window.scrollTo({ top: 300, behavior: "smooth" });
                                }}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isActive
                                    ? "bg-brand-red text-white shadow-md shadow-brand-red/25"
                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                        <button
                          onClick={() => {
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 300, behavior: "smooth" });
                          }}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all cursor-pointer"
                          aria-label="Next page"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 text-brand-red flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Products Found</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    {selectedSubCategory !== "all"
                      ? `No products found under "${currentSubcategories.find((s) => s.slug === selectedSubCategory)?.name || selectedSubCategory}". Try selecting another subcategory or resetting filters.`
                      : "No products match your selected filters. Try resetting your search."}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-brand-red text-white px-6 py-2.5 rounded-full text-sm font-bold shadow transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs lg:hidden">
          <div className="bg-white w-full max-w-xs h-full p-6 flex flex-col justify-between overflow-y-auto ml-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-black text-slate-900 text-base">Filter Products</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Categories</label>
                <div className="space-y-1">
                  <button
                    onClick={() => { handleCategorySelect("all"); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${selectedCategory === "all" ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => { handleCategorySelect(cat.slug); setIsMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${selectedCategory === cat.slug ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Subcategories (if any) */}
              {selectedCategory !== "all" && currentSubcategories.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-red">
                    Sub-Categories
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => { handleSubCategorySelect("all"); setIsMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${selectedSubCategory === "all" ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"}`}
                    >
                      All Sub-Categories
                    </button>
                    {currentSubcategories.map((sub) => (
                      <button
                        key={sub.slug}
                        onClick={() => { handleSubCategorySelect(sub.slug); setIsMobileFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${selectedSubCategory === sub.slug ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"}`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Storage Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Storage</label>
                <div className="space-y-1">
                  {[
                    { val: "all", label: "All Storage Types" },
                    { val: "ambient", label: "Ambient" },
                    { val: "chilled", label: "Chilled (+4°C)" },
                    { val: "frozen", label: "Frozen (-18°C)" },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setSelectedStorage(val)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${selectedStorage === val ? "bg-brand-red text-white" : "text-slate-700 hover:bg-slate-100"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => { handleResetFilters(); setIsMobileFilterOpen(false); }}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-200"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory={enquirySubject}
      />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
