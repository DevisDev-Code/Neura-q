/*
  # Data Analysis Feature Database Schema

  1. New Tables
    - `data_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `file_name` (text)
      - `analysis_results` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create `data-analysis` storage bucket for file uploads

  3. Security
    - Enable RLS on `data_analyses` table
    - Add policies for authenticated users to manage their own data
    - Configure storage bucket policies
*/

-- Create data_analyses table
CREATE TABLE IF NOT EXISTS data_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  analysis_results jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE data_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own data analyses"
  ON data_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own data analyses"
  ON data_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data analyses"
  ON data_analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data analyses"
  ON data_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for data analysis files
INSERT INTO storage.buckets (id, name, public)
VALUES ('data-analysis', 'data-analysis', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'data-analysis' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'data-analysis' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'data-analysis' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_data_analyses_user_id ON data_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_data_analyses_created_at ON data_analyses(created_at DESC);