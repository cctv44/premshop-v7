"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0A0618] border-t border-purple-900/30 mt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <span className="text-white font-black text-xl">P</span>
              </div>
              <div>
                <div className="font-black text-xl leading-none">
                  <span className="text-white">PREM</span>
                  <span className="text-purple-400">SHOP</span>
                </div>
                <div className="text-[10px] text-purple-400/80">ร้านขายบัญชีพรีเมียมอันดับ 1</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              บริการจำหน่ายบัญชีพรีเมียมออนไลน์<br />
              จัดส่งอัตโนมัติ รวดเร็ว ปลอดภัย 100%<br />
              พร้อมบริการลูกค้า 24 ชั่วโมง
            </p>
            <div className="flex items-center gap-3">
              {["FB", "LINE", "IG", "TT", "YT"].map((s) => (
                <button key={s} className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-700/30 text-xs text-purple-300 hover:bg-purple-700/40 hover:text-white transition-all flex items-center justify-center">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Main nav */}
          <div>
            <h4 className="text-white font-semibold mb-4">แหล่งหลัก</h4>
            <ul className="space-y-2">
              {["หน้าแรก", "สินค้า", "โปรโมชั่น", "รีวิว", "บทความ"].map((l) => (
                <li key={l}>
                  <Link href="/" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">หมวดหมู่สินค้า</h4>
            <ul className="space-y-2">
              {["Streaming", "Music", "Office", "AI Tools", "Productivity", "Game"].map((l) => (
                <li key={l}>
                  <Link href="/categories" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">ช่วยเหลือ</h4>
            <ul className="space-y-2">
              {["วิธีการสั่งซื้อ", "แจ้งปัญหา", "คำถามพบบ่อย", "นโยบายคืนเงิน", "ติดต่อเรา"].map((l) => (
                <li key={l}>
                  <Link href="/faq" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">ช่องทางการชำระเงิน</h4>
              <div className="flex flex-wrap gap-2">
                {["QR", "VISA", "MC", "TM", "LINE"].map((p) => (
                  <div key={p} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 border border-white/10">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact line */}
        <div className="border-t border-purple-900/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#06C755] hover:bg-[#05b04c] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
              <span>💬</span> แชทกับเรา
            </button>
            <button className="flex items-center gap-2 bg-[#06C755]/20 border border-[#06C755]/40 text-[#06C755] px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[#06C755]/30">
              LINE Official
            </button>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <span>Made with ❤️ by</span>
            <span className="text-purple-400 font-medium">PremShop Team</span>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-600 text-xs">
          © 2026 PremShop. All rights reserved. |{" "}
          <Link href="/privacy" className="hover:text-purple-400">นโยบายความเป็นส่วนตัว</Link>
          {" | "}
          <Link href="/terms" className="hover:text-purple-400">ข้อตกลงการใช้งาน</Link>
        </div>
      </div>
    </footer>
  );
}
