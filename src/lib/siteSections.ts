/**
 * Admin-editable content for every homepage section (stored in Supabase `site_sections`,
 * one JSON row per section). Defaults below are the original hardcoded copy; DB values
 * override them field by field, so a missing field always falls back to the default.
 */

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface CardItem {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

export interface InfoCard {
  tag: string;
  title: string;
  text: string;
  footer: string;
}

export interface SiteSections {
  heroBadges: { items: StatItem[] };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    mobileImage: string; // phones; empty = use image
    buttonText: string;
    buttonLink: string;
    stats: StatItem[];
  };
  products: { eyebrow: string; title: string; subtitle: string; buttonText: string };
  b2b: {
    eyebrow: string;
    titleHighlight: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    image: string;
    highlights: { icon: string; label: string }[];
    primaryText: string;
    primaryLink: string;
    secondaryText: string;
    badgeTitle: string;
    badgeSubtitle: string;
  };
  // Home page Services header; the cards come from servicesList (items with showOnHome)
  services: { eyebrow: string; title: string; subtitle: string; buttonText: string };
  whyChooseUs: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    strengths: CardItem[];
    mission: InfoCard;
    vision: InfoCard;
    valuesTag: string;
    valuesTitle: string;
    values: { label: string; desc: string }[];
    valuesFooter: string;
  };
  partners: { eyebrow: string; title: string; titleHighlight: string; subtitle: string };
  gallery: { eyebrow: string; title: string; subtitle: string; buttonText: string };
  // Site-wide contact details (Admin → Contact & Social); used by every page
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    mapAddress: string;
    hours: string;
    hoursNote: string;
  };
  // Social profile URLs; empty = icon hidden
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    youtube: string;
  };
  // Home page "Get In Touch" heading
  contactSection: {
    eyebrow: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    subtitle: string;
  };
  footer: { bio: string; tagline: string; taglineHighlight: string };

  // ── About page (/about) ──
  aboutHero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    subtitle: string;
    image: string;
    primaryText: string;
    secondaryText: string;
    secondaryLink: string;
  };
  aboutStats: { items: StatItem[] };
  aboutStory: {
    eyebrow: string;
    title: string;
    paragraphs: { text: string }[];
    checklist: { text: string }[];
    image: string;
    calloutTitle: string;
    calloutText: string;
  };
  aboutPillars: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { icon: string; badge: string; title: string; subtitle: string; description: string }[];
  };
  aboutValues: {
    mission: { title: string; text: string; footer: string };
    vision: { title: string; text: string; footer: string };
    valuesTitle: string;
    values: { label: string; desc: string }[];
    valuesFooter: string;
  };
  aboutMilestones: {
    eyebrow: string;
    title: string;
    items: { year: string; title: string; description: string }[];
  };
  aboutCta: {
    title: string;
    subtitle: string;
    primaryText: string;
    secondaryText: string;
    secondaryLink: string;
  };

  // ── Services page (/services) ──
  servicesHero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    subtitle: string;
    image: string;
    primaryText: string;
    secondaryText: string;
    secondaryLink: string;
    stats: StatItem[];
  };
  servicesList: {
    eyebrow: string;
    title: string;
    subtitle: string;
    buttonText: string;
    items: {
      showOnHome?: boolean; // shown in the home page Services section (default: yes)
      icon: string;
      highlight: string;
      title: string;
      description: string;
      image: string;
      features: { text: string }[];
    }[];
  };
  servicesProcess: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { icon: string; title: string; description: string }[];
  };
  servicesIndustries: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { icon: string; title: string; description: string }[];
  };
  servicesFaq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
  };
  servicesCta: {
    title: string;
    subtitle: string;
    primaryText: string;
    secondaryText: string;
  };
}

export type SectionId = keyof SiteSections;

