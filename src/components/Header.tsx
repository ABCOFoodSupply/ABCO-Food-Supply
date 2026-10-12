"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Info,
  Package,
  Briefcase,
  Images,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { usePathname, useRouter } from "next/navigation";
import { useSection } from "./SiteSectionsProvider";
import { phoneDigits } from "@/lib/siteSections";
import { toast } from "sonner";
import { Logo } from "./Logo";

interface HeaderProps {
  onOpenEnquiry?: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
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
  const pathname = usePathname();
  const contact = useSection("contact");
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
              image: cat.image,
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

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
  };

  const mobileNavLinks: { name: string; href: string; icon: LucideIcon }[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Services", href: "/services", icon: Briefcase },
    { name: "Gallery", href: "/gallery", icon: Images },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const handleWhatsAppClick = () => {
    toast.success("Connecting to WhatsApp Support...", {
      description: `Chat with ABCO Food Supply sales team on ${contact.phone}`,
    });
    window.open(
      `https://wa.me/${phoneDigits(contact.whatsapp || contact.phone)}?text=${encodeURIComponent(
        "Hello ABCO Food Supply, I would like to enquire about your products."
      )}`,
      "_blank"
    );
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
    { name: "Services", href: "/services" },
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
            <Logo imageClassName="h-14 sm:h-16 md:h-[72px] w-auto" />
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

              {/* Dropdown Menu (pt-3 bridges the gap so moving the mouse down doesn't close it) */}
              {productsDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                  <div className="relative w-[560px] bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
                      <div>
                        <p className="text-sm font-black text-slate-900">Shop by Category</p>
                        <p className="text-[11px] text-slate-500 font-medium">Wholesale food supply across Saudi Arabia</p>
                      </div>
                      <span className="text-[11px] font-bold text-brand-red bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                        {categories.length} Categories
                      </span>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-2 gap-1 p-2.5 max-h-[60vh] overflow-y-auto">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={() => setProductsDropdownOpen(false)}
                          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-red-50/70 transition-colors"
                        >
                          <span className="relative w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/80 group-hover:border-red-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {cat.image ? (
                              <Image src={cat.image} alt="" fill className="object-cover" sizes="40px" />
                            ) : (
                              <span className="text-xs font-black text-brand-red">{cat.name.charAt(0)}</span>
                            )}
                          </span>
                          <span className="text-[13px] font-semibold text-slate-700 group-hover:text-brand-red transition-colors leading-snug">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 pt-0">
                      <Link
                        href="/products"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="flex items-center justify-center w-full py-2.5 rounded-xl bg-red-50 hover:bg-brand-red text-brand-red hover:text-white text-[13px] font-bold transition-colors"
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/services" className="text-[15px] font-semibold text-slate-700 hover:text-brand-red transition-colors">
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
              <WhatsAppIcon className="w-4 h-4" />
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
              <WhatsAppIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div
          onClick={closeMobileMenu}
          className={`fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
        />

        {/* Panel */}
        <aside
          className={`fixed top-0 right-0 z-[61] h-[100dvh] w-[86%] max-w-sm bg-white shadow-2xl flex flex-col transition-[transform,visibility] duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0 visible" : "translate-x-full invisible"
          }`}
          aria-label="Mobile menu"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 h-20 border-b border-slate-100 shrink-0">
            <Link href="/" onClick={closeMobileMenu}>
              <Logo imageClassName="h-12 w-auto" />
            </Link>
            <button
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-brand-red flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            {/* Search */}
            <form onSubmit={(e) => { handleSearchSubmit(e); closeMobileMenu(); }} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rice, meat, oils..."
                className="w-full text-sm pl-10 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/10 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-red hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
              >
                Search
              </button>
            </form>

            {/* Navigation */}
            <nav className="space-y-1">
              <p className="px-3 pb-1 text-[11px] font-black uppercase tracking-wider text-slate-400">Menu</p>

              {mobileNavLinks.slice(0, 2).map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors ${
                      active ? "bg-red-50 text-brand-red" : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      active ? "bg-brand-red text-white" : "bg-slate-100 text-slate-500 group-hover:text-brand-red"
                    }`}>
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <span className="flex-1">{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${active ? "text-brand-red" : "text-slate-300"}`} />
                  </Link>
                );
              })}

              {/* Products accordion */}
              <div className={`rounded-xl transition-colors ${mobileProductsOpen ? "bg-slate-50" : ""}`}>
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  aria-expanded={mobileProductsOpen}
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors ${
                    pathname.startsWith("/products") ? "text-brand-red" : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    pathname.startsWith("/products") || mobileProductsOpen
                      ? "bg-brand-red text-white"
                      : "bg-slate-100 text-slate-500 group-hover:text-brand-red"
                  }`}>
                    <Package className="w-[18px] h-[18px]" />
                  </span>
                  <span className="flex-1 text-left">Products</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileProductsOpen ? "rotate-180 text-brand-red" : "text-slate-400"
                    }`}
                  />
                </button>

                {mobileProductsOpen && (
                  <div className="px-2 pb-2.5 pt-1 space-y-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-200/80 hover:border-brand-red/40 transition-colors min-w-0"
                        >
                          <span className="relative w-8 h-8 rounded-md bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                            {cat.image ? (
                              <Image src={cat.image} alt="" fill className="object-cover" sizes="32px" />
                            ) : (
                              <span className="text-[11px] font-black text-brand-red">{cat.name.charAt(0)}</span>
                            )}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 leading-tight">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/products"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center w-full py-2.5 rounded-lg bg-red-50 text-brand-red text-xs font-bold hover:bg-brand-red hover:text-white transition-colors"
                    >
                      View All Products
                    </Link>
                  </div>
                )}
              </div>

              {mobileNavLinks.slice(2).map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors ${
                      active ? "bg-red-50 text-brand-red" : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      active ? "bg-brand-red text-white" : "bg-slate-100 text-slate-500 group-hover:text-brand-red"
                    }`}>
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <span className="flex-1">{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${active ? "text-brand-red" : "text-slate-300"}`} />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sticky Footer CTAs */}
          <div className="shrink-0 border-t border-slate-100 bg-white px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3">
            <a
              href={`tel:+${phoneDigits(contact.phone)}`}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-brand-red flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold text-slate-500">Need help? Call us</span>
                <span className="block text-sm font-bold text-slate-900">{contact.phone}</span>
              </span>
            </a>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  closeMobileMenu();
                  if (onOpenEnquiry) onOpenEnquiry();
                }}
                className="bg-brand-red hover:bg-red-700 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-brand-red/20 transition-colors"
              >
                Enquire Now
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="bg-[#25D366] hover:bg-[#1fa855] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
};
