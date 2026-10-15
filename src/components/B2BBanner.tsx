"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import { useSection } from "./SiteSectionsProvider";
import { getIcon } from "@/lib/iconRegistry";

interface B2BBannerProps {
  onShopNow?: () => void;
}

export const B2BBanner: React.FC<B2BBannerProps> = ({ onShopNow }) => {
  const content = useSection("b2b");
  const highlights = content.highlights;

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
    <section className="py-10 md:py-16 bg-white w-full">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* B2B PROMOTIONAL BANNER CARD */}
        <div className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-white shadow-sm">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-red/[0.04] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-[20%] w-[28rem] h-[28rem] rounded-full bg-slate-100/70 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: "radial-gradient(rgba(148,163,184,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage: "linear-gradient(to right, transparent 40%, black 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 40%, black 100%)",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center p-6 sm:p-10 lg:p-12 xl:p-16">
            {/* Text Column */}
            <div className="space-y-5 sm:space-y-6 max-w-xl">
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-1.5 bg-white text-brand-red border border-red-100 shadow-sm px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {content.eyebrow}
              </span>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] text-slate-900">
                <span className="text-brand-red">{content.titleHighlight}</span> {content.titleLine1}{" "}
                <br className="hidden sm:inline" />
                {content.titleLine2}
              </h2>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                {content.subtitle}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {highlights.map((item, i) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <div
                      key={`${item.label}-${i}`}
                      className="flex items-center gap-2 bg-white/90 border border-slate-200/90 shadow-sm pl-1.5 pr-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-slate-800"
                    >
                      <span className="w-7 h-7 rounded-full bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      {item.label}
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link
                  href={content.primaryLink || "/products"}
                  className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3.5 rounded-full text-base font-bold tracking-wide shadow-lg shadow-brand-red/25 hover:shadow-xl hover:shadow-brand-red/30 transition-all inline-flex items-center justify-center gap-2.5 group"
                >
                  <span>{content.primaryText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={handleShopNow}
                  className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 hover:border-brand-red/40 px-7 py-3.5 rounded-full text-base font-bold shadow-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-brand-red" />
                  <span>{content.secondaryText}</span>
                </button>
              </div>
            </div>

            {/* Image Column */}
            <div className="relative">
              {/* Soft glow behind the products */}
              <div className="absolute inset-x-[8%] inset-y-[10%] rounded-full bg-white/80 blur-2xl" />

              <div className="relative w-full aspect-[1682/935]">
                <Image
                  src={content.image || "/categories/mix-product-new.png"}
                  alt={`${content.titleHighlight} ${content.titleLine1} ${content.titleLine2}`}
                  fill
                  className="object-contain drop-shadow-xl"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
