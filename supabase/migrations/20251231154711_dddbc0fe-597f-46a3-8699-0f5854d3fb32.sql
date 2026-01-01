-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller');

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create enum for product status
CREATE TYPE public.product_status AS ENUM ('pending', 'approved');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'buyer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  description TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2) NOT NULL,
  image1 TEXT,
  image2 TEXT,
  image3 TEXT,
  status product_status NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can view approved products" ON public.products
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Sellers can view their own products" ON public.products
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can insert their own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = seller_id);

-- Create chat requests table (orders_queue)
CREATE TABLE public.chat_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  status request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_requests
ALTER TABLE public.chat_requests ENABLE ROW LEVEL SECURITY;

-- Chat requests policies
CREATE POLICY "Buyers can view their own requests" ON public.chat_requests
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view requests to them" ON public.chat_requests
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can create requests" ON public.chat_requests
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update request status" ON public.chat_requests
  FOR UPDATE USING (auth.uid() = seller_id);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.chat_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is part of chat request
CREATE OR REPLACE FUNCTION public.is_chat_participant(request_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_requests
    WHERE id = request_uuid
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    AND status = 'accepted'
  )
$$;

-- Messages policies
CREATE POLICY "Users can view messages in their chats" ON public.messages
  FOR SELECT USING (public.is_chat_participant(request_id));

CREATE POLICY "Users can send messages in their chats" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id 
    AND public.is_chat_participant(request_id)
  );

-- Create daily message tracking table
CREATE TABLE public.daily_message_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, message_date)
);

-- Enable RLS on daily_message_counts
ALTER TABLE public.daily_message_counts ENABLE ROW LEVEL SECURITY;

-- Daily message counts policies
CREATE POLICY "Users can view their own message counts" ON public.daily_message_counts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own message counts" ON public.daily_message_counts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own message counts" ON public.daily_message_counts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_requests_updated_at
  BEFORE UPDATE ON public.chat_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_requests;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);