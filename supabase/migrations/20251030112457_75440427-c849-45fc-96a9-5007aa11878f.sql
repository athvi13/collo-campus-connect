-- Create enum for service types
CREATE TYPE service_type AS ENUM ('hostel', 'mess', 'tutor', 'transport', 'pets', 'stationary', 'laundry', 'other');

-- Create enum for location types  
CREATE TYPE location_type AS ENUM ('classroom', 'lab', 'office', 'hostel', 'canteen', 'library', 'auditorium', 'sports', 'parking', 'department', 'other');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type service_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price TEXT,
  amenities TEXT[],
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  image_url TEXT,
  added_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Anyone can view approved services"
  ON services FOR SELECT
  USING (approved = true OR auth.uid() = added_by);

CREATE POLICY "Authenticated users can create services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = added_by);

CREATE POLICY "Users can update own services"
  ON services FOR UPDATE
  USING (auth.uid() = added_by);

CREATE POLICY "Users can delete own services"
  ON services FOR DELETE
  USING (auth.uid() = added_by);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_id, user_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Create campus_map table
CREATE TABLE campus_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  building TEXT,
  floor INTEGER,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  description TEXT,
  type location_type NOT NULL,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE campus_map ENABLE ROW LEVEL SECURITY;

-- Campus map policies
CREATE POLICY "Anyone can view campus locations"
  ON campus_map FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create locations"
  ON campus_map FOR INSERT
  WITH CHECK (auth.uid() = added_by);

CREATE POLICY "Users can update locations they added"
  ON campus_map FOR UPDATE
  USING (auth.uid() = added_by);

CREATE POLICY "Users can delete locations they added"
  ON campus_map FOR DELETE
  USING (auth.uid() = added_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campus_map_updated_at
  BEFORE UPDATE ON campus_map
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update service rating
CREATE OR REPLACE FUNCTION update_service_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE services
  SET 
    rating = (SELECT AVG(rating)::numeric(2,1) FROM reviews WHERE service_id = NEW.service_id),
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE service_id = NEW.service_id)
  WHERE id = NEW.service_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update service rating on review
CREATE TRIGGER update_service_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_service_rating();