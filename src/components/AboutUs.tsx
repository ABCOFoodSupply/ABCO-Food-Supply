"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Globe, Truck, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface AboutUsProps {
  onLearnMore?: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onLearnMore }) => {
  const stats = [
    {
      value: "500+",
      label: "Food Products",
      icon: Package,
    },
    {
      value: "Trusted",
      label: "Global Suppliers",
      icon: Globe,
    },
    {
      value: "Reliable",
      label: "Supply Chain",
      icon: Truck,
    },
    {
      value: "Serving Across",
      label: "Saudi Arabia",
      icon: MapPin,
    },
  ];

  const handleLearnMore = () => {
    toast.info("ABCO Food Supply - Saudi Arabia", {
      description: "Established to lead wholesale and B2B food supply in Jubail and across the Kingdom.",
    });
    if (onLearnMore) onLearnMore();
  };

  return (
    <section id="about" className="py-10 md:py-16 bg-white w-full overflow-hidden">
      {/* FULL WIDTH ABOUT US BANNER - FULLY RESPONSIVE */}
      <div className="relative w-full min-h-[460px] md:min-h-[500px] lg:min-h-[520px] flex items-center bg-white border-y border-slate-100">
        {/* Desktop / Tablet Background Image */}
        <div className="hidden md:block absolute inset-0 z-0">
          <Image
            src="/categories/about-us.png"
            alt="ABCO Food Supply Warehouse Headquarters and Fleet"
            fill
            priority
            className="object-cover object-right lg:object-[85%_center]"
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 py-8 md:py-14">
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5">
            {/* Tag */}
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase block">
              ABOUT US
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-black text-slate-900 tracking-tight leading-tight">
              ABCO Food Supply
            </h2>

            {/* RESPONSIVE MOBILE IMAGE: Clearly visible on mobile */}
            <div className="block md:hidden relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-md border border-slate-200/90 my-5 bg-slate-50">
              <Image
                src="/categories/about-us.png"
                alt="ABCO Food Supply Logistics Hub and Fleet"
                fill
                priority
                className="object-cover object-[75%_center]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Body paragraph */}
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed text-left sm:text-justify">
              ABCO Food Supply is a Saudi-based food trading and distribution company specializing in the sourcing and supply of imported and locally manufactured food products. Through trusted global suppliers and local partners, we provide quality products and reliable supply solutions to distributors, wholesalers, retailers, catering companies, hospitality businesses, and food service providers across the Kingdom of Saudi Arabia.
            </p>

            {/* Red pill button */}
            <div className="pt-2">
              <Link
                href="/about"
                className="w-full sm:w-auto bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3.5 sm:py-4 rounded-full text-base font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group cursor-pointer inline-flex"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Badges Row below the banner */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 pt-10 md:pt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-brand-red/40 hover:shadow-md transition-all group min-w-0"
              >
                <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full border-2 border-brand-red flex items-center justify-center shrink-0 bg-red-50/60 group-hover:bg-brand-red transition-colors">
                  <Icon className="w-5 h-5 sm:w-6 md:w-7 sm:h-6 md:h-7 text-brand-red group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight truncate">
                    {stat.value}
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 font-bold leading-tight mt-0.5 sm:mt-1 break-words">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
