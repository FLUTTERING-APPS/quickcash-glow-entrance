-- Add aadhaar_number and pan_number columns to loan_applications table
ALTER TABLE public.loan_applications 
ADD COLUMN aadhaar_number TEXT,
ADD COLUMN pan_number TEXT;