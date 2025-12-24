import { supabase } from "./supabase";
import { Product } from "@/types/product";

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.image_url,
    originalPrice: item.original_price,
    discountedPrice: item.discounted_price,
    discountPercent: item.discount_percent,
    category: item.category,
    storeName: item.store_name,
    affiliateLink: item.affiliate_link,
    createdAt: item.created_at,
  }));
};

export const addProduct = async (
  product: Omit<Product, "id" | "createdAt">
) => {
  const { error } = await supabase.from("products").insert({
    name: product.name,
    image_url: product.imageUrl,
    original_price: product.originalPrice,
    discounted_price: product.discountedPrice,
    discount_percent: product.discountPercent,
    category: product.category,
    store_name: product.storeName,
    affiliate_link: product.affiliateLink,
  });

  if (error) throw error;
};

export const updateProduct = async (
  id: string,
  product: Omit<Product, "id" | "createdAt">
) => {
  const { error } = await supabase
    .from("products")
    .update({
      name: product.name,
      image_url: product.imageUrl,
      original_price: product.originalPrice,
      discounted_price: product.discountedPrice,
      discount_percent: product.discountPercent,
      category: product.category,
      store_name: product.storeName,
      affiliate_link: product.affiliateLink,
    })
    .eq("id", id);

  if (error) throw error;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
