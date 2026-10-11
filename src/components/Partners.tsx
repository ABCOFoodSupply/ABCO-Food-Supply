"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getHomePageCmsData, fetchHomePageCmsFromDb, DEFAULT_HOMEPAGE_CMS, HomePageCmsData } from "@/lib/cmsData";

export const Partners: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState(DEFAULT_HOMEPAGE_CMS.clientsPartners);

  useEffect(() => {
    const data = getHomePageCmsData();
    if (data.clientsPartners?.length) {
      setPartners(data.clientsPartners);
    }
    fetchHomePageCmsFromDb().then((dbData) => {
      if (dbData?.clientsPartners?.length) {
        setPartners(dbData.clientsPartners);
      }
    });
    const handleCmsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<HomePageCmsData>;
      if (customEvent.detail?.clientsPartners?.length) {
        setPartners(customEvent.detail.clientsPartners);
      }
    };
    window.addEventListener("afs_cms_updated", handleCmsUpdate);
    return () => window.removeEventListener("afs_cms_updated", handleCmsUpdate);
  }, []);

  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          setCardsPerView(2);
        } else if (window.innerWidth < 1024) {
          setCardsPerView(3);
        } else {
          setCardsPerView(4);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, partners.length - cardsPerView);

  // Auto-sliding interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const slideNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const slidePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handlePartnerClick = (name: string) => {
    toast.success(`Partner: ${name}`, {
      description: "Supplying bulk fresh & packaged food commodities across KSA outlets.",
    });
  };

  return (
    <section className="py-16 bg-white border-t border-slate-100 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Header with View All Partners */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-brand-red uppercase">
              OUR CLIENTS & PARTNERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Leading Businesses
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.info("Displaying all retail and hypermarket partners across Saudi Arabia.")}
              className="text-brand-red border border-brand-red/40 hover:bg-brand-red hover:text-white px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Partners</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* WORKING SLIDER CONTAINER */}
        <div
          className="relative flex items-center group/slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Arrow Button */}
          <button
            onClick={slidePrev}
            aria-label="Previous partners"
            className="absolute -left-2 sm:-left-4 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-brand-red hover:border-brand-red hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Sliding Track Viewport */}
          <div className="w-full overflow-hidden py-4 px-1" ref={sliderRef}>
            <div
              className="flex transition-transform duration-500 ease-out gap-4 sm:gap-5"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {partners.map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  onClick={() => handlePartnerClick(partner.name)}
                  className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] h-28 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-brand-red/40 rounded-2xl flex items-center justify-center p-3 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      width={180}
                      height={90}
                      className="object-contain max-h-20 w-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={slideNext}
            aria-label="Next partners"
            className="absolute -right-2 sm:-right-4 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-brand-red hover:border-brand-red hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slider Dots Indicator */}
        <div className="flex justify-center items-center gap-2 pt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-8 bg-brand-red"
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
