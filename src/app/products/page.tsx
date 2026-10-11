"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  X,
  ChevronRight,
  Boxes,
  ThermometerSnowflake,
  ShieldCheck,
  Globe2,
  Package,
  ArrowRight,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { CATEGORIES, ALL_PRODUCTS, ProductItem } from "@/data/products";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [selectedStorage, setSelectedStorage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Modal State
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");

  // Sync with URL query parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryParam]);

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

  // Unique origins list
  const origins = useMemo(() => {
    const list = new Set(ALL_PRODUCTS.map((p) => p.origin));
    return ["all", ...Array.from(list)];
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // Search
      const matchesSearch =
        searchQuery.trim() === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;

      // Origin
      const matchesOrigin =
        selectedOrigin === "all" || product.origin === selectedOrigin;

      // Storage
      const matchesStorage =
        selectedStorage === "all" ||
        (selectedStorage === "ambient" && product.storageType === "Ambient") ||
        (selectedStorage === "chilled" && product.storageType.includes("Chilled")) ||
        (selectedStorage === "frozen" && product.storageType.includes("Frozen"));

      return matchesSearch && matchesCategory && matchesOrigin && matchesStorage;
    }).sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0; // Default recommended
    });
  }, [searchQuery, selectedCategory, selectedOrigin, selectedStorage, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedOrigin("all");
    setSelectedStorage("all");
    setSortBy("recommended");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/products");
    }
  };

  const handleOpenProductEnquiry = (product: ProductItem) => {
    setEnquirySubject(`${product.name} (${product.categoryName})`);
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

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Products Catalog</span>
        </div>
      </div>

      {/* Hero Category Header */}
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
              Browse our comprehensive portfolio of imported and locally manufactured food commodities across Saudi Arabia. Filter by category, storage temperature, or origin to find the exact specifications for your business.
            </p>
          </div>

          {/* Quick Category Pills Scroll */}
          <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pt-6 pb-2">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-brand-red text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Categories ({ALL_PRODUCTS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? "bg-brand-red text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog with Interactive Filters */}
      <section className="py-8 sm:py-12 w-full flex-1">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Left Filter Sidebar (3 cols) */}
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
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Filter 1: Search by Name */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  Search Products
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rice, beef, oil..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 outline-none transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter 2: Categories */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  Category
                </label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-red-50 text-brand-red font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[11px] text-slate-400">{ALL_PRODUCTS.length}</span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.slug
                          ? "bg-red-50 text-brand-red font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {ALL_PRODUCTS.filter((p) => p.categorySlug === cat.slug).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 3: Storage Type */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  Storage Condition
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: "all", label: "All Storage Types" },
                    { id: "ambient", label: "Ambient (Dry Storage)" },
                    { id: "chilled", label: "Chilled (+4°C Cold Chain)" },
                    { id: "frozen", label: "Deep Frozen (-18°C)" },
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      onClick={() => setSelectedStorage(temp.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        selectedStorage === temp.id
                          ? "bg-red-50 text-brand-red font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{temp.label}</span>
                      {selectedStorage === temp.id && (
                        <Check className="w-3.5 h-3.5 text-brand-red" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 4: Country of Origin */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  Origin
                </label>
                <div className="space-y-1">
                  {origins.map((orig) => (
                    <button
                      key={orig}
                      onClick={() => setSelectedOrigin(orig)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        selectedOrigin === orig
                          ? "bg-red-50 text-brand-red font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="capitalize">{orig === "all" ? "All Origins" : orig}</span>
                      {selectedOrigin === orig && (
                        <Check className="w-3.5 h-3.5 text-brand-red" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Product Grid Area (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* Top Controls Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">
                    Showing <span className="text-brand-red">{filteredProducts.length}</span> Products
                  </span>
                  {selectedCategory !== "all" && (
                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-semibold">
                      {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                    </span>
                  )}
                </div>

                {/* Mobile Filter Toggle Button & Sort */}
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-brand-red" />
                    <span>Filter ({activeFilterCount})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:border-brand-red"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Cards Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-brand-red/40 transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        {/* Image Header with Badges - Clickable */}
                        <Link
                          href={`/products/${product.categorySlug}/${product.id}`}
                          className="relative aspect-[4/3] bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden block"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-4 group-hover:scale-108 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />

                          {/* Top Origin Tag */}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-800 border border-slate-200/80 shadow-2xs">
                            {product.origin}
                          </div>

                          {/* Storage Tag */}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-brand-red border border-slate-200/80 shadow-2xs">
                            {product.storageType}
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="p-5 space-y-3">
                          <Link
                            href={`/products/${product.categorySlug}`}
                            className="text-xs font-black uppercase tracking-wider text-brand-red hover:underline block"
                          >
                            {product.categoryName}
                          </Link>

                          <Link
                            href={`/products/${product.categorySlug}/${product.id}`}
                            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-snug block"
                          >
                            {product.name}
                          </Link>

                          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed line-clamp-2">
                            {product.description}
                          </p>

                          {/* Specs Pills */}
                          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">MOQ:</span>
                              <span className="font-bold text-slate-800">{product.moq}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Packaging:</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[170px]">
                                {product.packaging}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Standard:</span>
                              <span className="font-semibold text-brand-green truncate">
                                {product.certification}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="p-5 pt-0 flex items-center gap-2.5">
                        <button
                          onClick={() => handleOpenProductEnquiry(product)}
                          className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
                        >
                          Enquire Now
                        </button>
                        <Link
                          href={`/products/${product.categorySlug}/${product.id}`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-full transition-colors"
                          title="View Full Product Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty Filter Results State */
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 text-brand-red flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Matching Food Products Found</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    We could not find products matching your selected search query and filter criteria. Try resetting your filters.
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

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs h-full p-6 flex flex-col justify-between overflow-y-auto ml-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-black text-slate-900 text-base">Filter Products</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Categories</label>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      handleCategorySelect("all");
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                      selectedCategory === "all" ? "bg-red-50 text-brand-red" : "text-slate-700"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        handleCategorySelect(c.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                        selectedCategory === c.slug ? "bg-red-50 text-brand-red" : "text-slate-700"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Storage */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Storage</label>
                <div className="space-y-1">
                  {[
                    { id: "all", label: "All Storage" },
                    { id: "ambient", label: "Ambient" },
                    { id: "chilled", label: "Chilled (+4°C)" },
                    { id: "frozen", label: "Frozen (-18°C)" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStorage(s.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                        selectedStorage === s.id ? "bg-red-50 text-brand-red" : "text-slate-700"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-full text-sm font-bold"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-brand-red text-white py-3 rounded-full text-sm font-bold shadow"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory={enquirySubject || "General Products Inquiry"}
      />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
