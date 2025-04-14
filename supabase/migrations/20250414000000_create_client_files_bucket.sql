
-- Create storage bucket for client files
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-files', 'Client Files', false);

-- Set up access policies for the bucket
CREATE POLICY "Authenticated users can upload client files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'client-files');

CREATE POLICY "Users can view their own client files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'client-files' AND
  (auth.uid() IN (
    SELECT uploaded_by FROM public.files WHERE file_path = storage.objects.name
  ) OR
  auth.uid() IN (
    SELECT user_id FROM public.team_members WHERE client_id IN (
      SELECT client_id FROM public.files WHERE file_path = storage.objects.name
    )
  ))
);

CREATE POLICY "Admin users can access all client files"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'client-files' AND
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
