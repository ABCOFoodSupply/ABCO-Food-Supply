"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Search 
} from "lucide-react";

interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  type: string;
  locations: string;
  supplyScope: string;
  contractStatus: "Active" | "Contract Renewal" | "Expanding";
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([
    {
      id: "p-1",
      name: "Lulu Hypermarket",
      logo: "/partners/lulu.png",
      type: "Hypermarket Chain",
      locations: "Jubail, Dammam, Khobar, Riyadh",
      supplyScope: "Rice & Grains, Meat, Dairy, Edible Oils",
      contractStatus: "Active",
    },
    {
      id: "p-2",
      name: "Panda Retail Company",
      logo: "/partners/panda.png",
      type: "Supermarket & Hypermarket",
      locations: "Kingdom-wide (Eastern & Central)",
      supplyScope: "Fresh & Frozen Seafood, Bulk Poultry, Spices",
      contractStatus: "Active",
    },
    {
      id: "p-3",
      name: "Carrefour Saudi Arabia",
      logo: "/partners/carrefour.png",
      type: "International Hypermarket",
      locations: "Dammam, Riyadh, Khobar",
      supplyScope: "Imported Meat Cuts, Dairy Butter, Basmati Rice",
      contractStatus: "Active",
    },
    {
      id: "p-4",
      name: "Tamimi Markets",
      logo: "/partners/tamimi.png",
      type: "Premium Supermarket",
      locations: "Eastern Province, Riyadh",
      supplyScope: "Chilled Australian Beef, Salmon, Organic Grains",
      contractStatus: "Expanding",
    },
    {
      id: "p-5",
      name: "Danah Supermarket",
      logo: "/partners/danah.png",
      type: "Regional Supermarket Chain",
      locations: "Jubail Industrial City, Ras Tanura",
      supplyScope: "Daily Perishables, Edible Oils, Sugar & Flour",
      contractStatus: "Active",
    },
    {
      id: "p-6",
      name: "Safari Hypermarket",
      logo: "/partners/safari.png",
      type: "Mass Retail Hypermarket",
      locations: "Eastern Province",
      supplyScope: "Wholesale Institutional Rice, Frozen Chicken",
      contractStatus: "Active",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filtered = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.locations.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-7 h-7 text-brand-red" />
            <span>Retail & Hypermarket Partners</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Major institutional accounts receiving central warehouse and direct-to-store logistics from AFS Jubail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs">
            {partners.length} Key Strategic Accounts
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hypermarket or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
          />
        </div>
      </div>

      {/* Grid: Clean White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((partner) => (
          <div
            key={partner.id}
            className="bg-white border border-slate-200 hover:border-brand-red/40 rounded-3xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-28 h-12 bg-white rounded-xl p-2 border border-slate-200 flex items-center justify-center overflow-hidden shadow-2xs">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={90}
                    height={36}
                    className="object-contain max-h-8"
                  />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {partner.contractStatus}
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900">{partner.name}</h3>
              <p className="text-xs text-brand-red font-bold mt-0.5">{partner.type}</p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{partner.locations}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Scope: <strong className="text-slate-900 font-bold">{partner.supplyScope}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">Scheduled Recurring Delivery</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                SFDA Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
