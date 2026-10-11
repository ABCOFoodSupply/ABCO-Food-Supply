"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Boxes, Tag, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface B2BBannerProps {
  onShopNow?: () => void;
}

export const B2BBanner: React.FC<B2BBannerProps> = ({ onShopNow }) => {
  const highlights = [
    { label: "Bulk Supply", icon: Boxes },
    { label: "Best Prices", icon: Tag },
    { label: "Quality Assured", icon: ShieldCheck },
  ];

  const handleShopNow = () => {
    toast.success("Opening Wholesale Food Requisition", {
      description: "Direct B2B supply and contract pricing across Saudi Arabia.",
    });
    if (onShopNow) {
      onShopNow();
    } else {
      const el = document.getElementById("enquiry");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 md:py-12 bg-white w-full overflow-hidden">
      {/* FULL WIDTH B2B PROMOTIONAL BANNER - FULLY RESPONSIVE */}
      <div className="relative w-full min-h-[420px] md:min-h-[460px] lg:min-h-[480px] flex items-center bg-white border-y border-slate-100">
        {/* Desktop / Tablet Background Image */}
        <div className="hidden md:block absolute inset-0 z-0">
          <Image
            src="/categories/mix-product.png"
            alt="Buy Any Food Products for Your Business Needs - Fresh assortment"
            fill
            priority
            className="object-cover object-right lg:object-[85%_center]"
            sizes="100vw"
          />
        </div>

        {/* Top-Right Badges on Desktop */}
        <div className="hidden md:flex absolute top-6 right-8 lg:right-24 z-10 items-center gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs lg:text-sm font-semibold text-slate-800"
              >
                <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-slate-800" />
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 py-8 md:py-14">
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5">
            {/* Mobile Badges */}
            <div className="flex md:hidden flex-wrap items-center gap-2.5 pb-1">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-700" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-black tracking-tight leading-[1.15]">
              <span className="text-brand-red">Buy Any</span>{" "}
              <span className="text-slate-900">Food Products</span> <br className="hidden sm:inline" />
              <span className="text-slate-900">for Your Business Needs</span>
            </h2>

            {/* RESPONSIVE MOBILE IMAGE: Clearly visible on mobile */}
            <div className="block md:hidden relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-md border border-slate-200/90 my-5 bg-slate-50">
              <Image
                src="/categories/mix-product.png"
                alt="Fresh Food Products and Groceries Assortment"
                fill
                priority
                className="object-cover object-[75%_center]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-xl">
              From daily essentials to bulk supply, we provide high-quality food products with reliable delivery across Saudi Arabia.
            </p>

            {/* Red pill button */}
            <div className="pt-2">
              <button
                onClick={handleShopNow}
                className="w-full sm:w-auto bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3.5 sm:py-4 rounded-full text-base font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
