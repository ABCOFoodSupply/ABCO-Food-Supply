"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Logo } from "./Logo";
import { useSection } from "./SiteSectionsProvider";
import { SocialButtons } from "./SocialLinks";
import { phoneDigits } from "@/lib/siteSections";

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.14em] text-slate-900 mb-5">
    {children}
    <span className="block w-8 h-0.5 bg-brand-red rounded-full mt-2.5" />
  </h4>
);

const LinkArrow = () => (
  <ChevronRight className="w-3.5 h-3.5 -ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-red" />
);

export const Footer: React.FC = () => {
  const contact = useSection("contact");
  const footer = useSection("footer");

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const ourServices = [
    "Import & Distribution",
    "Procurement Support",
    "Logistics Coordination",
    "Fleet & Transport",
    "Custom Packaging",
    "Supply Chain Solutions",
  ];

  const categories = [
    { name: "Rice & Grains", slug: "rice-and-grains" },
    { name: "Meat", slug: "meat" },
    { name: "Seafood", slug: "seafood" },
    { name: "Poultry", slug: "poultry" },
    { name: "Dairy Products", slug: "dairy" },
    { name: "Edible Oils", slug: "edible-oils" },
    { name: "Food Ingredients", slug: "food-ingredients" },
    { name: "Beverages", slug: "beverages" },
    { name: "Fruits & Vegetables", slug: "fruits-and-vegetables" },
    { name: "Canned & Packaged", slug: "canned-packaged" },
    { name: "Frozen Foods", slug: "frozen-foods" },
    { name: "Bakery & Confectionery", slug: "bakery-confectionery" },
  ];

  const contacts = [
    { icon: MapPin, label: contact.address, href: undefined },
    { icon: Phone, label: contact.phone, href: `tel:+${phoneDigits(contact.phone)}` },
    { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
  ];

  const socialClass =
    "w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm transition-all hover:-translate-y-0.5 hover:text-white cursor-pointer";

  const linkClass =
    "group inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-red font-medium transition-colors";

  return (
    <footer className="relative bg-slate-50 border-t border-slate-200/80 text-slate-600">
      {/* Brand accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-red via-red-400 to-brand-green" />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 pt-14 sm:pt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1.5fr_0.8fr_1fr_1.7fr] gap-x-8 xl:gap-x-12 gap-y-10 pb-12 border-b border-slate-200">
          {/* Brand + Contact */}
          <div className="col-span-2 lg:col-span-4 xl:col-span-1 space-y-5 lg:grid lg:grid-cols-2 lg:gap-10 lg:space-y-0 xl:block xl:space-y-5">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 max-w-sm">
                {footer.bio}
              </p>

              {/* Social Icons (Admin → Contact & Social) */}
              <div className="pt-1">
                <SocialButtons />
              </div>
            </div>
            {/* Contact */}
            <ul className="space-y-3 lg:pt-2 xl:pt-1">
              {contacts.map(({ icon: Icon, label, href }) => {
                const content = (
                  <>
                    <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-brand-red flex items-center justify-center shrink-0 shadow-sm group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-red transition-colors [overflow-wrap:anywhere]">
                      {label}
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="group flex items-center gap-3">
                        {content}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-3">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <Heading>Quick Links</Heading>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={linkClass}>
                    <LinkArrow />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <Heading>Our Services</Heading>
            <ul className="space-y-3">
              {ourServices.map((service) => (
                <li key={service}>
                  <Link href="/services" className={linkClass}>
                    <LinkArrow />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div className="col-span-2 xl:col-span-1">
            <Heading>Product Categories</Heading>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-x-4 gap-y-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.slug}`} className={linkClass}>
                    <LinkArrow />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ABCO Food Supply. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-slate-400 hover:text-brand-red transition-colors font-medium">
              AFS Admin Portal
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="font-bold text-slate-700">
              {footer.tagline} <span className="text-brand-red">{footer.taglineHighlight}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
