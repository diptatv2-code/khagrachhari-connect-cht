
-- Create businesses table for the directory
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT,
  category TEXT NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('local', 'tourist')),
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  description TEXT,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Everyone can read businesses (public directory)
CREATE POLICY "Businesses are publicly readable"
ON public.businesses
FOR SELECT
USING (true);

-- Anyone can insert (community submissions)
CREATE POLICY "Anyone can submit a business"
ON public.businesses
FOR INSERT
WITH CHECK (true);
