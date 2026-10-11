"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Upload, 
  ExternalLink, 
  Check, 
  Copy, 
  X, 
  ThermometerSnowflake,
  ShieldCheck,
  Globe
} from "lucide-react";
import { ALL_PRODUCTS, ProductItem, CATEGORIES } from "@/data/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(ALL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStorage, setSelectedStorage] = useState<string>("all");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    categorySlug: "rice-and-grains",
    image: "/categories/rice-and-grains.png",
    origin: "Saudi Arabia (Local)",
    storageType: "Ambient",
    moq: "500 kg",
    packaging: "25 kg Multi-wall PP bags",
    shelfLife: "24 Months",
    certification: "100% SFDA & ISO 22000 Compliant",
    description: "",
  });

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.categorySlug === selectedCategory;
    const matchesStorage = selectedStorage === "all" || p.storageType.includes(selectedStorage);
    return matchesSearch && matchesCategory && matchesStorage;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("fileName", file.name.replace(/\.[^/.]+$/, ""));
      data.append("folder", "/afs-catalog");

      const res = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        setFormData((prev) => ({ ...prev, image: result.url }));
      } else {
        alert("ImageKit upload error. Using fallback image.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = CATEGORIES.find((c) => c.slug === formData.categorySlug);
    const newProduct: ProductItem = {
      id: `sku-${Date.now()}`,
      name: formData.name,
      categorySlug: formData.categorySlug,
      categoryName: cat?.name || "General Food Supply",
      image: formData.image || "/categories/rice-and-grains.png",
      origin: formData.origin as any,
      storageType: formData.storageType as any,
      moq: formData.moq,
      packaging: formData.packaging,
      shelfLife: formData.shelfLife,
      certification: formData.certification,
      description: formData.description,
      specs: {
        "Grade / Quality": "Wholesale Commercial A-Grade",
        "SFDA Standard": "Compliant with Saudi Food Regulations",
        "Recommended Usage": "Hospitality & Institutional Catering",
      },
    };

    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      categorySlug: "rice-and-grains",
      image: "/categories/rice-and-grains.png",
      origin: "Saudi Arabia (Local)",
      storageType: "Ambient",
      moq: "500 kg",
      packaging: "25 kg Multi-wall PP bags",
      shelfLife: "24 Months",
      certification: "100% SFDA & ISO 22000 Compliant",
      description: "",
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product SKU?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const copyUrl = (id: string, url: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Package className="w-7 h-7 text-brand-red" />
            <span>Product Catalog & SKU Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Manage wholesale inventory, storage conditions, ImageKit assets, and B2B specifications.
          </p>
        </div>

        {/* Red Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Product SKU</span>
        </button>
      </div>

      {/* Filter and Search Bar: White background, Black text */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU name, origin, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red font-bold"
          >
            <option value="all">All Categories ({CATEGORIES.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Storage Filter */}
          <select
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red font-bold"
          >
            <option value="all">All Storage Conditions</option>
            <option value="Ambient">Ambient</option>
            <option value="Chilled">Chilled (+4°C)</option>
            <option value="Frozen">Frozen (-18°C)</option>
          </select>

          <span className="text-xs text-slate-600 font-bold px-2">
            Showing <strong className="text-slate-900 font-black">{filteredProducts.length}</strong> SKUs
          </span>
        </div>
      </div>

      {/* Products Table: White card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Product / Image</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Origin & Storage</th>
                <th className="py-3.5 px-4">Packaging & MOQ</th>
                <th className="py-3.5 px-4">Certification</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0 overflow-hidden">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 hover:text-brand-red transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ID: {p.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                      {p.categoryName}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>{p.origin}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-brand-red mt-1 font-bold">
                      <ThermometerSnowflake className="w-3 h-3 text-brand-red" />
                      <span>{p.storageType}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-slate-900 font-bold">{p.packaging}</div>
                    <div className="text-[11px] text-slate-600 font-medium mt-0.5">MOQ: {p.moq}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SFDA Compliant</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyUrl(p.id, p.image)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black border border-slate-200 transition-colors cursor-pointer"
                        title="Copy Image URL (ImageKit CDN)"
                      >
                        {copiedId === p.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <Link
                        href={`/products/${p.categorySlug}/${p.id}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-brand-red border border-slate-200 transition-colors"
                        title="View Live SKU Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-brand-red border border-red-200 transition-colors cursor-pointer"
                        title="Delete SKU"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal: Clean White */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-red" />
                  <span>Register New Wholesale Product SKU</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Upload high-res product photos to ImageKit CDN and configure SFDA specifications.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Product SKU Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aged 1121 XXL Basmati Rice"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Supply Category</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ImageKit Upload / CDN Field */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-slate-800 font-bold">
                  Product Image (ImageKit CDN)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-20 h-20 bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5 text-white" />
                        <span>{isUploading ? "Uploading to CDN..." : "Upload from Device"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">Auto-hosted on ImageKit CDN</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste direct image URL"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Country of Origin</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                  >
                    <option value="Saudi Arabia (Local)">Saudi Arabia (Local)</option>
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Australia">Australia</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="USA">USA</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Global">Global</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Storage Condition</label>
                  <select
                    value={formData.storageType}
                    onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                  >
                    <option value="Ambient">Ambient (Dry & Ventilated)</option>
                    <option value="Chilled (+4°C)">Chilled (+4°C)</option>
                    <option value="Frozen (-18°C)">Frozen (-18°C)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Minimum Order Qty (MOQ)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 kg or 1 Full Container Load"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Bulk Packaging Standard</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25kg PP bags, 10x1kg carton"
                    value={formData.packaging}
                    onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Wholesale grade specifications, culinary applications, quality grading..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
                />
              </div>

              {/* Red Save Button */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-black font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold shadow-md shadow-brand-red/25 transition-all cursor-pointer"
                >
                  Save & Publish SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
