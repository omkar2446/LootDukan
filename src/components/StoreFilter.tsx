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
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            selected === store
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {store}
        </button>
      ))}
    </div>
  );
};

export default StoreFilter;
