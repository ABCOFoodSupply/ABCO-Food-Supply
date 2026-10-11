"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  CloudLightning, 
  Upload, 
  Copy, 
  Check, 
  ExternalLink, 
  Image as ImageIcon
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  folder: string;
}

export default function AdminMediaPage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: "media-1",
      name: "rice-and-grains.png",
      url: "/categories/rice-and-grains.png",
      size: "240 KB",
      type: "PNG",
      folder: "/categories",
    },
    {
      id: "media-2",
      name: "meat.png",
      url: "/categories/meat.png",
      size: "310 KB",
      type: "PNG",
      folder: "/categories",
    },
    {
      id: "media-3",
      name: "edible-oils.png",
      url: "/categories/edible-oils.png",
      size: "215 KB",
      type: "PNG",
      folder: "/categories",
    },
    {
      id: "media-4",
      name: "seafood.png",
      url: "/categories/seafood.png",
      size: "285 KB",
      type: "PNG",
      folder: "/categories",
    },
    {
      id: "media-5",
      name: "spices-and-seasoning.png",
      url: "/categories/spices-and-seasoning.png",
      size: "340 KB",
      type: "PNG",
      folder: "/categories",
    },
    {
      id: "media-6",
      name: "dairy-products.png",
      url: "/categories/dairy-products.png",
      size: "190 KB",
      type: "PNG",
      folder: "/categories",
    },
    {
      id: "media-7",
      name: "main_logo.png",
      url: "/logo/main_logo.png",
      size: "45 KB",
      type: "PNG",
      folder: "/branding",
    },
  ]);

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
        const newItem: MediaItem = {
          id: result.fileId || `media-${Date.now()}`,
          name: result.name || file.name,
          url: result.url,
          size: `${Math.round(file.size / 1024)} KB`,
          type: file.type.split("/")[1]?.toUpperCase() || "IMG",
          folder: "/afs-catalog",
        };
        setMediaItems([newItem, ...mediaItems]);
      } else {
        alert("Upload failed. Please check network.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading media file.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <CloudLightning className="w-7 h-7 text-brand-red" />
            <span>ImageKit Media & CDN Assets</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Global edge CDN hosting for high-resolution product photos, SFDA spec sheets, and certificates.
          </p>
        </div>

        {/* Red Upload Button */}
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-white" />
            <span>{isUploading ? "Uploading to CDN..." : "Upload New Asset"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Connection Info Banner: White card */}
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
          <span className="font-bold text-slate-900">Automatic WebP/AVIF compression</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Real-time resize & format transforms enabled</p>
        </div>
      </div>

      {/* Media Grid: Clean White Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 hover:border-brand-red/40 rounded-2xl p-4 flex flex-col justify-between group transition-all shadow-xs hover:shadow-md"
          >
            <div>
              <div className="relative aspect-square w-full rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-center overflow-hidden mb-3">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 border border-slate-200 shadow-2xs">
                  {item.type}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                {item.name}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-medium">
                <span>{item.size}</span>
                <span className="font-mono text-[10px]">{item.folder}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => copyToClipboard(item.url)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                title="Copy CDN Link"
              >
                {copiedUrl === item.url ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black rounded-lg border border-slate-200 transition-colors"
                title="Open Asset in New Tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
