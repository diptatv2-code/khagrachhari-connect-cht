
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC DEFAULT 0,
  price_type TEXT NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'negotiable', 'free')),
  condition TEXT NOT NULL DEFAULT 'used' CHECK (condition IN ('new', 'used', 'good')),
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  seller_name TEXT,
  image_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'hidden', 'expired')),
  report_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days')
);

-- RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Public can read active listings
CREATE POLICY "Active listings are publicly readable"
  ON public.marketplace_listings
  FOR SELECT
  USING (status = 'active');

-- Anyone can submit a listing
CREATE POLICY "Anyone can submit a listing"
  ON public.marketplace_listings
  FOR INSERT
  WITH CHECK (true);

-- Allow updates (for admin approval/reporting)
CREATE POLICY "Allow updates on listings"
  ON public.marketplace_listings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create marketplace_reports table
CREATE TABLE public.marketplace_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can report"
  ON public.marketplace_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Reports are readable"
  ON public.marketplace_reports
  FOR SELECT
  USING (true);

-- Add image_url column to businesses table for photo uploads
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS image_url TEXT;
