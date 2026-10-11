"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Building2,
  Award,
  Globe2,
  Clock,
  CheckCircle2,
  Target,
  Eye,
  HeartHandshake,
  ArrowRight,
  ChevronRight,
  Boxes,
  ThermometerSnowflake,
  FileCheck2,
  Users2
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { Vision2030Badge } from "@/components/Vision2030Badge";

export default function AboutPage() {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const stats = [
    { value: "500+", label: "Certified Food Products", icon: Boxes },
    { value: "30+", label: "Global Source Countries", icon: Globe2 },
    { value: "99.4%", label: "On-Time Delivery SLA", icon: Clock },
    { value: "100%", label: "SFDA & Halal Compliant", icon: ShieldCheck },
  ];

  const pillars = [
    {
      title: "Cold Chain Logistics",
      subtitle: "Unbroken -18°C to +4°C Multi-Zone",
      description: "Our refrigerated fleet and temperature-controlled storage ensure zero temperature fluctuation from customs quarantine to the client's store room.",
      icon: ThermometerSnowflake,
      badge: "Real-Time Telematics"
    },
    {
      title: "SFDA & Regulatory Assurance",
      subtitle: "Strict Compliance with Saudi Standards",
      description: "Every shipment undergoes rigorous laboratory testing, pesticide residue verification, and microbiology screening before clearance.",
      icon: FileCheck2,
      badge: "100% Certified"
    },
    {
      title: "Strategic Jubail Hub",
      subtitle: "Gateway to the Eastern Province & GCC",
      description: "Centrally positioned in Jubail Industrial City with rapid arterial highway connectivity to Dammam, Khobar, Riyadh, and GCC border points.",
      icon: Building2,
      badge: "Prime Location"
    },
    {
      title: "Institutional Volume Capability",
      subtitle: "Bulk Supply to Hypermarkets & HORECA",
      description: "Dedicated account managers providing flexible delivery cadences, palletised drop-offs, and custom private packaging solutions.",
      icon: Truck,
      badge: "Enterprise Ready"
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Foundation in Jubail",
      desc: "Established as an independent food trading enterprise in Jubail, focusing initially on rice, edible oils, and essential food commodities."
    },
    {
      year: "2020",
      title: "Cold Chain Expansion",
      desc: "Commissioned dedicated temperature-controlled cold storage facilities and launched multi-zone reefer distribution fleets."
    },
    {
      year: "2022",
      title: "Kingdom-Wide Logistics",
      desc: "Expanded delivery routes to supply major hypermarkets, catering companies, and industrial mess operations across Riyadh and the Eastern Province."
    },
    {
      year: "Present",
      title: "Vision 2030 Food Security",
      desc: "Partnering with certified global producers and local Saudi agriculturalists to bolster national supply resilience with over 500 active SKUs."
    }
  ];

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
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/categories/about-us.png"
            alt="ABCO Food Supply Hub"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="bg-brand-red text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                ABOUT ABCO FOOD SUPPLY
              </span>
              <Vision2030Badge />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Powering the Kingdom&apos;s <br className="hidden sm:inline" />
              <span className="text-brand-red">Food Supply Chain</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
              Distributor of imported and locally manufactured food products across the Kingdom of Saudi Arabia. Headquartered in Jubail, we deliver dependable food security, unbroken cold-chain transport, and institutional supply excellence.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="bg-brand-red hover:bg-brand-red-dark text-white px-7 py-3.5 rounded-full text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <span>Request B2B Quotation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                href="/products"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-7 py-3.5 rounded-full text-base font-bold tracking-wide transition-all"
              >
                Explore Product Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200/90 py-8 relative -mt-6 z-20 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 2xl:px-28 rounded-2xl shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3.5">
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
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <Image
                  src="/categories/about-us.png"
                  alt="ABCO Food Supply Operations"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Quality Callout */}
              <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-200/90 max-w-xs space-y-1">
                <div className="flex items-center gap-2 text-brand-red font-black text-sm">
                  <Award className="w-5 h-5 text-brand-red" />
                  <span>100% SFDA Certified</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Continuous food inspection and compliance verification under Saudi food regulations.
                </p>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
                  OUR STORY & IDENTITY
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  A Saudi Enterprise Dedicated to <br className="hidden sm:inline" />
                  Food Integrity & Reliable Distribution
                </h2>
              </div>

              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed text-justify">
                ABCO Food Supply (AFS) was established in Jubail with an unwavering objective: to provide Saudi businesses with a dependable, uninterrupted pipeline of premium food commodities and specialty ingredients. We bridge certified global producers across Europe, Asia, and the Americas with hypermarkets, institutional catering companies, hotel chains, and retail wholesalers throughout the Kingdom.
              </p>

              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed text-justify">
                Guided by the objectives of the Saudi Vision 2030 National Food Security Strategy, we invest extensively in multi-temperature cold storage, sanitized warehouse facilities, and a GPS-monitored refrigerated transport fleet. Every shipment that enters our supply chain is strictly verified for Halal authenticity, SFDA customs clearance, and quality perfection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">Direct Miller & Abattoir Contracts</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">Unbroken Cold Chain -18°C to +4°C</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">Rapid Port-to-Warehouse Logistics</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">Custom B2B Bulk Packaging Options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Operational Excellence */}
      <section className="py-16 md:py-20 bg-slate-50 w-full border-y border-slate-200/80">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              OPERATIONAL EXCELLENCE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Why Saudi Businesses Rely on ABCO
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Built from the ground up to solve the real-world logistical challenges of high-volume commercial kitchens and retail chains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
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
                <h3 className="text-2xl font-black text-white">Our Mission</h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  To deliver premium food products and reliable supply solutions through trusted global sourcing, efficient procurement, dependable cold-chain operations, and responsive customer service tailored to the Saudi food economy.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>Quality Delivered With Consistency</span>
              </div>
            </div>

            {/* Vision */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transition-all relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Our Vision</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  To become the most dependable and preferred food distribution partner in Saudi Arabia, recognized for quality excellence, seamless supply chains, and enduring commercial partnerships.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>Supporting Saudi Vision 2030</span>
              </div>
            </div>

            {/* Values */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transition-all relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-red">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Core Values</h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                    <strong>Integrity:</strong> Transparent commercial dealings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                    <strong>Quality:</strong> Strict Halal & SFDA hygiene compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                    <strong>Reliability:</strong> Dependable schedules without delay
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                    <strong>Customer Centric:</strong> Tailored enterprise service
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>Unwavering Ethical Standards</span>
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
              GROWTH & EVOLUTION
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Our Journey of Continuous Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((item, index) => (
              <div
                key={item.year}
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
                  {item.desc}
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
                Ready to Optimize Your Food Procurement?
              </h3>
              <p className="text-sm sm:text-base text-red-100 max-w-xl">
                Speak directly with our Jubail institutional sales desk to arrange contract pricing and scheduled deliveries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="bg-white text-brand-red hover:bg-slate-100 px-8 py-3.5 rounded-full text-base font-bold tracking-wide shadow-lg transition-all"
              >
                Request Quotation
              </button>
              <Link
                href="/contact"
                className="bg-brand-red-dark hover:bg-red-950 text-white border border-red-400 px-8 py-3.5 rounded-full text-base font-bold tracking-wide transition-all"
              >
                Contact Sales Team
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
