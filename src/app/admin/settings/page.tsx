"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Building2, 
  Save, 
} from "lucide-react";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [companySettings, setCompanySettings] = useState({
    companyName: "ABCO Food Supply (AFS)",
    crNumber: "2050123456",
    sfdaNumber: "SFDA-FS-2026-9918",
    email: "abcofoodsupply@gmail.com",
    phone: "+966 50 123 4567",
    address: "Jubail Industrial City, Support Services Area 1, Eastern Province, KSA",
    coldCapacity: "18,500 m³ (-18°C to +4°C)",
    fleetCount: "45 GPS Temperature-Monitored Reefer Units",
  });

  React.useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCompanySettings({
              companyName: json.data.company_name || json.data.companyName || "ABCO Food Supply (AFS)",
              crNumber: json.data.cr_number || json.data.crNumber || "2050123456",
              sfdaNumber: json.data.sfda_number || json.data.sfdaNumber || "SFDA-FS-2026-9918",
              email: json.data.email || "abcofoodsupply@gmail.com",
              phone: json.data.phone || "+966 50 123 4567",
              address: json.data.address || "Jubail Industrial City, Support Services Area 1, Eastern Province, KSA",
              coldCapacity: json.data.cold_capacity || json.data.coldCapacity || "18,500 m³ (-18°C to +4°C)",
              fleetCount: json.data.fleet_count || json.data.fleetCount || "45 GPS Temperature-Monitored Reefer Units",
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companySettings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      alert("Depot settings and configuration updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings to database.");
    } finally {
      setIsSaving(false);
    }
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
