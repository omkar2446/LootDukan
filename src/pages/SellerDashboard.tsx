import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Upload, X, Loader2 } from "lucide-react";

export default function SellerDashboard() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!user) navigate("/");
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user?.id)
      .order("created_at", { ascending: false });

    setProducts(data || []);
  };

  const uploadImage = async (file: File) => {
    const fileName = `${user?.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) return null;

    return supabase.storage
      .from("product-images")
      .getPublicUrl(fileName).data.publicUrl;
  };

  const addProductToDB = async () => {
    const urls: any[] = [];

    for (const img of images) {
      const url = await uploadImage(img);
      urls.push(url);
    }

    await supabase.from("products").insert({
      seller_id: user?.id,
      product_name: productName,
      description,
      original_price: Number(originalPrice),
      discount_price: Number(discountPrice),
      image1: urls[0] || null,
      image2: urls[1] || null,
      image3: urls[2] || null,
      status: "approved",
    });

    toast({ title: "Product added successfully ✅" });
    setOpen(false);
    fetchProducts();
  };

  // ✅ RAZORPAY PAYMENT
  const handleAddProduct = async () => {
    if (!productName || !originalPrice || !discountPrice) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }

      const RAZORPAY_KEY = String(import.meta.env.VITE_RAZORPAY_KEY_ID || "");

    if (!RAZORPAY_KEY) {
      toast({ title: 'Razorpay key missing', description: 'Contact admin or set VITE_RAZORPAY_KEY_ID in .env', variant: 'destructive' });
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: 5000,
      currency: "INR",
      name: "LootDukan",
      description: "Product Listing Fee",
      handler: async () => {
        await addProductToDB();
      },
      theme: {
        color: "#0f172a",
      },
    };

    // Ensure Razorpay script is loaded and available on window
    function ensureRazorpayLoaded(): Promise<void> {
      return new Promise((resolve, reject) => {
        if ((window as any).Razorpay) return resolve();
        const script = document.querySelector('script[src*="checkout.razorpay.com"]') as HTMLScriptElement | null;
        if (script) {
          script.addEventListener('load', () => resolve());
          script.addEventListener('error', () => reject(new Error('Failed to load Razorpay script')));
        } else {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load Razorpay script'));
          document.head.appendChild(s);
        }
      });
    }

    try {
      await ensureRazorpayLoaded();
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      console.error('Razorpay load/open error', e);
      toast({ title: 'Payment init failed', description: e.message || String(e), variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <img
                src={p.image1}
                className="w-full h-40 object-cover"
              />
              <CardContent>
                <h3 className="font-semibold">{p.product_name}</h3>
                <p className="text-sm text-muted-foreground">
                  ₹{p.discount_price}
                </p>
                <Badge className="mt-2">{p.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ADD PRODUCT MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-lg font-bold mb-3">Add Product</h2>

              <Input
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />

              <Textarea
                placeholder="Description"
                className="mt-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  placeholder="Original Price"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
                <Input
                  placeholder="Discount Price"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>

              <input
                type="file"
                multiple
                onChange={(e) =>
                  setImages(Array.from(e.target.files || []))
                }
                className="mt-3"
              />

              <Button className="w-full mt-4" onClick={handleAddProduct}>
                Pay ₹50 & Add Product
              </Button>

              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
