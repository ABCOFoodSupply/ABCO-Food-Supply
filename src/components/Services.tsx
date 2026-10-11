"use client";

import React from "react";
import {
  Globe2,
  ShoppingCart,
  Truck,
  Layers,
  Tags,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

interface ServicesProps {
  onExploreServices?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onExploreServices }) => {
  const services = [
    {
      title: "Food Import & Distribution",
      description:
        "We source and distribute imported and locally manufactured food products through trusted international and local suppliers.",
      icon: Globe2,
      highlight: "Global & Local Sourcing",
    },
    {
      title: "Procurement Solutions",
      description:
        "We provide tailored sourcing and procurement solutions for rice, meat, seafood, poultry, edible oils, spices, lentils, and other food products.",
      icon: ShoppingCart,
      highlight: "Tailored Sourcing",
    },
    {
      title: "Supply Chain & Logistics",
      description:
        "We coordinate efficient transportation, delivery, and cold chain requirements through trusted logistics partners.",
      icon: Truck,
      highlight: "Cold Chain 24/7",
    },
    {
      title: "Bulk Supply",
      description:
        "We provide dependable bulk supply solutions for wholesalers, retailers, distributors, and institutional customers.",
      icon: Layers,
      highlight: "Institutional Volumes",
    },
    {
      title: "Private Label & Custom Packaging",
      description:
        "We support private label and customized packaging requirements through selected sourcing and supply partners.",
      icon: Tags,
      highlight: "Tailored Packaging",
    },
    {
      title: "Catering & Food Service Supply",
      description:
        "We supply food products to catering companies, restaurants, hotels, hospitality businesses, and commercial kitchens.",
      icon: UtensilsCrossed,
      highlight: "HORECA & Kitchens",
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              OUR SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              End-to-End Food Supply &amp; Logistics Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Tailored procurement, unbroken cold chain distribution, and reliable bulk supply solutions across the Kingdom of Saudi Arabia.
            </p>
          </div>

          <button
            onClick={onExploreServices}
            className="self-start md:self-auto bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Request Service Proposal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6 Services Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-brand-red/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    {/* Red Outline Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-red-50/70 border border-red-100 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-300 shadow-2xs">
                      <Icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 group-hover:text-brand-red transition-colors bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      {item.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-red transition-colors mb-2.5 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {item.description}
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
