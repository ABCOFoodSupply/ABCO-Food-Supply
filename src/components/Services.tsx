"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSection } from "./SiteSectionsProvider";
import { getIcon } from "@/lib/iconRegistry";

interface ServicesProps {
  onExploreServices?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onExploreServices }) => {
  const content = useSection("services");
  // Cards are managed in Admin → Services Page; keep each one's position so it links to the right row
  const services = useSection("servicesList")
    .items.map((item, index) => ({ item, index }))
    .filter(({ item }) => item.showOnHome !== false);

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              {content.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {content.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {content.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
            <Link
              href="/services"
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 hover:border-brand-red/40 px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap"
            >
              Explore All Services
            </Link>
            <button
              onClick={onExploreServices}
              className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer whitespace-nowrap"
            >
              <span>{content.buttonText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Service cards with square (1:1) images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map(({ item, index }) => {
            const Icon = getIcon(item.icon);
            return (
              <Link
                key={`${item.title}-${index}`}
                href={`/services#service-${index + 1}`}
                className="group rounded-3xl bg-white border border-slate-200/90 hover:border-brand-red/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-red-50/60 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-20 h-20 text-brand-red/25" />
                    </div>
                  )}
                  {item.highlight && (
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-slate-700 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                      {item.highlight}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="relative p-6 pt-9 flex-1 flex flex-col">
                  <span className="absolute -top-7 left-6 w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red transition-colors">
                    <Icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-red transition-colors mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-red">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
