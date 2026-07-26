-- Create reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INTEGER NOT NULL,
    table_number TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access to create reservations (for the frontend API)
CREATE POLICY "Enable insert for anonymous users" ON public.reservations
    FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users to view all reservations
CREATE POLICY "Enable read access for authenticated users" ON public.reservations
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update reservations
CREATE POLICY "Enable update for authenticated users" ON public.reservations
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete reservations
CREATE POLICY "Enable delete for authenticated users" ON public.reservations
    FOR DELETE
    TO authenticated
    USING (true);
