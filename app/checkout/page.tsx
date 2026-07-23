"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleCheckout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("กรุณาเข้าสู่ระบบ");

      // 1. เช็คเครดิต
      const { data: profile } = await supabase.from("profiles").select("balance").eq("id", user.id).single();
      if ((profile?.balance || 0) < total) throw new Error("เครดิตไม่เพียงพอ");

      // 2. เริ่มกระบวนการจ่ายเงิน (ตัดเงิน)
      const newBalance = (profile?.balance || 0) - total;
      await supabase.from("profiles").update({ balance: newBalance }).eq("id", user.id);

      // 3. สร้าง Order
      const { data: order, error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        email: user.email,
        order_number: `PS${Date.now()}`,
        status: "delivered",
        total: total,
      }).select().single();

      if (orderError) throw orderError;

      // 4. วนลูปดึง Account จากสต็อกตามจำนวนที่สั่ง
      for (const item of items) {
        // ค้นหา Account ที่ยังไม่ถูกขาย
        const { data: stocks } = await supabase
          .from("product_stocks")
          .select("*")
          .eq("product_id", item.id)
          .eq("is_sold", false)
          .limit(item.quantity);

        const accountData = stocks?.map(s => s.account_data).join("\n") || "สินค้าหมดชั่วคราว ทีมงานจะเติมให้เร็วๆ นี้";

        // บันทึก Order Item
        await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          account_data: accountData
        });

        // อัปเดตสต็อกว่าขายแล้ว
        if (stocks && stocks.length > 0) {
          const stockIds = stocks.map(s => s.id);
          await supabase.from("product_stocks").update({ is_sold: true }).in("id", stockIds);
        }
      }

      clearCart();
      setStep("success");
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="bg-[#0F0A1E] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full glass-card p-10 rounded-3xl border border-purple-500/30">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/50">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">ชำระเงินสำเร็จ!</h2>
          <p className="text-gray-400 mb-8">ขอบคุณที่ใช้บริการ คุณสามารถดูรหัสสินค้าได้ใน "ประวัติการสั่งซื้อ" ในหน้าโปรไฟล์ของคุณ</p>
          <Link href="/" className="block w-full bg-purple-600 py-4 rounded-2xl text-white font-bold hover:bg-purple-500 transition-all">กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0A1E] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black text-white mb-8">ยืนยันการสั่งซื้อ</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-purple-900/30">
              <h3 className="text-white font-bold mb-4">รายการสินค้า</h3>
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{item.name} x {item.quantity}</span>
                  <span className="text-white font-bold">฿{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-purple-900/30 mt-4 pt-4 flex justify-between">
                <span className="text-white font-bold">ยอดรวมทั้งสิ้น</span>
                <span className="text-purple-400 font-black text-xl">฿{formatPrice(total)}</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-purple-900/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-yellow-400 mb-4 bg-yellow-400/10 p-3 rounded-xl border border-yellow-400/20">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs">กรุณาตรวจสอบรายการสินค้าก่อนยืนยัน</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">ระบบจะหักเครดิตจากยอดคงเหลือของคุณทันที และแสดงรหัสสินค้าให้คุณทราบหลังชำระเงิน</p>
            </div>
            <button 
              disabled={loading || items.length === 0}
              onClick={handleCheckout}
              className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl text-white font-black transition-all disabled:opacity-50"
            >
              {loading ? "กำลังประมวลผล..." : "ยืนยันและชำระเงิน"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
