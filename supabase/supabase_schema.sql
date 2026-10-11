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
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for category filtering & fast search
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON public.products (category_slug);
CREATE INDEX IF NOT EXISTS idx_products_storage_type ON public.products (storage_type);
CREATE INDEX IF NOT EXISTS idx_products_origin ON public.products (origin);

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

