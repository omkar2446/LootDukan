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
  aria-pressed={selected === value}
  className={cn(
    "rounded-full transition-all font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",

    // Selected state
    selected === value &&
      "bg-blue-600 text-white shadow-md hover:bg-blue-700",

    // 80% OFF button
    value === 80 &&
      selected !== value &&
      "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",

    // 50% OFF button
    value === 50 &&
      selected !== value &&
      "border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white"
  )}
>
  {label}
</Button>

      ))}
    </div>
  );
};

export default DiscountFilter;
