export interface ProductItem {
  id: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  subCategory?: string;
  subCategorySlug?: string;
  image: string;
  origin: "Saudi Arabia (Local)" | "India" | "Pakistan" | "Brazil" | "Australia" | "Netherlands" | "USA" | "Egypt" | "Global" | "Europe";
  storageType: "Ambient" | "Chilled (+4°C)" | "Frozen (-18°C)";
  moq: string;
  packaging: string;
  shelfLife: string;
  certification: string;
  description: string;
  specs: { [key: string]: string };
}

export interface CategoryInfo {
  slug: string;
  name: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  skuCount: string;
  storageTemp: string;
  certifications: string[];
  keyHighlights: string[];
  subCategories?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    varieties?: string[];
  }[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "rice-and-grains",
    name: "Rice & Grains",
    image: "/categories/rice-and-grains.png",
    shortDesc: "Premium Basmati, Jasmine, Sella, wheat grains, pulses and flours in bulk.",
    fullDesc: "ABCO Food Supply sources high-grade Basmati rice from the foothills of the Himalayas, Jasmine rice from Thailand, premium wheat grains, lentils, pulses, and bakery flours. Sourced directly from certified millers to guarantee exceptional grain elongation, aroma, and moisture control compliant with SFDA standards.",
    skuCount: "45+ Varieties",
    storageTemp: "Ambient (Dry & Ventilated)",
    certifications: ["SFDA Compliant", "ISO 22000", "Halal Certified", "Non-GMO Verified"],
    keyHighlights: [
      "Direct miller procurement from Punjab & Haryana",
      "Aged 2+ years Basmati for maximum elongation",
      "Moisture level strictly below 12.5%",
      "Available in 5kg, 10kg, 20kg, 40kg, and 1 MT bulk jumbo bags"
    ]
  },
  {
    slug: "meat",
    name: "Meat",
    image: "/categories/meat.png",
    shortDesc: "100% Halal certified beef, lamb, mutton, and primal butcher cuts.",
    fullDesc: "We provide wholesale chilled and frozen beef, mutton, and lamb cuts to Saudi hypermarkets, hotels, and institutional catering operations. All livestock is hand-slaughtered in accordance with Islamic Sharia principles, with complete veterinary certification and temperature tracking throughout the supply chain.",
    skuCount: "30+ Cuts",
    storageTemp: "Chilled (0°C to +4°C) / Frozen (-18°C)",
    certifications: ["100% Halal Slaughtered", "SFDA Approved Abattoirs", "HACCP Certified", "Veterinary Health Certificate"],
    keyHighlights: [
      "Full carcass and vacuum-packed primal cuts",
      "Strict cold-chain logistics from port to cold store",
      "Prime ribeye, striploin, tenderloin, top-side, and chuck",
      "Custom portioning and butchery packaging available"
    ]
  },
  {
    slug: "seafood",
    name: "Seafood",
    image: "/categories/seafood.png",
    shortDesc: "Fresh and frozen Atlantic salmon, black tiger prawns, kingfish, seabass, and shellfish.",
    fullDesc: "Supplying pristine seafood sourced from Arabian Gulf coastal fisheries and certified sustainable aquaculture farms globally. From whole round fish on ice to IQF (Individually Quick Frozen) fillets and headless prawns, our seafood maintains ocean-fresh texture and flavor.",
    skuCount: "25+ Species",
    storageTemp: "Chilled on Ice (0°C to +2°C) / Frozen (-18°C)",
    certifications: ["SFDA Inspected", "HACCP Verified", "Marine Stewardship Certified", "Halal"],
    keyHighlights: [
      "Daily fresh landings from Arabian Gulf fleets",
      "IQF blast-freezing within 2 hours of catch",
      "Glazing transparency and net weight guarantee",
      "Air-freighted Norwegian and Chilean salmon"
    ]
  },
  {
    slug: "poultry",
    name: "Poultry",
    image: "/categories/poultry.png",
    shortDesc: "Whole chilled chicken, boneless breast, drumsticks, wings, and institutional cuts.",
    fullDesc: "Partnered with premier Saudi poultry farms and globally certified abattoirs, ABCO Food Supply delivers fresh and frozen poultry meeting stringent biosecurity guidelines. Freshly chilled broilers and calibrated frozen cuts for catering companies, quick-service restaurants, and hypermarkets.",
    skuCount: "20+ Products",
    storageTemp: "Chilled (0°C to +4°C) / Frozen (-18°C)",
    certifications: ["100% Hand Halal Slaughtered", "SFDA Certified", "Salmonella & Hormone Free", "HACCP"],
    keyHighlights: [
      "Weight-graded calibrated chicken breasts (120g-220g)",
      "Daily supply of chilled fresh chickens (800g to 1300g)",
      "Institutional bulk packs for catering mess facilities",
      "No artificial growth promoters or antibiotics"
    ]
  },
  {
    slug: "dairy",
    name: "Dairy Products",
    image: "/categories/dairy.png",
    shortDesc: "Fresh milk, whipping creams, unsalted butter, mozzarella, cheddar, and specialty cheeses.",
    fullDesc: "Our dairy portfolio covers essential institutional and retail dairy ingredients sourced from European and local Saudi dairies. High-yield shredded mozzarella, pure butter blocks for industrial bakeries, UHT long-life milk cartons, and cooking creams that perform flawlessly in commercial kitchens.",
    skuCount: "50+ SKUs",
    storageTemp: "Chilled (+2°C to +6°C) / Frozen (-18°C for Butter)",
    certifications: ["SFDA Compliant", "ISO 9001:2015", "Halal Dairy Certified", "Cold-Chain Audited"],
    keyHighlights: [
      "82% pure butterfat European butter blocks",
      "High-stretch low-moisture mozzarella for pizzerias",
      "UHT milk with 9-month stable ambient shelf life",
      "Custom bulk packs for food manufacturing"
    ]
  },
  {
    slug: "edible-oils",
    name: "Edible Oils",
    image: "/categories/edible-oils.png",
    shortDesc: "Refined sunflower oil, pure corn oil, extra virgin olive oil, and frying shortening.",
    fullDesc: "ABCO Food Supply distributes premium cooking and edible oils designed for high smoke points, clarity, and extended frying durability. From 1.5L retail bottles to 18L foodservice tins and flexitank bulk containers, our oils meet all SFDA chemical and nutritional thresholds.",
    skuCount: "15+ Grades",
    storageTemp: "Ambient (Cool, Dry Place away from sunlight)",
    certifications: ["SFDA Approved", "100% Vegetable Source", "Cholesterol Free", "HACCP"],
    keyHighlights: [
      "High smoke point (>230°C) for industrial frying",
      "Cold-pressed Extra Virgin Olive Oil from the Mediterranean",
      "Heavy-duty 18L foodservice tin containers",
      "Refined, deodorized, and bleached for neutral taste"
    ]
  },
  {
    slug: "food-ingredients",
    name: "Food Ingredients",
    image: "/categories/food-ingredients.png",
    shortDesc: "Arabic spice blends, cardamom, saffron, pure tomato paste, and culinary seasonings.",
    fullDesc: "Supplying authentic culinary seasonings, pure spices, ground herbs, and base cooking pastes to Saudi kitchens and commercial food manufacturers. Hand-selected cardamom from Guatemala, pure saffron, custom Kabsa spice mixes, and double-concentrated tomato pastes.",
    skuCount: "80+ Flavors",
    storageTemp: "Ambient (Airtight, Dry & Cool)",
    certifications: ["SFDA Standard 100%", "Halal Certified", "Purity Lab Tested", "No Artificial Colors"],
    keyHighlights: [
      "Single-origin whole spices and micro-milled powders",
      "Traditional Saudi Kabsa, Mandi, and Bukhari blends",
      "High Brix (28-30%) tomato paste in 70g to 3kg cans",
      "Steam-sterilized for zero microbial contamination"
    ]
  },
  {
    slug: "beverages",
    name: "Beverages",
    image: "/categories/beverages.png",
    shortDesc: "Natural fruit juices, mineral water cartons, sparkling sodas, and premium tea blends.",
    fullDesc: "A complete beverage distribution range catering to hotels, offices, restaurants, and retail stores across the Kingdom. Featuring 100% NFC (Not From Concentrate) fruit juices, low-sodium bottled drinking water, energy beverages, and fine Ceylon black teas.",
    skuCount: "60+ Brands",
    storageTemp: "Ambient / Serve Chilled (+4°C)",
    certifications: ["SFDA Bottled Water Standards", "Halal Certified", "ISO 22000"],
    keyHighlights: [
      "Low sodium mineral water pallet distribution",
      "100% natural fruit juices with zero added sugar",
      "Bulk institutional tea bags and loose leaves",
      "Full container load and mixed pallet delivery"
    ]
  },
  {
    slug: "fruits-and-vegetables",
    name: "Fruits & Vegetables",
    image: "/categories/fruits-and-vegetables.png",
    shortDesc: "Farm-fresh tomatoes, onions, potatoes, citrus, leafy greens, and exotic produce.",
    fullDesc: "Daily farm-to-table procurement from Qassim, Al-Kharj, and direct air/sea refrigerated reefer containers from Egypt, Jordan, and Europe. Graded for size, uniform ripeness, and zero defects to satisfy strict catering compound and supermarket standards.",
    skuCount: "100+ Fresh Items",
    storageTemp: "Chilled (+4°C to +8°C Controlled Humidity)",
    certifications: ["Pesticide Residue Tested", "GlobalGAP Certified Farms", "SFDA Inspected"],
    keyHighlights: [
      "Daily morning delivery to commercial kitchens in Jubail & Eastern Province",
      "Pre-washed, peeled, and sanitized vegetable prep options",
      "Uniform weight grading for portion control",
      "Cold-chain refrigerated transport vans"
    ]
  },
  {
    slug: "canned-packaged",
    name: "Canned & Packaged",
    image: "/categories/canned-packaged.png",
    shortDesc: "Foul mudammas, canned tuna, chickpeas, sweet corn, caramel chutney, and shelf-stable goods.",
    fullDesc: "Long-life canned pulses, seafood, vegetables, condiments, and sauces essential for pantry stability and institutional bulk food prep. Easy-open and foodservice large cans ensuring zero spoilage and consistent taste year-round.",
    skuCount: "70+ Varieties",
    storageTemp: "Ambient (Dry Storage)",
    certifications: ["SFDA Standard Compliant", "BPA-Free Lining", "Halal Certified"],
    keyHighlights: [
      "Traditional Saudi Foul Mudammas and Tahina packs",
      "Solid and chunk light tuna in pure sunflower oil",
      "3kg catering size cans for commercial restaurants",
      "24 to 36 months long shelf life stability"
    ]
  },
  {
    slug: "frozen-foods",
    name: "Frozen Foods",
    image: "/categories/mix-product.png",
    shortDesc: "French fries, frozen green peas, burger patties, nuggets, and pre-formed pastries.",
    fullDesc: "High-turnover frozen convenience lines for fast-food operators, hospitality kitchens, and retail freezers. Featuring Grade-A Belgian potato fries, IQF mixed vegetables, and seasoned chicken and beef patties ready for the grill.",
    skuCount: "40+ Lines",
    storageTemp: "Deep Freeze (-18°C or below)",
    certifications: ["Continuous Cold-Chain Verified", "Halal Certified", "SFDA Registered"],
    keyHighlights: [
      "Crisp-coated and standard cut 9x9mm and 7x7mm fries",
      "IQF green peas, sweet corn, and vegetable medleys",
      "Calibrated portion weights for menu cost consistency",
      "Zero defrosting during transit guarantee"
    ]
  },
  {
    slug: "bakery-confectionery",
    name: "Bakery & Confectionery",
    image: "/categories/rice-and-grains.png",
    shortDesc: "Industrial baking flours, instant dry yeast, cocoa powders, chocolate compounds, and sugar.",
    fullDesc: "Dedicated ingredients for artisan bakeries, commercial pastry kitchens, and Arabic confectionery manufacturers. Consistent protein levels, gluten stability, and thermal resilience for perfect baking yields every batch.",
    skuCount: "35+ Products",
    storageTemp: "Ambient (Dry, below 25°C)",
    certifications: ["SFDA Approved Flours", "Halal Ingredients", "ISO 22000"],
    keyHighlights: [
      "High-gluten bread flour and low-protein pastry flour",
      "Instant high-potency dry yeast (500g vacuum packs)",
      "Belgian compound chocolate slabs and chips",
      "Specialty Arabic sweet syrups and rose essences"
    ]
  }
];

