"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
  X,
  Upload,
  Pencil
} from "lucide-react";
import { toast } from "sonner";
import { fetchHomePageCmsFromDb } from "@/lib/cmsData";

interface PartnerItem {
  id: string;
  name: string;
  image: string;
  type?: string;
  location?: string;
  supplyScope?: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Add Partner Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newType, setNewType] = useState("");
  const [newLocation, setNewLocation] = useState("Kingdom of Saudi Arabia");
  const [newCategory, setNewCategory] = useState<"client" | "partner">("partner");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setNewName("");
    setNewImage("");
    setNewType("");
    setNewLocation("Kingdom of Saudi Arabia");
    setNewCategory("partner");
  };

  const openAdd = () => {
    resetForm();
    setEditingId(null);
    setIsAddOpen(true);
  };

  const openEdit = (partner: PartnerItem) => {
    setNewName(partner.name);
    setNewImage(partner.image || "");
    setNewType(partner.type || "");
    setNewLocation(partner.location || "");
    setNewCategory((partner as any).category || "partner");
    setEditingId(partner.id);
    setIsAddOpen(true);
  };

  const closeModal = () => {
    setIsAddOpen(false);
    setEditingId(null);
  };

  const loadPartners = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHomePageCmsFromDb();
      if (data && Array.isArray(data.clientsPartners)) {
        setPartners(data.clientsPartners);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fileName", `partner-${Date.now()}-${file.name}`);
      form.append("folder", "/partners");

      const res = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setNewImage(json.url);
      toast.success("Partner logo uploaded to ImageKit CDN!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newImage.trim()) {
      toast.error("Please provide both name and logo.");
      return;
    }

    setIsSaving(true);
    try {
      const newPartner: PartnerItem = {
        id: editingId || `partner-${Date.now()}`,
        name: newName.trim(),
        image: newImage.trim(),
        type: newType.trim(),
        location: newLocation.trim(),
        category: newCategory,
      } as any;


      // Editing keeps the partner in its place; adding appends
      const updated = editingId
        ? partners.map((p) => (p.id === editingId ? { ...p, ...newPartner } : p))
        : [...partners, newPartner];

      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: {},
          quickCategories: [],
          clientsPartners: updated,
        }),
      });

      if (!res.ok) throw new Error("Failed to save partner to database");

      setPartners(updated);
      toast.success(
        editingId ? `Partner "${newPartner.name}" updated!` : `Partner "${newPartner.name}" added successfully!`
      );
      closeModal();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(editingId ? "Could not update partner. Please try again." : "Could not add partner. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove partner "${name}"?`)) return;

    try {
      const updated = partners.filter((p) => p.id !== id);
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: {},
          quickCategories: [],
          clientsPartners: updated,
        }),
      });

      if (!res.ok) throw new Error("Failed to delete partner");

      setPartners(updated);
      toast.success(`Partner "${name}" removed.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete partner from database.");
    }
  };

  const filtered = partners.filter((p) =>
    (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.type && p.type.toLowerCase().includes(searchQuery.toLowerCase()))
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
            Institutional client accounts receiving central warehouse and wholesale logistics from AFS Jubail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPartners}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Reload from database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-red" : ""}`} />
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Partner Brand</span>
          </button>
        </div>
      </div>

      {/* Search and Counts */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hypermarket, partner type, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
          />
        </div>
        <span className="text-xs font-bold text-slate-600">
          Showing {filtered.length} of {partners.length} Strategic Partners
        </span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-red mb-3" />
          <p className="text-sm font-bold text-slate-700">Loading partner brands from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No partner accounts found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? `No results for "${searchQuery}"` : "Click 'Add Partner Brand' to add your first client."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((partner) => (
            <div
              key={partner.id}
              className="bg-white border border-slate-200 hover:border-brand-red/40 rounded-3xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
                    <Image
                      src={partner.image || "/categories/partner-1.png"}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      sizes="112px"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(partner)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-brand-red hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                      title="Edit partner"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePartner(partner.id, partner.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-red hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove partner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900">{partner.name}</h3>
                <p className="text-xs font-bold mt-0.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    (partner as any).category === "client"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-red-50 text-brand-red"
                  }`}>
                    {(partner as any).category === "client" ? "Client" : "Partner"}
                  </span>
                  {partner.type ? <span className="ml-2 text-slate-500">{partner.type}</span> : null}
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{partner.location || "Kingdom of Saudi Arabia"}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct Institutional Contract</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Scheduled Delivery</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active Client
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Partner Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {editingId ? "Edit Partner Brand" : "Add Strategic Partner Brand"}
              </h3>
              <button
                onClick={() => closeModal()}
                className="p-1 rounded-lg text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as "client" | "partner")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-red bg-white"
                >
                  <option value="client">Our Client</option>
                  <option value="partner">Our Partner</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Al Othaim Markets"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Partner Type</label>
                <input
                  type="text"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="e.g. Hypermarket Chain"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Supply Locations</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Jubail, Dammam, Riyadh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Partner Logo (ImageKit CDN)</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20 border border-slate-200 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    {newImage ? (
                      <Image
                        src={newImage}
                        alt="Preview"
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 text-center leading-tight">No logo</span>
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full px-3 py-2 border border-dashed border-slate-300 hover:border-brand-red rounded-xl text-center text-slate-600 hover:text-brand-red flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? "Uploading..." : newImage ? "Change Logo" : "Upload Logo Image"}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => closeModal()}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? "Save Changes" : "Save Partner to DB"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

