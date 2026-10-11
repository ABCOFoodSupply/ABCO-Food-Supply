"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Warehouse,
  Truck,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Building2,
  CheckCircle2
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";

interface GalleryItem {
  id: string;
  title: string;
  category: "warehouse" | "fleet" | "quality" | "products" | "network";
  categoryLabel: string;
  image: string;
  caption: string;
  location: string;
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const galleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      title: "Jubail Logistics Hub & Fleet Staging",
      category: "warehouse",
      categoryLabel: "Warehousing & Facilities",
      image: "/categories/about-us.png",
      caption: "Our central Jubail warehousing complex featuring multi-temperature loading docks and dedicated refrigerated delivery fleet staging area.",
      location: "Jubail Industrial City, KSA"
    },
    {
      id: "gal-2",
      title: "Saudi Supermarket Food Distribution",
      category: "network",
      categoryLabel: "Retail & Client Network",
      image: "/categories/hero.png",
      caption: "Direct supply and shelf fulfillment of dry goods, edible oils, grains, and beverages to premier hypermarkets across the Kingdom.",
      location: "Eastern Province & Riyadh"
    },
    {
      id: "gal-3",
      title: "Fresh Wholesale Food Assortment",
      category: "products",
      categoryLabel: "Wholesale Products",
      image: "/categories/mix-product.png",
      caption: "Fresh produce, canned condiments, halal poultry, and kitchen staples prepared for commercial catering shipments.",
      location: "Central Distribution Center"
    },
    {
      id: "gal-4",
      title: "Premium Aged Basmati & Grains Reserve",
      category: "products",
      categoryLabel: "Wholesale Products",
      image: "/categories/rice-and-grains.png",
      caption: "Climate-controlled palletized bulk storage of aged 1121 XXL Basmati and parboiled Sella rice in multi-wall non-woven bags.",
      location: "Dry Goods Facility"
    },
    {
      id: "gal-5",
      title: "Certified Halal Butcher Cuts Inspection",
      category: "quality",
      categoryLabel: "Quality & Inspection",
      image: "/categories/meat.png",
      caption: "SFDA veterinary tag inspection and vacuum-seal verification on imported chilled ribeye and striploin beef cuts.",
      location: "Chilled Inspection Bay (+2°C)"
    },
    {
      id: "gal-6",
      title: "Ocean Fresh Seafood Handling on Ice",
      category: "quality",
      categoryLabel: "Quality & Inspection",
      image: "/categories/seafood.png",
      caption: "Daily catch sorting, iced presentation, and IQF quick-freeze compliance for black tiger prawns, kingfish, and salmon fillets.",
      location: "Fishery Processing Dock"
    },
    {
      id: "gal-7",
      title: "Multi-Zone Refrigerated Delivery Fleet",
      category: "fleet",
      categoryLabel: "Fleet & Logistics",
      image: "/categories/about-us.png",
      caption: "Heavy-duty and medium commercial reefer trucks equipped with Carrier refrigeration units and real-time GPS telemetry.",
      location: "King Fahd Highway Route"
    },
    {
      id: "gal-8",
      title: "Halal Grade-A Poultry Quarantine",
      category: "quality",
      categoryLabel: "Quality & Inspection",
      image: "/categories/poultry.png",
      caption: "Strict temperature verification and microbiological testing of chilled whole chickens and calibrated breast fillets.",
      location: "Cold Storage Unit (-18°C / +4°C)"
    },
    {
      id: "gal-9",
      title: "Commercial Dairy & Cheese Storage",
      category: "warehouse",
      categoryLabel: "Warehousing & Facilities",
      image: "/categories/dairy.png",
      caption: "High-density racking storage for pure European creamery butter blocks, pizza mozzarella, and long-life UHT milk cartons.",
      location: "Chilled Dairy Zone (+4°C)"
    },
    {
      id: "gal-10",
      title: "Industrial Cooking Oil Depository",
      category: "products",
      categoryLabel: "Wholesale Products",
      image: "/categories/edible-oils.png",
      caption: "18-Liter foodservice tins and 1.5L retail bottles of refined sunflower oil, corn oil, and Saudi extra virgin olive oil.",
      location: "Ambient Oils Warehouse"
    },
    {
      id: "gal-11",
      title: "Culinary Spices & Food Ingredients Vault",
      category: "products",
      categoryLabel: "Wholesale Products",
      image: "/categories/food-ingredients.png",
      caption: "Aromatic storage of whole cardamom, Saudi Kabsa spice blends, turmeric, and high-Brix canned tomato paste concentrates.",
      location: "Dry Ingredients Storage"
    },
    {
      id: "gal-12",
      title: "Farm-Fresh Produce Morning Intake",
      category: "network",
      categoryLabel: "Retail & Client Network",
      image: "/categories/fruits-and-vegetables.png",
      caption: "Daily dawn arrivals of hydroponic greenhouse tomatoes, onions, and citrus fruits ready for immediate HORECA dispatch.",
      location: "Eastern Province Produce Cross-Dock"
    }
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(
      selectedItemIndex === 0 ? filteredItems.length - 1 : selectedItemIndex - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(
      selectedItemIndex === filteredItems.length - 1 ? 0 : selectedItemIndex + 1
    );
  };

  const selectedItem =
    selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <main className="min-h-screen bg-slate-50/70 flex flex-col">
      <Header onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Operational Gallery</span>
        </div>
      </div>

      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/90 py-10 sm:py-14 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              CORPORATE SHOWCASE
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Operational & Facility Gallery
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              Explore ABCO Food Supply&apos;s infrastructure across Saudi Arabia — from multi-temperature cold storage and logistics fleets to rigorous quality inspections and retail distribution.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pt-8 pb-2">
            {[
              { id: "all", label: "All Showcase" },
              { id: "warehouse", label: "Warehousing & Facilities" },
              { id: "fleet", label: "Fleet & Logistics" },
              { id: "quality", label: "Quality & Inspection" },
              { id: "products", label: "Wholesale Products" },
              { id: "network", label: "Retail & Client Network" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedItemIndex(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-brand-red text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 sm:py-16 w-full flex-1">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemIndex(index)}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-brand-red/40 transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Category tag */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 border border-slate-200 shadow-2xs">
                      {item.categoryLabel}
                    </div>

                    {/* Hover Zoom Icon */}
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/95 text-brand-red flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Caption & Location */}
                  <div className="p-6 space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.caption}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs text-slate-400 font-semibold border-t border-slate-100 mt-2">
                  <span className="pt-2">{item.location}</span>
                  <span className="pt-2 text-brand-red flex items-center gap-1 font-bold">
                    View Photo
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItemIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Top Bar with Title & Close */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
                  {selectedItem.categoryLabel}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemIndex(null)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview with Navigation Controls */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-900 flex items-center justify-center">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain"
                priority
              />

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedItem.caption}
                </p>
                <span className="text-xs font-bold text-slate-400">
                  Location: {selectedItem.location}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedItemIndex(null);
                  setIsEnquiryModalOpen(true);
                }}
                className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow transition-all whitespace-nowrap self-start sm:self-auto"
              >
                Enquire for Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Facilities Stats Bar */}
      <section className="bg-white border-t border-slate-200/90 py-12 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl font-black text-brand-red">50,000+ MT</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Annual Food Distribution Volume</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-900">24 / 7</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Reefer Cold-Chain Monitoring</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-900">100% SFDA</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Regulatory Hygiene Compliance</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-900">13 Provinces</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Kingdom-Wide Logistics Reach</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory="Facility & Operations Inquiry"
      />
    </main>
  );
}
