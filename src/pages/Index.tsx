import { useState, useMemo, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { getProducts } from "@/lib/storage";
import { StoreName, Category, DiscountPercent, Product } from "@/types/product";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import ProductGrid from "@/components/ProductGrid";

import StoreFilter from "@/components/StoreFilter";
import CategoryFilter from "@/components/CategoryFilter";
import DiscountFilter from "@/components/DiscountFilter";
import SortSelect, { SortOption } from "@/components/SortSelect";

import {
  Flame,
  Zap,
  Headphones,
  ShirtIcon,
  Smartphone,
} from "lucide-react";

type FilterOption = StoreName | "All";
type CategoryOption = Category | "All";
type DiscountOption = DiscountPercent | "All";

interface IndexProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Index = ({ isDark, onToggleTheme }: IndexProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState<FilterOption>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryOption>("All");
  const [discountFilter, setDiscountFilter] = useState<DiscountOption>("All");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [hideFilterBar, setHideFilterBar] = useState(false);
  const lastScrollY = useRef(0);

  /* LOAD PRODUCTS */
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    loadProducts();
  }, []);

  /* SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHideFilterBar(y > lastScrollY.current && y > 200);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const availableCategories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))) as Category[],
    [products]
  );
  useEffect(() => {
  // Force light mode on first load
  document.documentElement.classList.remove("dark");
}, []);

  

  /* HOME SECTIONS */
  const hotDeals80 = products.filter(p => p.discountPercent >= 80);
  const flashDeals50 = products.filter(
    p => p.discountPercent >= 50 && p.discountPercent < 80
  );

  const headphonesProducts = products.filter(p => p.category === "Headphones");
  const dressesProducts = products.filter(p => p.category === "Dresses");
  const electronicsProducts = products.filter(p => p.category === "Electronics");
  const mobilesProducts = products.filter(p => p.category === "Mobiles");
  const watchesProducts = products.filter(p => p.category === "Watches");
  const footwearProducts = products.filter(p => p.category === "Footwear");
  const fashionProducts = products.filter(p => p.category === "Fashion");
  const homeKitchenProducts = products.filter(p => p.category === "Home & Kitchen");
  const beautyProducts = products.filter(p => p.category === "Beauty");
  const otherProducts = products.filter(p => p.category === "Other");

  /* FILTER CHECK */
  const isFiltersActive =
    searchQuery ||
    storeFilter !== "All" ||
    categoryFilter !== "All" ||
    discountFilter !== "All";

  /* FILTER + SORT */
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.storeName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (storeFilter !== "All") {
      result = result.filter(p => p.storeName === storeFilter);
    }

    if (categoryFilter !== "All") {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (discountFilter !== "All") {
      result = result.filter(p => p.discountPercent >= discountFilter);
    }

    if (sortOption === "price-low") {
      result.sort((a, b) => a.discountedPrice - b.discountedPrice);
    }

    if (sortOption === "price-high") {
      result.sort((a, b) => b.discountedPrice - a.discountedPrice);
    }

    if (sortOption === "newest") {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [
    products,
    searchQuery,
    storeFilter,
    categoryFilter,
    discountFilter,
    sortOption,
  ]);

  return (
    <>
      <Helmet>
        <title>LootDukan</title>
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
        />

        {/* FILTER BAR */}
       

        <main className="flex-1">
          <HeroBanner />
          <div
  className={`sticky top-0 z-40 bg-white transition-all ${
    hideFilterBar ? "-translate-y-full" : "translate-y-0"
  }`}
>
  <div className="mx-auto max-w-7xl px-3 py-3">
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gray-50 p-3 shadow-sm">

      {/* CATEGORY */}
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value as CategoryOption)}
        className="flex-1 min-w-[180px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none"
      >
        <option value="All">All Categories</option>
        {availableCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* STORE */}
      <select
        value={storeFilter}
        onChange={(e) => setStoreFilter(e.target.value as FilterOption)}
        className="flex-1 min-w-[160px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none"
      >
        <option value="All">All Stores</option>
        <option value="Amazon">Amazon</option>
        <option value="Flipkart">Flipkart</option>
        <option value="messho">messho</option>
      </select>

      {/* SORT */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        className="flex-1 min-w-[140px] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none"
      >
        <option value="newest">Latest</option>
        <option value="price-low">Price: Low → High</option>
        <option value="price-high">Price: High → Low</option>
      </select>

      {/* RESET BUTTON */}
      <button
        onClick={() => {
          setCategoryFilter("All");
          setStoreFilter("All");
          setSortOption("newest");
        }}
        className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
        aria-label="Reset filters"
      >
        ⟳
      </button>
    </div>
  </div>
</div>

          

          {loading ? (
            <div className="container py-20 text-center">
              Loading products...
            </div>
            
            
          ) : isFiltersActive ? (
            <section className="container py-8">
              
              
              

              <ProductGrid products={filteredAndSortedProducts} />
              
            </section>
            
            
          ) : (
            
            <>
              <ProductSection
                title="🔥 80%+ OFF Zone"
                icon={Flame}
                products={hotDeals80}
                onTitleClick={() => setDiscountFilter(80)}
              />

              <ProductSection
                title="⚡ 50%+ OFF Deals"
                icon={Zap}
                products={flashDeals50}
                onTitleClick={() => setDiscountFilter(50)}
              />

              <ProductSection
                title="🎧 Headphones"
                icon={Headphones}
                products={headphonesProducts}
                onTitleClick={() => setCategoryFilter("Headphones")}
              />

              <ProductSection
                title="👗 Dresses"
                icon={ShirtIcon}
                products={dressesProducts}
                onTitleClick={() => setCategoryFilter("Dresses")}
              />

              <ProductSection
                title="📱 Electronics"
                icon={Smartphone}
                products={electronicsProducts}
                onTitleClick={() => setCategoryFilter("Electronics")}
              />

              <ProductSection
                title="📱 Mobiles"
                products={mobilesProducts}
                onTitleClick={() => setCategoryFilter("Mobiles")}
              />

              <ProductSection
                title="⌚ Watches"
                products={watchesProducts}
                onTitleClick={() => setCategoryFilter("Watches")}
              />

              <ProductSection
                title="👟 Footwear"
                products={footwearProducts}
                onTitleClick={() => setCategoryFilter("Footwear")}
              />

              <ProductSection
                title="🧥 Fashion"
                products={fashionProducts}
                onTitleClick={() => setCategoryFilter("Fashion")}
              />

              <ProductSection
                title="🏠 Home & Kitchen"
                products={homeKitchenProducts}
                onTitleClick={() => setCategoryFilter("Home & Kitchen")}
              />

              <ProductSection
                title="💄 Beauty"
                products={beautyProducts}
                onTitleClick={() => setCategoryFilter("Beauty")}
              />

              <ProductSection
                title="📦 Other Products"
                products={otherProducts}
                onTitleClick={() => setCategoryFilter("Other")}
              />
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
