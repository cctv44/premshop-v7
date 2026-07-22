"use client";

import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { reviews } from "@/lib/data";

export function ReviewSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <h2 className="text-xl font-black text-white">รีวิวจากลูกค้าจริง</h2>
        </div>
        <Link href="/reviews" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
          ดูทั้งหมด <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="glass-card rounded-xl p-4 border border-purple-900/20 hover:border-purple-700/30 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {review.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-sm font-semibold">{review.name}</span>
                  {review.verified && (
                    <span className="text-[9px] bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 px-1.5 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-gray-500 text-[10px] ml-1">{review.timeAgo}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-300 leading-relaxed">{review.comment}</div>
            <div className="mt-2 text-[10px] text-purple-400">🛒 {review.product}</div>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "ลูกค้าทั้งหมด", value: "10,248+", icon: "👥" },
          { label: "คะแนนเฉลี่ย", value: "4.9/5 ⭐", icon: "⭐" },
          { label: "ออเดอร์สำเร็จ", value: "50,000+", icon: "✅" },
          { label: "อัตราความสำเร็จ", value: "99.9%", icon: "🎯" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 border border-purple-900/20 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-white font-black text-xl">{stat.value}</div>
            <div className="text-gray-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
