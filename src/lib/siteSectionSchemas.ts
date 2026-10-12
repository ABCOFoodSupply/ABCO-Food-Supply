import type { SectionId } from "./siteSections";

/** Form description used by the admin SectionEditor to edit a section's JSON content. */
export type FieldDef =
  | { type: "text"; key: string; label: string; help?: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; help?: string; rows?: number }
  | { type: "image"; key: string; label: string; help?: string; aspect?: "square" }
  | { type: "icon"; key: string; label: string }
  | { type: "toggle"; key: string; label: string; help?: string; defaultValue?: boolean }
  | { type: "group"; key: string; label: string; fields: FieldDef[] }
  | {
      type: "list";
      key: string;
      label: string;
      itemLabel: string;
      titleKey: string;
      fields: FieldDef[];
      newItem: Record<string, string | boolean>;
      help?: string;
    };

export interface SectionSchema {
  id: SectionId;
  title: string;
  description: string;
  fields: FieldDef[];
}

const statFields: FieldDef[] = [
  { type: "icon", key: "icon", label: "Icon" },
  { type: "text", key: "value", label: "Big Text" },
  { type: "text", key: "label", label: "Small Text" },
];

const cardFields: FieldDef[] = [
  { type: "icon", key: "icon", label: "Icon" },
  { type: "text", key: "highlight", label: "Tag (top-right)" },
  { type: "text", key: "title", label: "Title" },
  { type: "textarea", key: "description", label: "Description", rows: 3 },
];

const infoCardFields: FieldDef[] = [
  { type: "text", key: "tag", label: "Small Tag" },
  { type: "text", key: "title", label: "Title" },
  { type: "textarea", key: "text", label: "Text", rows: 4 },
  { type: "text", key: "footer", label: "Bottom Line" },
];

