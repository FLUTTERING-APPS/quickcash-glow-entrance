-- Create loan applications table
CREATE TABLE public.loan_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  loan_amount INTEGER NOT NULL,
  employment_type TEXT NOT NULL,
  monthly_income TEXT NOT NULL,
  age_group TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own loan applications" 
ON public.loan_applications 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own loan applications" 
ON public.loan_applications 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own loan applications" 
ON public.loan_applications 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Create KYC table
CREATE TABLE public.kyc_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for KYC
ALTER TABLE public.kyc_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for KYC
CREATE POLICY "Users can view their own KYC status" 
ON public.kyc_status 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own KYC status" 
ON public.kyc_status 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own KYC status" 
ON public.kyc_status 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_loan_applications_updated_at 
    BEFORE UPDATE ON public.loan_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_status_updated_at 
    BEFORE UPDATE ON public.kyc_status 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();