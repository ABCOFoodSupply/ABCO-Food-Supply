"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LayoutTemplate,
  Package,
  Inbox,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle,
  Database,
  CloudLightning,
  ChevronRight,
  Info,
  Briefcase,
  Contact
} from "lucide-react";
import { Logo } from "@/components/Logo";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(null);

  // If on login page, render raw children without the admin sidebar/topbar
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      const session = localStorage.getItem("afs_admin_session");
      if (!session) {
        router.push("/admin/login");
      } else {
        try {
          setAdminUser(JSON.parse(session));
        } catch {
          setAdminUser({
            name: "AFS Jubail Headquarters",
            email: "admin@abcofoodsupply.com",
            role: "super_admin",
          });
        }
      }
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch { /* ignore */ }
    if (typeof window !== "undefined") {
      localStorage.removeItem("afs_admin_session");
    }
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Home Page CMS", href: "/admin/cms", icon: LayoutTemplate, badge: "Sections", badgeColor: "bg-brand-red text-white font-bold" },
    { name: "About Page", href: "/admin/about-page", icon: Info },
    { name: "Services Page", href: "/admin/services-page", icon: Briefcase },
    { name: "Contact & Social", href: "/admin/contact-settings", icon: Contact },
    { name: "Products & Categories", href: "/admin/products", icon: Package },
    { name: "Wholesale RFQs", href: "/admin/rfq", icon: Inbox, badgeColor: "bg-brand-red text-white font-bold" },
    { name: "Gallery", href: "/admin/media", icon: ImageIcon },
    { name: "Clients & Partners", href: "/admin/partners", icon: Users },
    { name: "Admin Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Clean White Background */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 lg:bottom-auto left-0 z-50 w-72 lg:h-screen shrink-0 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out shadow-xs ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header with Exact Navbar Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="h-10" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-500 hover:text-black p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation items: text black, when active in particular tag -> RED with WHITE text */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm transition-all ${
                  isActive
                    ? "bg-brand-red text-white font-bold shadow-md shadow-brand-red/25"
                    : "text-slate-900 hover:text-brand-red hover:bg-slate-100/80 font-semibold"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-600"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badgeColor || "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Quick Customer Link */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 hover:text-brand-red text-xs font-bold border border-slate-200/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-brand-red" />
              <span>View Customer Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center font-bold text-white text-xs shadow-xs shrink-0">
                AF
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {adminUser?.name || "AFS Admin"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {adminUser?.email || "admin@abcofoodsupply.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/70">
        {/* Top Header - White Background */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-700 hover:text-black p-1.5 -ml-1 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-900">AFS Portal</span>
              <span>/</span>
              <span className="text-brand-red font-bold capitalize">
                {pathname.replace("/admin", "").replace("/", "") || "Executive Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search RFQ, SKU, Client..."
                className="bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red w-56 font-medium"
              />
            </div>

            <button className="relative p-2 text-slate-600 hover:text-black hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Production Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
