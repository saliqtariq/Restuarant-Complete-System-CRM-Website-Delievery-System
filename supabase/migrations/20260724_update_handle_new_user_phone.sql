-- Update handle_new_user trigger to also save phone number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, dob, gender, email_marketing)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    (NEW.raw_user_meta_data->>'dob')::date,
    NEW.raw_user_meta_data->>'gender',
    (NEW.raw_user_meta_data->>'email_marketing')::boolean
  )
  ON CONFLICT (id) DO UPDATE
    SET phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
