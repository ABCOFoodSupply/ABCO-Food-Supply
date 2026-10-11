"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  CloudLightning,
  Upload,
  Trash2,
  X,
  Image as ImageIcon,
  Plus,
  AlertCircle,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  caption: string;
  location: string;
  created_at?: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Upload form state
  const [formTitle, setFormTitle] = useState("");
  const [formCaption, setFormCaption] = useState("");
  const [formLocation, setFormLocation] = useState("Jubail Industrial City, KSA");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formPreview, setFormPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load gallery items from DB
  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormFile(file);
    setFormPreview(URL.createObjectURL(file));
    setFormError(null);
  };

  // Reset modal form
  const resetForm = () => {
    setFormTitle("");
    setFormCaption("");
    setFormLocation("Jubail Industrial City, KSA");
    setFormFile(null);
    setFormPreview(null);
    setFormError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Upload and save gallery image
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFile) {
      setFormError("Please select an image file.");
      return;
    }
    if (!formTitle.trim()) {
      setFormError("Image name is required.");
      return;
    }

    setUploading(true);
    setFormError(null);

    try {
      // Step 1: Upload to ImageKit
      const data = new FormData();
      data.append("file", formFile);
      data.append("fileName", formTitle.trim().replace(/\s+/g, "-").toLowerCase());
      data.append("folder", "/afs-gallery");

      const uploadRes = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: data,
      });

      if (!uploadRes.ok) {
        setFormError("Image upload failed. Please try again.");
        return;
      }

      const uploadResult = await uploadRes.json();
      const imageUrl: string = uploadResult.url;

      // Step 2: Save to Supabase gallery_items
      const saveRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          image: imageUrl,
          caption: formCaption.trim(),
          location: formLocation.trim() || "Jubail Industrial City, KSA",
        }),
      });

      if (!saveRes.ok) {
        setFormError("Failed to save gallery entry. Please try again.");
        return;
      }

      // Reload gallery
      await loadItems();
      closeModal();
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  // Delete gallery item
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Delete failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <CloudLightning className="w-7 h-7 text-brand-red" />
            <span>Gallery Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Upload and manage gallery images shown on the public gallery page.
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Gallery Image</span>
        </button>
      </div>

      {/* CDN Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-brand-red">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>ImageKit CDN Host</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                ACTIVE
              </span>
            </div>
            <code className="text-xs text-slate-900 font-mono font-bold mt-0.5 block">
              https://ik.imagekit.io/wg5w5t4nz
            </code>
          </div>
        </div>
        <div className="text-xs text-slate-600 text-right font-medium">
          <span className="font-bold text-slate-900">{items.length} image{items.length !== 1 ? "s" : ""} in gallery</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Saved to Supabase · Served via CDN</p>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400 font-semibold text-sm">
          Loading gallery…
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <span className="text-5xl">🖼️</span>
          <p className="font-semibold text-sm">No images uploaded yet.</p>
          <p className="text-xs text-center max-w-xs">
            Click &ldquo;Upload Gallery Image&rdquo; to add images that will appear on the public gallery page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-brand-red/40 rounded-2xl overflow-hidden group transition-all shadow-xs hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] bg-slate-50">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Info */}
              <div className="p-4 space-y-1">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                {item.caption && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.caption}</p>
                )}
                <p className="text-[11px] text-slate-400 font-medium">{item.location}</p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleting === item.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-black text-slate-900">Upload Gallery Image</h2>
                <p className="text-xs text-slate-500 mt-0.5">Image will appear on the public gallery page.</p>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* File Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Image File <span className="text-brand-red">*</span>
                </label>
                {formPreview ? (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <Image src={formPreview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFormFile(null);
                        setFormPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-brand-red rounded-xl p-8 cursor-pointer transition-colors bg-slate-50 hover:bg-red-50/30">
                    <Upload className="w-7 h-7 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-600">Click to select image</span>
                    <span className="text-xs text-slate-400">JPG, PNG, WebP — max 10MB</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Image Name / Title <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Jubail Warehouse Facility"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition"
                />
              </div>

              {/* Caption / Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description / Caption
                </label>
                <textarea
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  placeholder="Brief description of what this image shows…"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Jubail Industrial City, KSA"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition"
                />
              </div>

              {/* Error */}
              {formError && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-red/25 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload & Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
