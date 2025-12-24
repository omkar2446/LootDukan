import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import StoreBadge from "./StoreBadge";
import DiscountBadge from "./DiscountBadge";
import { Pencil, Trash2 } from "lucide-react";

interface AdminProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const AdminProductList = ({ products, onEdit, onDelete }: AdminProductListProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">No products added yet. Add your first product above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary/30"
        >
          {/* Image */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-16 w-16 rounded-md object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80";
            }}
          />

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground line-clamp-1">{product.name}</h4>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-primary">{formatPrice(product.discountedPrice)}</span>
              {product.discountPercent > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <StoreBadge store={product.storeName} />
              <DiscountBadge discount={product.discountPercent} />
              <span className="text-xs text-muted-foreground">{product.category}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(product)}
              className="h-9 w-9"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(product.id)}
              className="h-9 w-9 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminProductList;
