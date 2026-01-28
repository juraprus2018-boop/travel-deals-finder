-- Add restaurants to the page_type enum
ALTER TYPE public.page_type ADD VALUE IF NOT EXISTS 'restaurants';