export const SECTION_SCHEMAS: Record<SectionId, SectionSchema> = {
  heroBadges: {
    id: "heroBadges",
    title: "Hero Feature Badges",
    description: "The small badges under the hero headline (500+ Food Products, etc.).",
    fields: [
      {
        type: "list",
        key: "items",
        label: "Badges",
        itemLabel: "Badge",
        titleKey: "value",
        fields: statFields,
        newItem: { icon: "Star", value: "New", label: "Badge text" },
      },
    ],
  },
  about: {
    id: "about",
    title: "About Us Section",
    description: "Banner with background image, intro text, button and the 4 stat cards below it.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "title", label: "Heading" },
      { type: "textarea", key: "body", label: "Paragraph", rows: 5 },
      { type: "image", key: "image", label: "Desktop Background Image", help: "Tablets & desktops. Wide landscape image; text sits on its left side." },
      { type: "image", key: "mobileImage", label: "Mobile Image", help: "Phones (shown under the heading). Best size 16:10, e.g. 1200 × 750 px. Leave empty to reuse the desktop image." },
      { type: "text", key: "buttonText", label: "Button Text" },
      { type: "text", key: "buttonLink", label: "Button Link", placeholder: "/about" },
      {
        type: "list",
        key: "stats",
        label: "Stat Cards",
        itemLabel: "Stat",
        titleKey: "value",
        fields: statFields,
        newItem: { icon: "Star", value: "New", label: "Stat text" },
      },
    ],
  },
  products: {
    id: "products",
    title: "Our Products Section",
    description: "Heading above the featured products. The products themselves are managed in Products & Categories.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "buttonText", label: "Button Text" },
      { type: "textarea", key: "title", label: "Heading", rows: 2 },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
    ],
  },
  b2b: {
    id: "b2b",
    title: "B2B Banner (Buy Any Food Products)",
    description: "Promotional banner with image, highlight pills and two buttons.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "titleHighlight", label: "Heading – Red Part", help: "e.g. Buy Any" },
      { type: "text", key: "titleLine1", label: "Heading – Rest of Line 1" },
      { type: "text", key: "titleLine2", label: "Heading – Line 2" },
      { type: "textarea", key: "subtitle", label: "Paragraph", rows: 3 },
      { type: "image", key: "image", label: "Banner Image", help: "Transparent PNG works best." },
      {
        type: "list",
        key: "highlights",
        label: "Highlight Pills",
        itemLabel: "Pill",
        titleKey: "label",
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "label", label: "Text" },
        ],
        newItem: { icon: "Star", label: "New highlight" },
      },
      { type: "text", key: "primaryText", label: "Red Button Text" },
      { type: "text", key: "primaryLink", label: "Red Button Link", placeholder: "/products" },
      { type: "text", key: "secondaryText", label: "White Button Text", help: "Opens the enquiry form." },
      { type: "text", key: "badgeTitle", label: "Floating Card – Title" },
      { type: "text", key: "badgeSubtitle", label: "Floating Card – Subtitle" },
    ],
  },
  services: {
    id: "services",
    title: "Our Services Section",
    description:
      "Heading and buttons above the service cards. The cards themselves come from Services Page → Services (switch \"Show on Home Page\" on each service).",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "buttonText", label: "Button Text", help: "Opens the enquiry form." },
      { type: "textarea", key: "title", label: "Heading", rows: 2 },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
    ],
  },
  whyChooseUs: {
    id: "whyChooseUs",
    title: "Why Choose Us Section",
    description: "Strength cards plus the Mission, Vision and Values blocks.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "title", label: "Heading – Line 1" },
      { type: "text", key: "titleHighlight", label: "Heading – Red Line 2" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
      {
        type: "list",
        key: "strengths",
        label: "Strength Cards",
        itemLabel: "Strength",
        titleKey: "title",
        fields: cardFields,
        newItem: { icon: "Star", highlight: "New", title: "New Strength", description: "Describe the strength." },
      },
      { type: "group", key: "mission", label: "Mission Card", fields: infoCardFields },
      { type: "group", key: "vision", label: "Vision Card", fields: infoCardFields },
      { type: "text", key: "valuesTag", label: "Values Card – Small Tag" },
      { type: "text", key: "valuesTitle", label: "Values Card – Title" },
      {
        type: "list",
        key: "values",
        label: "Values",
        itemLabel: "Value",
        titleKey: "label",
        fields: [
          { type: "text", key: "label", label: "Value" },
          { type: "text", key: "desc", label: "Short Description" },
        ],
        newItem: { label: "New Value", desc: "Short description" },
      },
      { type: "text", key: "valuesFooter", label: "Values Card – Bottom Line" },
    ],
  },
  partners: {
    id: "partners",
    title: "Clients & Partners Heading",
    description: "Text above the scrolling partner logos.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "title", label: "Heading – Black Part" },
      { type: "text", key: "titleHighlight", label: "Heading – Red Part" },
      { type: "text", key: "subtitle", label: "Sub-heading" },
    ],
  },
  gallery: {
    id: "gallery",
    title: "Gallery Section Heading",
    description: "Text above the homepage gallery. Photos are managed in the Gallery page.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "buttonText", label: "Button Text" },
      { type: "text", key: "title", label: "Heading" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
    ],
  },
  contact: {
    id: "contact",
    title: "Contact Details",
    description: "Used everywhere on the website: header, footer, contact page, product WhatsApp buttons and the map.",
    fields: [
      { type: "text", key: "phone", label: "Phone Number", placeholder: "+966 5X XXX XXXX", help: "Shown on the site and used for Call buttons." },
      { type: "text", key: "whatsapp", label: "WhatsApp Number", placeholder: "9665XXXXXXXX", help: "With country code, digits only. Used by every WhatsApp button." },
      { type: "text", key: "email", label: "Email" },
      { type: "text", key: "address", label: "Address (shown on the site)" },
      {
        type: "text",
        key: "mapAddress",
        label: "Map Location",
        help: "Address or coordinates (e.g. 27.0174, 49.6225). Drives every Google Map and Directions button.",
      },
      { type: "text", key: "hours", label: "Working Hours" },
      { type: "text", key: "hoursNote", label: "Working Hours Note" },
    ],
  },
  social: {
    id: "social",
    title: "Social Media Links",
    description: "Paste your profile links. Only filled-in platforms are shown on the website; leave a box empty to hide its icon. WhatsApp is always shown from the Contact Details number.",
    fields: [
      { type: "text", key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
      { type: "text", key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourprofile" },
      { type: "text", key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourcompany" },
      { type: "text", key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/yourhandle" },
      { type: "text", key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
    ],
  },
  contactSection: {
    id: "contactSection",
    title: "Get In Touch Section (Home Page)",
    description: "Heading of the home page contact section. Phone, email, map and social links come from Admin → Contact & Social.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "titlePrefix", label: "Heading – Start" },
      { type: "text", key: "titleHighlight", label: "Heading – Red Part" },
      { type: "text", key: "titleSuffix", label: "Heading – Line 2" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
    ],
  },
  footer: {
    id: "footer",
    title: "Footer",
    description: "Footer text. Contact details and social links come from Admin → Contact & Social.",
    fields: [
      { type: "textarea", key: "bio", label: "About Text", rows: 3 },
      { type: "text", key: "tagline", label: "Bottom Tagline – Black Part" },
      { type: "text", key: "taglineHighlight", label: "Bottom Tagline – Red Part" },
    ],
  },

  // ── About page (/about) ──
  aboutHero: {
    id: "aboutHero",
    title: "Top Banner",
    description: "Dark banner at the top of the About page.",
    fields: [
      { type: "text", key: "badge", label: "Red Badge Text" },
      { type: "text", key: "titleLine1", label: "Heading – Line 1" },
      { type: "text", key: "titleHighlight", label: "Heading – Red Line 2" },
      { type: "textarea", key: "subtitle", label: "Paragraph", rows: 3 },
      { type: "image", key: "image", label: "Background Image", help: "Shown faded behind the dark banner." },
      { type: "text", key: "primaryText", label: "Red Button Text", help: "Opens the enquiry form." },
      { type: "text", key: "secondaryText", label: "White Button Text" },
      { type: "text", key: "secondaryLink", label: "White Button Link", placeholder: "/products" },
    ],
  },
  aboutStats: {
    id: "aboutStats",
    title: "Stats Bar",
    description: "White card with numbers just below the top banner.",
    fields: [
      {
        type: "list",
        key: "items",
        label: "Stats",
        itemLabel: "Stat",
        titleKey: "value",
        fields: statFields,
        newItem: { icon: "Star", value: "100+", label: "New stat" },
      },
    ],
  },
  aboutStory: {
    id: "aboutStory",
    title: "Our Story",
    description: "Image with a callout card, heading, paragraphs and a checklist.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "textarea", key: "title", label: "Heading", rows: 2 },
      {
        type: "list",
        key: "paragraphs",
        label: "Paragraphs",
        itemLabel: "Paragraph",
        titleKey: "",
        fields: [{ type: "textarea", key: "text", label: "Text", rows: 4 }],
        newItem: { text: "" },
      },
      {
        type: "list",
        key: "checklist",
        label: "Checklist Points",
        itemLabel: "Point",
        titleKey: "text",
        fields: [{ type: "text", key: "text", label: "Text" }],
        newItem: { text: "New point" },
      },
      { type: "image", key: "image", label: "Story Image" },
      { type: "text", key: "calloutTitle", label: "Image Callout – Title" },
      { type: "text", key: "calloutText", label: "Image Callout – Text" },
    ],
  },
  aboutPillars: {
    id: "aboutPillars",
    title: "Operational Excellence Cards",
    description: "Heading and the pillar cards (grey section).",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "title", label: "Heading" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
      {
        type: "list",
        key: "items",
        label: "Cards",
        itemLabel: "Card",
        titleKey: "title",
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "badge", label: "Tag (top-right)" },
          { type: "text", key: "title", label: "Title" },
          { type: "text", key: "subtitle", label: "Red Sub-title" },
          { type: "textarea", key: "description", label: "Description", rows: 3 },
        ],
        newItem: { icon: "Star", badge: "New", title: "New Card", subtitle: "Sub-title", description: "Describe it." },
      },
    ],
  },
  aboutValues: {
    id: "aboutValues",
    title: "Mission, Vision & Values",
    description: "The three cards (dark Mission card, Vision card, Values list).",
    fields: [
      {
        type: "group",
        key: "mission",
        label: "Mission Card",
        fields: [
          { type: "text", key: "title", label: "Title" },
          { type: "text", key: "footer", label: "Bottom Line" },
          { type: "textarea", key: "text", label: "Text", rows: 4 },
        ],
      },
      {
        type: "group",
        key: "vision",
        label: "Vision Card",
        fields: [
          { type: "text", key: "title", label: "Title" },
          { type: "text", key: "footer", label: "Bottom Line" },
          { type: "textarea", key: "text", label: "Text", rows: 4 },
        ],
      },
      { type: "text", key: "valuesTitle", label: "Values Card – Title" },
      { type: "text", key: "valuesFooter", label: "Values Card – Bottom Line" },
      {
        type: "list",
        key: "values",
        label: "Values",
        itemLabel: "Value",
        titleKey: "label",
        fields: [
          { type: "text", key: "label", label: "Value (bold)" },
          { type: "text", key: "desc", label: "Description" },
        ],
        newItem: { label: "New Value", desc: "Short description" },
      },
    ],
  },
  aboutMilestones: {
    id: "aboutMilestones",
    title: "Journey / Milestones",
    description: "Timeline cards showing company growth.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "title", label: "Heading" },
      {
        type: "list",
        key: "items",
        label: "Milestones",
        itemLabel: "Milestone",
        titleKey: "year",
        fields: [
          { type: "text", key: "year", label: "Year" },
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "description", label: "Description", rows: 3 },
        ],
        newItem: { year: "2026", title: "New Milestone", description: "What happened." },
      },
    ],
  },
  aboutCta: {
    id: "aboutCta",
    title: "Bottom Red Banner",
    description: "Call-to-action strip at the end of the About page.",
    fields: [
      { type: "text", key: "title", label: "Heading" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
      { type: "text", key: "primaryText", label: "White Button Text", help: "Opens the enquiry form." },
      { type: "text", key: "secondaryText", label: "Dark Button Text" },
      { type: "text", key: "secondaryLink", label: "Dark Button Link", placeholder: "/contact" },
    ],
  },

  // ── Services page (/services) ──
  servicesHero: {
    id: "servicesHero",
    title: "Top Banner",
    description: "Heading, image, buttons and the small stat cards at the top of the Services page.",
    fields: [
      { type: "text", key: "badge", label: "Small Red Label" },
      { type: "text", key: "titleLine1", label: "Heading – Line 1" },
      { type: "text", key: "titleHighlight", label: "Heading – Red Line 2" },
      { type: "textarea", key: "subtitle", label: "Paragraph", rows: 3 },
      { type: "image", key: "image", label: "Banner Image", help: "Shown on the right in a rounded frame." },
      { type: "text", key: "primaryText", label: "Red Button Text", help: "Opens the enquiry form." },
      { type: "text", key: "secondaryText", label: "White Button Text" },
      { type: "text", key: "secondaryLink", label: "White Button Link", placeholder: "/products" },
      {
        type: "list",
        key: "stats",
        label: "Stat Cards",
        itemLabel: "Stat",
        titleKey: "value",
        fields: statFields,
        newItem: { icon: "Star", value: "New", label: "Stat text" },
      },
    ],
  },
  servicesList: {
    id: "servicesList",
    title: "Services",
    description: "Each service is shown as a large row with image, description and feature list.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "buttonText", label: "Button Text on Each Service", help: "Opens the enquiry form for that service." },
      { type: "textarea", key: "title", label: "Heading", rows: 2 },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
      {
        type: "list",
        key: "items",
        label: "Services",
        itemLabel: "Service",
        titleKey: "title",
        fields: [
          {
            type: "toggle",
            key: "showOnHome",
            label: "Show on Home Page",
            help: "Shows this service as a card in the home page Services section.",
            defaultValue: true,
          },
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "highlight", label: "Tag" },
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "description", label: "Description", rows: 3 },
          { type: "image", key: "image", label: "Image", help: "Square 1:1 image, e.g. 1080 × 1080 px.", aspect: "square" },
          {
            type: "list",
            key: "features",
            label: "Feature Points",
            itemLabel: "Point",
            titleKey: "text",
            fields: [{ type: "text", key: "text", label: "Text" }],
            newItem: { text: "New point" },
          },
        ],
        newItem: { showOnHome: true, icon: "Star", highlight: "New", title: "New Service", description: "Describe the service.", image: "" },
      },
    ],
  },
  servicesProcess: {
    id: "servicesProcess",
    title: "How It Works",
    description: "Numbered steps on the dark band.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "title", label: "Heading" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
      {
        type: "list",
        key: "steps",
        label: "Steps",
        itemLabel: "Step",
        titleKey: "title",
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "description", label: "Description", rows: 2 },
        ],
        newItem: { icon: "Star", title: "New Step", description: "What happens in this step." },
      },
    ],
  },
  servicesIndustries: {
    id: "servicesIndustries",
    title: "Who We Serve",
    description: "Cards for the industries / customer types you supply.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "title", label: "Heading" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
      {
        type: "list",
        key: "items",
        label: "Industries",
        itemLabel: "Industry",
        titleKey: "title",
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "title", label: "Title" },
          { type: "textarea", key: "description", label: "Description", rows: 2 },
        ],
        newItem: { icon: "Star", title: "New Industry", description: "Short description." },
      },
    ],
  },
  servicesFaq: {
    id: "servicesFaq",
    title: "FAQ",
    description: "Questions & answers shown as an accordion.",
    fields: [
      { type: "text", key: "eyebrow", label: "Small Red Label" },
      { type: "text", key: "title", label: "Heading" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
      {
        type: "list",
        key: "items",
        label: "Questions",
        itemLabel: "Question",
        titleKey: "question",
        fields: [
          { type: "textarea", key: "question", label: "Question", rows: 2 },
          { type: "textarea", key: "answer", label: "Answer", rows: 3 },
        ],
        newItem: { question: "New question?", answer: "Answer." },
      },
    ],
  },
  servicesCta: {
    id: "servicesCta",
    title: "Bottom Banner",
    description: "Red call-to-action banner at the end of the Services page.",
    fields: [
      { type: "text", key: "title", label: "Heading" },
      { type: "textarea", key: "subtitle", label: "Sub-heading", rows: 2 },
      { type: "text", key: "primaryText", label: "White Button Text", help: "Opens the enquiry form." },
      { type: "text", key: "secondaryText", label: "WhatsApp Button Text", help: "Uses the WhatsApp number from Home Page CMS → Contact." },
    ],
  },
};
