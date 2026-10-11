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
  CalendarCheck,
  Share2,
  Download,
  PhoneCall,
  Check,
  Building2,
  Info,
  Scale
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { CATEGORIES, ALL_PRODUCTS, ProductItem } from "@/data/products";

export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const productId = params.productId as string;

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // RFQ Form state
  const [rfqName, setRfqName] = useState("");
  const [rfqCompany, setRfqCompany] = useState("");
  const [rfqPhone, setRfqPhone] = useState("");
  const [rfqVolume, setRfqVolume] = useState("500 kg");
  const [rfqNotes, setRfqNotes] = useState("");
  const [isSubmittingRfq, setIsSubmittingRfq] = useState(false);

  // Find product by id or slug
  const product = ALL_PRODUCTS.find(
    (p) => p.id === productId || p.id === `prod-${productId}`
  );

  const category = CATEGORIES.find(
    (c) => c.slug === categorySlug || (product && c.slug === product.categorySlug)
  );

  if (!product || !category) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h1 className="text-3xl font-black text-slate-900">Product Not Found</h1>
          <p className="text-slate-600 max-w-md">
            The food item you requested is not available in our catalog.
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

  // Related products from the same category (excluding current)
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.categorySlug === category.slug && p.id !== product.id
  ).slice(0, 3);

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRfq(true);

    setTimeout(() => {
      setIsSubmittingRfq(false);
      const ticketId = Math.floor(100000 + Math.random() * 900000);
      toast.success(`Quotation Request Transmitted for ${product.name}`, {
        description: `Ref #AFS-PRD-${ticketId}. Commercial sales team will send pricing sheet within 2 hours.`,
      });
      setRfqName("");
      setRfqCompany("");
      setRfqPhone("");
      setRfqNotes("");
    }, 700);
  };

  const handleShareProduct = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product Link Copied to Clipboard");
    }
  };

  // Dynamic applications & features fallback
  const productApplications = [
    "Hotels, Banquets & Hospitality Facilities",
    "Commercial Institutional Catering Operations",
    "Hypermarkets, Supermarket Chains & Food Retailers",
    "Industrial Food Preparation & Central Kitchens",
  ];

  const qualityPoints = [
    "100% SFDA & Saudi Import Regulations Compliant",
    "Strict Unbroken Cold Chain Logistics (-18°C to +4°C as specified)",
    "Comprehensive Microbiological & Laboratory Testing",
    "Full Traceability Batch Certification & Customs Clearance",
  ];

  return (
    <main className="min-h-screen bg-slate-50/70 flex flex-col">
      <Header onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-brand-red transition-colors font-medium">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/products/${category.slug}`} className="hover:text-brand-red transition-colors font-medium">
            {category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Hero Showcase */}
      <section className="bg-white border-b border-slate-200/90 py-10 sm:py-14 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left 5 Cols: Product Image Display */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl bg-slate-50 border border-slate-200 p-6 flex items-center justify-center overflow-hidden shadow-xl group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 group-hover:scale-108 transition-transform duration-500"
                  priority
                />

                {/* Storage Condition Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-bold text-brand-red border border-slate-200 shadow-2xs flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>{product.storageType}</span>
                </div>

                {/* Country of Origin Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                  <span>Origin: {product.origin}</span>
                </div>
              </div>

              {/* Quick Action: Share Product */}
              <div className="pt-2">
                <button
                  onClick={handleShareProduct}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Share Product Link</span>
                </button>
              </div>
            </div>

            {/* Right 7 Cols: Detailed Product Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/products/${category.slug}`}
                    className="bg-red-50 text-brand-red text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                  >
                    {product.categoryName}
                  </Link>

                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{product.certification}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed text-justify">
                {product.description}
              </p>

              {/* Key B2B Procurement Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Minimum Order
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{product.moq}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Packaging
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-0.5 truncate">{product.packaging}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Shelf Life
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{product.shelfLife}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Storage
                  </span>
                  <p className="text-sm font-black text-brand-red mt-0.5 truncate">{product.storageType}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => {
                    const el = document.getElementById("product-rfq-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3.5 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Wholesale Pricing</span>
                </button>

                <a
                  href={`https://wa.me/966501234567?text=Hello%20ABCO%20Food%20Supply,%20I%20would%20like%20to%20request%20pricing%20and%20availability%20for%20${encodeURIComponent(product.name)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-full text-base font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Instant WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Technical Specifications Grid */}
      <section className="py-12 sm:py-16 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Complete Specs Table */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-red">
                    LABORATORY & TECHNICAL DATA
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Product Specifications
                  </h2>
                </div>
                <Scale className="w-6 h-6 text-brand-red" />
              </div>

              <div className="divide-y divide-slate-100 text-sm">
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Product Name:</span>
                  <span className="font-bold text-slate-900 text-right">{product.name}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Category:</span>
                  <span className="font-bold text-slate-900 text-right">{product.categoryName}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Country of Origin:</span>
                  <span className="font-bold text-slate-900 text-right">{product.origin}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Minimum Order Quantity (MOQ):</span>
                  <span className="font-bold text-slate-900 text-right">{product.moq}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Packaging Format:</span>
                  <span className="font-bold text-slate-900 text-right">{product.packaging}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Shelf Life:</span>
                  <span className="font-bold text-slate-900 text-right">{product.shelfLife}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Storage Requirements:</span>
                  <span className="font-bold text-brand-red text-right">{product.storageType}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Regulatory Certification:</span>
                  <span className="font-bold text-brand-green text-right">{product.certification}</span>
                </div>

                {/* Specific technical parameters */}
                {Object.entries(product.specs).map(([specKey, specVal]) => (
                  <div key={specKey} className="py-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">{specKey}:</span>
                    <span className="font-bold text-slate-900 text-right">{specVal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Applications & Quality Guarantees */}
            <div className="lg:col-span-5 space-y-6">
              {/* Institutional Applications Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-red">
                    COMMERCIAL APPLICABILITY
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Target Sectors & Usage
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {productApplications.map((app, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                      <span className="font-medium">{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality & Food Safety Assurance Card */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-brand-red text-xs font-black uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>ABCO ASSURANCE GUARANTEE</span>
                </div>

                <h3 className="text-lg font-black text-white">
                  Compliance & Quality Protocol
                </h3>

                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {qualityPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specific RFQ Quotation Form for this Product */}
      <section id="product-rfq-section" className="py-12 sm:py-16 bg-white border-t border-slate-200/90 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 bg-red-100 text-brand-red px-3 py-1 rounded-full text-xs font-black uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WHOLESALE ORDER REQUISITION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Request Contract Pricing for {product.name}
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Submit your business details and required volume below. Our Jubail institutional food sales desk will provide tiered pricing and delivery schedules.
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
                    placeholder="e.g. Mohammed Al-Qahtani"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqCompany}
                    onChange={(e) => setRfqCompany(e.target.value)}
                    placeholder="e.g. Saudi Hospitality Corp"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Mobile / WhatsApp (+966) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={rfqPhone}
                    onChange={(e) => setRfqPhone(e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Required Quantity / Volume *
                  </label>
                  <select
                    value={rfqVolume}
                    onChange={(e) => setRfqVolume(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red outline-none"
                  >
                    <option>Minimum Order Quantity ({product.moq})</option>
                    <option>1 to 5 Metric Tons</option>
                    <option>5 to 20 Metric Tons</option>
                    <option>Full Container Load (FCL - 20ft / 40ft)</option>
                    <option>Recurring Scheduled Monthly Supply</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Delivery Destination & Specific Requirements
                </label>
                <textarea
                  rows={3}
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  placeholder="Specify destination city (Jubail, Dammam, Riyadh, Jeddah), packaging preferences, or delivery cadence..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRfq}
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-4 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmittingRfq ? (
                  <span>Submitting Product Requisition...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Request Quotation for {product.name}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products in this Category */}
      {relatedProducts.length > 0 && (
        <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200/80 w-full">
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
                  RELATED ITEMS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  More from {category.name}
                </h3>
              </div>
              <Link
                href={`/products/${category.slug}`}
                className="text-xs sm:text-sm font-bold text-brand-red hover:underline flex items-center gap-1"
              >
                <span>View Full Category</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${category.slug}/${rel.id}`}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-brand-red/40 hover:shadow-lg transition-all p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] bg-slate-50 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
                      <Image
                        src={rel.image}
                        alt={rel.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-red transition-colors line-clamp-1">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{rel.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 mt-3 font-medium">
                    <span>MOQ: {rel.moq}</span>
                    <span className="text-brand-red font-bold flex items-center gap-1">
                      View Specs
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory={`${product.name} (${category.name})`}
      />
    </main>
  );
}
