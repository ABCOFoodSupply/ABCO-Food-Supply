"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Layers, 
  ExternalLink, 
  Edit3, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Search
} from "lucide-react";
import { CATEGORIES, CategoryInfo } from "@/data/products";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Layers className="w-7 h-7 text-brand-red" />
            <span>Supply Categories Taxonomy</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Configure the 12 primary food sectors, cold-chain parameters, and wholesale specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs">
            {categories.length} Verified Categories
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search category name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
          />
        </div>
      </div>

      {/* Categories Grid - Clean White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.slug}
            className="bg-white border border-slate-200 hover:border-brand-red/40 rounded-3xl p-6 flex flex-col justify-between transition-all group shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-2xl bg-red-50 border border-red-100 p-2 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-brand-red border border-red-200">
                    {cat.skuCount}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 font-medium">/{cat.slug}</div>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-red transition-colors">
                {cat.name}
              </h3>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-medium">
                {cat.shortDesc}
              </p>

              {/* Temperature & Storage Badge */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-brand-red" />
                  <span className="text-[11px] truncate max-w-[170px]">{cat.storageTemp}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SFDA Regulated</span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                  Procurement Standards
                </span>
                <ul className="space-y-1">
                  {cat.keyHighlights.slice(0, 2).map((h, i) => (
                    <li key={i} className="text-[11px] text-slate-700 font-medium flex items-start gap-1.5">
                      <span className="text-brand-red shrink-0 font-bold">•</span>
                      <span className="line-clamp-1">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setEditingCategory(cat)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-brand-red font-bold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Configure Specs</span>
              </button>

              <Link
                href={`/products/${cat.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
              >
                <span>View Live</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setEditingCategory(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Category: {editingCategory.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Configure logistics specs and certifications</p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-black p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Storage Condition</label>
                <input
                  type="text"
                  value={editingCategory.storageTemp}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, storageTemp: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Short Summary</label>
                <textarea
                  rows={3}
                  value={editingCategory.shortDesc}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, shortDesc: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-slate-600 hover:text-black font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setCategories(
                      categories.map((c) => (c.slug === editingCategory.slug ? editingCategory : c))
                    );
                    setEditingCategory(null);
                  }}
                  className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer shadow-md shadow-brand-red/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
