"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Logo } from "./Logo";

interface HeaderProps {
  onOpenEnquiry?: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { id: "c1", name: "Rice & Grains", slug: "rice-and-grains" },
  { id: "c2", name: "Meat", slug: "meat" },
  { id: "c3", name: "Seafood", slug: "seafood" },
  { id: "c4", name: "Poultry", slug: "poultry" },
  { id: "c5", name: "Dairy Products", slug: "dairy" },
  { id: "c6", name: "Edible Oils", slug: "edible-oils" },
  { id: "c7", name: "Food Ingredients", slug: "food-ingredients" },
  { id: "c8", name: "Beverages", slug: "beverages" },
  { id: "c9", name: "Fruits & Vegetables", slug: "fruits-and-vegetables" },
  { id: "c10", name: "Canned & Packaged", slug: "canned-packaged" },
  { id: "c11", name: "Frozen Foods", slug: "frozen-foods" },
  { id: "c12", name: "Bakery & Confectionery", slug: "bakery-confectionery" },
];

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>(FALLBACK_CATEGORIES);

  // Fetch categories from DB dynamically
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: CategoryItem[] = json.data.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
            }));
            setCategories(mapped);
          }
        }
      } catch {
        // Keep fallback categories on error
      }
    }
    loadCategories();
  }, []);

  const handleWhatsAppClick = () => {
    toast.success("Connecting to WhatsApp Support...", {
      description: "Chat with ABCO Food Supply sales team on +966 57 299 5987",
    });
    window.open("https://wa.me/966572995987?text=Hello%20ABCO%20Food%20Supply,%20I%20would%20like%20to%20enquire%20about%20your%20products.", "_blank");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  const staticNavLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/#services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-100">
      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {/* Home */}
            <Link
              href="/"
              className="text-[15px] font-semibold text-slate-700 hover:text-brand-red transition-colors"
            >
              Home
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              className="text-[15px] font-semibold text-slate-700 hover:text-brand-red transition-colors"
            >
              About Us
            </Link>

            {/* Products with dynamic dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <Link
                href="/products"
                className="flex items-center gap-1 text-[15px] font-semibold text-slate-700 hover:text-brand-red transition-colors py-2"
              >
                Products
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    productsDropdownOpen ? "rotate-180 text-brand-red" : ""
                  }`}
                />
              </Link>

              {/* Dropdown Menu */}
              {productsDropdownOpen && (
                <div className="absolute left-0 top-full w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Food Product Categories
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setProductsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-brand-red hover:bg-slate-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      href="/products"
                      onClick={() => setProductsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-bold text-brand-red hover:bg-red-50 transition-colors"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/#services" className="text-[15px] font-semibold text-slate-700 hover:text-brand-red transition-colors">
              Services
            </Link>
            <Link href="/gallery" className="text-[15px] font-semibold text-slate-700 hover:text-brand-red transition-colors">
              Gallery
            </Link>
            <Link href="/contact" className="text-[15px] font-semibold text-slate-700 hover:text-brand-red transition-colors">
              Contact
            </Link>
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
                    className="bg-brand-red text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-red-700 shrink-0"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>

            {/* Red Enquiry Pill Button */}
            <button
              onClick={onOpenEnquiry}
              className="bg-brand-red hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <span>Enquiry</span>
            </button>

            {/* WhatsApp Green Pill Button */}
            <button
              onClick={handleWhatsAppClick}
              className="bg-[#25D366] hover:bg-[#1fa855] text-white px-4 py-2.5 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2"
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

          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-brand-red transition-colors"
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-brand-red transition-colors"
            >
              About Us
            </Link>

            {/* Products with dynamic mobile categories */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between rounded-xl hover:bg-slate-50 transition-colors">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-3 text-sm font-semibold text-slate-800 hover:text-brand-red transition-colors"
                >
                  Products
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  aria-label="Toggle products categories"
                  className="p-2.5 text-slate-500 hover:text-brand-red transition-colors"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileProductsOpen ? "rotate-180 text-brand-red" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Expandable Mobile Categories — dynamic from DB */}
              {mobileProductsOpen && (
                <div className="pl-4 pr-2 py-1.5 space-y-1 bg-slate-50/70 rounded-xl my-1 border border-slate-100 max-h-64 overflow-y-auto">
                  <Link
                    href="/products"
                    onClick={() => { setMobileMenuOpen(false); setMobileProductsOpen(false); }}
                    className="block py-2 px-3 text-xs font-bold text-brand-red hover:bg-white rounded-lg transition-colors border-b border-slate-200/60 mb-1"
                  >
                    View All Products (Full Catalog)
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => { setMobileMenuOpen(false); setMobileProductsOpen(false); }}
                      className="block py-1.5 px-3 text-xs font-medium text-slate-700 hover:text-brand-red hover:bg-white rounded-lg transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-brand-red transition-colors"
            >
              Services
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-brand-red transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-brand-red transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEnquiry) onOpenEnquiry();
              }}
              className="w-full bg-brand-red hover:bg-red-700 text-white py-3 rounded-full text-sm font-semibold tracking-wide shadow text-center"
            >
              Enquire Now
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-[#25D366] hover:bg-[#1fa855] text-white py-3 rounded-full text-sm font-semibold tracking-wide shadow flex items-center justify-center gap-2"
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
