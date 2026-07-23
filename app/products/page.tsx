"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { categories } from "@/lib/data";
import { ProductCard } from "@/components/home/ProductCard";
import { createClient } from "@/lib/supabase/client";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").eq("is_active", true);
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "all" || p.category === selectedCat;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.review_count - a.review_count;
    });

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-2">สินค้าทั้งหมด</h1>
        <div className="flex flex-col sm:flex-row gap-3 my-6">
          <div className="flex items-center bg-dark-100/50 border border-purple-900/30 rounded-xl px-4 py-2.5 gap-2 flex-1">
            <Search className="w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              className="bg-transparent text-sm text-white outline-none flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {loading ? <div className="text-purple-400">กำลังโหลด...</div> : filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
