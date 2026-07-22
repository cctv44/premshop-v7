"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "สั่งซื้อแล้วได้รับสินค้าเมื่อไหร่?",
    a: "ระบบอัตโนมัติจะส่งบัญชีพรีเมียมไปยังอีเมลที่ท่านระบุ ภายใน 1-5 นาทีหลังจากชำระเงินสำเร็จ หากไม่ได้รับภายใน 15 นาที กรุณาติดต่อ LINE Official ของเรา",
  },
  {
    q: "สามารถใช้บัญชีพรีเมียมได้กี่อุปกรณ์?",
    a: "ขึ้นอยู่กับแพ็กเกจที่ท่านเลือก Netflix Premium รองรับ 4 จอพร้อมกัน, Spotify Premium 1 อุปกรณ์ต่อเวลา แต่สามารถเข้าสู่ระบบได้หลายอุปกรณ์",
  },
  {
    q: "ถ้าใช้งานไม่ได้มีการรับประกันไหม?",
    a: "มีการรับประกัน 100% ตลอดระยะเวลาที่ซื้อ หากใช้งานไม่ได้ เราจะแก้ไขหรือเปลี่ยนให้ใหม่ทันที ติดต่อได้ตลอด 24 ชั่วโมง",
  },
  {
    q: "ชำระเงินผ่านช่องทางใดได้บ้าง?",
    a: "รับชำระผ่าน QR Code / PromptPay, บัตรเครดิต/เดบิต (VISA, Mastercard), TrueMoney Wallet และ LINE Pay",
  },
  {
    q: "สามารถขอคืนเงินได้ไหม?",
    a: "หากสินค้าไม่ตรงตามที่ระบุ หรือใช้งานไม่ได้และเราไม่สามารถแก้ไขได้ ท่านสามารถขอคืนเงินได้ภายใน 24 ชั่วโมง",
  },
  {
    q: "มีแพ็กเกจรายปีด้วยไหม?",
    a: "ขณะนี้มีให้เลือกตั้งแต่ 1 เดือน, 3 เดือน และ 6 เดือน กำลังเพิ่มแพ็กเกจรายปีเร็วๆ นี้",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">FAQ</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">คำถามที่พบบ่อย</h1>
        <p className="text-gray-400 text-sm mb-8">หากยังมีข้อสงสัย สามารถติดต่อเราได้ตลอด 24 ชั่วโมง</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl border border-purple-900/20 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-purple-900/10 transition-all"
              >
                <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-purple-900/20 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 glass-card rounded-2xl border border-purple-800/30 p-6 text-center">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="text-white font-bold text-lg mb-2">ยังมีคำถามอยู่?</h3>
          <p className="text-gray-400 text-sm mb-4">ทีมงานของเราพร้อมตอบคำถาม 24 ชั่วโมง</p>
          <div className="flex gap-3 justify-center">
            <button className="flex items-center gap-2 bg-[#06C755] hover:bg-[#05b04c] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">
              💬 LINE Official
            </button>
            <Link href="/contact" className="flex items-center gap-2 border border-purple-700/50 text-purple-300 hover:bg-purple-900/20 px-6 py-2.5 rounded-xl text-sm font-medium transition-all">
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
