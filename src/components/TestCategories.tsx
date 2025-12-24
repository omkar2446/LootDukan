import { categoriesWithProducts } from "@/types/product";

const TestCategories = () => {
  return (
    <div className="p-6 space-y-8">
      {Object.entries(categoriesWithProducts).map(
        ([category, products]) => (
          <div key={category}>
            <h2 className="text-xl font-bold mb-3">{category}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map((product) => (
                <div
                  key={product}
                  className="rounded-md border bg-muted px-3 py-2 text-sm"
                >
                  {product}
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TestCategories;
