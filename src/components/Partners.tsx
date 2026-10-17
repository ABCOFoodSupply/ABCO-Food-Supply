"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Handshake } from "lucide-react";
import {
  getHomePageCmsData,
  fetchHomePageCmsFromDb,
  DEFAULT_HOMEPAGE_CMS,
  HomePageCmsData,
  ClientPartnerItem,
} from "@/lib/cmsData";

const LogoGrid: React.FC<{ items: ClientPartnerItem[] }> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 divide-x divide-y divide-slate-200">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-center p-5 sm:p-7 bg-white hover:bg-slate-50 transition-colors group"
          >
            <div className="relative w-full h-14 sm:h-16">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain transition-all duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Partners: React.FC = () => {
  const [allItems, setAllItems] = useState(DEFAULT_HOMEPAGE_CMS.clientsPartners);

  useEffect(() => {
    const data = getHomePageCmsData();
    if (data.clientsPartners?.length) {
      setAllItems(data.clientsPartners);
    }
    fetchHomePageCmsFromDb().then((dbData) => {
      if (dbData?.clientsPartners?.length) {
        setAllItems(dbData.clientsPartners);
      }
    });
    const handleCmsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<HomePageCmsData>;
      if (customEvent.detail?.clientsPartners?.length) {
        setAllItems(customEvent.detail.clientsPartners);
      }
    };
    window.addEventListener("afs_cms_updated", handleCmsUpdate);
    return () => window.removeEventListener("afs_cms_updated", handleCmsUpdate);
  }, []);

  // Split into clients and partners; items without category → partner (backward compat)
  const clients = allItems.filter((p) => p.category === "client");
  const partners = allItems.filter((p) => !p.category || p.category === "partner");

  if (clients.length === 0 && partners.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white border-t border-slate-100 w-full">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 space-y-14">

        {/* Clients */}
        {clients.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Our <span className="text-brand-red">Client&apos;s</span>
              </h2>
            </div>
            <LogoGrid items={clients} />
          </div>
        )}

        {/* Partners */}
        {partners.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Our <span className="text-brand-red">Partners</span>
              </h2>
            </div>
            <LogoGrid items={partners} />
          </div>
        )}

      </div>
    </section>
  );
};
