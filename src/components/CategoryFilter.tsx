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
    <div
  className="flex flex-wrap gap-2"
  role="group"
  aria-label="Category filter"
>
  {allCategories.map((category) => {
    const isSelected = selected === category;

    return (
      <Button
        key={category}
        variant={isSelected ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(category)}
        aria-pressed={isSelected}
        className={cn(
          "rounded-full transition-all font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",

          // Selected state (high contrast)
          isSelected &&
            "bg-blue-600 text-white shadow-md hover:bg-blue-700",

          // Unselected state (still accessible)
          !isSelected &&
            "border-gray-300 text-gray-800 hover:bg-gray-100"
        )}
      >
        {category}
      </Button>
    );
  })}
</div>

  );
};

export default CategoryFilter;
