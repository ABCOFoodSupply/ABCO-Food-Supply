"use client";

import React from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useSection } from "./SiteSectionsProvider";
import { phoneDigits, type SiteSections } from "@/lib/siteSections";

type SocialKey = keyof SiteSections["social"];

// Brand glyphs (Simple Icons, CC0), 24×24 viewBox
const PATHS: Record<SocialKey, string> = {
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  linkedin:
    "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  twitter:
    "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
};

const PLATFORMS: { key: SocialKey; label: string; color: string }[] = [
  { key: "facebook", label: "Facebook", color: "#1877f2" },
  { key: "instagram", label: "Instagram", color: "#dc2743" },
  { key: "linkedin", label: "LinkedIn", color: "#0a66c2" },
  { key: "twitter", label: "X (Twitter)", color: "#000000" },
  { key: "youtube", label: "YouTube", color: "#ff0000" },
];

export interface SocialLink {
  key: SocialKey | "whatsapp";
  label: string;
  href: string;
  color: string;
}

const withProtocol = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

/** WhatsApp (from the contact number) plus every social profile the admin filled in. */
export function useSocialLinks(): SocialLink[] {
  const contact = useSection("contact");
  const social = useSection("social");
  const links: SocialLink[] = [];
  const wa = phoneDigits(contact.whatsapp || contact.phone);
  if (wa) links.push({ key: "whatsapp", label: "WhatsApp", href: `https://wa.me/${wa}`, color: "#25D366" });
  for (const p of PLATFORMS) {
    const url = social[p.key]?.trim();
    if (url) links.push({ ...p, href: withProtocol(url) });
  }
  return links;
}

export function SocialIcon({ name, className = "w-4 h-4" }: { name: SocialLink["key"]; className?: string }) {
  if (name === "whatsapp") return <WhatsAppIcon className={className} />;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Round brand-coloured icon buttons; colour fills the button on hover. */
export function SocialButtons({ size = "w-10 h-10", iconSize = "w-[18px] h-[18px]" }: { size?: string; iconSize?: string }) {
  const links = useSocialLinks();
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={l.label}
          title={l.label}
          style={{ "--brand": l.color } as React.CSSProperties}
          className={`${size} rounded-full bg-white border border-slate-200 text-[color:var(--brand)] hover:bg-[color:var(--brand)] hover:border-[color:var(--brand)] hover:text-white flex items-center justify-center shadow-sm transition-all hover:-translate-y-0.5`}
        >
          <SocialIcon name={l.key} className={iconSize} />
        </a>
      ))}
    </div>
  );
}
