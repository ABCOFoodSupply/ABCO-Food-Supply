"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useSection } from "@/components/SiteSectionsProvider";
import { phoneDigits } from "@/lib/siteSections";

export interface ProductCardData {
  id: string;
  name: string;
  category_slug: string;
  category_name: string;
  sub_category?: string;
  sub_category_slug?: string;
  image: string;
  origin?: string;
  storage_type?: string;
  moq?: string;
  packaging?: string;
  certification?: string;
  description?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  onEnquire: (product: ProductCardData) => void;
  sizes?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEnquire,
  sizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw",
}) => {
  const detailHref = `/products/${product.category_slug}/${product.id}`;
  const contact = useSection("contact");
  const waNumber = phoneDigits(contact.whatsapp || contact.phone);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-red/40 hover:shadow-xl shadow-sm transition-all flex flex-col group overflow-hidden">
      {/* Card Image */}
      <Link
        href={detailHref}
        className="relative aspect-[4/3] bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes={sizes}
          />
        ) : (
          <Package className="w-16 h-16 text-slate-300" />
        )}

        {/* Origin Tag */}
        {product.origin && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-800 border border-slate-200/80 shadow-2xs">
            {product.origin}
          </div>
        )}

        {/* Storage Tag */}
        {product.storage_type && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-brand-red border border-slate-200/80 shadow-2xs">
            {product.storage_type}
          </div>
        )}
      </Link>

      {/* Card Info */}
      <div className="p-5 space-y-3 flex-1">
        <Link
          href={`/products?category=${product.category_slug}`}
          className="text-xs font-black uppercase tracking-wider text-brand-red hover:underline block"
        >
          {product.category_name}
        </Link>

        <Link
          href={detailHref}
          className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-snug block"
        >
          {product.name}
        </Link>

        {product.description && (
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Specs */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          {product.moq && (
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-400 shrink-0">MOQ:</span>
              <span className="font-bold text-slate-800">{product.moq}</span>
            </div>
          )}
          {product.packaging && (
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-400 shrink-0">Packaging:</span>
              <span className="font-semibold text-slate-700 text-right min-w-0 break-words">{product.packaging}</span>
            </div>
          )}
          {product.certification && (
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-400 shrink-0">Standard:</span>
              <span className="font-semibold text-emerald-600 text-right min-w-0 break-words">{product.certification}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <button
          onClick={() => onEnquire(product)}
          className="flex-1 bg-brand-red hover:bg-red-700 text-white py-2.5 rounded-full text-xs font-bold shadow-sm hover:shadow transition-all text-center cursor-pointer"
        >
          Enquire Now
        </button>
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ABCO Food Supply, I would like to request wholesale pricing for ${product.name} (${product.category_name}).`)}`}
          target="_blank"
          rel="noreferrer"
          className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shrink-0 transition-transform hover:scale-105 shadow-sm"
          title="Quick WhatsApp Enquiry"
          aria-label={`WhatsApp Enquiry for ${product.name}`}
        >
          <WhatsAppIcon className="w-4 h-4" />
        </a>
        <Link
          href={detailHref}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
          title="View Full Product Details"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
