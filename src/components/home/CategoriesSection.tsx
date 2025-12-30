import { Link } from "react-router-dom";
import { 
  Laptop, 
  Shirt, 
  Home, 
  Car, 
  Smartphone, 
  Dumbbell,
  Palette,
  BookOpen,
  ChevronRight
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Laptop, color: "bg-blue-500/10 text-blue-600", count: 1250 },
  { name: "Fashion", icon: Shirt, color: "bg-pink-500/10 text-pink-600", count: 890 },
  { name: "Home & Garden", icon: Home, color: "bg-green-500/10 text-green-600", count: 456 },
  { name: "Vehicles", icon: Car, color: "bg-orange-500/10 text-orange-600", count: 234 },
  { name: "Mobile Phones", icon: Smartphone, color: "bg-purple-500/10 text-purple-600", count: 678 },
  { name: "Sports", icon: Dumbbell, color: "bg-red-500/10 text-red-600", count: 345 },
  { name: "Art & Crafts", icon: Palette, color: "bg-yellow-500/10 text-yellow-600", count: 189 },
  { name: "Books", icon: BookOpen, color: "bg-teal-500/10 text-teal-600", count: 567 },
];

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Browse by Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
          <Link to="/categories" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-medium"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.color} transition-transform duration-300 group-hover:scale-110`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-foreground">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {category.count.toLocaleString()} listings
              </p>
              <div className="absolute -bottom-1 -right-1 h-16 w-16 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <Link 
          to="/categories" 
          className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden"
        >
          View All Categories
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
