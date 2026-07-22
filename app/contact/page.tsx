"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">ติดต่อเรา</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">ติดต่อเรา</h1>
        <p className="text-gray-400 text-sm mb-8">ทีมงานพร้อมให้ความช่วยเหลือ 24 ชั่วโมง</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            { icon: "💬", title: "LINE Official", desc: "@premshop", action: "แชทเลย", color: "#06C755" },
            { icon: "📧", title: "อีเมล", desc: "support@premshop.com", action: "ส่งอีเมล", color: "#7C3AED" },
            { icon: "📱", title: "Facebook", desc: "PremShop Thailand", action: "ส่งข้อความ", color: "#1877F2" },
            { icon: "🕐", title: "เวลาให้บริการ", desc: "24 ชั่วโมง ทุกวัน", action: null, color: "#F59E0B" },
          ].map((item) => (
            <div key={item.title} className="glass-card rounded-xl border border-purple-900/20 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${item.color}22` }}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{item.title}</div>
                <div className="text-gray-400 text-xs">{item.desc}</div>
              </div>
              {item.action && (
                <button className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors">
                  {item.action} →
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Contact form */}
        {!sent ? (
          <div className="glass-card rounded-2xl border border-purple-800/30 p-6">
            <h3 className="text-white font-bold text-lg mb-5">📩 ส่งข้อความถึงเรา</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">ชื่อ</label>
                  <input
                    type="text"
                    placeholder="ชื่อของคุณ"
                    className="w-full bg-dark-100/50 border border-purple-900/30 focus:border-purple-500/60 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-gray-600 transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">อีเมล</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-dark-100/50 border border-purple-900/30 focus:border-purple-500/60 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-gray-600 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">หัวข้อ</label>
                <select className="w-full bg-dark-100/50 border border-purple-900/30 text-gray-300 text-sm rounded-xl px-4 py-3 outline-none">
                  <option value="">เลือกหัวข้อ</option>
                  <option>ปัญหาการใช้งาน</option>
                  <option>ยังไม่ได้รับสินค้า</option>
                  <option>ขอคืนเงิน</option>
                  <option>อื่นๆ</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">ข้อความ</label>
                <textarea
                  rows={4}
                  placeholder="อธิบายปัญหาหรือสิ่งที่ต้องการช่วยเหลือ..."
                  className="w-full bg-dark-100/50 border border-purple-900/30 focus:border-purple-500/60 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-gray-600 resize-none transition-all"
                />
              </div>
              <button
                onClick={() => setSent(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-purple-900/40"
              >
                <Send className="w-4 h-4" /> ส่งข้อความ
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-emerald-800/30 p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-white font-bold text-lg mb-2">ส่งข้อความสำเร็จ!</h3>
            <p className="text-gray-400 text-sm">ทีมงานจะตอบกลับภายใน 30 นาที ขอบคุณที่ติดต่อเรา</p>
          </div>
        )}
      </div>
    </div>
  );
}
