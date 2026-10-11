"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Trash2,
  Upload,
  ExternalLink,
  X,
  Layers,
  Globe,
  ThermometerSnowflake,
  ShieldCheck,
  ImageIcon,
  Tag,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────
interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  show_on_homepage: boolean;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  category_slug: string;
  category_name: string;
  image: string;
  origin: string;
  storage_type: string;
  moq: string;
  packaging: string;
  shelf_life: string;
  certification: string;
  description: string;
  specs: Record<string, string>;
  created_at?: string;
}

// ─── Helper: slugify ─────────────────────────────────────────────────────────
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─── ImageKit uploader ───────────────────────────────────────────────────────
async function uploadToImageKit(file: File, folder: string): Promise<string | null> {
  const data = new FormData();
  data.append("file", file);
  data.append("fileName", file.name.replace(/\.[^/.]+$/, ""));
  data.append("folder", folder);
  const res = await fetch("/api/imagekit/upload", { method: "POST", body: data });
  if (!res.ok) return null;
  const result = await res.json();
  return result.url || null;
}

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN PRODUCTS PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "products">("categories");

  // ── State: Categories ────────────────────────────────────────────────────
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [catSearch, setCatSearch] = useState("");
  const [catLoading, setCatLoading] = useState(true);
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<ProductCategory | null>(null);
  const [catUploading, setCatUploading] = useState(false);
  const [catForm, setCatForm] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
    show_on_homepage: false,
  });

  // ── State: Products ──────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [prodSearch, setProdSearch] = useState("");
  const [prodCatFilter, setProdCatFilter] = useState("all");
  const [prodLoading, setProdLoading] = useState(true);
  const [isAddProdOpen, setIsAddProdOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [prodUploading, setProdUploading] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: "",
    category_slug: "",
    image: "",
    origin: "India",
    storage_type: "Ambient",
    moq: "",
    packaging: "",
    shelf_life: "24 Months",
    certification: "SFDA Compliant, Halal",
    description: "",
    specs: {} as Record<string, string>,
    // extra spec fields (key-value pairs for dynamic specs)
    specKey1: "",
    specVal1: "",
    specKey2: "",
    specVal2: "",
    specKey3: "",
    specVal3: "",
  });

  // ── Fetch categories ─────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data || []);
    } catch {
      toast.error("Could not load categories");
    } finally {
      setCatLoading(false);
    }
  }, []);

  // ── Fetch products ───────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProdLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) setProducts(json.data || []);
    } catch {
      toast.error("Could not load products");
    } finally {
      setProdLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // ── Category: auto-slug ──────────────────────────────────────────────────
  const handleCatNameChange = (name: string) => {
    setCatForm((prev) => ({ ...prev, name, slug: slugify(name) }));
  };

  // ── Category: image upload ───────────────────────────────────────────────
  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCatUploading(true);
    const url = await uploadToImageKit(file, "/afs-cms/categories");
    if (url) {
      setCatForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } else {
      toast.error("Image upload failed");
    }
    setCatUploading(false);
  };

  // ── Category: save ───────────────────────────────────────────────────────
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<ProductCategory> = {
        name: catForm.name,
        slug: catForm.slug,
        image: catForm.image,
        description: catForm.description,
        show_on_homepage: catForm.show_on_homepage,
        sort_order: editingCat?.sort_order ?? categories.length + 1,
      };
      if (editingCat) payload.id = editingCat.id;

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.success(editingCat ? "Category updated!" : "Category added!");
      setIsAddCatOpen(false);
      setEditingCat(null);
      setCatForm({ name: "", slug: "", image: "", description: "", show_on_homepage: false });
      fetchCategories();
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  // ── Category: toggle homepage ─────────────────────────────────────────────
  const handleToggleHomepage = async (cat: ProductCategory) => {
    try {
      const res = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, show_on_homepage: !cat.show_on_homepage }),
      });
      const json = await res.json();
      if (!json.success) throw new Error("Toggle failed");
      toast.success(
        !cat.show_on_homepage
          ? `"${cat.name}" will now show on Homepage`
          : `"${cat.name}" removed from Homepage`
      );
      fetchCategories();
    } catch {
      toast.error("Could not update homepage visibility");
    }
  };

  // ── Category: delete ─────────────────────────────────────────────────────
  const handleDeleteCategory = async (cat: ProductCategory) => {
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/categories?id=${cat.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error("Delete failed");
      toast.success(`"${cat.name}" deleted`);
      fetchCategories();
    } catch {
      toast.error("Could not delete category");
    }
  };

  // ── Category: open edit ───────────────────────────────────────────────────
  const openEditCat = (cat: ProductCategory) => {
    setEditingCat(cat);
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      description: cat.description,
      show_on_homepage: cat.show_on_homepage,
    });
    setIsAddCatOpen(true);
  };

  // ── Product: image upload ─────────────────────────────────────────────────
  const handleProdImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProdUploading(true);
    const url = await uploadToImageKit(file, "/afs-catalog");
    if (url) {
      setProdForm((prev) => ({ ...prev, image: url }));
      toast.success("Product image uploaded");
    } else {
      toast.error("Image upload failed");
    }
    setProdUploading(false);
  };

  // ── Product: open edit ───────────────────────────────────────────────────
  const openEditProd = (p: Product) => {
    setEditingProd(p);
    const specEntries = Object.entries(p.specs || {});
    setProdForm({
      name: p.name,
      category_slug: p.category_slug,
      image: p.image || "",
      origin: p.origin || "India",
      storage_type: p.storage_type || "Ambient",
      moq: p.moq || "",
      packaging: p.packaging || "",
      shelf_life: p.shelf_life || "24 Months",
      certification: p.certification || "SFDA Compliant, Halal",
      description: p.description || "",
      specs: p.specs || {},
      specKey1: specEntries[0]?.[0] || "",
      specVal1: specEntries[0]?.[1] || "",
      specKey2: specEntries[1]?.[0] || "",
      specVal2: specEntries[1]?.[1] || "",
      specKey3: specEntries[2]?.[0] || "",
      specVal3: specEntries[2]?.[1] || "",
    });
    setIsAddProdOpen(true);
  };

  // ── Product: save / update ────────────────────────────────────────────────
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.slug === prodForm.category_slug);
    const specs: Record<string, string> = {};
    if (prodForm.specKey1 && prodForm.specVal1) specs[prodForm.specKey1] = prodForm.specVal1;
    if (prodForm.specKey2 && prodForm.specVal2) specs[prodForm.specKey2] = prodForm.specVal2;
    if (prodForm.specKey3 && prodForm.specVal3) specs[prodForm.specKey3] = prodForm.specVal3;

    const payload: Partial<Product> = {
      id: editingProd ? editingProd.id : `prod-${Date.now()}`,
      name: prodForm.name,
      category_slug: prodForm.category_slug,
      category_name: cat?.name || "General",
      image: prodForm.image,
      origin: prodForm.origin,
      storage_type: prodForm.storage_type,
      moq: prodForm.moq,
      packaging: prodForm.packaging,
      shelf_life: prodForm.shelf_life,
      certification: prodForm.certification,
      description: prodForm.description,
      specs,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      toast.success(editingProd ? `"${prodForm.name}" updated successfully!` : `"${prodForm.name}" added to catalog!`);
      setIsAddProdOpen(false);
      setEditingProd(null);
      setProdForm({
        name: "",
        category_slug: categories[0]?.slug || "",
        image: "",
        origin: "India",
        storage_type: "Ambient",
        moq: "",
        packaging: "",
        shelf_life: "24 Months",
        certification: "SFDA Compliant, Halal",
        description: "",
        specs: {},
        specKey1: "",
        specVal1: "",
        specKey2: "",
        specVal2: "",
        specKey3: "",
        specVal3: "",
      });
      fetchProducts();
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  // ── Product: delete ───────────────────────────────────────────────────────
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      const res = await fetch(`/api/products?id=${product.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error("Delete failed");
      toast.success(`"${product.name}" removed from catalog`);
      fetchProducts();
    } catch {
      toast.error("Could not delete product");
    }
  };

  // ── Filtered lists ────────────────────────────────────────────────────────
  const filteredCats = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(catSearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(catSearch.toLowerCase())
  );

  const filteredProds = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.category_name.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.origin.toLowerCase().includes(prodSearch.toLowerCase());
    const matchCat = prodCatFilter === "all" || p.category_slug === prodCatFilter;
    return matchSearch && matchCat;
  });

  // ────────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Package className="w-7 h-7 text-brand-red" />
            <span>Products</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Manage product categories and the full wholesale catalog.
          </p>
        </div>

        <button
          onClick={() => {
            if (activeTab === "categories") {
              setEditingCat(null);
              setCatForm({ name: "", slug: "", image: "", description: "", show_on_homepage: false });
              setIsAddCatOpen(true);
            } else {
              if (categories.length === 0) {
                toast.error("Add at least one category first");
                return;
              }
              setEditingProd(null);
              setProdForm({
                name: "",
                category_slug: categories[0]?.slug || "",
                image: "",
                origin: "India",
                storage_type: "Ambient",
                moq: "",
                packaging: "",
                shelf_life: "24 Months",
                certification: "SFDA Compliant, Halal",
                description: "",
                specs: {},
                specKey1: "",
                specVal1: "",
                specKey2: "",
                specVal2: "",
                specKey3: "",
                specVal3: "",
              });
              setIsAddProdOpen(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>{activeTab === "categories" ? "Add Category" : "Add Product"}</span>
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex items-center gap-2 shadow-2xs w-fit">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-brand-red text-white shadow-sm"
              : "text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          Categories
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "products"
              ? "bg-brand-red text-white shadow-sm"
              : "text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Package className="w-4 h-4" />
          Add Products
          {products.length > 0 && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === "products" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"
              }`}
            >
              {products.length}
            </span>
          )}
        </button>
      </div>

      {/* ════════════════════════════════════════════════════
          TAB 1: CATEGORIES
      ════════════════════════════════════════════════════ */}
      {activeTab === "categories" && (
        <div className="space-y-5">
          {/* Search */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
              />
            </div>
            <span className="text-xs font-bold text-slate-600 shrink-0">
              <strong className="text-slate-900">{filteredCats.length}</strong> categories
            </span>
          </div>

          {/* Info box */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
            <Tag className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium">
              Toggle <strong>"Show on Homepage"</strong> to feature a category in the homepage Quick Categories strip. These categories also appear in the product dropdown.
            </p>
          </div>

          {/* Categories Grid */}
          {catLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
            </div>
          ) : filteredCats.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-xs">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-sm">No categories yet.</p>
              <p className="text-slate-400 text-xs mt-1">Click "Add Category" to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCats.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-slate-200 hover:border-brand-red/40 rounded-2xl p-4 flex flex-col gap-3 shadow-xs hover:shadow-md transition-all group"
                >
                  {/* Image + badges */}
                  <div className="relative aspect-video bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center p-2">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-slate-300" />
                    )}
                    {cat.show_on_homepage && (
                      <span className="absolute top-1.5 left-1.5 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        Homepage
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-red transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">/{cat.slug}</p>
                    {cat.description && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex flex-col gap-2">
                    {/* Homepage toggle */}
                    <button
                      onClick={() => handleToggleHomepage(cat)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        cat.show_on_homepage
                          ? "bg-brand-red text-white border-brand-red hover:bg-red-700"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-red-50 hover:text-brand-red hover:border-red-200"
                      }`}
                    >
                      {cat.show_on_homepage ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Showing on Homepage
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Add to Homepage
                        </>
                      )}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditCat(cat)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-red-50 hover:bg-brand-red text-brand-red hover:text-white rounded-xl text-xs font-bold border border-red-200 hover:border-brand-red transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          TAB 2: PRODUCTS
      ════════════════════════════════════════════════════ */}
      {activeTab === "products" && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-2xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name, category, origin..."
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
              />
            </div>
            <select
              value={prodCatFilter}
              onChange={(e) => setProdCatFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-red font-bold"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-600 font-bold ml-auto shrink-0">
              <strong className="text-slate-900">{filteredProds.length}</strong> products
            </span>
          </div>

          {/* Product table */}
          {prodLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
            </div>
          ) : filteredProds.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-xs">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-sm">No products yet.</p>
              <p className="text-slate-400 text-xs mt-1">Click "Add Product" to add your first item.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-700 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Product / Image</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Origin & Storage</th>
                      <th className="py-3.5 px-4">Packaging & MOQ</th>
                      <th className="py-3.5 px-4">Standard</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProds.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0 overflow-hidden">
                              {p.image ? (
                                <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                              ) : (
                                <Package className="w-6 h-6 text-slate-300 m-auto" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 hover:text-brand-red transition-colors line-clamp-1">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {p.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                            {p.category_name}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                            <Globe className="w-3.5 h-3.5 text-blue-600" />
                            <span>{p.origin}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-brand-red mt-1 font-bold">
                            <ThermometerSnowflake className="w-3 h-3" />
                            <span>{p.storage_type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-slate-900 font-bold text-xs">{p.packaging}</div>
                          <div className="text-[11px] text-slate-600 font-medium mt-0.5">MOQ: {p.moq}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="line-clamp-1 max-w-[100px]">{p.certification}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditProd(p)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black border border-slate-200 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/products/${p.category_slug}/${p.id}`}
                              target="_blank"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-brand-red border border-slate-200 transition-colors"
                              title="View Live Product Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-brand-red border border-red-200 transition-colors cursor-pointer"
                              title="Delete Product"
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
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL: ADD / EDIT CATEGORY
      ════════════════════════════════════════════════════ */}
      {isAddCatOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setIsAddCatOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-red shrink-0" />
                  <span>{editingCat ? "Edit Category" : "Add New Category"}</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                  Categories organise your products and can be shown on the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCatOpen(false)}
                className="text-slate-400 hover:text-black p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveCategory} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-7 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rice & Grains"
                    value={catForm.name}
                    onChange={(e) => handleCatNameChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">URL Slug (auto-generated)</label>
                  <input
                    type="text"
                    value={catForm.slug}
                    onChange={(e) => setCatForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="rice-and-grains"
                  />
                </div>

                {/* Image Upload */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <label className="block text-slate-800 font-bold">Category Image</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      {catForm.image ? (
                        <Image src={catForm.image} alt="Preview" fill className="object-contain p-1" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <label className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{catUploading ? "Uploading..." : "Upload Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCatImageUpload}
                          disabled={catUploading}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or paste image URL"
                        value={catForm.image}
                        onChange={(e) => setCatForm((prev) => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of this category..."
                    value={catForm.description}
                    onChange={(e) => setCatForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
                  />
                </div>

                {/* Homepage toggle */}
                <label className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3 cursor-pointer select-none hover:bg-red-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={catForm.show_on_homepage}
                    onChange={(e) => setCatForm((prev) => ({ ...prev, show_on_homepage: e.target.checked }))}
                    className="w-4 h-4 accent-brand-red shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Show on Homepage</p>
                    <p className="text-[11px] text-slate-500">This category will appear in the Homepage Quick Category strip.</p>
                  </div>
                </label>
              </div>

              {/* Modal Sticky Footer */}
              <div className="px-5 sm:px-7 py-3 sm:py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl text-slate-600 hover:text-black font-bold cursor-pointer text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold shadow-md shadow-brand-red/25 transition-all cursor-pointer text-xs sm:text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCat ? "Update Category" : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL: ADD PRODUCT
      ════════════════════════════════════════════════════ */}
      {isAddProdOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setIsAddProdOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
              <div>
                <h3 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-red shrink-0" />
                  <span>{editingProd ? "Edit Product Details" : "Add New Product"}</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                  {editingProd ? "Modify wholesale catalog specifications and image assets." : "Configure wholesale catalog details, storage specifications, and ImageKit assets."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProdOpen(false)}
                className="text-slate-400 hover:text-black p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form with Scrollable Content */}
            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-8 space-y-4 sm:space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
                {/* Row 1: Name + Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aged 1121 XXL Basmati Rice"
                      value={prodForm.name}
                      onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5 flex items-center justify-between">
                      <span>Category *</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        ({categories.length} from database)
                      </span>
                    </label>
                    <select
                      required
                      value={prodForm.category_slug}
                      onChange={(e) => setProdForm({ ...prodForm, category_slug: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red cursor-pointer"
                    >
                      <option value="">Select category...</option>
                      {categories.map((c) => (
                        <option key={c.id || c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Image */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <label className="block text-slate-800 font-bold">Product Image</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      {prodForm.image ? (
                        <Image src={prodForm.image} alt="Preview" fill className="object-contain p-1" />
                      ) : (
                        <Package className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <label className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{prodUploading ? "Uploading..." : "Upload Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProdImageUpload}
                          disabled={prodUploading}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or paste image URL"
                        value={prodForm.image}
                        onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Origin + Storage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5">Country of Origin</label>
                    <select
                      value={prodForm.origin}
                      onChange={(e) => setProdForm({ ...prodForm, origin: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                    >
                      <option>Saudi Arabia (Local)</option>
                      <option>India</option>
                      <option>Pakistan</option>
                      <option>Brazil</option>
                      <option>Australia</option>
                      <option>Netherlands</option>
                      <option>USA</option>
                      <option>Egypt</option>
                      <option>Europe</option>
                      <option>Global</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5">Storage Condition</label>
                    <select
                      value={prodForm.storage_type}
                      onChange={(e) => setProdForm({ ...prodForm, storage_type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red"
                    >
                      <option value="Ambient">Ambient (Dry & Ventilated)</option>
                      <option value="Chilled (+4°C)">Chilled (+4°C)</option>
                      <option value="Frozen (-18°C)">Frozen (-18°C)</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: MOQ + Packaging */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5">MOQ (Minimum Order Qty) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500 kg (25 bags)"
                      value={prodForm.moq}
                      onChange={(e) => setProdForm({ ...prodForm, moq: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5">Packaging *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20kg & 40kg Non-Woven Bags"
                      value={prodForm.packaging}
                      onChange={(e) => setProdForm({ ...prodForm, packaging: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                </div>

                {/* Row 4: Shelf Life + Certification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5">Shelf Life</label>
                    <input
                      type="text"
                      placeholder="e.g. 24 Months"
                      value={prodForm.shelf_life}
                      onChange={(e) => setProdForm({ ...prodForm, shelf_life: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5">Certification / Standard</label>
                    <input
                      type="text"
                      placeholder="e.g. SFDA Compliant, Halal"
                      value={prodForm.certification}
                      onChange={(e) => setProdForm({ ...prodForm, certification: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Product Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the product — quality, grade, culinary uses, sourcing..."
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
                  />
                </div>

                {/* Specs (up to 3 key-value pairs) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="block text-slate-800 font-bold">Additional Specs (optional)</label>
                    <p className="text-[11px] text-slate-500">These appear in the product detail specifications table.</p>
                  </div>
                  <div className="space-y-2.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder={`Spec name ${i} (e.g. Grain Length)`}
                          value={(prodForm as any)[`specKey${i}`]}
                          onChange={(e) => setProdForm({ ...prodForm, [`specKey${i}`]: e.target.value })}
                          className="bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
                        />
                        <input
                          type="text"
                          placeholder={`Value ${i} (e.g. 8.4mm)`}
                          value={(prodForm as any)[`specVal${i}`]}
                          onChange={(e) => setProdForm({ ...prodForm, [`specVal${i}`]: e.target.value })}
                          className="bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="px-5 sm:px-8 py-3.5 sm:py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddProdOpen(false)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl text-slate-600 hover:text-black font-bold cursor-pointer text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold shadow-md shadow-brand-red/25 transition-all cursor-pointer text-xs sm:text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProd ? "Update Product" : "Save & Publish Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
