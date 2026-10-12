"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { ProductCard } from "@/components/ProductCard";

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
  const searchParam = searchParams.get("search") || searchParams.get("q");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [selectedStorage, setSelectedStorage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch Data ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        const prodJson = await prodRes.json();
        const catJson = await catRes.json();
        setProducts(prodJson.data || []);
        setCategories(catJson.data || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Sync URL param → category & search filters ─────────────────────────────
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [categoryParam, searchParam]);

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

  // Keep the selected pill centred in the strip (horizontal only, never scrolls the page)
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
    if (typeof window !== "undefined") {
      if (slug === "all") {
        window.history.pushState(null, "", "/products");
      } else {
        window.history.pushState(null, "", `/products?category=${slug}`);
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
          product.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || product.category_slug === selectedCategory;

        const matchesOrigin =
          selectedOrigin === "all" || product.origin === selectedOrigin;

        const matchesStorage =
          selectedStorage === "all" ||
          (selectedStorage === "ambient" && product.storage_type === "Ambient") ||
          (selectedStorage === "chilled" && product.storage_type.includes("Chilled")) ||
          (selectedStorage === "frozen" && product.storage_type.includes("Frozen"));

        return matchesSearch && matchesCategory && matchesOrigin && matchesStorage;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedOrigin, selectedStorage, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedOrigin, selectedStorage, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
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
    (selectedOrigin !== "all" ? 1 : 0) +
    (selectedStorage !== "all" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  return (
    <main className="min-h-screen bg-slate-50/70 flex flex-col">
      <Header onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Products Catalog</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200/90 py-10 sm:py-14 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              WHOLESALE B2B FOOD SUPPLY
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Product Catalog & Bulk Supply
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              Browse our comprehensive portfolio of imported and locally manufactured food commodities. Filter by category, storage temperature, or origin.
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
                  ? "bg-brand-red text-white shadow-md"
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
                className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? "bg-brand-red text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.name}
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
                    <span className="w-5 h-5 rounded-full bg-brand-red text-white text-[10px] flex items-center justify-center">
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

              {/* Storage Filter */}
              <div className="space-y-2">
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
              <div className="space-y-2">
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
                    placeholder="Search products, categories, origin..."
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
                      <span className="w-4 h-4 rounded-full bg-brand-red text-white text-[9px] flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <span className="text-xs text-slate-600 font-bold px-2 hidden sm:block">
                    <strong className="text-slate-900">{filteredProducts.length}</strong> products
                  </span>
                </div>
              </div>

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
                            // Show first, last, current, and adjacent pages
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
                    No products match your selected filters. Try resetting your search.
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

              {/* Mobile Storage Filter */}
              <div className="space-y-2">
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
