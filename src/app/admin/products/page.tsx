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
  FolderTree,
  ListPlus,
} from "lucide-react";
import { toast } from "sonner";
import type { SubCategoryItem } from "@/data/subcategories";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  featured_on_homepage?: boolean;
  created_at?: string;
}

// â”€â”€â”€ Helper: slugify â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// â”€â”€â”€ ImageKit uploader â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  ADMIN PRODUCTS PAGE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "products">("categories");

  // â”€â”€ State: Subcategories Mapping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, SubCategoryItem[]>>({});

  // â”€â”€ State: Categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    subcategories: [] as SubCategoryItem[],
  });

  // State for subcategory currently being added / edited inside category modal
  const [newSubcatName, setNewSubcatName] = useState("");
  const [newSubcatDesc, setNewSubcatDesc] = useState("");
  const [newSubcatVarieties, setNewSubcatVarieties] = useState("");

  // â”€â”€ State: Products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [products, setProducts] = useState<Product[]>([]);
  const [prodSearch, setProdSearch] = useState("");
  const [prodCatFilter, setProdCatFilter] = useState("all");
  const [prodLoading, setProdLoading] = useState(true);
  const [isAddProdOpen, setIsAddProdOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [prodUploading, setProdUploading] = useState(false);
  const [isAddingNewSubcatInline, setIsAddingNewSubcatInline] = useState(false);
  const [inlineNewSubcatName, setInlineNewSubcatName] = useState("");
  const [prodForm, setProdForm] = useState({
    name: "",
    category_slug: "",
    sub_category: "",
    sub_category_slug: "",
    image: "",
    origin: "India",
    storage_type: "Ambient",
    moq: "",
    packaging: "",
    shelf_life: "24 Months",
    certification: "SFDA Compliant, Halal",
    description: "",
    featured_on_homepage: false,
    specs: {} as Record<string, string>,
    // extra spec fields (key-value pairs for dynamic specs)
    specKey1: "",
    specVal1: "",
    specKey2: "",
    specVal2: "",
    specKey3: "",
    specVal3: "",
  });

  // â”€â”€ Fetch subcategories map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchSubcategories = useCallback(async () => {
    try {
      const res = await fetch("/api/subcategories");
      const json = await res.json();
      if (json.success && json.data) {
        setSubcategoriesMap(json.data);
      }
    } catch {
      console.error("Could not load subcategories");
    }
  }, []);

  // â”€â”€ Fetch categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Fetch products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    fetchSubcategories();
  }, [fetchCategories, fetchProducts, fetchSubcategories]);

  // â”€â”€ Category: auto-slug â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCatNameChange = (name: string) => {
    setCatForm((prev) => ({ ...prev, name, slug: slugify(name) }));
  };

  // â”€â”€ Category: image upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Category: save â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // Save subcategories for this category if any
      if (catForm.slug) {
        await fetch("/api/subcategories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categorySlug: catForm.slug,
            subcategories: catForm.subcategories || [],
          }),
        });
      }

      toast.success(editingCat ? "Category updated!" : "Category added!");
      setIsAddCatOpen(false);
      setEditingCat(null);
      setCatForm({ name: "", slug: "", image: "", description: "", show_on_homepage: false, subcategories: [] });
      setNewSubcatName("");
      setNewSubcatDesc("");
      setNewSubcatVarieties("");
      fetchCategories();
      fetchSubcategories();
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  // â”€â”€ Category Subcategory helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleAddSubcatToCat = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!newSubcatName.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }
    const slug = slugify(newSubcatName.trim());
    const varieties = newSubcatVarieties
      .split(/[\n,]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    const newItem: SubCategoryItem = {
      id: slug,
      name: newSubcatName.trim(),
      slug: slug,
      description: newSubcatDesc.trim(),
      varieties: varieties.length > 0 ? varieties : undefined,
    };

    setCatForm((prev) => ({
      ...prev,
      subcategories: [...(prev.subcategories || []).filter((s) => s.slug !== slug), newItem],
    }));

    setNewSubcatName("");
    setNewSubcatDesc("");
    setNewSubcatVarieties("");
    toast.success(`Sub-category "${newItem.name}" added to list`);
  };

  const handleRemoveSubcatFromCat = (subSlug: string) => {
    setCatForm((prev) => ({
      ...prev,
      subcategories: (prev.subcategories || []).filter((s) => s.slug !== subSlug),
    }));
  };

  // â”€â”€ Category: toggle homepage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Category: delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Category: open edit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openEditCat = (cat: ProductCategory) => {
    setEditingCat(cat);
    const existingSubs = subcategoriesMap[cat.slug] || [];
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      description: cat.description,
      show_on_homepage: cat.show_on_homepage,
      subcategories: existingSubs,
    });
    setNewSubcatName("");
    setNewSubcatDesc("");
    setNewSubcatVarieties("");
    setIsAddCatOpen(true);
  };

  // â”€â”€ Product: image upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Product: open edit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openEditProd = (p: Product) => {
    setEditingProd(p);
    const specEntries = Object.entries(p.specs || {});
    // Extract subcategory from specs if present
    const subCatName = p.specs?.["Sub Category"] || p.specs?.["SubCategory"] || "";
    const subCatSlug = p.specs?.["Sub-Category Slug"] || (subCatName ? slugify(subCatName) : "");

    // Exclude subcategory entries from dynamic spec inputs
    const otherSpecs = specEntries.filter(
      ([k]) => k !== "Sub Category" && k !== "SubCategory" && k !== "Sub-Category Slug"
    );

    setProdForm({
      name: p.name,
      category_slug: p.category_slug,
      sub_category: subCatName,
      sub_category_slug: subCatSlug,
      image: p.image || "",
      origin: p.origin || "India",
      storage_type: p.storage_type || "Ambient",
      moq: p.moq || "",
      packaging: p.packaging || "",
      shelf_life: p.shelf_life || "24 Months",
      certification: p.certification || "SFDA Compliant, Halal",
      description: p.description || "",
      featured_on_homepage: Boolean(p.featured_on_homepage),
      specs: p.specs || {},
      specKey1: otherSpecs[0]?.[0] || "",
      specVal1: otherSpecs[0]?.[1] || "",
      specKey2: otherSpecs[1]?.[0] || "",
      specVal2: otherSpecs[1]?.[1] || "",
      specKey3: otherSpecs[2]?.[0] || "",
      specVal3: otherSpecs[2]?.[1] || "",
    });
    setIsAddingNewSubcatInline(false);
    setInlineNewSubcatName("");
    setIsAddProdOpen(true);
  };

  // â”€â”€ Product: save / update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.slug === prodForm.category_slug);
    const specs: Record<string, string> = {};

    // Keep existing specs
    if (prodForm.specs) {
      Object.assign(specs, prodForm.specs);
    }

    // Set subcategory specs
    if (prodForm.sub_category) {
      specs["Sub Category"] = prodForm.sub_category;
      specs["Sub-Category Slug"] = prodForm.sub_category_slug || slugify(prodForm.sub_category);
    } else {
      delete specs["Sub Category"];
      delete specs["SubCategory"];
      delete specs["Sub-Category Slug"];
    }

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
      featured_on_homepage: prodForm.featured_on_homepage,
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
        sub_category: "",
        sub_category_slug: "",
        image: "",
        origin: "India",
        storage_type: "Ambient",
        moq: "",
        packaging: "",
        shelf_life: "24 Months",
        certification: "SFDA Compliant, Halal",
        description: "",
        featured_on_homepage: false,
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

  // â”€â”€ Product: toggle homepage featured â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleToggleProductFeatured = async (product: Product) => {
    try {
      const nextVal = !product.featured_on_homepage;
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, featured_on_homepage: nextVal }),
      });
      const json = await res.json();
      if (!json.success) throw new Error("Toggle failed");
      toast.success(
        nextVal
          ? `"${product.name}" is now featured on Homepage!`
          : `"${product.name}" removed from Homepage featured.`
      );
      fetchProducts();
    } catch {
      toast.error("Could not update homepage featured status");
    }
  };

  // â”€â”€ Product: delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Filtered lists â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  RENDER
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* â”€â”€ Page Header â”€â”€ */}
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
              setCatForm({ name: "", slug: "", image: "", description: "", show_on_homepage: false, subcategories: [] });
              setNewSubcatName("");
              setNewSubcatDesc("");
              setNewSubcatVarieties("");
              setIsAddCatOpen(true);
            } else {
              if (categories.length === 0) {
                toast.error("Add at least one category first");
                return;
              }
              setEditingProd(null);
              setIsAddingNewSubcatInline(false);
              setInlineNewSubcatName("");
              setProdForm({
                name: "",
                category_slug: categories[0]?.slug || "",
                sub_category: "",
                sub_category_slug: "",
                image: "",
                origin: "India",
                storage_type: "Ambient",
                moq: "",
                packaging: "",
                shelf_life: "24 Months",
                certification: "SFDA Compliant, Halal",
                description: "",
                featured_on_homepage: false,
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

      {/* â”€â”€ Tabs â”€â”€ */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TAB 1: CATEGORIES
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                    {subcategoriesMap[cat.slug] && subcategoriesMap[cat.slug].length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          <FolderTree className="w-3 h-3 text-brand-red" />
                          <span>{subcategoriesMap[cat.slug].length} Sub-Categories</span>
                        </span>
                      </div>
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TAB 2: PRODUCTS
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                      <th className="py-3.5 px-4 text-center">Homepage</th>
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
                          {p.specs?.["Sub Category"] && (
                            <div className="mt-1 flex items-center gap-1">
                              <FolderTree className="w-3 h-3 text-brand-red shrink-0" />
                              <span className="text-[11px] text-slate-600 font-medium truncate max-w-[100px]">
                                {p.specs["Sub Category"]}
                              </span>
                            </div>
                          )}
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

                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="line-clamp-1 max-w-[100px]">{p.certification}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleToggleProductFeatured(p)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                              p.featured_on_homepage
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                            }`}
                            title={p.featured_on_homepage ? "Click to remove from Homepage" : "Click to feature on Homepage"}
                          >
                            {p.featured_on_homepage ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-600" />
                                <span>Featured</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MODAL: ADD / EDIT CATEGORY
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

                {/* Sub-Categories Management */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-slate-900 font-bold flex items-center gap-1.5">
                        <FolderTree className="w-4 h-4 text-brand-red" />
                        <span>Sub-Categories ({catForm.subcategories?.length || 0})</span>
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Create subcategories (e.g. Basmati Rice, Non-Basmati Rice) and their varieties.
                      </p>
                    </div>
                  </div>

                  {/* List of current subcategories */}
                  {catForm.subcategories && catForm.subcategories.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {catForm.subcategories.map((sub) => (
                        <div
                          key={sub.slug}
                          className="bg-white border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3 shadow-2xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{sub.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">/{sub.slug}</span>
                            </div>
                            {sub.description && (
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{sub.description}</p>
                            )}
                            {sub.varieties && sub.varieties.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {sub.varieties.map((v, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                                  >
                                    {v}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubcatFromCat(sub.slug)}
                            className="text-slate-400 hover:text-brand-red p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                            title="Remove subcategory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/60 border border-dashed border-slate-200 rounded-xl p-3 text-center text-[11px] text-slate-400">
                      No subcategories configured yet. Use the fields below to add one.
                    </div>
                  )}

                  {/* Add New Subcategory Box */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ListPlus className="w-3.5 h-3.5 text-brand-red" />
                      <span>Add a Sub-Category</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Subcategory Name (e.g. Basmati Rice)"
                        value={newSubcatName}
                        onChange={(e) => setNewSubcatName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newSubcatDesc}
                        onChange={(e) => setNewSubcatDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Varieties (comma separated, e.g. 1121 Sella, 1509 Steam, Sharbati)"
                        value={newSubcatVarieties}
                        onChange={(e) => setNewSubcatVarieties(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSubcatToCat}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Sub-Category</span>
                    </button>
                  </div>
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MODAL: ADD PRODUCT
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                      onChange={(e) => {
                        const newCatSlug = e.target.value;
                        setProdForm({
                          ...prodForm,
                          category_slug: newCatSlug,
                          sub_category: "",
                          sub_category_slug: "",
                        });
                        setIsAddingNewSubcatInline(false);
                      }}
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

                {/* Sub-Category Selection / Inline Addition */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                      <FolderTree className="w-4 h-4 text-brand-red" />
                      <span>Sub-Category (Optional)</span>
                    </label>
                    {prodForm.category_slug && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewSubcatInline(!isAddingNewSubcatInline);
                          setInlineNewSubcatName("");
                        }}
                        className="text-xs text-brand-red font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAddingNewSubcatInline ? "Choose existing" : "+ Add new sub-category"}</span>
                      </button>
                    )}
                  </div>

                  {!isAddingNewSubcatInline ? (
                    <div>
                      <select
                        value={prodForm.sub_category_slug || ""}
                        disabled={!prodForm.category_slug}
                        onChange={(e) => {
                          const val = e.target.value;
                          const currentCatSubs = subcategoriesMap[prodForm.category_slug] || [];
                          const found = currentCatSubs.find((s) => s.slug === val);
                          setProdForm({
                            ...prodForm,
                            sub_category: found ? found.name : "",
                            sub_category_slug: val,
                          });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-brand-red cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="">
                          {!prodForm.category_slug
                            ? "Select a category first..."
                            : (subcategoriesMap[prodForm.category_slug]?.length || 0) === 0
                            ? "No sub-categories in this category (click + Add new)"
                            : "None / Not Applicable"}
                        </option>
                        {(subcategoriesMap[prodForm.category_slug] || []).map((sub) => (
                          <option key={sub.slug} value={sub.slug}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      {prodForm.sub_category && (
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                          âœ“ Assigned to subcategory: <strong>{prodForm.sub_category}</strong>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="New Sub-category Name (e.g. Basmati Rice)"
                        value={inlineNewSubcatName}
                        onChange={(e) => setInlineNewSubcatName(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!inlineNewSubcatName.trim()) {
                            toast.error("Enter a subcategory name");
                            return;
                          }
                          const sName = inlineNewSubcatName.trim();
                          const sSlug = slugify(sName);
                          const currentSubs = subcategoriesMap[prodForm.category_slug] || [];
                          const updatedSubs = [
                            ...currentSubs.filter((s) => s.slug !== sSlug),
                            { id: sSlug, name: sName, slug: sSlug, description: "" },
                          ];
                          try {
                            const res = await fetch("/api/subcategories", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                categorySlug: prodForm.category_slug,
                                subcategories: updatedSubs,
                              }),
                            });
                            const json = await res.json();
                            if (json.success) {
                              setSubcategoriesMap((prev) => ({
                                ...prev,
                                [prodForm.category_slug]: updatedSubs,
                              }));
                              setProdForm((prev) => ({
                                ...prev,
                                sub_category: sName,
                                sub_category_slug: sSlug,
                              }));
                              setIsAddingNewSubcatInline(false);
                              setInlineNewSubcatName("");
                              toast.success(`Sub-category "${sName}" created and assigned!`);
                            } else {
                              toast.error("Failed to create subcategory");
                            }
                          } catch {
                            toast.error("Network error saving subcategory");
                          }
                        }}
                        className="bg-brand-red hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Create & Assign
                      </button>
                    </div>
                  )}
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


                {/* Row 3: Packaging */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1.5">Packaging</label>
                    <input
                      type="text"
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
                  <label className="block text-slate-800 font-bold mb-1.5">Product Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the product â€” quality, grade, culinary uses, sourcing..."
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
                  />
                </div>

                {/* Homepage Featured Toggle */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <label className="block text-slate-900 font-bold text-xs sm:text-sm">
                      Feature in &quot;OUR PRODUCTS&quot; on Homepage
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      When enabled, this product will appear directly in the OUR PRODUCTS section on the home page.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={prodForm.featured_on_homepage}
                      onChange={(e) => setProdForm({ ...prodForm, featured_on_homepage: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                  </label>
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
