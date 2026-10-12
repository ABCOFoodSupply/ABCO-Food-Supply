"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mergeSection, SECTION_DEFAULTS, type SectionId, type SiteSections } from "@/lib/siteSections";

type Stored = Record<string, unknown>;

const SiteSectionsContext = createContext<Stored | null>(null);

export const SITE_SECTIONS_EVENT = "afs_sections_updated";

/** Seeds every page with the stored section content fetched on the server (no flash of defaults). */
export function SiteSectionsProvider({ initial, children }: { initial: Stored; children: React.ReactNode }) {
  const [stored, setStored] = useState<Stored>(initial);

  // A fresh server render (refresh / revalidation) brings newer saved content: adopt it
  useEffect(() => {
    setStored(initial);
  }, [initial]);

  // Admin saves in this tab update the live site immediately
  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<Stored>).detail;
      if (detail) setStored((prev) => ({ ...prev, ...detail }));
    };
    window.addEventListener(SITE_SECTIONS_EVENT, onUpdate);
    return () => window.removeEventListener(SITE_SECTIONS_EVENT, onUpdate);
  }, []);

  return <SiteSectionsContext.Provider value={stored}>{children}</SiteSectionsContext.Provider>;
}

/** Content for one homepage section: saved values over the built-in defaults. */
export function useSection<K extends SectionId>(id: K): SiteSections[K] {
  const stored = useContext(SiteSectionsContext);
  const override = stored?.[id];
  return useMemo(() => mergeSection(SECTION_DEFAULTS[id], override), [id, override]);
}
