"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Boxes,
  Truck,
  ArrowRight,
  ThermometerSnowflake,
  Package,
  Clock,
  Sparkles,
  Layers,
  Award,
  Send,
  MessageCircle,
  FileCheck2,
  CalendarCheck
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { CATEGORIES, ALL_PRODUCTS, ProductItem } from "@/data/products";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<string>("");

  // Category RFQ Form state
  const [rfqName, setRfqName] = useState("");
  const [rfqCompany, setRfqCompany] = useState("");
  const [rfqPhone, setRfqPhone] = useState("");
  const [rfqQuantity, setRfqQuantity] = useState("");
  const [rfqMessage, setRfqMessage] = useState("");
  const [isSubmittingRfq, setIsSubmittingRfq] = useState(false);

  // Find category data
  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  // If category does not match, return 404
  if (!category) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h1 className="text-3xl font-black text-slate-900">Category Not Found</h1>
          <p className="text-slate-600 max-w-md">
            The food category you requested does not exist in our catalog.
          </p>
          <Link
            href="/products"
            className="bg-brand-red text-white px-6 py-2.5 rounded-full font-bold text-sm shadow hover:bg-brand-red-dark transition-all"
          >
            Back to Products Catalog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Filter products belonging to this category
  const categoryProducts = ALL_PRODUCTS.filter(
    (p) => p.categorySlug === category.slug
  );

  // Related other categories
  const otherCategories = CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 4);

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRfq(true);

    setTimeout(() => {
      setIsSubmittingRfq(false);
      toast.success(`Quotation Request Received for ${category.name}`, {
        description: `Ref #AFS-${Math.floor(100000 + Math.random() * 900000)}. Our Jubail sales desk will contact you within 2 business hours.`,
      });
      setRfqName("");
      setRfqCompany("");
      setRfqPhone("");
      setRfqQuantity("");
      setRfqMessage("");
    }, 700);
  };

  const handleOpenProductEnquiry = (productName: string) => {
    setSelectedProductForModal(`${productName} (${category.name})`);
    setIsEnquiryModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50/70 flex flex-col">
      <Header onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-brand-red transition-colors font-medium">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{category.name}</span>
        </div>
      </div>

      {/* Category Hero Banner */}
      <section className="bg-white border-b border-slate-200/90 py-10 sm:py-16 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl bg-slate-50 p-6 flex items-center justify-center border border-slate-200 shadow-xl overflow-hidden group">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain p-6 group-hover:scale-108 transition-transform duration-500"
                  priority
                />

                {/* Storage Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-800 border border-slate-200 shadow-xs flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-brand-red" />
                  <span>{category.storageTemp}</span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="bg-brand-red text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    CATEGORY OVERVIEW
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {category.skuCount}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {category.name} Supply in Saudi Arabia
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed text-justify">
                {category.fullDesc}
              </p>

              {/* Certifications Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {category.certifications.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-bold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>

              {/* Key Highlights list */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                {category.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => {
                    const el = document.getElementById("category-rfq");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-brand-red hover:bg-brand-red-dark text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Request Category Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Varieties in This Category */}
      <section className="py-12 sm:py-16 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 space-y-8">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              SPECIFIC VARIETIES & CUTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured {category.name} Specifications
            </h2>
            <p className="text-sm text-slate-600">
              Commercial-grade packaging, strict quality inspection, and bulk pallet distribution.
            </p>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-red/40 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual box - clickable */}
                    <Link
                      href={`/products/${category.slug}/${product.id}`}
                      className="relative aspect-[16/10] bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100 block overflow-hidden"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-3 group-hover:scale-108 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />

                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 border border-slate-200">
                        {product.origin}
                      </div>

                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-brand-red border border-slate-200">
                        {product.storageType}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="p-6 space-y-3">
                      <Link
                        href={`/products/${category.slug}/${product.id}`}
                        className="text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-snug block"
                      >
                        {product.name}
                      </Link>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {product.description}
                      </p>

                      {/* Technical Specs Table */}
                      <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Minimum Order:</span>
                          <span className="font-bold text-slate-900">{product.moq}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Packaging:</span>
                          <span className="font-semibold text-slate-800">{product.packaging}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Shelf Life:</span>
                          <span className="font-semibold text-slate-800">{product.shelfLife}</span>
                        </div>
                        {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-slate-400">{key}:</span>
                            <span className="font-semibold text-slate-800">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Buttons Row */}
                  <div className="p-6 pt-0 grid grid-cols-2 gap-2.5">
                    <Link
                      href={`/products/${category.slug}/${product.id}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-full text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <span>View Full Info</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleOpenProductEnquiry(product.name)}
                      className="bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-full text-xs font-bold shadow-xs hover:shadow-md transition-all text-center cursor-pointer"
                    >
                      Instant Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <Boxes className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-base text-slate-600 font-semibold">
                Multiple unlisted institutional cuts and custom bulk packaging are available on request for this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Quotation Form for this Category */}
      <section id="category-rfq" className="py-12 sm:py-16 bg-white border-t border-slate-200/90 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 bg-red-100 text-brand-red px-3 py-1 rounded-full text-xs font-black uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INSTANT QUOTATION REQUEST</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Get Wholesale Pricing for {category.name}
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Fill out the form below to receive customized volume tiers, delivery schedules, and SFDA specification sheets from our sales team.
              </p>
            </div>

            <form onSubmit={handleRfqSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqName}
                    onChange={(e) => setRfqName(e.target.value)}
                    placeholder="e.g. Mohammed Al-Otaibi"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Company / Establishment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqCompany}
                    onChange={(e) => setRfqCompany(e.target.value)}
                    placeholder="e.g. Al-Tamimi Catering / Lulu Outlets"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={rfqPhone}
                    onChange={(e) => setRfqPhone(e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Estimated Monthly Volume / Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(e.target.value)}
                    placeholder="e.g. 5 Metric Tons / 200 Cartons per week"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Specific Requirements / Delivery City
                </label>
                <textarea
                  rows={3}
                  value={rfqMessage}
                  onChange={(e) => setRfqMessage(e.target.value)}
                  placeholder="Specify destination (Jubail, Dammam, Riyadh), cut preferences, or packaging sizes..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRfq}
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-4 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmittingRfq ? (
                  <span>Transmitting Request to Jubail Desk...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Request for Quotation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Browse Other Categories */}
      <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200/80 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Other Food Supply Categories
            </h3>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-brand-red hover:underline flex items-center gap-1"
            >
              <span>View All 12 Categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={`/products?category=${other.slug}`}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand-red/40 hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div className="relative w-20 h-20 mb-2">
                  <Image
                    src={other.image}
                    alt={other.name}
                    fill
                    className="object-contain p-1 group-hover:scale-108 transition-transform"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors">
                  {other.name}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {other.skuCount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory={selectedProductForModal || category.name}
      />
    </main>
  );
}
