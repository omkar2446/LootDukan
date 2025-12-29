import { DiscountPercent } from "@/types/product";
import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  discount: DiscountPercent; // now number-based
  className?: string;
}

const DiscountBadge = ({ discount, className }: DiscountBadgeProps) =>{
  // Hide badge if no discount or invalid value
  if (!discount || discount <= 0) return null;

  const getBadgeStyle = () => {
    if (discount >= 80) {
      return "bg-red-600 text-white";
    }
    if (discount >= 50) {
      return "bg-yellow-600 text-white";
    }
    if (discount >= 30) {
      return "bg-orange-600 text-white";
    }
    return "bg-gray-800 text-white";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide",
        "focus:outline-none",
        getBadgeStyle(),
        className
      )}
      aria-label={`${Math.round(discount)} percent discount`}
      title={`${Math.round(discount)}% off`}
    >
      {Math.round(discount)}% OFF
    </span>
  );
};

export default DiscountBadge;
