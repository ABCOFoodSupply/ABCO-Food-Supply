"use client";

import React from "react";
import {
  Ship,
  ShoppingCart,
  GitBranch,
  Truck,
  Box,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ServicesProps {
  onExploreServices?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onExploreServices }) => {
  const services = [
    {
      title: "Import & Distribution",
      description: "Sourcing from trusted global suppliers",
      icon: Ship,
      details: "Direct container shipping and air-freight clearance ensuring uninterrupted product supply to Saudi wholesalers.",
    },
    {
      title: "Procurement Support",
      description: "Efficient and cost-effective procurement",
      icon: ShoppingCart,
      details: "Dedicated B2B purchasing agents securing high quality commodities at competitive bulk volume pricing.",
    },
    {
      title: "Logistics Coordination",
      description: "Reliable supply chain management",
      icon: GitBranch,
      details: "Real-time shipment tracking, bonded warehousing, and streamlined inventory control across KSA hubs.",
    },
    {
      title: "Fleet & Transport",
      description: "Modern fleet and transport solutions",
      icon: Truck,
      details: "Multi-temperature reefer trucks guaranteeing cold chain integrity from port to store doorstep.",
    },
    {
      title: "Custom Packaging",
      description: "Solutions as per business needs",
      icon: Box,
      details: "Tailored bulk packaging, private labeling, vacuum sealing, and institutional portion sizes.",
    },
  ];

  const handleCardClick = (service: (typeof services)[0]) => {
    toast.info(`Service: ${service.title}`, {
      description: service.details,
    });
  };

  const handleExplore = () => {
    toast.success("Explore Our Food Logistics Services", {
      description: "Full supply chain management customized for HORECA and retail clients.",
    });
    if (onExploreServices) onExploreServices();
  };

  return (
    <section id="services" className="py-16 md:py-20 bg-white">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-brand-red uppercase">
              OUR SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              End-to-End Food Supply Solutions
            </h2>
          </div>

          <button
            onClick={handleExplore}
            className="self-start md:self-auto bg-brand-red hover:bg-brand-red-dark text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow transition-all flex items-center gap-2 group cursor-pointer whitespace-nowrap"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                onClick={() => handleCardClick(item)}
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-brand-red/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Red Outline Icon */}
                  <div className="w-12 h-12 rounded-xl bg-red-50/60 border border-red-100 flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:border-brand-red transition-all">
                    <Icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-[11px] font-semibold text-brand-red opacity-80 group-hover:opacity-100">
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
