import { DiscountPercent } from "@/types/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DiscountOption = DiscountPercent | "All";

interface DiscountFilterProps {
  selected: DiscountOption;
  onSelect: (discount: DiscountOption) => void;
}

const discountOptions: { value: DiscountOption; label: string }[] = [
  { value: "All", label: "All Discounts" },
  { value: 80, label: "80% OFF" },
  { value: 50, label: "50% OFF" },
];

const DiscountFilter = ({ selected, onSelect }: DiscountFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {discountOptions.map(({ value, label }) => (
        <Button
          key={value}
          variant={selected === value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(value)}
          className={cn(
            "rounded-full transition-all",
            selected === value && "shadow-md",
            value === 80 && selected !== value && "border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground",
            value === 50 && selected !== value && "border-amazon/50 text-amazon hover:bg-amazon hover:text-white"
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default DiscountFilter;
