-- Create Storage Bucket for Crop Images
-- Run this in Supabase SQL Editor

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'crop-images',
  'crop-images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create policy for uploading images (authenticated users only)
CREATE POLICY "crop_images_upload_policy" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'crop-images' 
  AND auth.role() = 'authenticated'
);

-- Create policy for viewing images (public access)
CREATE POLICY "crop_images_view_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'crop-images');

-- Create policy for deleting images (users can delete their own)
CREATE POLICY "crop_images_delete_policy" ON storage.objects
FOR DELETE USING (
  bucket_id = 'crop-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'crop-images';
