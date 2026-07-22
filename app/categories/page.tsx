"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/home/ProductCard";

export default function CategoriesPage() {
  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">หมวดหมู่</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">หมวดหมู่ทั้งหมด</h1>
        <p className="text-gray-400 text-sm mb-8">เลือกหมวดหมู่ที่ต้องการ</p>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((cat) => (
            <div key={cat.id} className="glass-card rounded-xl p-4 border border-purple-900/20 hover:border-purple-700/40 transition-all hover:scale-[1.03] text-center cursor-pointer group">
              <div
                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-3 transition-all group-hover:shadow-lg"
                style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}
              >
                {cat.icon}
              </div>
              <div className="text-white text-sm font-bold">{cat.name}</div>
              <div className="text-gray-500 text-xs mt-1">{cat.count} รายการ</div>
            </div>
          ))}
        </div>

        {/* Products by category */}
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.id);
          if (catProducts.length === 0) return null;
          return (
            <div key={cat.id} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: `${cat.color}22` }}
                >
                  {cat.icon}
                </div>
                <h2 className="text-lg font-black text-white">{cat.name}</h2>
                <span className="text-gray-500 text-sm">({catProducts.length} รายการ)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {catProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
