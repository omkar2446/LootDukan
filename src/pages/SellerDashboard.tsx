import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);

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
      if (url) urls.push(url);
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

  // ✅ DELETE PRODUCT
  const deleteProduct = async (product: any) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const images = [product.image1, product.image2, product.image3]
        .filter(Boolean)
        .map((url: string) => url.split("/product-images/")[1]);

      if (images.length > 0) {
        await supabase.storage
          .from("product-images")
          .remove(images);
      }

      await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      toast({ title: "Product deleted successfully 🗑️" });
      fetchProducts();
    } catch (err) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Button>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <img
                src={p.image1}
                className="w-full h-40 object-cover"
              />

              <CardContent className="space-y-2">
                <h3 className="font-semibold">{p.product_name}</h3>
                <p className="text-sm text-muted-foreground">
                  ₹{p.discount_price}
                </p>

                <Badge>{p.status}</Badge>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => deleteProduct(p)}
                >
                  Delete Product
                </Button>
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
                className="mt-3"
                onChange={(e) =>
                  setImages(Array.from(e.target.files || []))
                }
              />

              <Button className="w-full mt-4" onClick={addProductToDB}>
                Add Product
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
