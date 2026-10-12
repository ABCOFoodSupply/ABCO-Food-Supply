"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Handshake } from "lucide-react";
import { getHomePageCmsData, fetchHomePageCmsFromDb, DEFAULT_HOMEPAGE_CMS, HomePageCmsData } from "@/lib/cmsData";
import { useSection } from "./SiteSectionsProvider";

export const Partners: React.FC = () => {
  const content = useSection("partners");
  const [partners, setPartners] = useState(DEFAULT_HOMEPAGE_CMS.clientsPartners);

  useEffect(() => {
    const data = getHomePageCmsData();
    if (data.clientsPartners?.length) {
      setPartners(data.clientsPartners);
    }
    fetchHomePageCmsFromDb().then((dbData) => {
      if (dbData?.clientsPartners?.length) {
        setPartners(dbData.clientsPartners);
      }
    });
    const handleCmsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<HomePageCmsData>;
      if (customEvent.detail?.clientsPartners?.length) {
        setPartners(customEvent.detail.clientsPartners);
      }
    };
    window.addEventListener("afs_cms_updated", handleCmsUpdate);
    return () => window.removeEventListener("afs_cms_updated", handleCmsUpdate);
  }, []);

  // Repeat the list so one loop is always wider than the screen, then render it twice
  // and slide by -50% for a seamless marquee.
  const loop = Array.from({ length: Math.max(2, Math.ceil(10 / Math.max(partners.length, 1))) }, () => partners).flat();
  const duration = `${loop.length * 3.5}s`;

  return (
    <section className="py-16 md:py-20 bg-slate-50/70 border-t border-slate-100 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-white text-brand-red border border-red-100 shadow-sm px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider">
            <Handshake className="w-3.5 h-3.5" />
            {content.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {content.title} <span className="text-brand-red">{content.titleHighlight}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Logo Marquee */}
      <div
        className="relative w-full overflow-hidden py-3"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ "--marquee-duration": duration } as React.CSSProperties}
        >
          {[0, 1].map((copy) =>
            loop.map((partner, idx) => (
              <div
                key={`${copy}-${partner.id ?? partner.name}-${idx}`}
                aria-hidden={copy === 1}
                className="shrink-0 mr-4 sm:mr-6 w-44 h-32 sm:w-56 sm:h-36 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-lg hover:border-brand-red/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center p-1"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner.image}
                    alt={copy === 1 ? "" : partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 176px, 224px"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
