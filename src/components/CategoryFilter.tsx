import { Category } from "@/types/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CategoryOption = Category | "All";

interface CategoryFilterProps {
  selected: CategoryOption;
  onSelect: (category: CategoryOption) => void;
  availableCategories: Category[];
}

const CategoryFilter = ({ selected, onSelect, availableCategories }: CategoryFilterProps) => {
  const allCategories: CategoryOption[] = ["All", ...availableCategories];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category)}
          className={cn(
            "rounded-full transition-all",
            selected === category && "shadow-md"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
