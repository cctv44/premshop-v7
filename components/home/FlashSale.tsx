"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { flashSaleProducts } from "@/lib/data";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

function useCountdown(targetHours = 5, targetMinutes = 24, targetSeconds = 36) {
  const [time, setTime] = useState({ h: targetHours, m: targetMinutes, s: targetSeconds });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 5, m: 24, s: 36 }; // reset
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

export function FlashSale() {
  const { h, m, s } = useCountdown();
  const addItem = useCartStore((s) => s.addItem);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="glass-card rounded-2xl border border-purple-800/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center">
              <span className="text-lg">🏷️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-lg">🔥 โปรโมชั่นพิเศษวันนี้!</span>
              </div>
              <div className="text-xs text-gray-400">ลดสูงสุด 20% สำหรับแพ็กเกจยอดนิยม</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400 mr-1">หมดเวลาใน</div>
            {[pad(h), pad(m), pad(s)].map((val, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="countdown-box">
                  <div className="text-white font-black text-lg leading-none">{val}</div>
                  <div className="text-purple-400 text-[9px]">{["ชั่วโมง", "นาที", "วินาที"][i]}</div>
                </div>
                {i < 2 && <span className="text-purple-400 font-bold text-lg">:</span>}
              </div>
            ))}
            <Link href="/promotions" className="ml-2 text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
              ดูทั้งหมด <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Products */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {flashSaleProducts.map((product) => (
            <div key={product.id} className="bg-dark-100/50 rounded-xl p-3 border border-purple-900/20 hover:border-purple-700/30 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <ProductLogo name={product.name} color={product.color} bgColor={product.bgColor} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-bold truncate">{product.name}</div>
                  <div className="text-gray-400 text-[10px]">{product.description.split("\n")[0]}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-white font-black text-lg">{formatPrice(product.price)} ฿</div>
                  {product.originalPrice && (
                    <div className="text-gray-500 text-xs line-through">
                      {formatPrice(product.originalPrice)} ฿
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  -{product.discountPercent}%
                </div>
              </div>
              <button
                onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    variant: product.name,
                    duration: "1 เดือน",
                    price: product.price,
                    quantity: 1,
                    image: product.image,
                    color: product.color,
                  });
                  toast.success(`เพิ่ม ${product.name} แล้ว!`, {
                    style: { background: "#1A1033", color: "#fff", border: "1px solid rgba(124,58,237,0.4)" },
                    icon: "🛒",
                  });
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white py-2 rounded-lg text-xs font-semibold transition-all active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                ซื้อเลย
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
