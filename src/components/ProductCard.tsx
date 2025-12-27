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

  // ✅ Smart popup handler (Desktop popup / Mobile same tab)
  const openProduct = (url: string) => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile → open normally
      window.location.href = url;
    } else {
      // Desktop → popup
      const width = 900;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        url,
        "_blank",
        `width=${width},
         height=${height},
         top=${top},
         left=${left},
         resizable=no,
         scrollbars=yes,
         toolbar=no,
         menubar=no,
         location=no`
      );
    }
  };

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        <StoreBadge store={product.storeName} />
        <DiscountBadge discount={product.discountPercent} />
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>

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

        {/* ✅ Smart Popup Button */}
        <Button
          onClick={() => openProduct(product.affiliateLink)}
          className="mt-auto w-full gap-2 font-semibold transition-all duration-300 group-hover:shadow-md"
        >
          Buy Now
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
