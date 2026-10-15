-- ==============================================================================
-- ABCO FOOD SUPPLY (AFS) DATABASE SCHEMA
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable UUID Extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE: product_categories
-- Stores all wholesale supply categories created/managed in Admin > Products > Categories
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    show_on_homepage BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 99,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on slug & homepage flag for fast lookup
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON public.product_categories (slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_homepage ON public.product_categories (show_on_homepage);

-- ==============================================================================
-- TABLE: products
-- Stores all wholesale products created/managed in Admin > Products > Add Products
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    category_name TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    origin TEXT NOT NULL DEFAULT 'Saudi Arabia (Local)',
    storage_type TEXT NOT NULL DEFAULT 'Ambient',
    moq TEXT NOT NULL DEFAULT '500 kg',
    packaging TEXT NOT NULL DEFAULT '25 kg bags',
    shelf_life TEXT NOT NULL DEFAULT '24 Months',
    certification TEXT NOT NULL DEFAULT 'SFDA Compliant, Halal',
    description TEXT NOT NULL DEFAULT '',
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    featured_on_homepage BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Quick migration if table already exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured_on_homepage BOOLEAN NOT NULL DEFAULT false;

-- Indexes for category filtering, fast search & featured products
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON public.products (category_slug);
CREATE INDEX IF NOT EXISTS idx_products_storage_type ON public.products (storage_type);
CREATE INDEX IF NOT EXISTS idx_products_origin ON public.products (origin);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (featured_on_homepage);

-- ==============================================================================
-- TABLE: homepage_hero
-- Stores hero headlines, POV image (ImageKit), and CTA buttons managed via CMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.homepage_hero (
    id TEXT PRIMARY KEY DEFAULT 'default_hero',
    badge_text TEXT NOT NULL DEFAULT 'Saudi Vision 2030 Partner',
    title_line1 TEXT NOT NULL DEFAULT 'Your Trusted Partner for',
    title_highlight TEXT NOT NULL DEFAULT 'Food Supply',
    subtitle TEXT NOT NULL DEFAULT 'Distributor of Imported & Locally Manufactured Food Products Across the Kingdom of Saudi Arabia.',
    hero_image TEXT NOT NULL DEFAULT '/categories/hero.png',
    mobile_hero_image TEXT,
    button1_text TEXT NOT NULL DEFAULT 'Buy Any Products',
    button1_link TEXT NOT NULL DEFAULT '/products',
    button2_text TEXT NOT NULL DEFAULT 'Enquire Now',
    button2_link TEXT NOT NULL DEFAULT '#enquire',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: clients_partners
-- Stores partner & client logos shown on the homepage
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.clients_partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    type TEXT DEFAULT 'Retail Partner',
    location TEXT DEFAULT 'KSA',
    sort_order INTEGER NOT NULL DEFAULT 99,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public can read all catalog items, Service Role / API has full write permissions
-- ==============================================================================
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- Existing databases: add the mobile hero image column
ALTER TABLE public.homepage_hero ADD COLUMN IF NOT EXISTS mobile_hero_image TEXT;

ALTER TABLE public.homepage_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients_partners ENABLE ROW LEVEL SECURITY;

-- Allow public read access (Anon key & customers)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read product_categories') THEN
        CREATE POLICY "Allow public read product_categories" ON public.product_categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all write product_categories') THEN
        CREATE POLICY "Allow all write product_categories" ON public.product_categories FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read products') THEN
        CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all write products') THEN
        CREATE POLICY "Allow all write products" ON public.products FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read homepage_hero') THEN
        CREATE POLICY "Allow public read homepage_hero" ON public.homepage_hero FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all write homepage_hero') THEN
        CREATE POLICY "Allow all write homepage_hero" ON public.homepage_hero FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read clients_partners') THEN
        CREATE POLICY "Allow public read clients_partners" ON public.clients_partners FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all write clients_partners') THEN
        CREATE POLICY "Allow all write clients_partners" ON public.clients_partners FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- wholesale_rfqs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wholesale_rfqs' AND policyname = 'Allow public read wholesale_rfqs') THEN
        CREATE POLICY "Allow public read wholesale_rfqs" ON public.wholesale_rfqs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wholesale_rfqs' AND policyname = 'Allow all write wholesale_rfqs') THEN
        CREATE POLICY "Allow all write wholesale_rfqs" ON public.wholesale_rfqs FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ==============================================================================
-- TABLE: wholesale_rfqs
-- Stores all incoming B2B quotations & enquiries from website forms
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wholesale_rfqs (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL DEFAULT 'quotation_modal',
    client_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    cr_number TEXT DEFAULT '',
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Jubail Industrial City',
    business_type TEXT DEFAULT 'HORECA & Hospitality',
    category TEXT NOT NULL DEFAULT 'Rice & Grains',
    product_name TEXT DEFAULT '',
    requested_volume TEXT NOT NULL DEFAULT 'Bulk Container',
    status TEXT NOT NULL DEFAULT 'Pending',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wholesale_rfqs_status ON public.wholesale_rfqs (status);
CREATE INDEX IF NOT EXISTS idx_wholesale_rfqs_created_at ON public.wholesale_rfqs (created_at DESC);

ALTER TABLE public.wholesale_rfqs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- TABLE: gallery_items
-- Stores operational depot, cold fleet, and facility photos displayed on /gallery
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'warehouse',
    category_label TEXT NOT NULL DEFAULT 'Warehousing & Facilities',
    image TEXT NOT NULL,
    caption TEXT DEFAULT '',
    location TEXT DEFAULT 'Jubail Industrial City, KSA',
    sort_order INTEGER NOT NULL DEFAULT 99,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- TABLE: company_settings
-- Stores global company phone, email, CR, and address displayed on contact & footer
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.company_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    company_name TEXT NOT NULL DEFAULT 'ABCO Food Supply (AFS)',
    cr_number TEXT NOT NULL DEFAULT '2050123456',
    sfda_number TEXT NOT NULL DEFAULT 'SFDA-FS-2026-9918',
    email TEXT NOT NULL DEFAULT 'info@acbofoodsupply.com ',
    phone TEXT NOT NULL DEFAULT '+966 50 123 4567',
    whatsapp TEXT NOT NULL DEFAULT '+966 50 123 4567',
    address TEXT NOT NULL DEFAULT 'Jubail Industrial City, Support Services Area 1, Eastern Province, KSA',
    cold_capacity TEXT NOT NULL DEFAULT '18,500 m³ (-18°C to +4°C)',
    fleet_count TEXT NOT NULL DEFAULT '45 GPS Temperature-Monitored Reefer Units',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- gallery_items
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_items' AND policyname = 'Allow public read gallery_items') THEN
        CREATE POLICY "Allow public read gallery_items" ON public.gallery_items FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_items' AND policyname = 'Allow all write gallery_items') THEN
        CREATE POLICY "Allow all write gallery_items" ON public.gallery_items FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- company_settings
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow public read company_settings') THEN
        CREATE POLICY "Allow public read company_settings" ON public.company_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow all write company_settings') THEN
        CREATE POLICY "Allow all write company_settings" ON public.company_settings FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Seed default company settings row
INSERT INTO public.company_settings (id, company_name, cr_number, sfda_number, email, phone, whatsapp, address, cold_capacity, fleet_count)
VALUES (
    'default_settings',
    'ABCO Food Supply (AFS)',
    '2050123456',
    'SFDA-FS-2026-9918',
    'info@acbofoodsupply.com ',
    '+966 50 123 4567',
    '+966 50 123 4567',
    'Jubail Industrial City, Support Services Area 1, Eastern Province, KSA',
    '18,500 m³ (-18°C to +4°C)',
    '45 GPS Temperature-Monitored Reefer Units'
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- TABLE: site_sections
-- Admin-editable homepage section content (one JSON document per section id)
-- Reads are public; writes go through the server with the service role key.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_sections (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_sections' AND policyname = 'Allow public read site_sections') THEN
        CREATE POLICY "Allow public read site_sections" ON public.site_sections FOR SELECT USING (true);
    END IF;
END $$;

-- Gallery photos picked for the homepage gallery section
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN NOT NULL DEFAULT true;
