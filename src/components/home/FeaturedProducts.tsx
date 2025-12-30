import { Link } from "react-router-dom";
import { ProductCard } from "@/components/products/ProductCard";
import { ChevronRight } from "lucide-react";

// Mock featured products
const featuredProducts = [
  {
    id: "1",
    name: "iPhone 14 Pro Max - Excellent Condition",
    price: 89999,
    originalPrice: 129900,
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop",
    category: "Mobile Phones",
    location: "Mumbai",
    sellerName: "Tech Store Mumbai",
    whatsapp: "919876543210",
  },
  {
    id: "2",
    name: "Royal Enfield Classic 350 - 2022 Model",
    price: 185000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "Vehicles",
    location: "Delhi",
    sellerName: "Bike World",
    whatsapp: "919876543211",
  },
  {
    id: "3",
    name: "MacBook Pro M2 - Like New",
    price: 145000,
    originalPrice: 199000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    category: "Electronics",
    location: "Bangalore",
    sellerName: "Premium Electronics",
    whatsapp: "919876543212",
  },
  {
    id: "4",
    name: "Designer Lehenga - Bridal Collection",
    price: 45000,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
    category: "Fashion",
    location: "Jaipur",
    sellerName: "Ethnic Boutique",
    whatsapp: "919876543213",
  },
  {
    id: "5",
    name: "Sony PlayStation 5 with Extra Controller",
    price: 52000,
    originalPrice: 59990,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
    category: "Electronics",
    location: "Chennai",
    sellerName: "Gaming Hub",
    whatsapp: "919876543214",
  },
  {
    id: "6",
    name: "Gym Equipment Set - Complete Home Gym",
    price: 75000,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    category: "Sports",
    location: "Pune",
    sellerName: "Fitness Pro",
    whatsapp: "919876543215",
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked deals just for you
            </p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View All Products
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <Link 
          to="/products" 
          className="mt-8 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden"
        >
          View All Products
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
