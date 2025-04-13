
-- Create a table to log Google Drive creation attempts
CREATE TABLE IF NOT EXISTS public.google_drive_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'success' or 'failure'
  drive_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies to protect the logs table
ALTER TABLE public.google_drive_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert logs (needed for the edge function)
CREATE POLICY "Allow inserts to logs" 
  ON public.google_drive_logs 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Only admins can view logs
CREATE POLICY "Only admins can select logs" 
  ON public.google_drive_logs 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
