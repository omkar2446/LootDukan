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

  /* FILTER BAR SCROLL HIDE */
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

  /* SCROLL LOGIC */
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHideFilterBar(currentY > lastScrollY.current && currentY > 200);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* AVAILABLE CATEGORIES */
  const availableCategories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))) as Category[],
    [products]
  );

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

  /* FILTER ACTIVE CHECK */
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
  {/* Basic SEO */}
  <title>LootDukan – Best Deals, Discounts & Online Shopping</title>
  <meta
    name="description"
    content="LootDukan brings you the best online deals, discounts, and offers on mobiles, fashion, electronics, beauty, and more. Save big with 50%–80% OFF!"
  />
  <meta
    name="keywords"
    content="LootDukan, online shopping, best deals, discounts, mobiles, electronics, fashion, beauty products, cheap shopping, India deals"
  />
  <meta name="author" content="LootDukan" />
  <meta name="robots" content="index, follow" />

  {/* Open Graph (Facebook, WhatsApp) */}
  <meta property="og:title" content="LootDukan – Best Deals & Discounts Online" />
  <meta
    property="og:description"
    content="Shop smart with LootDukan. Discover hot deals, 80% OFF offers, and trending products from top stores."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://lootdukan.in" />
  <meta property="og:image" content="/og-image.png" />

  {/* Twitter SEO */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="LootDukan – Best Deals Online" />
  <meta
    name="twitter:description"
    content="Find trending products and massive discounts on LootDukan."
  />
  <meta name="twitter:image" content="/og-image.png" />

  {/* Mobile Optimization */}
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  {/* Canonical URL */}
  <link rel="canonical" href="https://lootdukan.in" />
</Helmet>


      <div className="flex min-h-screen flex-col">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
        />

        {/* FILTER BAR */}
        <div
          className={`sticky top-16 z-40 bg-background/90 backdrop-blur transition-transform duration-300 ${
            hideFilterBar ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="container py-4 space-y-3">
            <StoreFilter selected={storeFilter} onSelect={setStoreFilter} />
            <CategoryFilter
              selected={categoryFilter}
              availableCategories={availableCategories}
              onSelect={setCategoryFilter}
            />
            <DiscountFilter
              selected={discountFilter}
              onSelect={setDiscountFilter}
            />
            <SortSelect value={sortOption} onValueChange={setSortOption} />
          </div>
        </div>

        <main className="flex-1">
          <HeroBanner />

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
              {/* 🔥 CLICK → APPLY FILTER */}
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
