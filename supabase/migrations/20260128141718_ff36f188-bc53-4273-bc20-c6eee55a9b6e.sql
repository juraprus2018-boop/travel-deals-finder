-- Create storage bucket for destination images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('destination-images', 'destination-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view images
CREATE POLICY "Public read access for destination images"
ON storage.objects FOR SELECT
USING (bucket_id = 'destination-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload destination images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'destination-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update images
CREATE POLICY "Admins can update destination images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'destination-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete images
CREATE POLICY "Admins can delete destination images"
ON storage.objects FOR DELETE
USING (bucket_id = 'destination-images' AND has_role(auth.uid(), 'admin'::app_role));