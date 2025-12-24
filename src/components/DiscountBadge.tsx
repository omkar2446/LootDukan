import { DiscountPercent } from "@/types/product";
import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  discount: DiscountPercent; // now number-based
  className?: string;
}

const DiscountBadge = ({ discount, className }: DiscountBadgeProps) => {
  // Hide badge if no discount or invalid value
  if (!discount || discount <= 0) return null;

  const getBadgeStyle = () => {
    if (discount >= 80) {
      return "bg-destructive text-destructive-foreground";
    }
    if (discount >= 50) {
      return "bg-amazon text-white";
    }
    if (discount >= 30) {
      return "bg-orange-500 text-white";
    }
    return "bg-accent text-accent-foreground";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide",
        getBadgeStyle(),
        className
      )}
    >
      {Math.round(discount)}% OFF
    </span>
  );
};

export default DiscountBadge;
