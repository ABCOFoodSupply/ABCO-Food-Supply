"use client";

import React, { useState } from "react";
import {
  Target,
  Eye,
  Gem,
  CheckCircle2,
  Sparkles,
  Check,
} from "lucide-react";
import { useSection } from "./SiteSectionsProvider";
import { getIcon } from "@/lib/iconRegistry";

export const WhyChooseUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const content = useSection("whyChooseUs");
  const strengths = content.strengths;
  const values = content.values;

  const handleCardClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white w-full border-t border-slate-100">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Section Header with Creative Typography */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/80 px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span className="text-xs font-black tracking-widest text-brand-red uppercase">
              {content.eyebrow}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {content.title} <br className="hidden sm:inline" />
            <span className="text-brand-red">{content.titleHighlight}</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto pt-1">
            {content.subtitle}
          </p>
        </div>

        {/* 8 Strengths Grid with Creative Human Polish */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {strengths.map((item, index) => {
            const Icon = getIcon(item.icon);
            const isActive = activeTab === index;
            return (
              <div
                key={`${item.title}-${index}`}
                onClick={() => handleCardClick(index)}
                className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group bg-white ${
                  isActive
                    ? "border-brand-red ring-2 ring-brand-red/20 shadow-xl -translate-y-1"
                    : "border-slate-200 hover:border-brand-red/50 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50/70 border border-red-100 flex items-center justify-center group-hover:bg-brand-red transition-all duration-300">
                      <Icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 group-hover:text-brand-red transition-colors bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      {item.highlight}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-red transition-colors">
                  <span>Learn details</span>
                  <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Columns: Creative Mission, Vision, and Values Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {/* OUR MISSION */}
          <div className="relative rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-white shadow-md">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black tracking-widest text-brand-red uppercase block">
                    {content.mission.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {content.mission.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify">
                {content.mission.text}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
              <span>{content.mission.footer}</span>
            </div>
          </div>

          {/* OUR VISION */}
          <div className="relative rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
                  <Eye className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[11px] font-black tracking-widest text-emerald-600 uppercase block">
                    {content.vision.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {content.vision.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify">
                {content.vision.text}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{content.vision.footer}</span>
            </div>
          </div>

          {/* OUR VALUES */}
          <div className="relative rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md">
                  <Gem className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black tracking-widest text-amber-600 uppercase block">
                    {content.valuesTag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {content.valuesTitle}
                  </h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2.5">
                {values.map((val, i) => (
                  <div
                    key={`${val.label}-${i}`}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-red-50/40 hover:border-red-200 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                      <span>{val.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
              <span>{content.valuesFooter}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
