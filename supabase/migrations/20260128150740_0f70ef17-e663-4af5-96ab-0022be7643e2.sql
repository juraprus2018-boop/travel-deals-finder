-- Create country_content table for managing country page SEO and content
CREATE TABLE public.country_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_slug TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  hero_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  intro_text TEXT,
  seo_content TEXT,
  highlights TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.country_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view country content
CREATE POLICY "Anyone can view country content"
  ON public.country_content FOR SELECT
  USING (true);

-- Admins can manage country content
CREATE POLICY "Admins can create country content"
  ON public.country_content FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update country content"
  ON public.country_content FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete country content"
  ON public.country_content FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_country_content_updated_at
  BEFORE UPDATE ON public.country_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();