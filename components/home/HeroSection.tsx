"use client";

import Link from "next/link";
import { ShoppingBag, LayoutGrid, Zap, Shield, Headphones, Star } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F0A1E] via-[#180D3A] to-[#0F0A1E] pt-28 pb-14 lg:pt-36 lg:pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-700/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Hero text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 text-yellow-400 text-xs font-black mb-6 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
              <Star size={14} fill="currentColor" /> ร้านขายดีอันดับ 1 ในไทย
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
              ซื้อบัญชีพรีเมียม<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient">
                ง่ายๆ ได้ทันที 24 ชม.
              </span>
            </h1>
            
            <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              บริการอัตโนมัติ รวดเร็ว ปลอดภัย 100% พร้อมใช้งานได้ทันทีหลังชำระเงิน ราคาถูกที่สุด ครบทุกบริการความบันเทิง
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-purple-900/40 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" /> ช้อปเลยตอนนี้
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95"
              >
                <LayoutGrid className="w-5 h-5" /> ดูแพ็กเกจทั้งหมด
              </Link>
            </div>
          </motion.div>

          {/* Right: Hero Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              {/* Main Box */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="text-center">
                   <div className="text-8xl mb-4">🛍️</div>
                   <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl px-6 py-2">
                      <div className="text-emerald-400 font-black text-sm uppercase tracking-widest">PREMSHOP</div>
                      <div className="text-white text-xs font-bold">✅ SUCCESS!</div>
                   </div>
                </div>
              </div>
              
              {/* Floating Icons */}
              <FloatingIcon color="bg-[#E50914]" label="N" pos="-top-4 -left-4" delay={0} />
              <FloatingIcon color="bg-[#113CCF]" label="D+" pos="-top-4 -right-4" delay={1} />
              <FloatingIcon color="bg-[#1DB954]" label="♪" pos="-bottom-4 -left-4" delay={0.5} />
              <FloatingIcon color="bg-[#FF0000]" label="▶" pos="-bottom-4 -right-4" delay={1.5} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingIcon({ color, label, pos, delay }: any) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
      className={`absolute ${pos} w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-2xl border border-white/20 z-20`}
    >
      {label}
    </motion.div>
  );
}
