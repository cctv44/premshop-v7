"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { createClient } from "@/lib/supabase/client";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchFeatured = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .limit(6);
      
      if (!error && data) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  if (loading) return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 flex justify-center">
      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
    </div>
  );

  if (products.length === 0) return null;

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <h2 className="text-xl font-black text-white">สินค้าแนะนำ</h2>
        </div>
        <Link href="/products" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
          ดูทั้งหมด <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
