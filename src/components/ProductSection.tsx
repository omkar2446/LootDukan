import { useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { LucideIcon } from "lucide-react";

interface ProductSectionProps {
  title: string;
  icon?: LucideIcon;
  products: Product[];
  variant?: "default" | "hot" | "flash";
  expanded?: boolean;
  onTitleClick?: () => void;
}

const ProductSection = ({
  title,
  icon: Icon,
  products,
  variant = "default",
  expanded = false,
  onTitleClick,
}: ProductSectionProps) => {
  if (products.length === 0) return null;

  // ✅ Local fallback state (only used if parent doesn't control)
  const [localExpanded, setLocalExpanded] = useState(false);

  const isExpanded = onTitleClick ? expanded : localExpanded;

  

  const getBgClass = () => {
    if (variant === "hot")
      return "bg-gradient-to-r from-destructive/5 via-background to-destructive/5";
    if (variant === "flash")
      return "bg-gradient-to-r from-amazon/5 via-background to-amazon/5";
    return "bg-background";
  };

  const getIconBgClass = () => {
    if (variant === "hot") return "bg-destructive text-destructive-foreground";
    if (variant === "flash") return "bg-amazon text-white";
    return "bg-primary text-primary-foreground";
  };

  return (
    <section className={`py-8 ${getBgClass()}`}>
      <div className="container">
        {/* HEADER */}
     <button
 
  className="mb-6 flex w-full items-center gap-3 rounded-lg text-left 
             focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
             group"
  aria-expanded={isExpanded}
>
  {/* Icon */}
  {Icon && (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-xl 
                  ${getIconBgClass()} text-white`}
      aria-hidden="true"
    >
      <Icon className="h-5 w-5" />
    </div>
  )}

  {/* Title */}
  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl group-hover:underline">
    {title}
  </h2>

  {/* Count badge */}
  <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white">
    {products.length} items
  </span>

  {/* Action text */}
  <span className="ml-auto text-sm font-medium text-blue-600 group-hover:text-blue-800">
    {isExpanded ? "Show less ↑" : "View all →"}
  </span>
</button>


        {/* PRODUCTS */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {(isExpanded ? products : products.slice(0, 5)).map(
            (product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
