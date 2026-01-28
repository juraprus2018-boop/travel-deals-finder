-- Create restaurants table for storing Google Places data
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  google_place_id TEXT UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  google_maps_url TEXT,
  photo_url TEXT,
  rating NUMERIC(2,1),
  user_ratings_total INTEGER,
  price_level INTEGER,
  opening_hours TEXT[],
  is_open_now BOOLEAN,
  cuisine_types TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Public can view visible restaurants of published destinations
CREATE POLICY "Anyone can view visible restaurants of published destinations"
ON public.restaurants
FOR SELECT
USING (
  is_visible = true AND
  EXISTS (
    SELECT 1 FROM destinations
    WHERE destinations.id = restaurants.destination_id
    AND destinations.is_published = true
  )
);

-- Admins can view all restaurants
CREATE POLICY "Admins can view all restaurants"
ON public.restaurants
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can create restaurants
CREATE POLICY "Admins can create restaurants"
ON public.restaurants
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update restaurants
CREATE POLICY "Admins can update restaurants"
ON public.restaurants
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete restaurants
CREATE POLICY "Admins can delete restaurants"
ON public.restaurants
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add index for faster queries
CREATE INDEX idx_restaurants_destination_id ON public.restaurants(destination_id);
CREATE INDEX idx_restaurants_sort_order ON public.restaurants(sort_order);

-- Add trigger for updated_at
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();