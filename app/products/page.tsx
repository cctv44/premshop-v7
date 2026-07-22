"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { products, categories } from "@/lib/data";
import { ProductCard } from "@/components/home/ProductCard";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

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
      return b.reviewCount - a.reviewCount;
    });

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-2">สินค้าทั้งหมด</h1>
        <p className="text-gray-400 text-sm mb-6">พบ {filtered.length} รายการ</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center bg-dark-100/50 border border-purple-900/30 rounded-xl px-4 py-2.5 gap-2 flex-1">
            <Search className="w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-100/50 border border-purple-900/30 text-gray-300 text-sm rounded-xl px-4 py-2.5 outline-none"
          >
            <option value="popular">ยอดนิยม</option>
            <option value="rating">คะแนนสูงสุด</option>
            <option value="price-asc">ราคาต่ำ-สูง</option>
            <option value="price-desc">ราคาสูง-ต่ำ</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setSelectedCat("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCat === "all"
                ? "bg-purple-700 text-white"
                : "bg-dark-100/50 border border-purple-900/30 text-gray-400 hover:text-white"
            }`}
          >
            ทั้งหมด
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedCat === cat.id
                  ? "bg-purple-700 text-white"
                  : "bg-dark-100/50 border border-purple-900/30 text-gray-400 hover:text-white"
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <div>ไม่พบสินค้าที่ค้นหา</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
