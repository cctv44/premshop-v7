"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { products } from "@/lib/data";
import { ProductCard } from "./ProductCard";

const tabs = ["ทั้งหมด", "ขายดี", "ใหม่!", "ลดราคา"];

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [visibleStart, setVisibleStart] = useState(0);

  const filteredProducts = products.filter((p) => {
    if (activeTab === "ขายดี") return p.badge === "HOT";
    if (activeTab === "ใหม่!") return p.badge === "NEW";
    if (activeTab === "ลดราคา") return p.originalPrice !== null;
    return true;
  });

  const handleNext = () => {
    setVisibleStart((prev) => Math.min(prev + 1, Math.max(0, filteredProducts.length - 6)));
  };
  const handlePrev = () => {
    setVisibleStart((prev) => Math.max(0, prev - 1));
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <h2 className="text-xl font-black text-white">สินค้าแนะนำ</h2>
          <div className="flex items-center gap-1 ml-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setVisibleStart(0); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "bg-purple-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-purple-900/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={visibleStart === 0}
            className="w-8 h-8 rounded-lg border border-purple-800/40 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={visibleStart >= filteredProducts.length - 6}
            className="w-8 h-8 rounded-lg border border-purple-800/40 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <Link href="/products" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 ml-1">
            ดูทั้งหมด <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredProducts.slice(visibleStart, visibleStart + 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
