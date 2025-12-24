import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Product } from "@/types/product";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/storage";
import { getSession, logout } from "@/lib/auth";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminProductForm from "@/components/AdminProductForm";
import AdminProductList from "@/components/AdminProductList";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Package, LogOut, User } from "lucide-react";

interface AdminProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Admin = ({ isDark, onToggleTheme }: AdminProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = getSession();

  // 🔥 MUST START AS ARRAY
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 LOAD PRODUCTS FROM SUPABASE
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔐 LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/admin-login", { replace: true });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // ➕ ADD / ✏️ UPDATE PRODUCT
  const handleSubmit = async (
    productData: Omit<Product, "id" | "createdAt">
  ) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: "Product updated",
          description: "The product has been updated successfully.",
        });
        setEditingProduct(null);
      } else {
        await addProduct(productData);
        toast({
          title: "Product added",
          description: "The product has been added successfully.",
        });
      }

      await loadProducts();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  // ✏️ EDIT
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑 DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({
        title: "Product deleted",
        description: "The product has been removed.",
        variant: "destructive",
      });

      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }

      await loadProducts();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel - LootDukan</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
        />

        <main className="flex-1 py-8">
          <div className="container">
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your affiliate products
                  </p>
                </div>
              </div>

              {/* USER + LOGOUT */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {session?.name || "Admin"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* FORM */}
              <section className="rounded-xl border bg-card p-6 shadow-soft">
                <h2 className="mb-5 text-lg font-semibold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <AdminProductForm
                  editingProduct={editingProduct}
                  onSubmit={handleSubmit}
                  onCancel={handleCancelEdit}
                />
              </section>

              {/* PRODUCT LIST */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Products ({products.length})
                  </h2>
                </div>

                <div className="max-h-[600px] overflow-y-auto pr-2">
                  {loading ? (
                    <div className="text-center text-muted-foreground">
                      Loading products...
                    </div>
                  ) : (
                    <AdminProductList
                      products={products}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Admin;
