"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutTemplate, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  Eye, 
  Layers, 
  Users, 
  Image as ImageIcon,
  Database,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { 
  getHomePageCmsData, 
  fetchHomePageCmsFromDb,
  saveHomePageCmsData, 
  resetHomePageCmsData, 
  HomePageCmsData, 
  QuickCategoryItem, 
  ClientPartnerItem 
} from "@/lib/cmsData";

export default function AdminHomePageCmsPage() {
  const [cmsData, setCmsData] = useState<HomePageCmsData>(getHomePageCmsData());
  const [activeTab, setActiveTab] = useState<"hero" | "categories" | "partners">("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  // Modal states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatImage, setNewCatImage] = useState("/categories/rice-and-grains.png");

  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerImage, setNewPartnerImage] = useState("");
  const [newPartnerType, setNewPartnerType] = useState("");
  const [newPartnerLocation, setNewPartnerLocation] = useState("Kingdom of Saudi Arabia");

  // Load from Supabase DB on mount
  useEffect(() => {
    fetchHomePageCmsFromDb().then((data) => {
      if (data) {
        setCmsData(data);
      }
    });
  }, []);

  // Generic ImageKit uploader for CMS assets
  const handleImageKitUpload = async (file: File, folder = "/afs-cms") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name.replace(/\.[^/.]+$/, ""));
    formData.append("folder", folder);

    const res = await fetch("/api/imagekit/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload image to ImageKit");
    }

    const data = await res.json();
    return data.url as string;
  };

  // Upload single hero image (auto-responsive for all screen sizes)
  const handleSingleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadTarget("heroImage");
    try {
      const cdnUrl = await handleImageKitUpload(file, "/afs-cms/hero");
      setCmsData((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          heroImage: cdnUrl,
          mobileHeroImage: cdnUrl,
        },
      }));
      toast.success("Hero image uploaded to ImageKit CDN!");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading hero image to ImageKit.");
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
    }
  };

  // Upload category image in modal
  const handleCategoryModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadTarget("newCategory");
    try {
      const cdnUrl = await handleImageKitUpload(file, "/afs-cms/categories");
      setNewCatImage(cdnUrl);
      toast.success("Category image uploaded to ImageKit!");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading category image.");
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
    }
  };

  // Upload partner logo in modal
  const handlePartnerModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadTarget("newPartner");
    try {
      const cdnUrl = await handleImageKitUpload(file, "/afs-cms/partners");
      setNewPartnerImage(cdnUrl);
      toast.success("Partner logo uploaded to ImageKit!");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading partner logo.");
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
    }
  };

  // Single Unified Save Action: saves to DB & shows Toast notification
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const success = await saveHomePageCmsData(cmsData);
      if (success) {
        toast.success("Home page changes saved to database & published successfully!", {
          description: "All hero banners, categories, and partners are now live.",
        });
      } else {
        toast.success("Home page changes saved to local cache & synced!", {
          description: "Live on homepage.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to factory defaults
  const handleReset = async () => {
    if (confirm("Reset all home page content back to original factory defaults?")) {
      const def = resetHomePageCmsData();
      setCmsData(def);
      await saveHomePageCmsData(def);
      toast.success("Home page content reset to defaults!");
    }
  };

  // Add category to list
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newCat: QuickCategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug,
      image: newCatImage || "/categories/rice-and-grains.png",
    };

    const updated = {
      ...cmsData,
      quickCategories: [...cmsData.quickCategories, newCat],
    };
    setCmsData(updated);
    await saveHomePageCmsData(updated);

    toast.success(`Category "${newCat.name}" added to homepage strip!`);

    // Reset modal
    setNewCatName("");
    setNewCatSlug("");
    setNewCatImage("/categories/rice-and-grains.png");
    setIsAddCategoryOpen(false);
  };

  // Remove category from list and delete from Supabase DB
  const handleRemoveCategory = async (id: string, name: string) => {
    if (confirm(`Remove "${name}" from the home page category strip?`)) {
      const updated = {
        ...cmsData,
        quickCategories: cmsData.quickCategories.filter((c) => c.id !== id),
      };
      setCmsData(updated);

      // Direct delete call to backend API for Supabase DB
      fetch(`/api/cms?type=category&id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(console.error);

      // Persist new set
      await saveHomePageCmsData(updated);
      toast.success(`Removed "${name}" from category strip.`);
    }
  };

  // Add partner to list
  const handleAddPartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;

    const newPartner: ClientPartnerItem = {
      id: `partner-${Date.now()}`,
      name: newPartnerName.trim(),
      image: newPartnerImage || "/categories/partner-1.png",
      type: newPartnerType,
      location: newPartnerLocation,
    };

    const updated = {
      ...cmsData,
      clientsPartners: [...cmsData.clientsPartners, newPartner],
    };
    setCmsData(updated);
    await saveHomePageCmsData(updated);

    toast.success(`Partner "${newPartner.name}" added to homepage!`);

    // Reset modal
    setNewPartnerName("");
    setNewPartnerType("");
    setNewPartnerImage("");
    setIsAddPartnerOpen(false);
  };

  // Remove partner from list and delete from Supabase DB
  const handleRemovePartner = async (id: string, name: string) => {
    if (confirm(`Remove "${name}" from the home page partners carousel?`)) {
      const updated = {
        ...cmsData,
        clientsPartners: cmsData.clientsPartners.filter((p) => p.id !== id),
      };
      setCmsData(updated);

      // Direct delete call to backend API for Supabase DB
      fetch(`/api/cms?type=partner&id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(console.error);

      // Persist new set
      await saveHomePageCmsData(updated);
      toast.success(`Removed "${name}" from partners.`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Bar with ONLY ONE Single Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-brand-red text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span>Interactive Website CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <LayoutTemplate className="w-7 h-7 text-brand-red" />
            <span>Home Page Sections Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Manage Hero banner, Category quick strip, and Strategic Client logos with direct Supabase DB &amp; ImageKit CDN sync.
          </p>
        </div>

        {/* Action Controls: ONLY ONE Save Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Reset to default content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-700" />
            <span>View Live Website</span>
          </Link>

          {/* THE SINGLE UNIFIED SAVE BUTTON */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>Save All Changes to DB</span>
              </>
            )}
          </button>
        </div>
      </div>



      {/* Navigation Tabs: Inactive text black, Active tag RED with WHITE text */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap items-center gap-2 shadow-2xs">
        <button
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "hero"
              ? "bg-brand-red text-white shadow-md shadow-brand-red/20"
              : "text-slate-900 hover:text-black hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Hero Section &amp; POV Banner</span>
        </button>

        <button
          onClick={() => setActiveTab("partners")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "partners"
              ? "bg-brand-red text-white shadow-md shadow-brand-red/20"
              : "text-slate-900 hover:text-black hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Our Clients &amp; Partners ({cmsData.clientsPartners.length} Brands)</span>
        </button>
      </div>

      {/* TAB 1: HERO SECTION MANAGER */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-red" />
                  <span>Hero Section Headlines, POV Image &amp; Buttons</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Upload any image — the system automatically scales and renders it responsively across Desktop, Tablet, and Mobile devices.
                </p>
              </div>

              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Auto-Responsive Single Image
              </span>
            </div>

            {/* UNIFIED HERO BACKGROUND IMAGE / POV BANNER */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Hero Background Image / POV Banner
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload your high-res hero banner image. It automatically adapts responsively for mobile, tablet, and desktop layouts.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full w-fit">
                  Responsive Across All Devices
                </span>
              </div>

              {/* Responsive Preview Container */}
              <div className="relative aspect-[16/7] sm:aspect-[21/9] w-full rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-2xs">
                <Image
                  src={cmsData.hero.heroImage || "/categories/hero.png"}
                  alt="Hero Background POV"
                  fill
                  className="object-cover object-[80%_center]"
                />
              </div>

              {/* Upload Action & URL Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-brand-red/25 transition-all">
                    <Upload className="w-4 h-4 text-white" />
                    <span>
                      {isUploading && uploadTarget === "heroImage"
                        ? "Uploading to ImageKit CDN..."
                        : "Upload Hero POV Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSingleHeroImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-slate-600 font-medium">Auto-hosted on ImageKit CDN</span>
                </div>

                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    value={cmsData.hero.heroImage}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        hero: {
                          ...cmsData.hero,
                          heroImage: e.target.value,
                          mobileHeroImage: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="Or paste direct image URL"
                  />
                </div>
              </div>
            </div>

            {/* Headline & Subtitle Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 text-xs uppercase tracking-wider">
                  Headline Primary Line
                </label>
                <input
                  type="text"
                  value={cmsData.hero.titleLine1}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      hero: { ...cmsData.hero, titleLine1: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 text-xs uppercase tracking-wider">
                  Highlighted Red Text
                </label>
                <input
                  type="text"
                  value={cmsData.hero.titleHighlight}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      hero: { ...cmsData.hero, titleHighlight: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-brand-red font-black focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs uppercase tracking-wider">
                Hero Subtitle Description
              </label>
              <textarea
                rows={2}
                value={cmsData.hero.subtitle}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    hero: { ...cmsData.hero, subtitle: e.target.value },
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
              />
            </div>

            {/* Buttons Navigation Management */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-red" />
                <span>Call-To-Action Buttons &amp; Navigation Routing</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Button 1 (Red Primary) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-brand-red block">
                    Button 1: Red Primary Button
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.button1Text}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          hero: { ...cmsData.hero, button1Text: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Navigation Destination URL
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.button1Link}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          hero: { ...cmsData.hero, button1Link: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                      placeholder="e.g. /products or #products"
                    />
                  </div>
                </div>

                {/* Button 2 (Secondary White) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-900 block">
                    Button 2: Secondary Button
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.button2Text}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          hero: { ...cmsData.hero, button2Text: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Navigation Destination URL
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero.button2Link}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          hero: { ...cmsData.hero, button2Link: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                      placeholder="e.g. #enquire or /contact"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* TAB 3: OUR CLIENTS & PARTNERS */}
      {activeTab === "partners" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-red" />
                  <span>&quot;OUR CLIENTS &amp; PARTNERS&quot; Section Manager</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Manage partner and client brand logos displayed on the homepage.
                </p>
              </div>

              {/* Red Button: Add Client */}
              <button
                onClick={() => setIsAddPartnerOpen(true)}
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add More Clients &amp; Partners</span>
              </button>
            </div>

            {/* Clients Logos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cmsData.clientsPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-slate-50 border border-slate-200 hover:border-brand-red/40 rounded-2xl p-4 flex flex-col group transition-all shadow-2xs"
                >
                  <div className="relative aspect-[16/9] w-full bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 mb-3 overflow-hidden">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="mb-3">
                    <h4 className="text-xs font-bold text-slate-900 truncate" title={partner.name}>
                      {partner.name}
                    </h4>
                    <span className="text-[10px] text-brand-red font-bold block mt-0.5">
                      {partner.type || "Retail Partner"}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {partner.location || "KSA Outlets"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemovePartner(partner.id, partner.name)}
                    className="mt-auto w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-50 hover:bg-brand-red text-brand-red hover:text-white rounded-xl text-[10px] font-bold border border-red-200 hover:border-brand-red transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete Brand
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD MORE CATEGORIES (With ImageKit upload) */}
      {isAddCategoryOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddCategoryOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-red" />
                  <span>Add More Category to Home Strip</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Upload food category image to ImageKit CDN</p>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-slate-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Category Name (e.g. Frozen Bakery, Confectionery)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frozen Foods or Exotic Fruits"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Category URL Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. frozen-foods"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>

              {/* ImageKit Upload Field */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-slate-800 font-bold">
                  Category Icon / Thumbnail (ImageKit CDN)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    {newCatImage ? (
                      <Image
                        src={newCatImage}
                        alt="Preview"
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-white" />
                      <span>
                        {isUploading && uploadTarget === "newCategory"
                          ? "Uploading to ImageKit..."
                          : "Upload Photo from Device"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryModalImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-black font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold shadow-md shadow-brand-red/25 transition-all cursor-pointer"
                >
                  Add Category to Strip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MORE CLIENTS & PARTNERS (With ImageKit upload) */}
      {isAddPartnerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddPartnerOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-red" />
                  <span>Add New Client / Partner Brand</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Upload partner logo directly to ImageKit CDN</p>
              </div>
              <button
                onClick={() => setIsAddPartnerOpen(false)}
                className="text-slate-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPartnerSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Client / Partner Brand Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al Othaim Markets, Danube, BinDawood"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Account Classification
                  </label>
                  <input
                    type="text"
                    value={newPartnerType}
                    onChange={(e) => setNewPartnerType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium"
                    placeholder="Hypermarket / Hotel / Catering"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    City / Coverage
                  </label>
                  <input
                    type="text"
                    value={newPartnerLocation}
                    onChange={(e) => setNewPartnerLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium"
                    placeholder="Jubail, Riyadh, Dammam"
                  />
                </div>
              </div>

              {/* ImageKit Logo Upload */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-slate-800 font-bold">
                  Partner Brand Logo (ImageKit CDN)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-14 bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                    {newPartnerImage ? (
                      <Image
                        src={newPartnerImage}
                        alt="Logo Preview"
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-white" />
                      <span>
                        {isUploading && uploadTarget === "newPartner"
                          ? "Uploading to ImageKit..."
                          : "Upload Logo"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePartnerModalImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={newPartnerImage}
                      onChange={(e) => setNewPartnerImage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-black font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold shadow-md shadow-brand-red/25 transition-all cursor-pointer"
                >
                  Add Partner to Homepage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
