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
  ExternalLink,
  Pencil,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { 
  getHomePageCmsData, 
  fetchHomePageCmsFromDb,
  saveHomePageCmsData, 
  DEFAULT_HOMEPAGE_CMS,
  HomePageCmsData, 
  QuickCategoryItem, 
  ClientPartnerItem 
} from "@/lib/cmsData";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { SITE_SECTIONS_EVENT } from "@/components/SiteSectionsProvider";
import { SECTION_SCHEMAS } from "@/lib/siteSectionSchemas";
import { SECTION_DEFAULTS, mergeAllSections, type SectionId, type SiteSections } from "@/lib/siteSections";

// Admin tabs: each lists the editable site sections it shows (hero & partners also keep their existing editors)
const ADMIN_TABS: { id: string; label: string; sections: SectionId[] }[] = [
  { id: "hero", label: "Hero", sections: ["heroBadges"] },
  { id: "about", label: "About Us", sections: ["about"] },
  { id: "products", label: "Products", sections: ["products"] },
  { id: "b2b", label: "B2B Banner", sections: ["b2b"] },
  { id: "services", label: "Services", sections: ["services"] },
  { id: "why", label: "Why Choose Us", sections: ["whyChooseUs"] },
  { id: "partners", label: "Partners", sections: ["partners"] },
  { id: "gallery", label: "Gallery", sections: ["gallery"] },
  { id: "contact", label: "Contact & Footer", sections: ["contactSection", "footer"] },
];

