"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, Layers, Phone, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useSection } from "@/components/SiteSectionsProvider";
import { getIcon } from "@/lib/iconRegistry";
import { phoneDigits } from "@/lib/siteSections";

const container = "w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28";
const pad = (n: number) => String(n).padStart(2, "0");

export default function ServicesPage() {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("General B2B Inquiry");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const hero = useSection("servicesHero");
  const list = useSection("servicesList");
  const process = useSection("servicesProcess");
  const industries = useSection("servicesIndustries");
  const faq = useSection("servicesFaq");
  const cta = useSection("servicesCta");
  const contact = useSection("contact");

  const waNumber = phoneDigits(contact.whatsapp || contact.phone);
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Hello ABCO Food Supply, I would like to discuss your supply services."
  )}`;

  const openEnquiry = (subject = "General B2B Inquiry") => {
    setEnquirySubject(subject);
    setIsEnquiryModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header onOpenEnquiry={() => openEnquiry()} />

      {/* Breadcrumb */}
      <div className={`bg-white border-b border-slate-200/80 py-3 ${container} text-xs sm:text-sm text-slate-500`}>
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Services</span>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/70">
        <div className="pointer-events-none absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-brand-red/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-48 w-96 h-96 rounded-full bg-brand-green/[0.06] blur-3xl" />

        <div className={`relative ${container} py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center`}>
          {/* Text */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-white text-brand-red border border-red-100 shadow-sm px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {hero.badge}
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] text-slate-900">
              {hero.titleLine1}
              <br />
              <span className="text-brand-red">{hero.titleHighlight}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">{hero.subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openEnquiry()}
                className="bg-brand-red hover:bg-brand-red-dark text-white px-7 py-3.5 rounded-full text-base font-bold shadow-lg shadow-brand-red/25 hover:shadow-xl transition-all inline-flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                {hero.primaryText}
              </button>
              <Link
                href={hero.secondaryLink || "/products"}
                className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 hover:border-brand-red/40 px-7 py-3.5 rounded-full text-base font-bold shadow-sm transition-all inline-flex items-center justify-center"
              >
                {hero.secondaryText}
              </Link>
            </div>

            {hero.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2 max-w-lg">
                {hero.stats.map((stat, i) => {
                  const Icon = getIcon(stat.icon);
                  return (
                    <div key={`${stat.value}-${i}`} className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm">
                      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-brand-red flex items-center justify-center mb-2">
                        <Icon className="w-4 h-4" />
                      </span>
                      <p className="text-sm sm:text-lg font-black text-slate-900 leading-tight">{stat.value}</p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-semibold leading-tight">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-3 sm:-inset-5 rounded-[2.5rem] bg-gradient-to-br from-brand-red/15 via-transparent to-brand-green/15" />
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl bg-slate-100">
              {hero.image && (
                <Image
                  key={hero.image}
                  src={hero.image}
                  alt={`${hero.titleLine1} ${hero.titleHighlight}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
            <div className="absolute -bottom-5 left-4 sm:left-8 flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-xl px-4 py-3">
              <span className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-black text-slate-900">{list.items.length} Supply Services</p>
                <p className="text-xs text-slate-500 font-medium">One trusted partner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services (alternating rows) ───────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className={container}>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">{list.eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{list.title}</h2>
            <p className="text-base sm:text-lg text-slate-600">{list.subtitle}</p>
          </div>

          {/* Quick jump chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-14 md:mb-20">
            {list.items.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <a
                  key={`chip-${i}`}
                  href={`#service-${i + 1}`}
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-brand-red/40 text-slate-700 hover:text-brand-red pl-1.5 pr-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-white border border-slate-200 text-brand-red flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  {item.title}
                </a>
              );
            })}
          </div>

          <div className="space-y-20 md:space-y-28">
            {list.items.map((item, i) => {
              const Icon = getIcon(item.icon);
              const flip = i % 2 === 1;
              return (
                <div
                  key={`${item.title}-${i}`}
                  id={`service-${i + 1}`}
                  className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
                >
                  {/* Image */}
                  <div className={`relative w-full max-w-xl mx-auto lg:mx-0 ${flip ? "lg:order-2 lg:ml-auto" : ""}`}>
                    <div className="group relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 to-red-50/60 border border-slate-200 shadow-xl">
                      {item.image ? (
                        <Image
                          key={item.image}
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-24 h-24 text-brand-red/30" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`absolute -top-5 ${flip ? "right-6" : "left-6"} w-14 h-14 rounded-2xl bg-brand-red text-white font-black text-xl flex items-center justify-center shadow-lg shadow-brand-red/30`}
                    >
                      {pad(i + 1)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-brand-red flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </span>
                      {item.highlight && (
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                          {item.highlight}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{item.title}</h3>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{item.description}</p>

                    {item.features?.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {item.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5">
                            <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                            <span className="text-sm font-semibold text-slate-700">{f.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => openEnquiry(item.title)}
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-brand-red text-white px-6 py-3 rounded-full text-sm font-bold transition-colors group cursor-pointer"
                    >
                      {list.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-red-50/70 via-white to-white border-y border-slate-200/70">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(rgba(227,24,55,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 70%)",
          }}
        />
        <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-brand-green/[0.07] blur-3xl" />

        <div className={`relative ${container}`}>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 md:mb-16">
            <span className="inline-flex items-center gap-1.5 bg-white text-brand-red border border-red-100 shadow-sm px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {process.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{process.title}</h2>
            <p className="text-base sm:text-lg text-slate-600">{process.subtitle}</p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {/* Dashed connector through the icons (desktop) */}
            <div className="hidden lg:block absolute top-[3.75rem] left-[12.5%] right-[12.5%] border-t-2 border-dashed border-brand-red/30" />
            {process.steps.map((step, i) => {
              const Icon = getIcon(step.icon);
              return (
                <div
                  key={`${step.title}-${i}`}
                  className="group relative bg-white rounded-3xl p-6 pt-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:shadow-brand-red/10 hover:-translate-y-1 hover:border-brand-red/40 transition-all duration-300 overflow-hidden"
                >
                  <span className="pointer-events-none absolute -bottom-5 -right-1 text-8xl font-black leading-none text-brand-red/[0.06] select-none">
                    {pad(i + 1)}
                  </span>
                  <div className="relative w-16 h-16">
                    <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red to-red-600 text-white flex items-center justify-center shadow-lg shadow-brand-red/30 group-hover:scale-105 transition-transform">
                      <Icon className="w-7 h-7" />
                    </span>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-brand-red text-brand-red text-[11px] font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="relative text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors mt-5 mb-2">{step.title}</h3>
                  <p className="relative text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Who we serve ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/70">
        <div className={container}>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">{industries.eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{industries.title}</h2>
            <p className="text-base sm:text-lg text-slate-600">{industries.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.items.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <div
                  key={`${item.title}-${i}`}
                  className="group bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-brand-red/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
                >
                  <span className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-brand-red group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className={`${container} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14`}>
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-4">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">{faq.eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">{faq.title}</h2>
            <p className="text-base text-slate-600">{faq.subtitle}</p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1fa855] text-white py-3 rounded-xl text-sm font-bold transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:+${phoneDigits(contact.phone)}`}
                className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 py-3 rounded-xl text-sm font-bold transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-red" />
                {contact.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {faq.items.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={`${item.question}-${i}`}
                  className={`rounded-2xl border transition-colors ${open ? "border-brand-red/40 bg-red-50/30" : "border-slate-200 bg-white"}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer"
                  >
                    <span className="text-base font-bold text-slate-900">{item.question}</span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        open ? "bg-brand-red text-white rotate-180" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className={`${container} pb-16 md:pb-24`}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-red via-brand-red to-red-800 text-white p-8 sm:p-12 lg:p-14">
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-black/10 blur-2xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{cta.title}</h2>
              <p className="text-base sm:text-lg text-red-100">{cta.subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => openEnquiry()}
                className="bg-white text-brand-red hover:bg-slate-100 px-7 py-3.5 rounded-full text-base font-bold shadow-lg transition-colors cursor-pointer"
              >
                {cta.primaryText}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fa855] text-white px-7 py-3.5 rounded-full text-base font-bold shadow-lg transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {cta.secondaryText}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory={enquirySubject}
      />
    </main>
  );
}
