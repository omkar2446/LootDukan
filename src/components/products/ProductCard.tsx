import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";

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
  profiles?: {
    full_name: string;
  };
}

interface ProductCardProps {
  product: Product;
  onChatRequest?: (productId: string, sellerId: string) => void;
}

export default function ProductCard({ product, onChatRequest }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const images = [product.image1, product.image2, product.image3].filter(Boolean) as string[];
  const discount = Math.round(((product.original_price - product.discount_price) / product.original_price) * 100);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleChatRequest = async () => {
  if (!user) {
    navigate("/auth");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("chat_requests")
      .upsert(
        {
          buyer_id: user.id,
          seller_id: product.seller_id,
          product_id: product.id, // ✅ REQUIRED
          status: "pending",
        },
        {
          onConflict: "buyer_id,seller_id,product_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Chat error:", error);
      alert("Unable to start chat");
      return;
    }

    navigate(`/chat/${data.id}`);
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Carousel */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.product_name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">₹{product.discount_price.toLocaleString()}</span>
          {discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>
          )}
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-seller/10 flex items-center justify-center">
            <User className="w-3 h-3 text-seller" />
          </div>
          <span>{product.profiles?.full_name || 'Seller'}</span>
        </div>

        {/* Action Button */}
        {profile?.role !== "seller" && (
  <Button
    size="sm"
    className="w-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white"
    onClick={handleChatRequest}
  >
    <MessageCircle className="w-4 h-4 mr-2" />
    Chat with Seller
  </Button>
)}

      </div>
    </div>
  );
}