async function saveSiteSections(data: SiteSections) {
  const res = await fetch("/api/sections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sections: data }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.error || "Failed to save section content");
  window.dispatchEvent(new CustomEvent(SITE_SECTIONS_EVENT, { detail: data }));
}

// ── Partner / Client form state ─────────────────────────────────────────────
interface PartnerFormState {
  id: string;
  name: string;
  image: string;
  type: string;
  category: "client" | "partner";
}

const EMPTY_PARTNER_FORM: PartnerFormState = {
  id: "",
  name: "",
  image: "",
  type: "",
  category: "partner",
};

export default function AdminHomePageCmsPage() {
  const [cmsData, setCmsData] = useState<HomePageCmsData>(getHomePageCmsData());
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [sections, setSections] = useState<SiteSections>(SECTION_DEFAULTS);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  // Category modal
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatImage, setNewCatImage] = useState("/categories/rice-and-grains.png");

  // Partner / Client inline manager
  const [partnerForm, setPartnerForm] = useState<PartnerFormState>(EMPTY_PARTNER_FORM);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isSavingPartner, setIsSavingPartner] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Load from Supabase DB on mount
  useEffect(() => {
    fetchHomePageCmsFromDb().then((data) => {
      if (data) setCmsData(data);
    });
    fetch("/api/sections", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setSections(mergeAllSections(json?.data)))
      .catch((err) => console.warn("Could not load section content:", err));
  }, []);

  const renderSection = (id: SectionId) => {
    const schema = SECTION_SCHEMAS[id];
    return (
      <SectionEditor
        key={id}
        title={schema.title}
        description={schema.description}
        fields={schema.fields}
        value={sections[id] as unknown as Record<string, unknown>}
        onChange={(v) => setSections((prev) => ({ ...prev, [id]: v }))}
      />
    );
  };

  // ── Partner helpers ────────────────────────────────────────────────────────
  const openAddPartner = () => {
    setPartnerForm(EMPTY_PARTNER_FORM);
    setEditingPartnerId(null);
    setIsPartnerModalOpen(true);
  };

  const openEditPartner = (p: ClientPartnerItem) => {
    setPartnerForm({
      id: p.id,
      name: p.name,
      image: p.image,
      type: p.type || "",
      category: (p as any).category || "partner",
    });
    setEditingPartnerId(p.id);
    setIsPartnerModalOpen(true);
  };

  const closePartnerModal = () => {
    setIsPartnerModalOpen(false);
    setEditingPartnerId(null);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const url = await handleImageKitUpload(file, "/afs-cms/partners");
      setPartnerForm((prev) => ({ ...prev, image: url }));
      toast.success("Logo uploaded!");
    } catch {
      toast.error("Logo upload failed.");
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPartner(true);
    try {
      const newItem: ClientPartnerItem & { category: string } = {
        id: editingPartnerId || `cp-${Date.now()}`,
        name: partnerForm.name.trim(),
        image: partnerForm.image.trim(),
        type: partnerForm.type.trim(),
        category: partnerForm.category,
      };

      const updated: ClientPartnerItem[] = editingPartnerId
        ? cmsData.clientsPartners.map((p) => (p.id === editingPartnerId ? (newItem as any) : p))
        : [...cmsData.clientsPartners, newItem as any];

      const newCmsData = { ...cmsData, clientsPartners: updated };
      setCmsData(newCmsData);

      // Persist to DB
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero: {}, quickCategories: [], clientsPartners: updated }),
      });
      if (!res.ok) throw new Error("DB save failed");

      toast.success(editingPartnerId ? `"${newItem.name}" updated!` : `"${newItem.name}" added!`);
      closePartnerModal();
    } catch (err) {
      toast.error("Could not save. Please try again.");
    } finally {
      setIsSavingPartner(false);
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}"?`)) return;
    const updated = cmsData.clientsPartners.filter((p) => p.id !== id);
    setCmsData({ ...cmsData, clientsPartners: updated });
    try {
      await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero: {}, quickCategories: [], clientsPartners: updated }),
      });
      toast.success(`"${name}" removed.`);
    } catch {
      toast.error("Failed to delete.");
    }
  };

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

  // Desktop image change; a mobile image that just mirrored the desktop one goes back to "use desktop"
  const setDesktopHeroImage = (url: string) => {
    setCmsData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        heroImage: url,
        mobileHeroImage: prev.hero.mobileHeroImage === prev.hero.heroImage ? "" : prev.hero.mobileHeroImage,
      },
    }));
  };

  const setMobileHeroImage = (url: string) => {
    setCmsData((prev) => ({ ...prev, hero: { ...prev.hero, mobileHeroImage: url } }));
  };

  // Upload desktop / tablet hero image
  const handleSingleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadTarget("heroImage");
    try {
      const cdnUrl = await handleImageKitUpload(file, "/afs-cms/hero");
      setDesktopHeroImage(cdnUrl);
      toast.success("Hero image uploaded to ImageKit CDN!");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading hero image to ImageKit.");
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
    }
  };

  // Upload mobile-only hero image
  const handleMobileHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadTarget("mobileHeroImage");
    try {
      const cdnUrl = await handleImageKitUpload(file, "/afs-cms/hero");
      setMobileHeroImage(cdnUrl);
      toast.success("Mobile hero image uploaded! Click Save to publish.");
    } catch (err) {
      console.error(err);
      toast.error("Error uploading mobile hero image.");
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
      e.target.value = "";
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

  // Single Unified Save Action: saves to DB & shows Toast notification
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Partners are managed on the Clients page: save the latest DB list, never this page's possibly stale copy
      const latest = await fetchHomePageCmsFromDb();
      const success = await saveHomePageCmsData({ ...cmsData, clientsPartners: latest.clientsPartners });
      try {
        await saveSiteSections(sections);
      } catch (err) {
        toast.error("Section text & images were not saved", {
          description: err instanceof Error ? err.message : String(err),
          duration: 10000,
        });
        return;
      }
      if (success) {
        toast.success("Home page changes saved to database & published successfully!", {
          description: "All home page sections are now live.",
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
      // Partners are managed on the Clients page, so a reset keeps them
      const latest = await fetchHomePageCmsFromDb();
      const def = { ...DEFAULT_HOMEPAGE_CMS, clientsPartners: latest.clientsPartners };
      setCmsData(def);
      setSections(SECTION_DEFAULTS);
      await saveHomePageCmsData(def);
      try {
        await saveSiteSections(SECTION_DEFAULTS);
      } catch (err) {
        console.error(err);
      }
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Bar with ONLY ONE Single Save Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0 lg:flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-brand-red text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
            <span>Interactive Website CMS</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5 sm:gap-3">
            <LayoutTemplate className="w-6 h-6 sm:w-7 sm:h-7 text-brand-red shrink-0" />
            <span>Home Page Sections Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Manage Hero banner, Category quick strip, and Strategic Client logos with direct Supabase DB &amp; ImageKit CDN sync.
          </p>
        </div>

        {/* Action Controls: ONLY ONE Save Button */}
        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center gap-2.5 sm:gap-3 lg:shrink-0">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs"
            title="Reset to default content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold whitespace-nowrap transition-all shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-700" />
            <span className="sm:hidden">View Website</span>
            <span className="hidden sm:inline">View Live Website</span>
          </Link>

          {/* THE SINGLE UNIFIED SAVE BUTTON */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="col-span-2 inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-6 py-3 sm:py-2.5 rounded-xl text-sm whitespace-nowrap shadow-md shadow-brand-red/25 transition-all cursor-pointer disabled:opacity-50"
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



      {/* Navigation Tabs: scroll sideways on phones, wrap on larger screens */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 sm:p-2 flex sm:flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar shadow-2xs">
        {ADMIN_TABS.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-brand-red text-white shadow-md shadow-brand-red/20"
                : "text-slate-900 hover:text-black hover:bg-slate-100"
            }`}
          >
            <span className={activeTab === tab.id ? "text-white/70" : "text-slate-400"}>{i + 1}.</span>
            <span suppressHydrationWarning>
              {tab.label}
              {tab.id === "partners" ? ` (${cmsData.clientsPartners.length})` : ""}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: HERO SECTION MANAGER */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-red shrink-0" />
                <span>Hero Section Headlines, Images &amp; Buttons</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Set separate images for desktop and phones, plus the headline and call-to-action buttons.
              </p>
            </div>

            {/* UNIFIED HERO BACKGROUND IMAGE / POV BANNER */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Desktop Hero Image
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Shown as the hero background on tablets and desktops. Phones use the Mobile Hero Image below.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full w-fit">
                  Desktop &amp; Tablet
                </span>
              </div>

              {/* Responsive Preview Container */}
              <div className="relative aspect-[16/7] sm:aspect-[21/9] w-full rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-2xs">
                <Image
                  key={cmsData.hero.heroImage}
                  src={cmsData.hero.heroImage || "/categories/hero.png"}
                  alt="Hero Background POV"
                  fill
                  className="object-cover object-[80%_center]"
                  sizes="(max-width: 1024px) 100vw, 1100px"
                />
              </div>

              {/* Upload Action & URL Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-brand-red/25 transition-all">
                    <Upload className="w-4 h-4 text-white" />
                    <span>
                      {isUploading && uploadTarget === "heroImage"
                        ? "Uploading to ImageKit CDN..."
                        : "Upload Desktop Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSingleHeroImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  <span className="hidden md:inline text-xs text-slate-600 font-medium">Auto-hosted on ImageKit CDN</span>
                </div>

                <div className="w-full sm:flex-1 sm:max-w-md">
                  <input
                    type="text"
                    value={cmsData.hero.heroImage}
                    onChange={(e) => setDesktopHeroImage(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="Or paste direct image URL"
                  />
                </div>
              </div>
            </div>

            {/* MOBILE HERO IMAGE */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Mobile Hero Image
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Shown under the headline on phones. Best size: 16:10 landscape (e.g. 1200 × 750 px). Leave empty to reuse the desktop image.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-100/70 border border-sky-200 px-3 py-1 rounded-full w-fit">
                  Phones
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Preview at the same 16:10 ratio the homepage uses on phones */}
                <div className="relative w-full sm:w-72 aspect-[16/10] rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                  <Image
                    key={cmsData.hero.mobileHeroImage || cmsData.hero.heroImage}
                    src={cmsData.hero.mobileHeroImage || cmsData.hero.heroImage || "/categories/hero.png"}
                    alt="Mobile Hero Preview"
                    fill
                    sizes="(max-width: 640px) 100vw, 288px"
                    className={`object-cover ${cmsData.hero.mobileHeroImage ? "" : "object-[80%_center]"}`}
                  />
                  {!cmsData.hero.mobileHeroImage && (
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      Using desktop image
                    </span>
                  )}
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <label className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-brand-red/25 transition-all">
                      <Upload className="w-4 h-4 text-white" />
                      <span>
                        {isUploading && uploadTarget === "mobileHeroImage" ? "Uploading..." : "Upload Mobile Image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMobileHeroImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                    {cmsData.hero.mobileHeroImage && (
                      <button
                        type="button"
                        onClick={() => setMobileHeroImage("")}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Use Desktop Image
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={cmsData.hero.mobileHeroImage || ""}
                    onChange={(e) => setMobileHeroImage(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="Or paste direct mobile image URL"
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
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-red shrink-0" />
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

          {renderSection("heroBadges")}
        </div>
      )}

      {/* SECTION TABS (schema-driven editors) */}
      {activeTab !== "hero" && activeTab !== "partners" && (
        <div className="space-y-6">
          {ADMIN_TABS.find((t) => t.id === activeTab)?.sections.map(renderSection)}
        </div>
      )}



      {/* TAB: CLIENTS & PARTNERS MANAGER */}
      {activeTab === "partners" && (() => {
        const clients = cmsData.clientsPartners.filter((p) => (p as any).category === "client");
        const partners = cmsData.clientsPartners.filter((p) => !((p as any).category) || (p as any).category === "partner");

        const LogoCard = ({ item }: { item: ClientPartnerItem }) => (
          <div className="group bg-white border border-slate-200 hover:border-brand-red/40 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-xs hover:shadow-md transition-all relative">
            <div className="relative w-24 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
              <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="96px" />
            </div>
            <p className="text-xs font-bold text-slate-800 text-center leading-tight line-clamp-2">{item.name}</p>
            {(item as any).type && (
              <p className="text-[11px] text-slate-500 text-center">{(item as any).type}</p>
            )}
            <div className="flex items-center gap-1.5 mt-auto">
              <button
                onClick={() => openEditPartner(item)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 hover:text-brand-red hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => handleDeletePartner(item.id, item.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

        return (
          <div className="space-y-6">
            {renderSection("partners")}

            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-red shrink-0" />
                    <span>Our Clients &amp; Partners</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Add logos here — choose <strong className="text-blue-700">Client</strong> or <strong className="text-brand-red">Partner</strong>. Each group appears as its own section on the homepage.
                  </p>
                </div>
                <button
                  onClick={openAddPartner}
                  className="shrink-0 inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Client / Partner
                </button>
              </div>

              {/* OUR CLIENTS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                    <Users className="w-3 h-3" /> Our Clients
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{clients.length} logo{clients.length !== 1 ? "s" : ""}</span>
                </div>
                {clients.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                    <p className="text-sm text-slate-400 font-medium">No clients added yet.</p>
                    <button onClick={openAddPartner} className="mt-2 text-xs text-brand-red font-bold hover:underline cursor-pointer">
                      + Add first client
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                    {clients.map((item) => <LogoCard key={item.id} item={item} />)}
                  </div>
                )}
              </div>

              {/* OUR PARTNERS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-red-50 text-brand-red border border-red-200 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                    <Users className="w-3 h-3" /> Our Partners
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{partners.length} logo{partners.length !== 1 ? "s" : ""}</span>
                </div>
                {partners.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                    <p className="text-sm text-slate-400 font-medium">No partners added yet.</p>
                    <button onClick={openAddPartner} className="mt-2 text-xs text-brand-red font-bold hover:underline cursor-pointer">
                      + Add first partner
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                    {partners.map((item) => <LogoCard key={item.id} item={item} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: ADD / EDIT CLIENT OR PARTNER */}
      {isPartnerModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={closePartnerModal}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-md w-full max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-5 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingPartnerId ? "Edit Logo" : "Add Client or Partner"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Choose category then upload the brand logo.</p>
              </div>
              <button onClick={closePartnerModal} className="p-1.5 rounded-xl text-slate-400 hover:text-black hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4 text-xs sm:text-sm">
              {/* Category selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["client", "partner"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPartnerForm((p) => ({ ...p, category: cat }))}
                      className={`py-3 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        partnerForm.category === cat
                          ? cat === "client"
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-red-50 border-brand-red text-brand-red"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {cat === "client" ? "Our Client" : "Our Partner"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Brand / Company Name</label>
                <input
                  type="text"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Almarai, India Gate"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Type / Category Label <span className="text-slate-400 font-medium">(optional)</span></label>
                <input
                  type="text"
                  value={partnerForm.type}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, type: e.target.value }))}
                  placeholder="e.g. Dairy Brand, Hypermarket Chain"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>

              {/* Logo upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Logo Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-16 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                    {partnerForm.image ? (
                      <Image src={partnerForm.image} alt="Preview" fill className="object-contain p-1" sizes="80px" />
                    ) : (
                      <span className="text-[10px] text-slate-400 text-center">No logo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer shadow-xs transition-colors w-full justify-center">
                      <Upload className="w-3.5 h-3.5" />
                      {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                    </label>
                    <input
                      type="text"
                      value={partnerForm.image}
                      onChange={(e) => setPartnerForm((p) => ({ ...p, image: e.target.value }))}
                      placeholder="Or paste image URL"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={closePartnerModal} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPartner || isUploadingLogo}
                  className="bg-brand-red hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-md shadow-brand-red/25 transition-all"
                >
                  {isSavingPartner && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {editingPartnerId ? "Save Changes" : "Add to Homepage"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL: ADD MORE CATEGORIES (With ImageKit upload) */}
      {isAddCategoryOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={() => setIsAddCategoryOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-5 sm:p-7 shadow-2xl relative"
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

              <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-black font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold shadow-md shadow-brand-red/25 transition-all cursor-pointer"
                >
                  Add Category to Strip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