export const ALL_PRODUCTS: ProductItem[] = [
  // Rice & Grains
  {
    id: "prod-basmati-1121",
    name: "Aged 1121 XXL Basmati Rice",
    categorySlug: "rice-and-grains",
    categoryName: "Rice & Grains",
    image: "/categories/rice-and-grains.png",
    origin: "India",
    storageType: "Ambient",
    moq: "500 kg (25 bags)",
    packaging: "20kg & 40kg Non-Woven Fabric Bags",
    shelfLife: "24 Months",
    certification: "SFDA Compliant, Halal",
    description: "Extra-long grain premium aged Basmati rice with exquisite aroma and elongation up to 22mm when cooked. Ideal for Mandi and Kabsa.",
    specs: {
      "Grain Length": "8.35mm (Pre-cooked)",
      "Moisture": "Under 12%",
      "Broken Ratio": "Max 1%",
      "Crop Year": "2024 (Aged 2 Years)"
    }
  },
  {
    id: "prod-sella-rice",
    name: "Golden Sella Parboiled Basmati Rice",
    categorySlug: "rice-and-grains",
    categoryName: "Rice & Grains",
    image: "/categories/rice-and-grains.png",
    origin: "Pakistan",
    storageType: "Ambient",
    moq: "1,000 kg",
    packaging: "40kg PP Bags",
    shelfLife: "24 Months",
    certification: "SFDA Approved, ISO 22000",
    description: "Hard-grained parboiled rice with golden luster. Highly resistant to overcooking, designed specifically for commercial catering kitchens.",
    specs: {
      "Processing": "Steam Parboiled",
      "Moisture": "12.0%",
      "Broken Ratio": "Under 0.5%",
      "Texture": "Firm & Non-sticky"
    }
  },
  {
    id: "prod-wheat-grain",
    name: "Hard Red Winter Wheat Grains",
    categorySlug: "rice-and-grains",
    categoryName: "Rice & Grains",
    image: "/categories/rice-and-grains.png",
    origin: "Saudi Arabia (Local)",
    storageType: "Ambient",
    moq: "2,000 kg",
    packaging: "50kg Woven Polypropylene Bags",
    shelfLife: "18 Months",
    certification: "Saudi Grain Organization Certified",
    description: "Locally produced high-protein wheat grains suitable for commercial stone milling, wholemeal bread, and traditional Harees preparation.",
    specs: {
      "Protein": "13.5% Min",
      "Moisture": "11.5% Max",
      "Test Weight": "78 kg/hl",
      "Cleanliness": "99.8% Pure"
    }
  },
  {
    id: "prod-lentils-red",
    name: "Split Red Football Lentils",
    categorySlug: "rice-and-grains",
    categoryName: "Rice & Grains",
    image: "/categories/rice-and-grains.png",
    origin: "Global",
    storageType: "Ambient",
    moq: "500 kg",
    packaging: "25kg Bags",
    shelfLife: "24 Months",
    certification: "SFDA Inspected, Halal",
    description: "Bright orange-red polished split lentils with rapid cooking time. Standard ingredient for Arabic soups and curries.",
    specs: {
      "Purity": "99.9%",
      "Cooking Time": "15-20 Minutes",
      "Oil Polished": "Food-grade mineral oil 0.1%",
      "Foreign Matter": "Nil"
    }
  },

  // Meat
  {
    id: "prod-beef-ribeye",
    name: "Chilled Halal Beef Ribeye Primal",
    categorySlug: "meat",
    categoryName: "Meat",
    image: "/categories/meat.png",
    origin: "Brazil",
    storageType: "Chilled (+4°C)",
    moq: "200 kg (10 cases)",
    packaging: "Vacuum Packed (4 pieces per carton, ~20kg)",
    shelfLife: "90 Days Chilled",
    certification: "100% Halal Slaughter, SFDA Approved",
    description: "Grass-fed and grain-finished halal beef ribeye with consistent marbling. Tender, flavorful, and vacuum-sealed for hotel restaurants.",
    specs: {
      "Cut Code": "RIB-001",
      "Weight/Primal": "4.5 - 5.5 kg",
      "Chilled SLA": "0°C to +2°C",
      "Hormone Status": "Zero Added Hormones"
    }
  },
  {
    id: "prod-lamb-carcass",
    name: "Whole Frozen Halal Lamb Carcass",
    categorySlug: "meat",
    categoryName: "Meat",
    image: "/categories/meat.png",
    origin: "Australia",
    storageType: "Frozen (-18°C)",
    moq: "50 Carcasses (~800 kg)",
    packaging: "Cotton Stockinette + Polybag wrap",
    shelfLife: "18 Months Frozen",
    certification: "Halal Islamic Council, SFDA Health Tag",
    description: "Prime young pasture-fed Australian lamb carcasses, weight graded 14-18kg. Tender meat with sweet fat profile for banquet feasts.",
    specs: {
      "Weight Range": "16 - 18 kg Average",
      "Dentition": "0 Tooth Young Lamb",
      "Freezing": "Blast Frozen -35°C",
      "SFDA Abattoir": "Export Grade A"
    }
  },
  {
    id: "prod-beef-mince",
    name: "Lean Minced Beef 80/20",
    categorySlug: "meat",
    categoryName: "Meat",
    image: "/categories/meat.png",
    origin: "Brazil",
    storageType: "Frozen (-18°C)",
    moq: "300 kg",
    packaging: "10 x 1kg Roll Chubs or 4 x 5kg Bulk Bags",
    shelfLife: "12 Months",
    certification: "SFDA Certified, 100% Halal",
    description: "Precisely blended 80% lean meat and 20% fat minced beef for juicy burger patties, koftas, and meat sauce preparations.",
    specs: {
      "Lean/Fat Ratio": "80% Lean / 20% Fat",
      "Grind Size": "4mm Coarse Grind",
      "Moisture": "Natural Meat Moisture",
      "Additives": "Zero Preservatives / 100% Pure Beef"
    }
  },

  // Seafood
  {
    id: "prod-salmon-fillet",
    name: "Fresh Atlantic Salmon Fillets (Skin-on)",
    categorySlug: "seafood",
    categoryName: "Seafood",
    image: "/categories/seafood.png",
    origin: "Netherlands",
    storageType: "Chilled (+4°C)",
    moq: "100 kg (10 styrofoam boxes)",
    packaging: "10kg Insulated EPS boxes with dry ice",
    shelfLife: "14 Days from harvest",
    certification: "SFDA Inspected, GlobalGAP Aquaculture",
    description: "Air-freighted premium Atlantic salmon fillets with rich omega-3 fat layers, pin-bone out, graded TRIM-D.",
    specs: {
      "Trim Style": "Trim D (Belly off, Fin off, Pin-bone out)",
      "Fillet Weight": "1.4 - 1.8 kg",
      "Color Score": "SalmoFan 28-30 (Deep Orange)",
      "Supply Frequency": "Weekly Direct Flights to Dammam/Riyadh"
    }
  },
  {
    id: "prod-tiger-prawns",
    name: "Black Tiger Prawns Headless (HOSO / HLSO)",
    categorySlug: "seafood",
    categoryName: "Seafood",
    image: "/categories/seafood.png",
    origin: "Saudi Arabia (Local)",
    storageType: "Frozen (-18°C)",
    moq: "200 kg",
    packaging: "6 x 2kg Master Cartons (12kg net)",
    shelfLife: "24 Months",
    certification: "SFDA Red Sea Aquaculture, Halal",
    description: "Sustainably farmed giant black tiger prawns from pristine Red Sea waters. Firm texture, sweet flavor, and zero antibiotic residues.",
    specs: {
      "Size Grade": "U/10, 16/20, 21/25 counts/kg",
      "Glazing": "10% Net Weight Guaranteed",
      "Freezing Method": "IQF (Individually Quick Frozen)",
      "Sodium Metabisulfite": "Below 30ppm"
    }
  },

  // Poultry
  {
    id: "prod-chicken-whole",
    name: "Grade-A Halal Whole Chicken (1000g)",
    categorySlug: "poultry",
    categoryName: "Poultry",
    image: "/categories/poultry.png",
    origin: "Saudi Arabia (Local)",
    storageType: "Chilled (+4°C)",
    moq: "500 Birds (50 cartons)",
    packaging: "10 birds per carton, individually bagged",
    shelfLife: "7 Days Chilled / 12 Mo Frozen",
    certification: "SFDA Approved, 100% Local Halal",
    description: "Locally raised fresh chilled chickens fed on 100% natural vegetarian grain diet. Exceptionally tender and juicy.",
    specs: {
      "Unit Weight": "1000g ± 50g",
      "Bleeding Time": "Islamic Sharia Full Drainage",
      "Defects": "Grade A (No bruises, zero broken bones)",
      "Cold Chain": "Direct Chilled Delivery 0°C to +4°C"
    }
  },
  {
    id: "prod-chicken-breast",
    name: "Calibrated Boneless Skinless Chicken Breast",
    categorySlug: "poultry",
    categoryName: "Poultry",
    image: "/categories/poultry.png",
    origin: "Brazil",
    storageType: "Frozen (-18°C)",
    moq: "600 kg (40 cartons)",
    packaging: "2 x 7.5kg layer packs per 15kg carton",
    shelfLife: "18 Months Frozen",
    certification: "SFDA Registered Abattoir, Halal",
    description: "Calibrated boneless skinless chicken breasts with minimal moisture purge. Ideal for shish tawook, escalopes, and shawarma.",
    specs: {
      "Calibration": "160g - 180g / 180g - 200g pieces",
      "Water Content": "Normal (Under 7% purge on thaw)",
      "Trimming": "Fat and cartilage completely removed",
      "Freezing": "Layer packed blast frozen"
    }
  },

  // Dairy
  {
    id: "prod-butter-unsalted",
    name: "Pure Creamery Unsalted Butter 82% FAT",
    categorySlug: "dairy",
    categoryName: "Dairy Products",
    image: "/categories/dairy.png",
    origin: "Netherlands",
    storageType: "Frozen (-18°C)",
    moq: "500 kg (20 cartons)",
    packaging: "25kg Solid Block in Poly-Lined Corrugated Box",
    shelfLife: "24 Months Frozen / 90 Days Chilled",
    certification: "SFDA Compliant, Halal Dairy",
    description: "Rich European lactic/sweet cream butter with 82% minimum milk fat. The industry gold standard for croissants, puff pastries, and commercial kitchens.",
    specs: {
      "Milk Fat": "82.2% Min",
      "Moisture": "15.8% Max",
      "Non-fat Solids": "2.0% Max",
      "Color": "Pale Cream Natural Luster"
    }
  },
  {
    id: "prod-mozzarella-cheese",
    name: "High-Stretch Low-Moisture Mozzarella Block",
    categorySlug: "dairy",
    categoryName: "Dairy Products",
    image: "/categories/dairy.png",
    origin: "Europe",
    storageType: "Chilled (+4°C)",
    moq: "300 kg (15 cartons)",
    packaging: "4 x 2.5kg Loaf Blocks per carton (10kg)",
    shelfLife: "6 Months Chilled",
    certification: "Halal Certified, SFDA Inspected",
    description: "Low-moisture whole-milk mozzarella cheese offering supreme stretch, golden browning, and minimal oil-off for commercial pizzerias.",
    specs: {
      "Fat in Dry Matter": "45% Min",
      "Moisture": "48% Max",
      "Stretch Length": "Over 35 cm when melted",
      "Browning": "Uniform golden blisters without burn"
    }
  },

  // Edible Oils
  {
    id: "prod-sunflower-oil",
    name: "Pure Refined Sunflower Oil (Foodservice 18L)",
    categorySlug: "edible-oils",
    categoryName: "Edible Oils",
    image: "/categories/edible-oils.png",
    origin: "Global",
    storageType: "Ambient",
    moq: "50 Tins (900 Liters)",
    packaging: "18 Liter Food-Grade Heavy Duty Steel Tin",
    shelfLife: "24 Months",
    certification: "SFDA Standard, 100% Pure Vegetable",
    description: "Crystal clear refined sunflower oil with superior oxidative stability and high smoke point (>232°C). Zero foam, zero odor transfer.",
    specs: {
      "Smoke Point": "232°C (450°F)",
      "Free Fatty Acids": "0.08% Max",
      "Peroxide Value": "1.0 meq/kg Max",
      "Vitamin Fortification": "Enriched with Vitamin A & D"
    }
  },
  {
    id: "prod-olive-oil-evoo",
    name: "Extra Virgin Olive Oil First Cold Press",
    categorySlug: "edible-oils",
    categoryName: "Edible Oils",
    image: "/categories/edible-oils.png",
    origin: "Saudi Arabia (Local)",
    storageType: "Ambient",
    moq: "20 Cartons (240 Liters)",
    packaging: "12 x 1L Dark Glass Bottles per carton",
    shelfLife: "24 Months",
    certification: "SFDA Organic Certified, Jouf Harvest",
    description: "Single-estate extra virgin olive oil from the renowned groves of Al-Jouf, Saudi Arabia. Acidity below 0.4%, rich in polyphenols with fruity aroma.",
    specs: {
      "Acidity": "≤ 0.35% (Oleic Acid)",
      "Extraction": "Continuous Cold Centrifuge < 26°C",
      "Origin": "Al-Jouf Region, KSA",
      "Bottle": "UV-blocking dark green glass"
    }
  },

  // Food Ingredients
  {
    id: "prod-saudi-kabsa-spice",
    name: "Traditional Saudi Kabsa Spice Master Blend",
    categorySlug: "food-ingredients",
    categoryName: "Food Ingredients",
    image: "/categories/food-ingredients.png",
    origin: "Saudi Arabia (Local)",
    storageType: "Ambient",
    moq: "100 kg",
    packaging: "5kg Multi-layer Foil Barrier Bags (4 per carton)",
    shelfLife: "24 Months",
    certification: "SFDA Food Standard, 100% Halal",
    description: "Authentic Arabic master spice formulation featuring black lime (Loomi), green cardamom, cinnamon, cloves, cumin, and coriander in balanced proportions.",
    specs: {
      "Form": "Coarse Ground Blend",
      "Irradiation": "Sterilized / Zero Pathogens",
      "Salt Content": "Zero Added Salt (Pure Spice)",
      "Aroma Profile": "Warm, citrusy, and aromatic"
    }
  },
  {
    id: "prod-tomato-paste",
    name: "Double Concentrated Tomato Paste 28-30% Brix",
    categorySlug: "food-ingredients",
    categoryName: "Food Ingredients",
    image: "/categories/food-ingredients.png",
    origin: "Egypt",
    storageType: "Ambient",
    moq: "100 Cartons",
    packaging: "6 x 3kg Cans per carton",
    shelfLife: "36 Months",
    certification: "SFDA Approved, Non-GMO",
    description: "Deep red double-concentrated tomato paste manufactured from ripe field tomatoes. Vibrant natural color without artificial dyes.",
    specs: {
      "Brix": "28 - 30% Soluble Solids",
      "Color a/b": "2.1 Min (HunterLab)",
      "Acidity": "1.8 - 2.4% (Citric Acid)",
      "Lining": "Epoxy Phenolic Food-Grade Lacquer"
    }
  },

  // Beverages
  {
    id: "prod-orange-juice-100",
    name: "100% Pure Squeezed Orange Juice (NFC)",
    categorySlug: "beverages",
    categoryName: "Beverages",
    image: "/categories/beverages.png",
    origin: "Global",
    storageType: "Chilled (+4°C)",
    moq: "50 Cartons",
    packaging: "12 x 1L Tetra Pak with screw cap",
    shelfLife: "12 Months Unopened",
    certification: "SFDA Approved, 100% Fruit Juice",
    description: "Pure orange juice with delicate pulp, not made from concentrate. Balanced sweet-tart flavor with natural vitamin C.",
    specs: {
      "Brix": "11.2° Min",
      "Sugar": "No Added Sugar or Syrups",
      "Pulp Content": "2.5% Medium Pulp",
      "Preservatives": "Zero Added Chemicals"
    }
  },

  // Fruits & Vegetables
  {
    id: "prod-fresh-tomatoes",
    name: "Grade-1 Greenhouse Roma Tomatoes",
    categorySlug: "fruits-and-vegetables",
    categoryName: "Fruits & Vegetables",
    image: "/categories/fruits-and-vegetables.png",
    origin: "Saudi Arabia (Local)",
    storageType: "Chilled (+4°C)",
    moq: "50 Crates (300 kg)",
    packaging: "6kg Ventilated Recyclable Crates",
    shelfLife: "10-14 Days Chilled",
    certification: "Saudi GAP, Pesticide residue tested",
    description: "Firm, thick-walled plum tomatoes harvested daily from modern hydroponic greenhouses in Al-Kharj. High yield and uniform color.",
    specs: {
      "Variety": "Roma / Plum Tomato",
      "Diameter": "55 - 65 mm Calibrated",
      "Color Stage": "Stage 4-5 (Pink to Firm Red)",
      "Cleanliness": "Washed, graded, and stem-trimmed"
    }
  },

  // Canned & Packaged
  {
    id: "prod-foul-mudammas",
    name: "Premium Fava Beans (Foul Mudammas)",
    categorySlug: "canned-packaged",
    categoryName: "Canned & Packaged",
    image: "/categories/canned-packaged.png",
    origin: "Egypt",
    storageType: "Ambient",
    moq: "100 Cartons",
    packaging: "24 x 400g Easy-Open Cans per carton",
    shelfLife: "36 Months",
    certification: "SFDA Verified, Halal",
    description: "Tender, whole fava beans cooked in light seasoned brine. The quintessential breakfast staple for catering operations across the Kingdom.",
    specs: {
      "Drained Weight": "240g min per 400g can",
      "Can Opening": "Easy-Open Tab Pull",
      "Brine": "Water, Salt, Cumin hint, Citric Acid",
      "Shelf Stability": "Hermetically sealed retort process"
    }
  },

  // Frozen Foods
  {
    id: "prod-french-fries",
    name: "Grade-A Straight Cut French Fries 9x9mm",
    categorySlug: "frozen-foods",
    categoryName: "Frozen Foods",
    image: "/categories/mix-product.png",
    origin: "Netherlands",
    storageType: "Frozen (-18°C)",
    moq: "80 Cartons (800 kg)",
    packaging: "4 x 2.5kg Bags per 10kg Master Carton",
    shelfLife: "24 Months Deep Frozen",
    certification: "Halal Certified, SFDA Registered",
    description: "Crispy outer golden coat with fluffy potato interior. Exceptionally low oil absorption and long holding time in warming drawers.",
    specs: {
      "Cut Size": "9mm x 9mm (3/8 inch Straight Cut)",
      "Solids": "20.5% Minimum Potato Solids",
      "Defects": "Grade A (Zero black spots)",
      "Holding Time": "Stays crispy for 15+ minutes"
    }
  },

  // Bakery & Confectionery
  {
    id: "prod-bakers-flour",
    name: "High-Protein Bakery Flour (Patent Flour)",
    categorySlug: "bakery-confectionery",
    categoryName: "Bakery & Confectionery",
    image: "/categories/rice-and-grains.png",
    origin: "Saudi Arabia (Local)",
    storageType: "Ambient",
    moq: "1,000 kg (20 bags)",
    packaging: "50kg Multi-wall Paper Valve Bags",
    shelfLife: "12 Months",
    certification: "SFDA Wheat Flour Standard, Halal",
    description: "Milled from selected hard spring wheats. Excellent water absorption, high gluten development, and superior dough volume for sandwich loaves and burger buns.",
    specs: {
      "Protein": "12.8% - 13.5%",
      "Wet Gluten": "32% Minimum",
      "Ash Content": "0.55% Maximum",
      "Falling Number": "320 - 380 seconds"
    }
  }
];
