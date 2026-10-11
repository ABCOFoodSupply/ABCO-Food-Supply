"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Database, 
  CloudLightning, 
  Building2, 
  ShieldCheck, 
  Save, 
  Server
} from "lucide-react";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const [companySettings, setCompanySettings] = useState({
    companyName: "ABCO Food Supply (AFS)",
    crNumber: "2050123456",
    sfdaNumber: "SFDA-FS-2026-9918",
    email: "procurement@abcofoodsupply.com",
    phone: "+966 50 123 4567",
    address: "Jubail Industrial City, Support Services Area 1, Eastern Province, KSA",
    coldCapacity: "18,500 m³ (-18°C to +4°C)",
    fleetCount: "45 GPS Temperature-Monitored Reefer Units",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Depot settings and configuration updated successfully!");
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
          <Settings className="w-7 h-7 text-brand-red" />
          <span>Depot Configuration & Cloud Integrations</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
          Review connected Supabase database nodes, ImageKit CDN parameters, and Jubail facility profiles.
        </p>
      </div>

      {/* Cloud & Database Integrations Status: White card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
          <Server className="w-5 h-5 text-emerald-600" />
          <span>Active Backend Infrastructure</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supabase Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Supabase Cloud PostgreSQL</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-500 font-medium">REST Endpoint:</div>
              <div className="font-mono text-slate-900 font-bold bg-white p-2 rounded-lg text-[11px] break-all border border-slate-200">
                https://exrgcryuyhkwpqsyciif.supabase.co
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
              <span>Region: AWS ap-south-1</span>
              <span className="text-emerald-700 font-bold">Port 5432 Pooler</span>
            </div>
          </div>

          {/* ImageKit Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                <CloudLightning className="w-4 h-4 text-cyan-600" />
                <span>ImageKit CDN Storage</span>
              </div>
              <span className="bg-cyan-100 text-cyan-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Active
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-500 font-medium">CDN URL Endpoint:</div>
              <div className="font-mono text-slate-900 font-bold bg-white p-2 rounded-lg text-[11px] break-all border border-slate-200">
                https://ik.imagekit.io/wg5w5t4nz
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
              <span>Auto WebP / AVIF Optimization</span>
              <span className="text-cyan-700 font-bold">Edge Accelerated</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-red shrink-0" />
          <span>
            API tokens and service keys are protected inside <code className="text-slate-900 font-bold">.env</code> and strictly excluded via <code className="text-slate-900 font-bold">.gitignore</code>.
          </span>
        </div>
      </div>

      {/* Facility & Profile Settings Form: White card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-6">
          <Building2 className="w-5 h-5 text-brand-red" />
          <span>Jubail Headquarters & Logistics Profile</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-5 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                Entity Legal Name
              </label>
              <input
                type="text"
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                Commercial Registration (CR)
              </label>
              <input
                type="text"
                value={companySettings.crNumber}
                onChange={(e) => setCompanySettings({ ...companySettings, crNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                SFDA Importer Registration
              </label>
              <input
                type="text"
                value={companySettings.sfdaNumber}
                onChange={(e) => setCompanySettings({ ...companySettings, sfdaNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                Central Inquiries Email
              </label>
              <input
                type="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                Procurement WhatsApp / Hotline
              </label>
              <input
                type="text"
                value={companySettings.phone}
                onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                Cold Store Cubic Capacity
              </label>
              <input
                type="text"
                value={companySettings.coldCapacity}
                onChange={(e) => setCompanySettings({ ...companySettings, coldCapacity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
              Warehouse Depot Physical Address
            </label>
            <input
              type="text"
              value={companySettings.address}
              onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>

          {/* Red Save Button */}
          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-7 py-3 rounded-xl shadow-md shadow-brand-red/25 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Save className="w-4 h-4 text-white" />
              <span>{isSaving ? "Saving Configuration..." : "Save Depot Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
