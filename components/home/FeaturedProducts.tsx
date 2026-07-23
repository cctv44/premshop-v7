"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { createClient } from "@/lib/supabase/client";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .limit(6);
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  if (loading) return <div className="max-w-screen-xl mx-auto px-4 py-10 text-purple-400">กำลังโหลดสินค้าแนะนำ...</div>;

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
