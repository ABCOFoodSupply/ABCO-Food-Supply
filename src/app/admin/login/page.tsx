"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Sparkles
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { authenticateAdmin, DEFAULT_ADMIN_CREDENTIALS } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const admin = await authenticateAdmin(email, password);
      if (admin) {
        if (typeof window !== "undefined") {
          localStorage.setItem("afs_admin_session", JSON.stringify(admin));
        }
        router.push("/admin");
      } else {
        setError("Invalid administrative credentials. Please verify your email and password.");
      }
    } catch {
      setError("An unexpected authentication error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Back to website button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-red bg-white hover:bg-slate-50 px-4 py-2 rounded-full border border-slate-200 transition-all shadow-xs"
        >
          <Building2 className="w-4 h-4 text-brand-red" />
          <span>Back to Main Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header branding with Navbar Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4">
            <Logo className="h-11" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            AFS Command Center
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Administrative & Operations Portal</span>
          </p>
        </div>

        {/* Login Card - Clean White */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Administrator Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@abcofoodsupply.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Master Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Fill Helper */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                <span>One-Click Fill Credentials</span>
              </button>
            </div>

            {/* Credentials Card: Black text on clean light background */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1.5">
              <div className="text-slate-800 font-bold flex items-center justify-between">
                <span>Default Admin Credentials:</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">READY</span>
              </div>
              <div className="flex items-center justify-between text-slate-900">
                <span className="text-slate-600 font-medium">Email:</span>
                <code className="text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                  admin@abcofoodsupply.com
                </code>
              </div>
              <div className="flex items-center justify-between text-slate-900">
                <span className="text-slate-600 font-medium">Password:</span>
                <code className="text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                  AdminPassword2026!
                </code>
              </div>
              <div className="text-[10px] text-slate-500 text-center pt-1 font-medium">
                Also accepted: Password <code className="text-slate-800 font-bold">Abcofood@0302</code> or <code className="text-slate-800 font-bold">admin123</code>
              </div>
            </div>

            {/* Red Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-brand-red/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Credentials info note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" />
              <span>Secured Admin Access Control</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Jubail Industrial City Depot • CR: 2050123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
