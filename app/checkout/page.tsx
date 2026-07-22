"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, QrCode, CreditCard, Smartphone, CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { products } from "@/lib/data";

const paymentMethods = [
  { id: "qr", label: "QR Code / PromptPay", icon: QrCode, description: "สแกน QR Code ชำระผ่านแอปธนาคาร" },
  { id: "card", label: "บัตรเครดิต/เดบิต", icon: CreditCard, description: "VISA, Mastercard, JCB" },
  { id: "truemoney", label: "TrueMoney Wallet", icon: Smartphone, description: "ชำระผ่าน TrueMoney" },
  { id: "linepay", label: "LINE Pay", icon: Smartphone, description: "ชำระผ่าน LINE Pay" },
];

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [step, setStep] = useState<"form" | "payment" | "success">("form");

  if (items.length === 0 && step !== "success") {
    return (
      <div className="bg-[#0F0A1E] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🛒</div>
          <h2 className="text-xl font-bold text-white mb-3">ตะกร้าสินค้าว่างเปล่า</h2>
          <Link href="/products" className="text-purple-400 hover:text-purple-300">ดูสินค้าทั้งหมด →</Link>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="bg-[#0F0A1E] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-900/30 border-2 border-emerald-500/50 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">ชำระเงินสำเร็จ!</h2>
          <p className="text-gray-400 mb-2">ระบบกำลังส่งบัญชีพรีเมียมไปที่อีเมลของคุณ</p>
          <p className="text-purple-400 font-semibold mb-6">{email}</p>
          <div className="glass-card rounded-2xl border border-emerald-800/30 p-4 text-sm text-gray-300 mb-6">
            ⚡ โดยปกติใช้เวลาไม่เกิน 1-5 นาที หากไม่ได้รับภายใน 15 นาที กรุณาติดต่อ LINE Official ของเรา
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all">
              กลับหน้าหลัก
            </Link>
            <Link href="/products" className="px-6 py-3 border border-purple-700/50 text-purple-300 hover:bg-purple-900/20 rounded-xl font-semibold transition-all">
              ซื้อสินค้าต่อ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/cart" className="hover:text-purple-400">ตะกร้า</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">ชำระเงิน</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-6">ชำระเงิน</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Email */}
            <div className="glass-card rounded-2xl border border-purple-800/30 p-5">
              <h3 className="text-white font-bold mb-4">📧 รับบัญชีที่อีเมล</h3>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-100/50 border border-purple-900/30 focus:border-purple-500/60 text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-gray-500 transition-all"
              />
              <p className="text-gray-500 text-xs mt-2">ระบบจะส่งบัญชีพรีเมียมไปยังอีเมลนี้ทันทีหลังชำระเงิน</p>
            </div>

            {/* Payment method */}
            <div className="glass-card rounded-2xl border border-purple-800/30 p-5">
              <h3 className="text-white font-bold mb-4">💳 เลือกวิธีชำระเงิน</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                      paymentMethod === pm.id
                        ? "border-purple-500 bg-purple-900/20"
                        : "border-purple-900/30 hover:border-purple-700/40"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === pm.id ? "bg-purple-700" : "bg-dark-100/50 border border-purple-900/30"}`}>
                      <pm.icon className={`w-5 h-5 ${paymentMethod === pm.id ? "text-white" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${paymentMethod === pm.id ? "text-white" : "text-gray-300"}`}>{pm.label}</div>
                      <div className="text-gray-500 text-xs">{pm.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code display */}
            {paymentMethod === "qr" && (
              <div className="glass-card rounded-2xl border border-purple-800/30 p-5 text-center">
                <h3 className="text-white font-bold mb-4">สแกน QR Code เพื่อชำระเงิน</h3>
                <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-3">
                  <div className="text-gray-800 text-center">
                    <QrCode className="w-32 h-32 mx-auto opacity-60" />
                    <div className="text-xs text-gray-500 mt-1">QR PromptPay</div>
                  </div>
                </div>
                <div className="text-purple-400 font-black text-2xl">{formatPrice(total)} ฿</div>
                <div className="text-gray-400 text-sm mt-1">เลขที่บัญชี: 0XX-X-XXXXX-X</div>
                <div className="text-gray-500 text-xs mt-2">สแกนผ่านแอปธนาคารทุกแห่ง</div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div className="glass-card rounded-2xl border border-purple-800/30 p-5 sticky top-20">
              <h3 className="text-white font-bold mb-4">สรุปคำสั่งซื้อ</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.id);
                  return (
                    <div key={`${item.id}-${item.variant}`} className="flex items-center gap-2">
                      {product && <ProductLogo name={item.name} color={product.color} bgColor={product.bgColor} size="sm" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-medium truncate">{item.name}</div>
                        <div className="text-gray-500 text-[10px]">{item.duration} × {item.quantity}</div>
                      </div>
                      <div className="text-white text-sm font-bold">{formatPrice(item.price * item.quantity)} ฿</div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-purple-900/30 pt-3 flex justify-between mb-4">
                <span className="text-white font-bold">รวมทั้งสิ้น</span>
                <span className="text-white font-black text-xl">{formatPrice(total)} ฿</span>
              </div>
              <button
                onClick={() => {
                  if (!email) {
                    alert("กรุณากรอกอีเมลก่อนชำระเงิน");
                    return;
                  }
                  clearCart();
                  setStep("success");
                }}
                className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white py-3.5 rounded-xl font-bold transition-all hover:shadow-lg"
              >
                ยืนยันชำระเงิน {formatPrice(total)} ฿
              </button>
              <div className="mt-3 text-center text-gray-500 text-xs flex items-center justify-center gap-1">
                🔒 ปลอดภัยด้วย SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
