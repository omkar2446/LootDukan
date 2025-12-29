import { StoreName } from "@/types/product";
import { cn } from "@/lib/utils";

type FilterOption = StoreName | "All";

interface StoreFilterProps {
  selected: FilterOption;
  onSelect: (store: FilterOption) => void;
}

const stores: FilterOption[] = ["All", "Amazon", "Flipkart", "Myntra"];

const StoreFilter = ({ selected, onSelect }: StoreFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {stores.map((store) => (
        <button
  key={store}
  onClick={() => onSelect(store)}
  aria-pressed={selected === store}
  className={cn(
    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",

    selected === store
      ? "bg-blue-600 text-white shadow-md"
      : "border border-gray-300 text-gray-800 hover:bg-gray-100"
  )}
>
  {store}
</button>

      ))}
    </div>
  );
};

export default StoreFilter;