export const SECTION_DEFAULTS: SiteSections = {
  heroBadges: {
    items: [
      { icon: "Package", value: "500+", label: "Food Products" },
      { icon: "Truck", value: "Trusted", label: "Global Suppliers" },
      { icon: "Clock", value: "Reliable", label: "Supply Chain" },
      { icon: "BadgePercent", value: "Serving KSA", label: "Nationwide" },
    ],
  },
  about: {
    eyebrow: "ABOUT US",
    title: "ABCO Food Supply",
    body:
      "ABCO Food Supply is a Saudi-based food trading and distribution company specializing in the sourcing and supply of imported and locally manufactured food products. Through trusted global suppliers and local partners, we provide quality products and reliable supply solutions to distributors, wholesalers, retailers, catering companies, hospitality businesses, and food service providers across the Kingdom of Saudi Arabia.",
    image: "/categories/about-us.png",
    mobileImage: "",
    buttonText: "Learn More",
    buttonLink: "/about",
    stats: [
      { icon: "Package", value: "500+", label: "Food Products" },
      { icon: "Globe", value: "Trusted", label: "Global Suppliers" },
      { icon: "Truck", value: "Reliable", label: "Supply Chain" },
      { icon: "MapPin", value: "Serving Across", label: "Saudi Arabia" },
    ],
  },
  products: {
    eyebrow: "OUR PRODUCTS",
    title: "Wide Range of Imported & Locally Manufactured Food Products",
    subtitle:
      "Featured wholesale commodities ready for HORECA, commercial catering, and retail distribution across Saudi Arabia.",
    buttonText: "View All Products",
  },
  b2b: {
    eyebrow: "B2B Wholesale Supply",
    titleHighlight: "Buy Any",
    titleLine1: "Food Products",
    titleLine2: "for Your Business Needs",
    subtitle:
      "From daily essentials to bulk supply, we provide high-quality food products with reliable delivery across Saudi Arabia.",
    image: "/categories/mix-product-new.png",
    highlights: [
      { icon: "Boxes", label: "Bulk Supply" },
      { icon: "Tag", label: "Best Prices" },
      { icon: "ShieldCheck", label: "Quality Assured" },
    ],
    primaryText: "Shop Now",
    primaryLink: "/products",
    secondaryText: "Request Bulk Quote",
    badgeTitle: "Reliable Delivery",
    badgeSubtitle: "Across Saudi Arabia",
  },
  services: {
    eyebrow: "OUR SERVICES",
    title: "End-to-End Food Supply & Logistics Solutions",
    subtitle:
      "Tailored procurement, unbroken cold chain distribution, and reliable bulk supply solutions across the Kingdom of Saudi Arabia.",
    buttonText: "Request Service Proposal",
  },
  whyChooseUs: {
    eyebrow: "WHY ABCO FOOD SUPPLY?",
    title: "Setting the Benchmark in",
    titleHighlight: "Saudi Food Distribution",
    subtitle:
      "We bridge global food producers with the Kingdom's leading retailers, HORECA establishments, and catering contractors through dependable operations.",
    strengths: [
      { icon: "ShieldCheck", title: "Trusted Local & Global Sourcing", description: "Direct partnerships with certified growers, millers, and processors across 30+ countries.", highlight: "Global Network" },
      { icon: "Award", title: "Quality Products", description: "Rigorous quality inspection meeting Saudi Food & Drug Authority (SFDA) standards.", highlight: "100% Certified" },
      { icon: "Truck", title: "Reliable Supply Chain", description: "Temperature-controlled multi-zone logistics ensuring zero cold-chain breaks.", highlight: "Cold Chain 24/7" },
      { icon: "Settings", title: "End-to-End Procurement Support", description: "Tailored bulk orders, scheduled deliveries, and dedicated B2B institutional account managers.", highlight: "Turnkey Service" },
      { icon: "Repeat", title: "Flexible Supply Solutions", description: "Customized portioning, private packaging, and adaptable delivery frequencies.", highlight: "Tailored Plans" },
      { icon: "Tag", title: "Competitive Pricing", description: "High-volume direct procurement enabling industry-leading wholesale market rates.", highlight: "Best B2B Rates" },
      { icon: "Clock", title: "Timely Delivery", description: "Guaranteed on-schedule fulfillment to commercial kitchens, hypermarkets, and hotels.", highlight: "Guaranteed SLA" },
      { icon: "HeartHandshake", title: "Customer-Centric Service", description: "Rapid responsiveness, responsive inquiry resolution, and 24/7 client coordination.", highlight: "Dedicated Desk" },
    ],
    mission: {
      tag: "PURPOSE & COMMITMENT",
      title: "Our Mission",
      text:
        "To deliver premium food products and reliable supply solutions through trusted sourcing, efficient procurement, dependable cold-chain operations, and responsive customer service tailored to the Saudi food economy.",
      footer: "SFDA & HACCP Quality Compliant",
    },
    vision: {
      tag: "KINGDOM VISION 2030",
      title: "Our Vision",
      text:
        "To become the most trusted and recognized food trading and supply partner across Saudi Arabia and the wider GCC, strengthening national food security through modern logistics and strategic supplier partnerships.",
      footer: "Aligned with Saudi Vision 2030",
    },
    valuesTag: "FOUNDATIONAL PILLARS",
    valuesTitle: "Our Values",
    values: [
      { label: "Integrity", desc: "Transparent dealings & contracts" },
      { label: "Quality", desc: "Strict hygiene & halal guidelines" },
      { label: "Reliability", desc: "Dependable supply without delays" },
      { label: "Customer Focus", desc: "Customized client specifications" },
      { label: "Partnership", desc: "Long-term win-win collaboration" },
      { label: "Continuous Improvement", desc: "Constant technological innovation" },
    ],
    valuesFooter: "Commitment to Client Success",
  },
  partners: {
    eyebrow: "Our Clients & Partners",
    title: "Trusted by",
    titleHighlight: "Leading Businesses",
    subtitle: "Supplying hypermarkets, retail chains and HORECA businesses across Saudi Arabia.",
  },
  gallery: {
    eyebrow: "OPERATIONAL SHOWCASE",
    title: "Facility, Fleet & Operations Gallery",
    subtitle:
      "Explore our Jubail temperature-controlled cold chain, logistics fleets, and distribution infrastructure.",
    buttonText: "View Full Gallery",
  },
  contact: {
    phone: "+966 57 299 5987",
    whatsapp: "966572995987",
    email: "abcofoodsupply@gmail.com",
    address: "Jubail Industrial City, KSA",
    mapAddress: "Jubail Industrial City, Saudi Arabia",
    hours: "Sun – Thu  8:00 AM – 6:00 PM",
    hoursNote: "Arabia Standard Time (GMT+3)",
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },
  contactSection: {
    eyebrow: "Get In Touch",
    titlePrefix: "We're Based in",
    titleHighlight: "Jubail,",
    titleSuffix: "Saudi Arabia",
    subtitle: "Reach our team for wholesale pricing, bulk orders and supply partnerships.",
  },
  footer: {
    bio: "Distributor of imported & locally manufactured food products across the Kingdom of Saudi Arabia.",
    tagline: "Quality Food.",
    taglineHighlight: "Reliable Supply.",
  },

  aboutHero: {
    badge: "ABOUT ABCO FOOD SUPPLY",
    titleLine1: "Powering the Kingdom's",
    titleHighlight: "Food Supply Chain",
    subtitle:
      "Distributor of imported and locally manufactured food products across the Kingdom of Saudi Arabia. Headquartered in Jubail, we deliver dependable food security, unbroken cold-chain transport, and institutional supply excellence.",
    image: "/categories/about-us.png",
    primaryText: "Request B2B Quotation",
    secondaryText: "Explore Product Catalog",
    secondaryLink: "/products",
  },
  aboutStats: {
    items: [
      { icon: "Boxes", value: "500+", label: "Certified Food Products" },
      { icon: "Globe2", value: "30+", label: "Global Source Countries" },
      { icon: "Clock", value: "99.4%", label: "On-Time Delivery SLA" },
      { icon: "ShieldCheck", value: "100%", label: "SFDA & Halal Compliant" },
    ],
  },
  aboutStory: {
    eyebrow: "OUR STORY & IDENTITY",
    title: "A Saudi Enterprise Dedicated to Food Integrity & Reliable Distribution",
    paragraphs: [
      {
        text: "ABCO Food Supply (AFS) was established in Jubail with an unwavering objective: to provide Saudi businesses with a dependable, uninterrupted pipeline of premium food commodities and specialty ingredients. We bridge certified global producers across Europe, Asia, and the Americas with hypermarkets, institutional catering companies, hotel chains, and retail wholesalers throughout the Kingdom.",
      },
      {
        text: "Guided by the objectives of the Saudi Vision 2030 National Food Security Strategy, we invest extensively in multi-temperature cold storage, sanitized warehouse facilities, and a GPS-monitored refrigerated transport fleet. Every shipment that enters our supply chain is strictly verified for Halal authenticity, SFDA customs clearance, and quality perfection.",
      },
    ],
    checklist: [
      { text: "Direct Miller & Abattoir Contracts" },
      { text: "Unbroken Cold Chain -18°C to +4°C" },
      { text: "Rapid Port-to-Warehouse Logistics" },
      { text: "Custom B2B Bulk Packaging Options" },
    ],
    image: "/categories/about-us.png",
    calloutTitle: "100% SFDA Certified",
    calloutText: "Continuous food inspection and compliance verification under Saudi food regulations.",
  },
  aboutPillars: {
    eyebrow: "OPERATIONAL EXCELLENCE",
    title: "Why Saudi Businesses Rely on ABCO",
    subtitle:
      "Built from the ground up to solve the real-world logistical challenges of high-volume commercial kitchens and retail chains.",
    items: [
      {
        icon: "ThermometerSnowflake",
        badge: "Real-Time Telematics",
        title: "Cold Chain Logistics",
        subtitle: "Unbroken -18°C to +4°C Multi-Zone",
        description:
          "Our refrigerated fleet and temperature-controlled storage ensure zero temperature fluctuation from customs quarantine to the client's store room.",
      },
      {
        icon: "FileCheck2",
        badge: "100% Certified",
        title: "SFDA & Regulatory Assurance",
        subtitle: "Strict Compliance with Saudi Standards",
        description:
          "Every shipment undergoes rigorous laboratory testing, pesticide residue verification, and microbiology screening before clearance.",
      },
      {
        icon: "Building2",
        badge: "Prime Location",
        title: "Strategic Jubail Hub",
        subtitle: "Gateway to the Eastern Province & GCC",
        description:
          "Centrally positioned in Jubail Industrial City with rapid arterial highway connectivity to Dammam, Khobar, Riyadh, and GCC border points.",
      },
      {
        icon: "Truck",
        badge: "Enterprise Ready",
        title: "Institutional Volume Capability",
        subtitle: "Bulk Supply to Hypermarkets & HORECA",
        description:
          "Dedicated account managers providing flexible delivery cadences, palletised drop-offs, and custom private packaging solutions.",
      },
    ],
  },
  aboutValues: {
    mission: {
      title: "Our Mission",
      text:
        "To deliver premium food products and reliable supply solutions through trusted global sourcing, efficient procurement, dependable cold-chain operations, and responsive customer service tailored to the Saudi food economy.",
      footer: "Quality Delivered With Consistency",
    },
    vision: {
      title: "Our Vision",
      text:
        "To become the most dependable and preferred food distribution partner in Saudi Arabia, recognized for quality excellence, seamless supply chains, and enduring commercial partnerships.",
      footer: "Supporting Saudi Vision 2030",
    },
    valuesTitle: "Core Values",
    values: [
      { label: "Integrity", desc: "Transparent commercial dealings" },
      { label: "Quality", desc: "Strict Halal & SFDA hygiene compliance" },
      { label: "Reliability", desc: "Dependable schedules without delay" },
      { label: "Customer Centric", desc: "Tailored enterprise service" },
    ],
    valuesFooter: "Unwavering Ethical Standards",
  },
  aboutMilestones: {
    eyebrow: "GROWTH & EVOLUTION",
    title: "Our Journey of Continuous Growth",
    items: [
      {
        year: "2018",
        title: "Foundation in Jubail",
        description:
          "Established as an independent food trading enterprise in Jubail, focusing initially on rice, edible oils, and essential food commodities.",
      },
      {
        year: "2020",
        title: "Cold Chain Expansion",
        description:
          "Commissioned dedicated temperature-controlled cold storage facilities and launched multi-zone reefer distribution fleets.",
      },
      {
        year: "2022",
        title: "Kingdom-Wide Logistics",
        description:
          "Expanded delivery routes to supply major hypermarkets, catering companies, and industrial mess operations across Riyadh and the Eastern Province.",
      },
      {
        year: "Present",
        title: "Vision 2030 Food Security",
        description:
          "Partnering with certified global producers and local Saudi agriculturalists to bolster national supply resilience with over 500 active SKUs.",
      },
    ],
  },
  aboutCta: {
    title: "Ready to Optimize Your Food Procurement?",
    subtitle:
      "Speak directly with our Jubail institutional sales desk to arrange contract pricing and scheduled deliveries.",
    primaryText: "Request Quotation",
    secondaryText: "Contact Sales Team",
    secondaryLink: "/contact",
  },

  servicesHero: {
    badge: "OUR SERVICES",
    titleLine1: "End-to-End Food Supply",
    titleHighlight: "Built for Your Business",
    subtitle:
      "From sourcing and procurement to cold-chain logistics and bulk delivery, we handle the complete food supply journey for retailers, distributors and HORECA businesses across Saudi Arabia.",
    image: "/categories/about-us.png",
    primaryText: "Request a Service Proposal",
    secondaryText: "Browse Products",
    secondaryLink: "/products",
    stats: [
      { icon: "Package", value: "500+", label: "Food Products" },
      { icon: "Globe2", value: "Global", label: "& Local Sourcing" },
      { icon: "Truck", value: "KSA-Wide", label: "Delivery" },
    ],
  },
  servicesList: {
    eyebrow: "WHAT WE DO",
    title: "Services Designed Around Your Supply Needs",
    subtitle: "Pick one service or combine them into a single, dependable supply partnership.",
    buttonText: "Enquire About This Service",
    items: [
      {
        showOnHome: true,
        icon: "Globe2",
        highlight: "Global & Local Sourcing",
        title: "Food Import & Distribution",
        description:
          "We source and distribute imported and locally manufactured food products through trusted international and local suppliers.",
        image: "/categories/mix-product-new.png",
        features: [
          { text: "Imported & locally manufactured products" },
          { text: "Trusted international supplier network" },
          { text: "Distribution across the Kingdom" },
          { text: "Wide multi-category portfolio" },
        ],
      },
      {
        showOnHome: true,
        icon: "ShoppingCart",
        highlight: "Tailored Sourcing",
        title: "Procurement Solutions",
        description:
          "We provide tailored sourcing and procurement solutions for rice, meat, seafood, poultry, edible oils, spices, lentils, and other food products.",
        image: "/categories/rice-and-grains.png",
        features: [
          { text: "Sourcing to your specifications" },
          { text: "Rice, meat, seafood, poultry & oils" },
          { text: "Spices, lentils & food ingredients" },
          { text: "Competitive wholesale pricing" },
        ],
      },
      {
        showOnHome: true,
        icon: "Truck",
        highlight: "Cold Chain 24/7",
        title: "Supply Chain & Logistics",
        description:
          "We coordinate efficient transportation, delivery, and cold chain requirements through trusted logistics partners.",
        image: "/categories/about-us.png",
        features: [
          { text: "Chilled & frozen cold-chain handling" },
          { text: "Scheduled & on-demand deliveries" },
          { text: "Trusted logistics partners" },
          { text: "Delivery coordination across KSA" },
        ],
      },
      {
        showOnHome: true,
        icon: "Layers",
        highlight: "Institutional Volumes",
        title: "Bulk Supply",
        description:
          "We provide dependable bulk supply solutions for wholesalers, retailers, distributors, and institutional customers.",
        image: "/categories/canned-packaged.png",
        features: [
          { text: "Wholesale & institutional volumes" },
          { text: "Recurring supply schedules" },
          { text: "Consistent product quality" },
          { text: "Dedicated account support" },
        ],
      },
      {
        showOnHome: true,
        icon: "Tags",
        highlight: "Tailored Packaging",
        title: "Private Label & Custom Packaging",
        description:
          "We support private label and customized packaging requirements through selected sourcing and supply partners.",
        image: "/categories/food-ingredients.png",
        features: [
          { text: "Private label sourcing" },
          { text: "Custom pack sizes" },
          { text: "Selected manufacturing partners" },
          { text: "Packaging to your brand needs" },
        ],
      },
      {
        showOnHome: true,
        icon: "UtensilsCrossed",
        highlight: "HORECA & Kitchens",
        title: "Catering & Food Service Supply",
        description:
          "We supply food products to catering companies, restaurants, hotels, hospitality businesses, and commercial kitchens.",
        image: "/categories/meat.png",
        features: [
          { text: "Hotels, restaurants & catering" },
          { text: "Commercial & central kitchens" },
          { text: "Kitchen-ready product range" },
          { text: "Reliable recurring deliveries" },
        ],
      },
    ],
  },
  servicesProcess: {
    eyebrow: "HOW IT WORKS",
    title: "From Enquiry to Delivery in 4 Simple Steps",
    subtitle: "A clear, dependable process so your kitchens and shelves never run short.",
    steps: [
      { icon: "ClipboardList", title: "Share Your Requirement", description: "Tell us the products, volumes and delivery schedule you need." },
      { icon: "Globe2", title: "We Source & Quote", description: "We source from trusted suppliers and send you competitive wholesale pricing." },
      { icon: "ShieldCheck", title: "Quality Check", description: "Products are checked for quality and compliance before dispatch." },
      { icon: "Truck", title: "Reliable Delivery", description: "Your order is delivered on schedule, with cold chain where required." },
    ],
  },
  servicesIndustries: {
    eyebrow: "WHO WE SERVE",
    title: "Trusted by Businesses Across the Food Industry",
    subtitle: "We supply businesses of every size, from single outlets to nationwide chains.",
    items: [
      { icon: "Store", title: "Hypermarkets & Retail", description: "Shelf-ready products for supermarkets and retail chains." },
      { icon: "Hotel", title: "Hotels & Hospitality", description: "Consistent supply for hotel kitchens and banquets." },
      { icon: "ChefHat", title: "Restaurants & Catering", description: "Kitchen-ready ingredients for restaurants and caterers." },
      { icon: "Warehouse", title: "Wholesalers & Distributors", description: "Bulk volumes for onward distribution." },
      { icon: "Building2", title: "Institutions", description: "Dependable supply for institutional and commercial kitchens." },
      { icon: "UtensilsCrossed", title: "Food Service Providers", description: "Flexible supply for food service operators." },
    ],
  },
  servicesFaq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    subtitle: "Can't find your answer? Our team is happy to help.",
    items: [
      {
        question: "How do I request a quotation?",
        answer: "Use the enquiry form on this page or message us on WhatsApp with the products and volumes you need. Our team will get back to you with pricing.",
      },
      {
        question: "Do you deliver across Saudi Arabia?",
        answer: "Yes. We coordinate delivery to businesses across the Kingdom through our trusted logistics partners.",
      },
      {
        question: "Is there a minimum order quantity?",
        answer: "Minimum order quantities vary by product. You can see the MOQ on each product in our catalog, or ask our team.",
      },
      {
        question: "Can you supply private label products?",
        answer: "Yes. We support private label and customized packaging requirements through selected sourcing and supply partners.",
      },
    ],
  },
  servicesCta: {
    title: "Let's Build Your Supply Plan",
    subtitle: "Tell us what your business needs and we'll put together the right supply solution.",
    primaryText: "Request a Proposal",
    secondaryText: "Chat on WhatsApp",
  },
};

export const SECTION_IDS = Object.keys(SECTION_DEFAULTS) as SectionId[];

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Overlay stored values on the defaults: known keys only, nested objects merged, arrays replaced. */
export function mergeSection<T>(defaults: T, override: unknown): T {
  if (!isPlainObject(defaults) || !isPlainObject(override)) return defaults;
  const out: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(override)) {
    if (!(key in defaults) || value === undefined || value === null) continue;
    const base = (defaults as Record<string, unknown>)[key];
    if (isPlainObject(base)) out[key] = mergeSection(base, value);
    else if (Array.isArray(base)) out[key] = Array.isArray(value) ? value : base;
    else out[key] = typeof value === typeof base ? value : base;
  }
  return out as T;
}

export function mergeAllSections(stored: Partial<Record<string, unknown>> | null | undefined): SiteSections {
  const out = {} as Record<SectionId, unknown>;
  for (const id of SECTION_IDS) out[id] = mergeSection(SECTION_DEFAULTS[id], stored?.[id]);
  return out as unknown as SiteSections;
}

/** Digits only, for wa.me / tel: links. */
export const phoneDigits = (value: string) => value.replace(/[^0-9]/g, "");

export const SITE_SECTIONS_TAG = "site-sections";
