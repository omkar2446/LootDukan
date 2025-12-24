import { ExternalLink } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import StoreBadge from "./StoreBadge";
import DiscountBadge from "./DiscountBadge";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Badges Container */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        <StoreBadge store={product.storeName} />
        <DiscountBadge discount={product.discountPercent} />
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";
          }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Product Name */}
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex flex-col gap-1">
          <p className="text-xl font-bold text-primary">
            {formatPrice(product.discountedPrice)}
          </p>
          {product.discountPercent > 0 && (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Buy Button */}
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto"
        >
          <Button className="w-full gap-2 font-semibold transition-all duration-300 group-hover:shadow-md">
            Buy Now
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </article>
  );
};

export default ProductCard;
