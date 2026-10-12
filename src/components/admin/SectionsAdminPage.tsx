"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, RotateCcw, Save, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { SectionEditor } from "./SectionEditor";
import { SITE_SECTIONS_EVENT } from "@/components/SiteSectionsProvider";
import { SECTION_SCHEMAS } from "@/lib/siteSectionSchemas";
import { SECTION_DEFAULTS, mergeAllSections, type SectionId, type SiteSections } from "@/lib/siteSections";

export interface SectionsAdminTab {
  id: string;
  label: string;
  sections: SectionId[];
}

/** Tabbed admin page that edits and saves a set of site sections (e.g. everything on /about). */
export function SectionsAdminPage({
  icon: Icon,
  title,
  description,
  previewHref,
  tabs,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  previewHref: string;
  tabs: SectionsAdminTab[];
}) {
  const [sections, setSections] = useState<SiteSections>(SECTION_DEFAULTS);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [isSaving, setIsSaving] = useState(false);
  const ids = tabs.flatMap((t) => t.sections);

  useEffect(() => {
    fetch("/api/sections", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setSections(mergeAllSections(json?.data)))
      .catch((err) => console.warn("Could not load section content:", err));
  }, []);

  const save = async (data: SiteSections) => {
    const subset = Object.fromEntries(ids.map((id) => [id, data[id]]));
    const res = await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: subset }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) throw new Error(json.error || "Failed to save");
    window.dispatchEvent(new CustomEvent(SITE_SECTIONS_EVENT, { detail: subset }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await save(sections);
      toast.success("Changes saved & published!", { description: "The live page now shows your updates." });
    } catch (err) {
      toast.error("Could not save changes", { description: err instanceof Error ? err.message : String(err) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm(`Reset all ${title} content back to the original defaults?`)) return;
    const next = { ...sections };
    for (const id of ids) (next as Record<SectionId, unknown>)[id] = SECTION_DEFAULTS[id];
    setSections(next);
    try {
      await save(next);
      toast.success("Content reset to defaults.");
    } catch (err) {
      toast.error("Could not reset", { description: err instanceof Error ? err.message : String(err) });
    }
  };

  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0 lg:flex-1">
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5 sm:gap-3">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-red shrink-0" />
            <span>{title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{description}</p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center gap-2.5 sm:gap-3 lg:shrink-0">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <Link
            href={previewHref}
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold whitespace-nowrap transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-slate-700" />
            View Page
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="col-span-2 inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-6 py-3 sm:py-2.5 rounded-xl text-sm whitespace-nowrap shadow-md shadow-brand-red/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 sm:p-2 flex sm:flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar shadow-2xs">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              current?.id === tab.id
                ? "bg-brand-red text-white shadow-md shadow-brand-red/20"
                : "text-slate-900 hover:text-black hover:bg-slate-100"
            }`}
          >
            <span className={current?.id === tab.id ? "text-white/70" : "text-slate-400"}>{i + 1}.</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editors */}
      <div className="space-y-6">
        {current?.sections.map((id) => {
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
        })}
      </div>
    </div>
  );
}
