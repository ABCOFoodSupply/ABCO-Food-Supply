"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Target,
  Eye,
  HeartHandshake,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { Vision2030Badge } from "@/components/Vision2030Badge";
import { useSection } from "@/components/SiteSectionsProvider";
import { getIcon } from "@/lib/iconRegistry";

export default function AboutPage() {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const hero = useSection("aboutHero");
  const stats = useSection("aboutStats").items;
  const story = useSection("aboutStory");
  const pillars = useSection("aboutPillars");
  const mvv = useSection("aboutValues");
  const milestones = useSection("aboutMilestones");
  const cta = useSection("aboutCta");

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-3 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">About Us</span>
        </div>
      </div>

      {/* Hero Header Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
        {hero.image && (
          <div className="absolute inset-0 z-0">
            <Image
              key={hero.image}
              src={hero.image}
              alt={hero.badge}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            {/* Dark overlay keeps the white text readable while the photo stays visible */}
            <div className="absolute inset-0 bg-slate-900/75 md:bg-transparent md:bg-gradient-to-r md:from-slate-900/95 md:via-slate-900/75 md:to-slate-900/25" />
          </div>
        )}

        <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-brand-red text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                {hero.badge}
              </span>
              <Vision2030Badge />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {hero.titleLine1} <br className="hidden sm:inline" />
              <span className="text-brand-red">{hero.titleHighlight}</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
              {hero.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="bg-brand-red hover:bg-brand-red-dark text-white px-7 py-3.5 rounded-full text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <span>{hero.primaryText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                href={hero.secondaryLink || "/products"}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-7 py-3.5 rounded-full text-base font-bold tracking-wide transition-all"
              >
                {hero.secondaryText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200/90 py-8 relative -mt-6 z-20 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 2xl:px-28 rounded-2xl shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-8">
          {stats.map((stat, i) => {
            const Icon = getIcon(stat.icon);
            return (
              <div key={`${stat.label}-${i}`} className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 text-brand-red">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-snug">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Company Story & Mission Section */}
      <section className="py-16 md:py-24 bg-white w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
                {story.image && (
                  <Image
                    key={story.image}
                    src={story.image}
                    alt={story.eyebrow}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Floating Quality Callout */}
              {(story.calloutTitle || story.calloutText) && (
                <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-200/90 max-w-xs space-y-1">
                  <div className="flex items-center gap-2 text-brand-red font-black text-sm">
                    <Award className="w-5 h-5 text-brand-red" />
                    <span>{story.calloutTitle}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {story.calloutText}
                  </p>
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
                  {story.eyebrow}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {story.title}
                </h2>
              </div>

              {story.paragraphs.map((p, i) => (
                <p key={i} className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed text-justify">
                  {p.text}
                </p>
              ))}

              {story.checklist.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {story.checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-slate-800">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Operational Excellence */}
      <section className="py-16 md:py-20 bg-slate-50 w-full border-y border-slate-200/80">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              {pillars.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {pillars.title}
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              {pillars.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.items.map((pillar, i) => {
              const Icon = getIcon(pillar.icon);
              return (
                <div
                  key={`${pillar.title}-${i}`}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-red/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                        {pillar.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-xs font-semibold text-brand-red">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission, Vision, and Values Showcase */}
      <section className="py-16 md:py-24 bg-white w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Mission */}
            <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full pointer-events-none" />
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-white">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white">{mvv.mission.title}</h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {mvv.mission.text}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>{mvv.mission.footer}</span>
              </div>
            </div>

            {/* Vision */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transition-all relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{mvv.vision.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {mvv.vision.text}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>{mvv.vision.footer}</span>
              </div>
            </div>

            {/* Values */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transition-all relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-red">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{mvv.valuesTitle}</h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {mvv.values.map((value, i) => (
                    <li key={`${value.label}-${i}`} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                      <span>
                        <strong>{value.label}:</strong> {value.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>{mvv.valuesFooter}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Milestones */}
      <section className="py-16 md:py-20 bg-slate-50 w-full border-t border-slate-200/80">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-2">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              {milestones.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {milestones.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.items.map((item, index) => (
              <div
                key={`${item.year}-${index}`}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-brand-red">{item.year}</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Step {index + 1}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-brand-red text-white py-14 sm:py-16 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                {cta.title}
              </h3>
              <p className="text-sm sm:text-base text-red-100 max-w-xl">
                {cta.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="bg-white text-brand-red hover:bg-slate-100 px-8 py-3.5 rounded-full text-base font-bold tracking-wide shadow-lg transition-all"
              >
                {cta.primaryText}
              </button>
              <Link
                href={cta.secondaryLink || "/contact"}
                className="bg-brand-red-dark hover:bg-red-950 text-white border border-red-400 px-8 py-3.5 rounded-full text-base font-bold tracking-wide transition-all"
              >
                {cta.secondaryText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory="General B2B Inquiry"
      />
    </main>
  );
}
