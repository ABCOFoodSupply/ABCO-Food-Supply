"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";

export const Footer: React.FC = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/#services" },
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

  const categoriesLeft = [
    { name: "Rice & Grains", slug: "rice-and-grains" },
    { name: "Meat", slug: "meat" },
    { name: "Seafood", slug: "seafood" },
    { name: "Poultry", slug: "poultry" },
    { name: "Dairy Products", slug: "dairy" },
    { name: "Edible Oils", slug: "edible-oils" },
  ];

  const categoriesRight = [
    { name: "Food Ingredients", slug: "food-ingredients" },
    { name: "Beverages", slug: "beverages" },
    { name: "Fruits & Vegetables", slug: "fruits-and-vegetables" },
    { name: "Canned & Packaged", slug: "canned-packaged" },
    { name: "Frozen Foods", slug: "frozen-foods" },
    { name: "Bakery & Confectionery", slug: "bakery-confectionery" },
  ];

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-14 pb-8 text-slate-600 text-sm sm:text-base">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-200/80">
          {/* Col 1: Brand & Bio (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Logo variant="full" />
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
              Distributor of imported & locally manufactured food products across the Kingdom of Saudi Arabia.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/966572995987"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>

              <button
                onClick={() => toast.info("Opening Facebook")}
                className="w-10 h-10 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              <button
                onClick={() => toast.info("Opening Instagram")}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-brand-red transition-colors inline-block text-slate-600 hover:translate-x-1 transform duration-150 text-sm sm:text-[15px] font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Our Services (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {ourServices.map((service) => (
                <li key={service}>
                  <Link
                    href="/#services"
                    className="hover:text-brand-red transition-colors inline-block text-slate-600 hover:translate-x-1 transform duration-150 text-sm sm:text-[15px] font-medium"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Product Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
              Product Categories
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <ul className="space-y-2.5">
                {categoriesLeft.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className="hover:text-brand-red transition-colors inline-block text-slate-600 hover:translate-x-1 transform duration-150 text-sm sm:text-[15px] font-medium"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2.5">
                {categoriesRight.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className="hover:text-brand-red transition-colors inline-block text-slate-600 hover:translate-x-1 transform duration-150 text-sm sm:text-[15px] font-medium"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 5: Contact Us (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm sm:text-[15px] font-medium leading-snug">Jubail, Kingdom of Saudi Arabia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-brand-red shrink-0" />
                <span className="text-slate-600 text-sm sm:text-[15px] font-medium">+966 57 299 5987</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-brand-red shrink-0" />
                <a
                  href="mailto: abcofoodsupply@gmail.com"
                  className="hover:text-brand-red text-slate-600 text-sm sm:text-[15px] font-medium transition-colors break-all"
                >
                   abcofoodsupply@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Slogan */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} ABCO Food Supply. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="text-slate-400 hover:text-brand-red transition-colors font-medium flex items-center gap-1"
            >
              <span>AFS Admin Portal</span>
            </Link>
            <span className="text-slate-300">•</span>
            <p className="font-semibold text-slate-600">Quality Food. Reliable Supply.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
