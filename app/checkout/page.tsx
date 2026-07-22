"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { products } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const [step, setStep] = useState<"form" | "success">("form");
  const supabase = createClient();

  const handleCheckout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("กรุณาเข้าสู่ระบบก่อนสั่งซื้อ");
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("balance").eq("id", user.id).single();
      if ((profile?.balance || 0) < total) {
        toast.error("เครดิตไม่เพียงพอ กรุณาเติมเงิน");
        return;
      }

      await supabase.from("profiles").update({ balance: (profile?.balance || 0) - total }).eq("id", user.id);

      const { data: order, error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        email: user.email,
        order_number: `PS${Date.now()}`,
        status: "delivered",
        total: total,
      }).select().single();

      if (orderError) throw orderError;

      await supabase.from("order_items").insert(
        items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          account_data: "บัญชีของคุณคือ: user:pass123"
        }))
      );

      clearCart();
      setStep("success");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการสั่งซื้อ");
      console.error(error);
    }
  };

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
          <p className="text-gray-400 mb-6">ระบบตัดเครดิตเรียบร้อยแล้ว คุณสามารถดูรายละเอียดบัญชีได้ในประวัติการสั่งซื้อ</p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all">
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-6">ชำระเงิน</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card rounded-2xl border border-purple-800/30 p-5">
              <h3 className="text-white font-bold mb-4">สถานะ: ชำระด้วยเครดิตคงเหลือ</h3>
            </div>
          </div>
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
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white py-3.5 rounded-xl font-bold transition-all hover:shadow-lg"
              >
                ยืนยันชำระเงิน {formatPrice(total)} ฿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
