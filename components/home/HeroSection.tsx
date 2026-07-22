"use client";

import Link from "next/link";
import { ShoppingBag, LayoutGrid, Zap, Shield, Headphones } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F0A1E] via-[#180D3A] to-[#0F0A1E] min-h-[500px] lg:min-h-[540px]">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["top-20 left-[10%]", "top-10 right-[20%]", "bottom-20 left-[30%]", "top-1/2 right-[10%]"].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-2 h-2 rounded-full bg-purple-500/40 animate-float`}
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-700/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10 lg:py-14">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left: Hero text */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 text-yellow-400 text-xs font-medium mb-4">
                <span>⭐</span> ร้านขายดีอันดับ 1
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
                ซื้อบัญชีพรีเมียม
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ง่ายๆ ได้ทันที 24 ชม.
                </span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                บริการอัตโนมัติ รวดเร็ว ปลอดภัย 100%<br />
                พร้อมใช้งานได้ทันทีหลังชำระเงิน
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Link
                  href="/products"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-purple-900/40 transition-all hover:shadow-purple-700/50 hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  ช้อปเลยตอนนี้
                </Link>
                <Link
                  href="/categories"
                  className="flex items-center gap-2 bg-transparent border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-purple-900/20"
                >
                  <LayoutGrid className="w-4 h-4" />
                  ดูแพ็กเกจทั้งหมด
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: "⚡", text: "ส่งใน 1 นาที" },
                  { icon: "🔒", text: "ปลอดภัย 100%" },
                  { icon: "💎", text: "ราคาคุ้มที่สุด" },
                  { icon: "🎧", text: "บริการ 24 ชม." },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-1.5 bg-purple-900/20 border border-purple-800/30 rounded-full px-3 py-1 text-xs text-gray-300">
                    <span>{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image placeholder */}
            <div className="order-1 md:order-2 relative flex justify-center">
              <div className="relative w-64 h-64 md:w-72 md:h-72">
                {/* Anime character placeholder with floating service icons */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/20 flex items-center justify-center overflow-hidden border border-purple-700/30">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-600/40 to-pink-600/40 flex items-center justify-center border-2 border-purple-500/40">
                      <div className="text-6xl">🛍️</div>
                    </div>
                    <div className="mt-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-4 py-2">
                      <div className="text-emerald-400 font-bold text-sm">PREMSHOP</div>
                      <div className="text-white text-xs">✅ SUCCESS!</div>
                    </div>
                  </div>
                </div>
                {/* Floating icons */}
                {[
                  { label: "N", color: "#E50914", pos: "-top-4 -left-4" },
                  { label: "D+", color: "#113CCF", pos: "-top-4 -right-4" },
                  { label: "♪", color: "#1DB954", pos: "-bottom-4 -left-4" },
                  { label: "▶", color: "#FF0000", pos: "-bottom-4 -right-4" },
                ].map((icon) => (
                  <div
                    key={icon.label}
                    className={`absolute ${icon.pos} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg animate-float`}
                    style={{ background: icon.color, animationDelay: `${Math.random() * 2}s` }}
                  >
                    {icon.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Why choose us card */}
          <div className="glass-card rounded-2xl p-5 border border-purple-800/30">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">✨</span> ทำไมต้องเลือกเรา?
            </h3>
            <div className="space-y-4">
              {[
                { icon: "⚡", title: "ส่งอัตโนมัติ 24 ชม.", desc: "ระบบอัตโนมัติ รวดเร็ว ส่งทาง Gmail" },
                { icon: "🔒", title: "ปลอดภัย 100%", desc: "รับประกันความปลอดภัยของข้อมูล" },
                { icon: "💳", title: "ชำระเงินหลากหลาย", desc: "รองรับทุกช่องทางการชำระเงิน" },
                { icon: "🎁", title: "โปรโมชั่นทุกวัน", desc: "อัปเดตโปรโมชั่นใหม่ทุกวัน" },
                { icon: "⭐", title: "รีวิวจากลูกค้าจริง", desc: "ความพึงพอใจจากลูกค้ากว่า 10,000+ คน" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-700/30 flex items-center justify-center text-sm flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Rating */}
            <div className="mt-4 pt-4 border-t border-purple-900/30 flex items-center justify-between">
              <div className="flex -space-x-2">
                {["👩", "👨", "👱"].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-purple-800/60 border-2 border-dark-card flex items-center justify-center text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-lg">4.9/5</div>
                <div className="text-gray-400 text-xs">จาก 10,248 รีวิว</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
