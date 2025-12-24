import { StoreName } from "@/types/product";
import { cn } from "@/lib/utils";

interface StoreBadgeProps {
  store: StoreName;
  className?: string;
}

const StoreBadge = ({ store, className }: StoreBadgeProps) => {
  const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";
  
  const storeClasses: Record<StoreName, string> = {
    Amazon: "bg-amazon text-white",
    Flipkart: "bg-flipkart text-white",
    Myntra: "bg-myntra text-white",
  };

  return (
    <span className={cn(baseClasses, storeClasses[store], className)}>
      {store}
    </span>
  );
};

export default StoreBadge;
