"use client";

import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { reviews } from "@/lib/data";

const moreReviews = [
  { id: 5, name: "Somying", verified: true, rating: 5, product: "YouTube Premium", comment: "ดีมากค่ะ ส่งไว ได้รับบัญชีทันที ใช้งานได้จริง แนะนำมากๆ", timeAgo: "2 วันที่แล้ว" },
  { id: 6, name: "Prakan", verified: true, rating: 5, product: "Disney+ Premium", comment: "ซื้อมาหลายครั้งแล้ว ไม่เคยผิดหวัง บริการดีเยี่ยม", timeAgo: "3 วันที่แล้ว" },
  { id: 7, name: "Manida", verified: true, rating: 4, product: "Spotify Premium", comment: "โอเคมากครับ ราคาถูกกว่าซื้อตรง ส่งเร็ว", timeAgo: "4 วันที่แล้ว" },
  { id: 8, name: "Teerawat", verified: true, rating: 5, product: "Netflix Premium", comment: "ร้านนี้ดีมากจริงๆ ประทับใจมาก จะซื้อซ้ำแน่นอน", timeAgo: "5 วันที่แล้ว" },
];

const allReviews = [...reviews, ...moreReviews];

export default function ReviewsPage() {
  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">รีวิว</span>
        </div>

        {/* Stats header */}
        <div className="glass-card rounded-2xl border border-purple-800/30 p-6 mb-8 text-center">
          <div className="text-6xl font-black text-white mb-1">4.9</div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div className="text-gray-400">จาก 10,248 รีวิว</div>
          <div className="mt-4 grid grid-cols-5 gap-2 max-w-sm mx-auto">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-1.5">
                <div className="text-yellow-400 text-xs">{stars}★</div>
                <div className="flex-1 bg-dark-100/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: stars === 5 ? "92%" : stars === 4 ? "6%" : "2%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-6">รีวิวจากลูกค้าจริง</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allReviews.map((review) => (
            <div key={review.id} className="glass-card rounded-xl p-4 border border-purple-900/20 hover:border-purple-700/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {review.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-sm font-semibold">{review.name}</span>
                    {review.verified && (
                      <span className="text-[9px] bg-emerald-900/40 border border-emerald-700/30 text-emerald-400 px-1.5 py-0.5 rounded-full">Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-gray-500 text-[10px] ml-1">{review.timeAgo}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
              <div className="mt-2 text-[10px] text-purple-400">🛒 {review.product}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
