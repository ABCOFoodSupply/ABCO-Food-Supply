"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ThermometerSnowflake,
  Package,
  Sparkles,
  Award,
  Send,
  Share2,
  Check,
  Scale,
  Loader2,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useSection } from "@/components/SiteSectionsProvider";
import { phoneDigits } from "@/lib/siteSections";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { ProductCard } from "@/components/ProductCard";

// ─── Types ────────────────────────────────────────────────────────────────────
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
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const productId = params.productId as string;

  const contact = useSection("contact");
  const waNumber = phoneDigits(contact.whatsapp || contact.phone);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");

  // RFQ Form state
  const [rfqName, setRfqName] = useState("");
  const [rfqCompany, setRfqCompany] = useState("");
  const [rfqPhone, setRfqPhone] = useState("");
  const [rfqVolume, setRfqVolume] = useState("500 kg");
  const [rfqNotes, setRfqNotes] = useState("");
  const [isSubmittingRfq, setIsSubmittingRfq] = useState(false);

  // ── Fetch product from API ────────────────────────────────────────────────
  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        const allProducts: Product[] = json.data || [];

        const found = allProducts.find((p) => p.id === productId);
        if (!found) {
          setNotFound(true);
          return;
        }
        setProduct(found);

        // Related: same category, exclude current
        const related = allProducts
          .filter((p) => p.category_slug === found.category_slug && p.id !== found.id)
          .slice(0, 3);
        setRelatedProducts(related);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqName.trim() || !rfqPhone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setIsSubmittingRfq(true);
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "product_detail_page_rfq",
          clientName: rfqName,
          companyName: rfqCompany || "Independent Buyer",
          phone: rfqPhone,
          category: product?.category_name || "Food Supply",
          productName: product?.name || "",
          requestedVolume: rfqVolume,
          notes: rfqNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.success) {
        throw new Error(data.error || "Failed to submit request");
      }

      toast.success(`Quotation Request Submitted for ${product?.name}`, {
        description: `Ref #${data.data?.id || "AFS-RFQ"}. Our team will send formal pricing within 2 hours.`,
        duration: 5000,
      });

      setRfqName("");
      setRfqCompany("");
      setRfqPhone("");
      setRfqNotes("");
    } catch (err) {
      console.error(err);
      toast.error("Could not transmit quotation request. Please try again or WhatsApp us.");
    } finally {
      setIsSubmittingRfq(false);
    }
  };

  const handleShareProduct = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product Link Copied to Clipboard");
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound || !product) {
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
            className="bg-brand-red text-white px-6 py-2.5 rounded-full font-bold text-sm shadow hover:bg-red-700 transition-all"
          >
            Back to Products Catalog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Product quality points ────────────────────────────────────────────────
  const qualityPoints = [
    "100% SFDA & Saudi Import Regulations Compliant",
    "Strict Unbroken Cold Chain Logistics",
    "Comprehensive Microbiological & Laboratory Testing",
    "Full Traceability Batch Certification & Customs Clearance",
  ];

  const productApplications = [
    "Hotels, Banquets & Hospitality Facilities",
    "Commercial Institutional Catering Operations",
    "Hypermarkets, Supermarket Chains & Food Retailers",
    "Industrial Food Preparation & Central Kitchens",
  ];

  // ────────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50/70 flex flex-col">
      <Header
        onOpenEnquiry={() => {
          setEnquirySubject("");
          setIsEnquiryModalOpen(true);
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-brand-red transition-colors font-medium">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/products?category=${product.category_slug}`}
            className="hover:text-brand-red transition-colors font-medium"
          >
            {product.category_name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product Hero */}
      <section className="bg-white border-b border-slate-200/90 py-10 sm:py-14 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left: Image */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl bg-slate-50 border border-slate-200 p-6 flex items-center justify-center overflow-hidden shadow-xl group">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <Package className="w-24 h-24 text-slate-300" />
                )}

                {/* Storage Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-bold text-brand-red border border-slate-200 shadow-2xs flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>{product.storage_type}</span>
                </div>

                {/* Origin Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{product.origin}</span>
                </div>
              </div>

              <button
                onClick={handleShareProduct}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share Product Link</span>
              </button>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/products?category=${product.category_slug}`}
                    className="bg-red-50 text-brand-red text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                  >
                    {product.category_name}
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

              {/* Key B2B Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Minimum Order</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{product.moq}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Packaging</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5 break-words">{product.packaging}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Shelf Life</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{product.shelf_life}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Storage</span>
                  <p className="text-sm font-black text-brand-red mt-0.5 break-words">{product.storage_type}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => {
                    const el = document.getElementById("product-rfq-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-brand-red hover:bg-red-700 text-white px-8 py-3.5 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Wholesale Pricing</span>
                </button>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ABCO Food Supply, I would like to request wholesale pricing for ${product.name} (${product.category_name}).`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-full text-base font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12 sm:py-16 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Specs table */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  {/* <span className="text-xs font-black uppercase tracking-wider text-brand-red">TECHNICAL DATA</span> */}
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Product Specifications</h2>
                </div>
                <Scale className="w-6 h-6 text-brand-red" />
              </div>

              <div className="divide-y divide-slate-100 text-sm">
                {[
                  ["Product Name", product.name],
                  ["Category", product.category_name],
                  ["Country of Origin", product.origin],
                  ["Minimum Order Quantity (MOQ)", product.moq],
                  ["Packaging Format", product.packaging],
                  ["Shelf Life", product.shelf_life],
                  ["Storage Requirements", product.storage_type],
                  ["Regulatory Certification", product.certification],
                ].map(([label, value]) => (
                  <div key={label} className="py-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">{label}:</span>
                    <span className={`font-bold text-right ${label === "Storage Requirements" ? "text-brand-red" : label === "Regulatory Certification" ? "text-emerald-700" : "text-slate-900"}`}>
                      {value}
                    </span>
                  </div>
                ))}

                {/* Dynamic specs */}
                {product.specs && Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="py-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">{key}:</span>
                    <span className="font-bold text-slate-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Applications + Quality */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-red">COMMERCIAL APPLICABILITY</span>
                  <h3 className="text-lg font-bold text-slate-900">Target Sectors & Usage</h3>
                </div>
                <div className="space-y-2.5">
                  {productApplications.map((app, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-brand-red text-xs font-black uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>AFS ASSURANCE GUARANTEE</span>
                </div>
                <h3 className="text-lg font-black text-white">Compliance & Quality Protocol</h3>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {qualityPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2.5">
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

      {/* RFQ Form */}
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
                Submit your business details and required volume below. Our team will provide tiered pricing and delivery schedules.
              </p>
            </div>

            <form onSubmit={handleRfqSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Contact Person Name *</label>
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
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Company / Organization *</label>
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
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Mobile / WhatsApp *</label>
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
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Required Quantity *</label>
                  <select
                    value={rfqVolume}
                    onChange={(e) => setRfqVolume(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red outline-none"
                  >
                    <option>Minimum Order Quantity ({product.moq})</option>
                    <option>1 to 5 Metric Tons</option>
                    <option>5 to 20 Metric Tons</option>
                    <option>Full Container Load (FCL)</option>
                    <option>Recurring Monthly Supply</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Delivery Destination & Requirements</label>
                <textarea
                  rows={3}
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  placeholder="Specify destination city, packaging preferences, or delivery cadence..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-brand-red outline-none"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmittingRfq}
                  className="w-full sm:w-auto sm:min-w-[260px] bg-brand-red hover:bg-red-700 text-white px-10 py-3.5 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmittingRfq ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Request Quotation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200/80 w-full">
          <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">RELATED ITEMS</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">More from {product.category_name}</h3>
              </div>
              <Link
                href={`/products?category=${product.category_slug}`}
                className="text-xs sm:text-sm font-bold text-brand-red hover:underline flex items-center gap-1"
              >
                <span>View Full Category</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onEnquire={() => {
                    setEnquirySubject(`${rel.name} (${rel.category_name})`);
                    setIsEnquiryModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory={enquirySubject || `${product.name} (${product.category_name})`}
      />
    </main>
  );
}
