"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * Category pages now redirect to the unified products catalog
 * with the category pre-selected as a filter.
 */
export default function CategoryRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;

  useEffect(() => {
    router.replace(`/products?category=${categorySlug}`);
  }, [categorySlug, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading products...</span>
      </div>
    </div>
  );
}
