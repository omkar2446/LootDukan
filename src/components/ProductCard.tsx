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
  if (!url) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // Mobile → open in same tab
  if (isMobile) {
    window.location.href = url;
    return;
  }

  // Desktop popup
  const width = 900;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const newWindow = window.open(
    url,
    "_blank",
    `
      width=${width},
      height=${height},
      top=${top},
      left=${left},
      resizable=yes,
      scrollbars=yes,
      toolbar=no,
      menubar=no,
      location=no
    `
  );

  // Security + popup-blocker safety
  if (newWindow) {
    newWindow.opener = null;
    newWindow.focus();
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
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
  <img
    src={product.imageUrl}
    alt={product.name}
    width={400}
    height={400}
    loading="lazy"
    decoding="async"
    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src =
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";
    }}
  />

  {/* Overlay for better contrast */}
  <div
    className="absolute inset-0 bg-gradient-to-t 
               from-black/50 via-black/20 to-transparent 
               opacity-0 group-hover:opacity-100 
               transition-opacity duration-300"
    aria-hidden="true"
  />
</div>


      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>

        <div className="flex flex-col gap-1">
  <p className="flex items-center gap-1 whitespace-nowrap text-lg font-bold text-primary">
    {formatPrice(product.discountedPrice)}
  </p>

  {product.discountPercent > 0 && (
    <p className="flex items-center gap-1 whitespace-nowrap text-sm text-muted-foreground line-through">
      {formatPrice(product.originalPrice)}
    </p>
  )}
</div>


        {/* ✅ Smart Popup Button */}
       <Button
  onClick={() => openProduct(product.affiliateLink)}
  className="mt-auto w-full gap-2 font-semibold 
             bg-blue-600 text-white 
             hover:bg-blue-700 
             focus:outline-none focus:ring-2 focus:ring-blue-500
             transition-all duration-300"
  aria-label="Buy product now"
>
  Buy Now
  <ExternalLink className="h-4 w-4" />
</Button>

      </div>
    </article>
  );
};

export default ProductCard;
