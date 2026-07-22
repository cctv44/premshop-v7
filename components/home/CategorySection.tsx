"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categories } from "@/lib/data";

export function CategorySection() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-white">หมวดหมู่ยอดนิยม</h2>
        <Link href="/categories" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
          ดูทั้งหมด <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories?cat=${cat.id}`}>
            <div className="glass-card rounded-xl p-3 border border-purple-900/20 hover:border-purple-700/40 transition-all hover:scale-[1.03] text-center group">
              <div
                className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-xl mb-2 transition-all group-hover:shadow-lg"
                style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}
              >
                {cat.icon}
              </div>
              <div className="text-white text-xs font-semibold truncate">{cat.name}</div>
              <div className="text-gray-500 text-[10px]">{cat.count} รายการ</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
