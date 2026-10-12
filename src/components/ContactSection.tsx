"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Copy,
  Navigation,
  Headphones,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { toast } from "sonner";
import { useSection } from "./SiteSectionsProvider";
import { SocialButtons } from "./SocialLinks";
import { phoneDigits } from "@/lib/siteSections";

export const ContactSection: React.FC = () => {
  const content = useSection("contact");
  const heading = useSection("contactSection");
  const PHONE = content.phone;
  const EMAIL = content.email;
  const TEL_HREF = `tel:+${phoneDigits(content.phone)}`;
  const WA_NUMBER = phoneDigits(content.whatsapp || content.phone);
  const WHATSAPP_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    "Hello ABCO Food Supply, I would like to enquire about your products."
  )}`;
  const MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(content.mapAddress)}`;
  const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(content.mapAddress)}&z=12&output=embed`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Copied ${label}`, { description: text });
  };

  const contactItems = [
    {
      icon: Phone,
      label: "Direct Phone",
      value: PHONE,
      href: TEL_HREF,
      actionLabel: "Call now",
      copy: () => handleCopy(PHONE, "Phone Number"),
    },
    {
      icon: Mail,
      label: "Email Inquiries",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      actionLabel: "Send email",
      copy: () => handleCopy(EMAIL, "Email Address"),
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: content.address,
      href: MAPS_URL,
      actionLabel: "Get directions",
      copy: () => handleCopy(content.address, "Location"),
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: content.hours,
      note: content.hoursNote,
    },
  ];


  return (
    <section
      id="contact"
      className="relative py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200/60 overflow-hidden"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-red/5 blur-3xl" />

      <div className="relative w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-white text-brand-red border border-red-100 shadow-sm px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              {heading.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              {heading.titlePrefix} <span className="text-brand-red">{heading.titleHighlight}</span>{" "}
              <br className="hidden sm:inline" />
              {heading.titleSuffix}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              {heading.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fa855] text-white font-bold px-6 py-3.5 rounded-full text-sm shadow-lg shadow-[#25D366]/25 transition-all"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat on WhatsApp
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={TEL_HREF}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 hover:border-brand-red/40 font-bold px-6 py-3.5 rounded-full text-sm shadow-sm transition-all"
            >
              <Phone className="w-4 h-4 text-brand-red" />
              Call Now
            </a>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Contact cards + socials */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="group bg-white border border-slate-200/90 hover:border-brand-red/40 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-red-50 text-brand-red group-hover:bg-brand-red group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug [overflow-wrap:anywhere]">
                          {item.value}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 min-h-[28px]">
                      {item.href ? (
                        <>
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
                          >
                            {item.actionLabel}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={item.copy}
                            aria-label={`Copy ${item.label}`}
                            title="Copy"
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-brand-red hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">{item.note}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social strip (light) */}
            <div className="bg-gradient-to-br from-red-50 via-white to-white border border-red-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-base font-black text-slate-900">Follow ABCO Food Supply</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Stay updated on wholesale deals &amp; arrivals
                </p>
              </div>
              <SocialButtons />
            </div>
          </div>

          {/* RIGHT: Map */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col min-h-[380px] lg:min-h-0">
            {/* Map Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-red" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">ABCO Headquarters</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{content.mapAddress}</p>
                </div>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm transition-colors shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Directions</span>
              </a>
            </div>

            {/* Live Map */}
            <div className="relative flex-1 min-h-[300px] bg-slate-100">
              <iframe
                title={`ABCO Food Supply location – ${content.mapAddress}`}
                src={MAPS_EMBED_URL}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
