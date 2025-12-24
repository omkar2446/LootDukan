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
        <div
          className={`mb-6 flex items-center gap-3 ${
            onTitleClick ? "cursor-pointer group" : ""
          }`}
          onClick={onTitleClick}
        >
          {Icon && (
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getIconBgClass()}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}

          <h2 className="text-xl font-bold sm:text-2xl group-hover:underline">
            {title}
          </h2>

          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
            {products.length} items
          </span>

          {onTitleClick && (
            <span className="ml-auto text-sm text-primary group-hover:underline">
              {expanded ? "Show less ↑" : "View all →"}
            </span>
          )}
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {(expanded ? products : products.slice(0, 5)).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;