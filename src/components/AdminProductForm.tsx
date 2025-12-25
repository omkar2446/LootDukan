import { useState, useEffect } from "react";
import { StoreName, Product, Category, DiscountPercent } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save, X } from "lucide-react";

/* ================= PROPS ================= */
interface AdminProductFormProps {
  editingProduct: Product | null;
  onSubmit: (product: Omit<Product, "id" | "createdAt">) => void;
  onCancel: () => void;
}

/* ================= CATEGORY LIST ================= */
const categories: Category[] = [
  "Headphones",
  "Dresses",
  "Electronics",
  "Fashion",
  "Mobiles",
  "Watches",
  "Footwear",
  "Home & Kitchen",
  "Beauty",
  "Other",
];

/* ================= CATEGORY → PRODUCTS ================= */
const categoriesWithProducts: Record<Category, string[]> = {
  Headphones: [
    "Wireless Earbuds",
    "Bluetooth Headphones",
    "Gaming Headset",
    "Neckband",
    "Wired Earphones",
  ],
  Dresses: [
    "Women Dress",
    "Girls Dress",
    "Kids Dress",
    "Party Wear Dress",
    "Casual Dress",
  ],
  Electronics: [
    "Laptop",
    "Gaming Laptop",
    "Tablet",
    "Smart TV",
    "Bluetooth Speaker",
    "Camera",
  ],
  Fashion: [
    "Men T-Shirt",
    "Men Shirt",
    "Women Top",
    "Women Kurti",
    "Jeans",
    "Bra",
    "Innerwear",
    "Kids Wear",
  ],
  Mobiles: [
    "Android Mobile",
    "iPhone",
    "5G Mobile",
    "Mobile Cover",
    "Mobile Charger",
  ],
  Watches: [
    "Smart Watch",
    "Analog Watch",
    "Digital Watch",
    "Men Watch",
    "Women Watch",
  ],
  Footwear: [
    "Sports Shoes",
    "Casual Shoes",
    "Formal Shoes",
    "Sandals",
    "Slippers",
  ],
  "Home & Kitchen": [
    "Mixer Grinder",
    "Pressure Cooker",
    "Cookware Set",
    "Bedsheet",
    "Home Decor",
  ],
  Beauty: [
    "Face Wash",
    "Face Cream",
    "Makeup Kit",
    "Lipstick",
    "Perfume",
  ],
  Other: ["Kids Toys", "Books", "Gym Equipment", "Car Accessories"],
};

/* ================= COMPONENT ================= */
const AdminProductForm = ({
  editingProduct,
  onSubmit,
  onCancel,
}: AdminProductFormProps) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [discountPercent, setDiscountPercent] =
    useState<DiscountPercent>(0);
  const [category, setCategory] = useState<Category>("Electronics");
  const [productType, setProductType] = useState("");
  const [storeName, setStoreName] = useState<StoreName>("Amazon");
  const [affiliateLink, setAffiliateLink] = useState("");

  /* ===== EDIT MODE ===== */
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setImageUrl(editingProduct.imageUrl);
      setOriginalPrice(editingProduct.originalPrice.toString());
      setDiscountedPrice(editingProduct.discountedPrice.toString());
      setDiscountPercent(editingProduct.discountPercent);
      setCategory(editingProduct.category);
      setStoreName(editingProduct.storeName);
      setAffiliateLink(editingProduct.affiliateLink);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  /* ===== AUTO CALCULATE DISCOUNT % ===== */
  useEffect(() => {
    if (!originalPrice || !discountedPrice) {
      setDiscountPercent(0);
      return;
    }

    const original = Number(originalPrice);
    const discounted = Number(discountedPrice);

    if (discounted <= 0 || discounted >= original) {
      setDiscountPercent(0);
      return;
    }

    const percent = Math.round(
      ((original - discounted) / original) * 100
    );

    setDiscountPercent(percent as DiscountPercent);
  }, [originalPrice, discountedPrice]);

  const resetForm = () => {
    setName("");
    setImageUrl("");
    setOriginalPrice("");
    setDiscountedPrice("");
    setDiscountPercent(0);
    setCategory("Electronics");
    setProductType("");
    setStoreName("Amazon");
    setAffiliateLink("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !imageUrl ||
      !originalPrice ||
      !discountedPrice ||
      !affiliateLink
    )
      return;

    onSubmit({
      name: productType ? `${productType} - ${name}` : name,
      imageUrl,
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      discountPercent,
      category,
      storeName,
      affiliateLink,
    });

    if (!editingProduct) resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label>Product Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Product Type</Label>
          <Select value={productType} onValueChange={setProductType}>
            <SelectTrigger>
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              {categoriesWithProducts[category].map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Image URL *</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>

        <Input
          placeholder="Original Price"
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
        />

        <Input
          placeholder="Discounted Price"
          type="number"
          value={discountedPrice}
          onChange={(e) => setDiscountedPrice(e.target.value)}
        />

        {/* Discount % Display */}
        <div className="flex items-center text-sm font-semibold">
          Discount: {discountPercent}% OFF
        </div>

        <Select value={storeName} onValueChange={(v) => setStoreName(v as StoreName)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Amazon">Amazon</SelectItem>
            <SelectItem value="Flipkart">Flipkart</SelectItem>
            <SelectItem value="Myntra">Myntra</SelectItem>
          </SelectContent>
        </Select>

        <div className="sm:col-span-2">
          <Input
            placeholder="Affiliate Link"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1 gap-2">
          {editingProduct ? <Save size={16} /> : <Plus size={16} />}
          {editingProduct ? "Update Product" : "Add Product"}
        </Button>
        {editingProduct && (
          <Button variant="outline" onClick={onCancel}>
            <X size={16} /> Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AdminProductForm;
