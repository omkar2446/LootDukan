import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Search, ShoppingBag, Store, MessageCircle, Shield, ArrowRight, Loader2 } from 'lucide-react';
import {  Heart, Link } from "lucide-react";
import {  Mail, Phone, MapPin } from 'lucide-react';
interface Product {
  id: string;
  product_name: string;
  description: string | null;
  original_price: number;
  discount_price: number;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  seller_id: string;
  profiles: {
    full_name: string;
  } | null;
}

export default function Index({ isDark = false, onToggleTheme = () => {} }: { isDark?: boolean; onToggleTheme?: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles:seller_id (full_name)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const handleChatRequest = async (productId: string, sellerId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.id === sellerId) {
      toast({
        title: 'Cannot chat with yourself',
        description: 'You cannot request a chat for your own product.',
        variant: 'destructive',
      });
      return;
    }

    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from('chat_requests')
      .select('*')
      .eq('buyer_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingRequest) {
      if (existingRequest.status === 'accepted') {
        navigate(`/chat/${existingRequest.id}`);
      } else if (existingRequest.status === 'pending') {
        toast({
          title: 'Request pending',
          description: 'Your chat request is still pending approval.',
        });
      } else {
        toast({
          title: 'Request rejected',
          description: 'Your previous request was rejected.',
          variant: 'destructive',
        });
      }
      return;
    }

    // Create new chat request
    const { error } = await supabase.from('chat_requests').insert({
      buyer_id: user.id,
      seller_id: sellerId,
      product_id: productId,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send chat request.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Request sent!',
        description: 'The seller will be notified of your request.',
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
            <Header
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
    
      
      {/* Hero Section */}
   



     

      {/* Products Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Latest Products</h2>
              <p className="text-muted-foreground mt-1">Discover new arrivals from our sellers</p>
            </div>
            {profile?.role === 'seller' && (
              <Button variant="default" onClick={() => navigate('/seller/dashboard')}>
                <Store className="w-4 h-4" />
                Seller Dashboard
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onChatRequest={handleChatRequest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try a different search term' : 'Be the first seller to list a product!'}
              </p>
              {profile?.role === 'seller' && (
                <Button variant="default" onClick={() => navigate('/seller/dashboard')}>
                  <Store className="w-4 h-4" />
                  Add Your First Product
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

     

      {/* Footer */}
      <footer className="py-8 border-t border-border">
      

      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <img src="afavicon.ico" alt="" />
              </div>
              <span className="font-display text-xl font-bold">Lootdukan</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find the best deals across Amazon, Flipkart, and more. Compare prices and save money on every purchase.
            </p>
          </div>

          {/* Quick Links */}
          

          {/* Stores */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Partner Stores</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-xl">🛒</span> Amazon
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🛍️</span> Flipkart
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">📦</span> Myntra
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                otambe016@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 9405909432
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                maharashtra, India
              </li>
            </ul>
          </div>
        </div>

      
      </div>
  



      </footer>
    </div>
  );
}
