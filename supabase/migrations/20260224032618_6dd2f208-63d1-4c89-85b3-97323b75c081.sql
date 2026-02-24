ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS google_maps_place_id text,
ADD COLUMN IF NOT EXISTS hours text,
ADD COLUMN IF NOT EXISTS rating text,
ADD COLUMN IF NOT EXISTS tag text;