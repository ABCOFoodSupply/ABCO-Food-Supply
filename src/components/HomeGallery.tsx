"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2, X, ChevronLeft, ChevronRight, Images } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  caption?: string;
  location?: string;
}

const FALLBACK_HOME_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Jubail Logistics Hub & Fleet Staging",
    image: "/categories/about-us.png",
    caption: "Central Jubail warehousing complex featuring multi-temperature loading docks and delivery fleet staging.",
    location: "Jubail Industrial City, KSA",
  },
  {
    id: "gal-2",
    title: "Saudi Supermarket Food Distribution",
    image: "/categories/hero.png",
    caption: "Direct supply and shelf fulfillment of dry goods, edible oils, and food products to hypermarkets across KSA.",
    location: "Eastern Province & Riyadh",
  },
  {
    id: "gal-3",
    title: "Fresh Wholesale Food Assortment",
    image: "/categories/mix-product.png",
    caption: "Fresh produce, grains, and kitchen staples prepared for commercial catering shipments.",
    location: "Central Distribution Center",
  },
  {
    id: "gal-4",
    title: "Aged Basmati & Grains Reserve",
    image: "/categories/rice-and-grains.png",
    caption: "Climate-controlled bulk storage of premium grains and pulses.",
    location: "Dry Goods Facility",
  },
];

export const HomeGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_HOME_GALLERY);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setItems(
              json.data.slice(0, 6).map((item: any) => ({
                id: item.id,
                title: item.title,
                image: item.image,
                caption: item.caption || "",
                location: item.location || "Jubail Industrial City, KSA",
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Failed to fetch gallery for home page:", err);
      }
    }
    fetchGallery();
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(
      selectedItemIndex === 0 ? items.length - 1 : selectedItemIndex - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(
      selectedItemIndex === items.length - 1 ? 0 : selectedItemIndex + 1
    );
  };

  const selectedItem =
    selectedItemIndex !== null ? items[selectedItemIndex] : null;

  return (
    <section className="py-14 sm:py-20 bg-slate-50/70 border-t border-slate-200/70">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase flex items-center gap-1.5">
              <Images className="w-4 h-4" />
              OPERATIONAL SHOWCASE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Facility, Fleet &amp; Operations Gallery
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Explore our Jubail temperature-controlled cold chain, logistics fleets, and distribution infrastructure.
            </p>
          </div>

          <Link
            href="/gallery"
            className="self-start sm:self-auto bg-brand-red hover:bg-brand-red-dark text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 group cursor-pointer whitespace-nowrap"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItemIndex(index)}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-brand-red/40 transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-brand-red flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center justify-between text-[11px] text-slate-400 font-semibold border-t border-slate-100">
                <span className="truncate max-w-[150px]">{item.location}</span>
                <span className="text-brand-red font-bold flex items-center gap-0.5 shrink-0">
                  View
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItemIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 truncate pr-4">
                {selectedItem.title}
              </h3>
              <button
                onClick={() => setSelectedItemIndex(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-950 flex items-center justify-center">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain"
                priority
              />

              {items.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                {selectedItem.caption && (
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    {selectedItem.caption}
                  </p>
                )}
                {selectedItem.location && (
                  <span className="text-[11px] font-bold text-slate-400 block">
                    Location: {selectedItem.location}
                  </span>
                )}
              </div>
              <Link
                href="/gallery"
                className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow text-center self-start sm:self-auto shrink-0"
              >
                Full Gallery
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
