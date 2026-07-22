"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Tag } from "lucide-react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/home/ProductCard";

function useCountdown() {
  const [time, setTime] = useState({ h: 5, m: 24, s: 36 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 5, m: 24, s: 36 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

const coupons = [
  { code: "NEW20", discount: "ลด 20%", min: 200, desc: "สำหรับสมาชิกใหม่" },
  { code: "PREM50", discount: "ลด 50 บาท", min: 300, desc: "ซื้อขั้นต่ำ 300 บาท" },
  { code: "NETFLIX10", discount: "ลด 10%", min: 129, desc: "สำหรับ Netflix Premium" },
];

export default function PromotionsPage() {
  const { h, m, s } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">โปรโมชั่น</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">โปรโมชั่นพิเศษ</h1>
        <p className="text-gray-400 text-sm mb-8">อัปเดตโปรโมชั่นใหม่ทุกวัน คุ้มค่าทุกการสั่งซื้อ</p>

        {/* Flash sale countdown */}
        <div className="glass-card rounded-2xl border border-purple-800/30 p-6 mb-8 bg-gradient-to-r from-purple-900/30 to-pink-900/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <h2 className="text-2xl font-black text-white">Flash Sale วันนี้!</h2>
              </div>
              <p className="text-gray-400">ลดสูงสุด 40% เฉพาะวันนี้เท่านั้น</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-400 text-sm">หมดเวลาใน</div>
              {[pad(h), pad(m), pad(s)].map((val, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="bg-purple-900/50 border border-purple-700/40 rounded-xl px-4 py-3 text-center min-w-[56px]">
                    <div className="text-white font-black text-2xl leading-none">{val}</div>
                    <div className="text-purple-400 text-[10px] mt-0.5">{["ชม.", "นาที", "วิ"][i]}</div>
                  </div>
                  {i < 2 && <span className="text-purple-400 font-bold text-xl">:</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coupons */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-400" /> คูปองส่วนลด
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div key={coupon.code} className="glass-card rounded-xl border border-purple-800/30 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-700/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="text-purple-400 text-xs mb-1">{coupon.desc}</div>
                <div className="text-white font-black text-2xl mb-1">{coupon.discount}</div>
                <div className="text-gray-500 text-xs mb-3">ขั้นต่ำ {coupon.min} บาท</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-dark-100/60 border border-dashed border-purple-700/40 rounded-lg px-3 py-2 text-purple-300 font-mono text-sm font-bold text-center">
                    {coupon.code}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(coupon.code);
                      alert(`คัดลอก ${coupon.code} แล้ว!`);
                    }}
                    className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  >
                    คัดลอก
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All products on sale */}
        <div>
          <h2 className="text-xl font-black text-white mb-4">🛒 สินค้าโปรโมชั่น</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
