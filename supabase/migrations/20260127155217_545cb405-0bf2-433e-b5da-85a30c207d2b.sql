-- Create enum for category types
CREATE TYPE public.category_type AS ENUM (
  'stedentrips',
  'strandvakanties', 
  'wintersport',
  'vakantieparken',
  'pretparken'
);

-- Create enum for page content types
CREATE TYPE public.page_type AS ENUM (
  'main',
  'hotels',
  'bezienswaardigheden',
  'vliegtickets'
);

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create destinations table
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  category category_type NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  hero_image TEXT,
  short_description TEXT,
  highlights TEXT[] DEFAULT '{}',
  best_time_to_visit TEXT,
  average_temperature TEXT,
  currency TEXT,
  language TEXT,
  nearest_airport TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create generated_content table for AI-generated texts
CREATE TABLE public.generated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  page_type page_type NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  intro_text TEXT,
  main_content TEXT,
  tips TEXT[] DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(destination_id, page_type)
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a role (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for destinations
-- Anyone can read published destinations
CREATE POLICY "Anyone can view published destinations"
ON public.destinations
FOR SELECT
USING (is_published = true);

-- Admins can view all destinations
CREATE POLICY "Admins can view all destinations"
ON public.destinations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create destinations
CREATE POLICY "Admins can create destinations"
ON public.destinations
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update destinations
CREATE POLICY "Admins can update destinations"
ON public.destinations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete destinations
CREATE POLICY "Admins can delete destinations"
ON public.destinations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for generated_content
-- Anyone can read content for published destinations
CREATE POLICY "Anyone can view content of published destinations"
ON public.generated_content
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.destinations
    WHERE destinations.id = generated_content.destination_id
    AND destinations.is_published = true
  )
);

-- Admins can view all content
CREATE POLICY "Admins can view all content"
ON public.generated_content
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create content
CREATE POLICY "Admins can create content"
ON public.generated_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update content
CREATE POLICY "Admins can update content"
ON public.generated_content
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete content
CREATE POLICY "Admins can delete content"
ON public.generated_content
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
-- Users can only see their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_destinations_updated_at
BEFORE UPDATE ON public.destinations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at
BEFORE UPDATE ON public.generated_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_destinations_category ON public.destinations(category);
CREATE INDEX idx_destinations_slug ON public.destinations(slug);
CREATE INDEX idx_destinations_published ON public.destinations(is_published);
CREATE INDEX idx_generated_content_destination ON public.generated_content(destination_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);