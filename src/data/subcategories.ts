export interface SubCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  varieties?: string[];
}

export interface CategorySubcategoriesMap {
  [categorySlug: string]: SubCategoryItem[];
}

export const DEFAULT_SUBCATEGORIES: CategorySubcategoriesMap = {
  "rice-and-grains": [
    {
      id: "basmati-rice",
      name: "Basmati Rice",
      slug: "basmati-rice",
      description: "Aged long grain aromatic Basmati rice varieties sourced from India & Pakistan.",
      image: "/categories/rice-and-grains.png",
      varieties: [
        "1121 Basmati Rice (White / Steam / Golden Sella)",
        "1509 Basmati Rice (White / Golden Sella)",
        "Sharbati Basmati Rice",
        "Sugandha Basmati Rice",
        "Jeerakasala Basmati Rice",
      ],
    },
    {
      id: "non-basmati-rice",
      name: "Non-Basmati Rice",
      slug: "non-basmati-rice",
      description: "High-grade commercial long grain, parboiled, and everyday dining rice.",
      image: "/categories/rice-and-grains.png",
      varieties: [
        "Long Grain Rice",
        "Parmal Rice (PR11, PR14 & PR106)",
        "IR64 Rice",
        "Sona Masuri Rice",
      ],
    },
  ],
};
