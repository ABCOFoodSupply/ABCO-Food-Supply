"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

interface ProductCategoriesProps {
  onSelectCategory?: (category: string) => void;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({ onSelectCategory }) => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  // 12 Authentic food categories using official categories assets
  const products = [
    {
      id: "rice-grains",
      title: "Rice & Grains",
      image: "/categories/rice-and-grains.png",
      description: "Basmati rice, Jasmine rice, wheat grains, pulses, lentils, and bulk flours sourced globally.",
      itemsCount: "45+ Varieties",
    },
    {
      id: "meat",
      title: "Meat",
      image: "/categories/meat.png",
      description: "Halal certified beef, mutton, lamb, and prime butcher cuts for hospitality and retail.",
      itemsCount: "30+ Cuts",
    },
    {
      id: "seafood",
      title: "Seafood",
      image: "/categories/seafood.png",
      description: "Fresh and frozen salmon, tiger prawns, hammour, seabass, and coastal shellfish on ice.",
      itemsCount: "25+ Species",
    },
    {
      id: "poultry",
      title: "Poultry",
      image: "/categories/poultry.png",
      description: "Whole chilled chicken, boneless breast, thighs, wings, and institutional poultry items.",
      itemsCount: "20+ Products",
    },
    {
      id: "dairy-products",
      title: "Dairy Products",
      image: "/categories/dairy.png",
      description: "Fresh milk, whipping creams, butter, mozzarella, cheddar, feta, and specialty cheeses.",
      itemsCount: "50+ SKUs",
    },
    {
      id: "edible-oils",
      title: "Edible Oils",
      image: "/categories/edible-oils.png",
      description: "Sunflower oil, corn oil, extra virgin olive oil, frying shortening, and bulk cooking oils.",
      itemsCount: "15+ Grades",
    },
    {
      id: "food-ingredients",
      title: "Food Ingredients",
      image: "/categories/food-ingredients.png",
      description: "Authentic Arabic spice blends, seasoning powders, cooking pastes, and herbs in bowls.",
      itemsCount: "80+ Flavors",
    },
    {
      id: "beverages",
      title: "Beverages",
      image: "/categories/beverages.png",
      description: "Pure juices, sparkling waters, energy drinks, mineral water cartons, and tea blends.",
      itemsCount: "60+ Brands",
    },
    {
      id: "fruits-vegetables",
      title: "Fruits & Vegetables",
      image: "/categories/fruits-and-vegetables.png",
      description: "Farm-fresh tomatoes, onions, bell peppers, citrus fruits, and tropical produce.",
      itemsCount: "100+ Fresh Items",
    },
    {
      id: "canned-packaged",
      title: "Canned & Packaged",
      image: "/categories/canned-packaged.png",
      description: "Canned condiments, caramel chutney, tuna, foul mudammas, chickpeas, and sauces.",
      itemsCount: "70+ Varieties",
    },
    {
      id: "frozen-foods",
      title: "Frozen Foods",
      image: "/categories/mix-product.png",
      description: "French fries, frozen green peas, mixed vegetables, burger patties, nuggets, and pastries.",
      itemsCount: "40+ Lines",
    },
    {
      id: "bakery-confectionery",
      title: "Bakery & Confectionery",
      image: "/categories/rice-and-grains.png",
      description: "Baking flour, yeast, chocolate chips, Arabic sweets ingredients, and artisan bakery.",
      itemsCount: "35+ Products",
    },
  ];

  const handleCardClick = (product: (typeof products)[0]) => {
    setSelectedCat(product.title);
    toast.success(`Category Selected: ${product.title}`, {
      description: `${product.itemsCount} available. Click "Enquiry Now" to request pricing specifications.`,
    });
    if (onSelectCategory) {
      onSelectCategory(product.title);
    }
  };

  const handleViewAll = () => {
    toast.info("Viewing Full Catalog", {
      description: "Showing all 12 core food supply product categories across Saudi Arabia.",
    });
  };

  return (
    <section id="products" className="py-16 md:py-20 bg-slate-50/60 w-full">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        {/* Section Header with View All Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-brand-red uppercase">
              OUR PRODUCTS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Wide Range of Imported & Locally Manufactured Food Products
            </h2>
          </div>

          <button
            onClick={handleViewAll}
            className="self-start md:self-auto bg-brand-red hover:bg-brand-red-dark text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow transition-all flex items-center gap-2 group cursor-pointer whitespace-nowrap"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 12 Product Cards Grid - Uncut, clean, fully visible food images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {products.map((product) => {
            const isSelected = selectedCat === product.title;
            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(product)}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col bg-white ${
                  isSelected
                    ? "border-brand-red ring-2 ring-brand-red/30 shadow-xl -translate-y-1"
                    : "border-slate-200 hover:border-brand-red/50 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {/* Clean image box with object-contain so food image is 100% visible and unclipped */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-2 flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-2 group-hover:scale-108 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 bg-brand-red text-white p-1 rounded-full shadow-md z-10">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Card Title Label */}
                <div className="p-3 text-center flex-1 flex flex-col justify-center border-t border-slate-100 bg-white">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-brand-red transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
