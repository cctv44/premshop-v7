import Link from "next/link";
import { ChevronRight } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: "🔍",
    title: "เลือกสินค้า",
    desc: "เลือกบัญชีพรีเมียมที่ต้องการ เช่น Netflix, Spotify, Disney+ ฯลฯ",
  },
  {
    step: 2,
    icon: "🛒",
    title: "เพิ่มลงตะกร้า",
    desc: "กดปุ่ม 'ซื้อเลย' หรือ 'เพิ่มในตะกร้า' เลือกจำนวนและแพ็กเกจที่ต้องการ",
  },
  {
    step: 3,
    icon: "📧",
    title: "กรอกอีเมล",
    desc: "กรอกอีเมลที่ถูกต้อง เพราะระบบจะส่งบัญชีพรีเมียมไปที่อีเมลนี้",
  },
  {
    step: 4,
    icon: "💳",
    title: "ชำระเงิน",
    desc: "เลือกช่องทางชำระเงิน: QR Code, บัตรเครดิต, TrueMoney หรือ LINE Pay",
  },
  {
    step: 5,
    icon: "⚡",
    title: "รับบัญชีทันที",
    desc: "ระบบอัตโนมัติจะส่งข้อมูลบัญชีพรีเมียมไปที่อีเมลของคุณภายใน 1-5 นาที",
  },
  {
    step: 6,
    icon: "✅",
    title: "ใช้งานได้เลย!",
    desc: "เข้าสู่ระบบด้วยข้อมูลที่ได้รับ และเพลิดเพลินกับบริการพรีเมียมได้ทันที",
  },
];

export default function HowToPage() {
  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">วิธีการสั่งซื้อ</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">วิธีการสั่งซื้อ</h1>
        <p className="text-gray-400 text-sm mb-8">ง่ายๆ เพียง 6 ขั้นตอน รับบัญชีพรีเมียมทันที</p>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.step} className="glass-card rounded-xl border border-purple-900/20 p-5 flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-neon-purple">
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-white font-bold">{step.title}</span>
                </div>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl border border-yellow-800/30 p-4">
            <div className="text-yellow-400 font-bold mb-2">⚠️ หมายเหตุ</div>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• กรุณากรอกอีเมลที่ถูกต้องและสามารถรับข้อความได้</li>
              <li>• ตรวจสอบกล่องจดหมาย Spam หากไม่ได้รับ</li>
              <li>• ไม่แชร์ข้อมูลบัญชีกับผู้อื่น</li>
            </ul>
          </div>
          <div className="glass-card rounded-xl border border-emerald-800/30 p-4">
            <div className="text-emerald-400 font-bold mb-2">✅ การรับประกัน</div>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• รับประกัน 100% ตลอดระยะเวลาที่ซื้อ</li>
              <li>• หากใช้งานไม่ได้ เปลี่ยนให้ใหม่ทันที</li>
              <li>• บริการลูกค้า 24 ชั่วโมง</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-900/40 transition-all"
          >
            🛒 ซื้อสินค้าเลย
          </Link>
        </div>
      </div>
    </div>
  );
}
