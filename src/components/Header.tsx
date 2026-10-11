"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Search,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";

interface HeaderProps {
  onOpenEnquiry?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const handleWhatsAppClick = () => {
    toast.success("Connecting to WhatsApp Support...", {
      description: "Chat with ABCO Food Supply sales team on +966 50 123 4567",
    });
    window.open("https://wa.me/966501234567?text=Hello%20ABCO%20Food%20Supply,%20I%20would%20like%20to%20enquire%20about%20your%20products.", "_blank");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.info(`Searching for "${searchQuery}"`, {
      description: "Found matching food products across our catalog.",
    });
    setSearchOpen(false);
    // Smooth scroll to products
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { name: "Home", href: "#hero", active: true },
    { name: "About Us", href: "#about" },
    {
      name: "Products",
      href: "#products",
      hasDropdown: true,
      subItems: [
        "Rice & Grains",
        "Fresh Meat & Poultry",
        "Seafood & Fishery",
        "Dairy Products",
        "Edible & Cooking Oils",
        "Food Ingredients & Spices",
        "Beverages & Juices",
        "Canned & Packaged Goods",
        "Frozen Foods",
        "Bakery & Confectionery",
      ],
    },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-100">
      {/* Top Info Bar */}
      <div className="bg-[#f8fafc] text-slate-600 border-b border-slate-200/70 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        <div className="w-full flex items-center justify-between py-2 gap-4">
          {/* Left: Quality Slogan */}
          <div className="flex items-center gap-1.5 text-slate-700 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
            <span className="text-sm font-semibold whitespace-nowrap">Quality Food. Reliable Supply.</span>
          </div>

          {/* Right: Contact Details + Social Icons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-5">
            {/* Contact Info Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
              <div className="flex items-center gap-1.5 text-slate-600 cursor-pointer hover:text-brand-red transition-colors">
                <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                <span className="text-sm font-medium">Jubail, Kingdom of Saudi Arabia</span>
              </div>

              <a
                href="mailto:info@abcofoodsupply.com"
                className="flex items-center gap-1.5 text-slate-600 hover:text-brand-red transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-red shrink-0" />
                <span className="text-sm font-medium">info@abcofoodsupply.com</span>
              </a>
            </div>

            {/* Social Icons — always in one row */}
            <div className="flex items-center gap-2 sm:pl-3 sm:border-l sm:border-slate-300">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                onClick={(e) => {
                  e.preventDefault();
                  toast("Facebook page link clicked");
                }}
                className="w-7 h-7 rounded-full bg-[#1877f2]/10 hover:bg-[#1877f2] text-[#1877f2] hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                onClick={(e) => {
                  e.preventDefault();
                  toast("Instagram page link clicked");
                }}
                className="w-7 h-7 rounded-full bg-[#e4405f]/10 hover:bg-[#e4405f] text-[#e4405f] hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                onClick={(e) => {
                  e.preventDefault();
                  toast("LinkedIn company profile link clicked");
                }}
                className="w-7 h-7 rounded-full bg-[#0a66c2]/10 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setProductsDropdownOpen(true)}
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                  >
                    <a
                      href={link.href}
                      className="flex items-center gap-1 text-[15px] font-semibold text-slate-700 hover:text-brand-red transition-colors py-2"
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          productsDropdownOpen ? "rotate-180 text-brand-red" : ""
                        }`}
                      />
                    </a>

                    {/* Dropdown Menu */}
                    {productsDropdownOpen && (
                      <div className="absolute left-0 top-full w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                          Food Product Categories
                        </div>
                        {link.subItems?.map((item) => (
                          <a
                            key={item}
                            href="#products"
                            onClick={() => {
                              setProductsDropdownOpen(false);
                              toast.info(`Filtered: ${item}`);
                            }}
                            className="block px-4 py-2 text-xs font-medium text-slate-700 hover:text-brand-red hover:bg-slate-50 transition-colors"
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-semibold transition-colors ${
                    link.active
                      ? "text-brand-red border-b-2 border-brand-red pb-1"
                      : "text-slate-700 hover:text-brand-red"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search products"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-red hover:border-brand-red/40 hover:bg-slate-50 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rice, meat, oils..."
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-brand-red"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-brand-red text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-brand-red-dark shrink-0"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>

            {/* Red Enquiry Pill Button */}
            <button
              onClick={onOpenEnquiry}
              className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <span>Enquiry</span>
            </button>

            {/* WhatsApp Green Pill Button */}
            <button
              onClick={handleWhatsAppClick}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={handleWhatsAppClick}
              className="p-2 rounded-full bg-[#25D366] text-white"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-brand-red"
            />
            <button
              type="submit"
              className="bg-brand-red text-white text-xs px-4 py-2 rounded-lg font-medium"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm font-medium ${
                  link.active
                    ? "bg-brand-red/10 text-brand-red font-semibold"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEnquiry) onOpenEnquiry();
              }}
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-full text-sm font-semibold tracking-wide shadow text-center"
            >
              Enquire Now
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-full text-sm font-semibold tracking-wide shadow flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Contact via WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
