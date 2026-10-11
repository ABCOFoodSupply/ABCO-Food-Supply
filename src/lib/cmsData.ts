/**
 * Home Page CMS Content Model & Database Sync Helper
 * Reads and writes to Supabase database via /api/cms with ImageKit asset CDN storage.
 */

export interface HeroFeature {
  title: string;
  subtitle: string;
}

export interface HeroCmsData {
  badgeText: string;
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
  heroImage: string; // Single responsive image used for both desktop & mobile
  mobileHeroImage?: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  features: HeroFeature[];
}

export interface QuickCategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface ClientPartnerItem {
  id: string;
  name: string;
  image: string;
  type?: string;
  location?: string;
}

export interface HomePageCmsData {
  hero: HeroCmsData;
  quickCategories: QuickCategoryItem[];
  clientsPartners: ClientPartnerItem[];
  lastUpdated?: string;
}

export const DEFAULT_HOMEPAGE_CMS: HomePageCmsData = {
  hero: {
    badgeText: "Saudi Vision 2030 Partner",
    titleLine1: "Your Trusted Partner for",
    titleHighlight: "Food Supply",
    subtitle: "Distributor of Imported & Locally Manufactured Food Products Across the Kingdom of Saudi Arabia.",
    heroImage: "/categories/hero.png",
    mobileHeroImage: "/categories/hero.png",
    button1Text: "Buy Any Products",
    button1Link: "/products",
    button2Text: "Enquire Now",
    button2Link: "#enquire",
    features: [
      { title: "Wide Product", subtitle: "Range" },
      { title: "Reliable", subtitle: "Supply Chain" },
      { title: "Timely", subtitle: "Delivery" },
      { title: "Competitive", subtitle: "Pricing" },
    ],
  },
  quickCategories: [
    {
      id: "cat-1",
      name: "Rice & Grains",
      slug: "rice-and-grains",
      image: "/categories/rice-and-grains.png",
    },
    {
      id: "cat-2",
      name: "Meat",
      slug: "meat",
      image: "/categories/meat.png",
    },
    {
      id: "cat-3",
      name: "Seafood",
      slug: "seafood",
      image: "/categories/seafood.png",
    },
    {
      id: "cat-4",
      name: "Poultry",
      slug: "poultry",
      image: "/categories/poultry.png",
    },
    {
      id: "cat-5",
      name: "Dairy",
      slug: "dairy",
      image: "/categories/dairy.png",
    },
    {
      id: "cat-6",
      name: "Edible Oils",
      slug: "edible-oils",
      image: "/categories/edible-oils.png",
    },
    {
      id: "cat-7",
      name: "Food Ingredients",
      slug: "food-ingredients",
      image: "/categories/food-ingredients.png",
    },
    {
      id: "cat-8",
      name: "Beverages",
      slug: "beverages",
      image: "/categories/beverages.png",
    },
    {
      id: "cat-9",
      name: "Fruits & Vegetables",
      slug: "fruits-and-vegetables",
      image: "/categories/fruits-and-vegetables.png",
    },
  ],
  clientsPartners: [
    {
      id: "partner-1",
      name: "LuLu Hypermarket",
      image: "/categories/partner-2.png",
      type: "Hypermarket Chain",
      location: "Jubail, Dammam, Riyadh",
    },
    {
      id: "partner-2",
      name: "Carrefour KSA",
      image: "/categories/partner-1.png",
      type: "International Retailer",
      location: "Eastern & Central Province",
    },
    {
      id: "partner-3",
      name: "Panda Retail Company",
      image: "/categories/partner-3.png",
      type: "Supermarket & Hypermarket",
      location: "Kingdom-wide",
    },
    {
      id: "partner-4",
      name: "Tamimi Markets",
      image: "/categories/partner-4.png",
      type: "Premium Supermarkets",
      location: "Eastern Province, Riyadh",
    },
    {
      id: "partner-5",
      name: "Danah Supermarket",
      image: "/categories/partner-5.png",
      type: "Regional Supermarket",
      location: "Jubail Industrial City",
    },
  ],
};

const CMS_STORAGE_KEY = "afs_homepage_cms_v1";

/**
 * Loads the current CMS data synchronously from local cache
 */
export function getHomePageCmsData(): HomePageCmsData {
  if (typeof window === "undefined") {
    return DEFAULT_HOMEPAGE_CMS;
  }
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return DEFAULT_HOMEPAGE_CMS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HOMEPAGE_CMS,
      ...parsed,
      hero: { ...DEFAULT_HOMEPAGE_CMS.hero, ...(parsed.hero || {}) },
      quickCategories: parsed.quickCategories?.length ? parsed.quickCategories : DEFAULT_HOMEPAGE_CMS.quickCategories,
      clientsPartners: parsed.clientsPartners?.length ? parsed.clientsPartners : DEFAULT_HOMEPAGE_CMS.clientsPartners,
    };
  } catch {
    return DEFAULT_HOMEPAGE_CMS;
  }
}

/**
 * Fetches latest CMS data from Supabase database via /api/cms and syncs cache
 */
export async function fetchHomePageCmsFromDb(): Promise<HomePageCmsData> {
  try {
    const res = await fetch("/api/cms", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(json.data));
          window.dispatchEvent(new CustomEvent("afs_cms_updated", { detail: json.data }));
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch CMS from DB, using cached data:", err);
  }
  return getHomePageCmsData();
}

/**
 * Saves updated CMS data both to local cache and persists to Supabase database
 */
export async function saveHomePageCmsData(data: HomePageCmsData): Promise<boolean> {
  const payload = {
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent("afs_cms_updated", { detail: payload }));
    } catch (err) {
      console.error("Local storage error:", err);
    }
  }

  // Persist to Supabase Database
  try {
    const res = await fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to persist CMS to Supabase DB:", err);
    return false;
  }
}

/**
 * Resets CMS data back to defaults
 */
export function resetHomePageCmsData(): HomePageCmsData {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CMS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("afs_cms_updated", { detail: DEFAULT_HOMEPAGE_CMS }));
  }
  // Also push defaults to database
  saveHomePageCmsData(DEFAULT_HOMEPAGE_CMS).catch(console.error);
  return DEFAULT_HOMEPAGE_CMS;
}
