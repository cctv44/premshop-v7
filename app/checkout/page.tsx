"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, ChevronRight, Loader2 } from "lucide-react";
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
    if (loading || items.length === 0) return;
    setLoading(true);

    try {
      // 1. ตรวจสอบการเข้าสู่ระบบ
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("กรุณาเข้าสู่ระบบก่อนสั่งซื้อ");

      // 2. ตรวจสอบเครดิตผู้ใช้
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();
      
      if (profileErr || !profile) throw new Error("ไม่พบข้อมูลผู้ใช้งาน");
      if (Number(profile.balance) < total) throw new Error("เครดิตของคุณไม่เพียงพอ กรุณาเติมเงิน");

      // 3. ตรวจสอบสต็อกสินค้าทั้งหมดก่อนเริ่มกระบวนการ
      for (const item of items) {
        const { count } = await supabase
          .from("product_stocks")
          .select("*", { count: 'exact', head: true })
          .eq("product_id", item.id)
          .eq("is_sold", false);
        
        if ((count || 0) < item.quantity) {
          throw new Error(`สินค้า ${item.name} หมดหรือสต็อกไม่พอ (เหลือ ${count || 0} ชิ้น)`);
        }
      }

      // 4. สร้างรายการ Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          email: user.email,
          order_number: `PS${Date.now()}`,
          status: "delivered",
          total: total,
        })
        .select()
        .single();

      if (orderError) throw new Error("ไม่สามารถสร้างรายการสั่งซื้อได้");

      // 5. ตัดสต็อกและสร้าง Order Items
      for (const item of items) {
        // ดึงข้อมูลรหัสบัญชีจากสต็อก
        const { data: stocks, error: stockErr } = await supabase
          .from("product_stocks")
          .select("id, account_data")
          .eq("product_id", item.id)
          .eq("is_sold", false)
          .limit(item.quantity);

        if (stockErr || !stocks || stocks.length < item.quantity) {
          throw new Error(`เกิดข้อผิดพลาดในการดึงสินค้า ${item.name}`);
        }

        const accountData = stocks.map(s => s.account_data).join("\n");

        // บันทึกลง order_items
        await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          account_data: accountData
        });

        // อัปเดตสต็อกว่าขายแล้ว
        const stockIds = stocks.map(s => s.id);
        await supabase.from("product_stocks").update({ is_sold: true }).in("id", stockIds);
      }

      // 6. หักเครดิตผู้ใช้ (Final Step)
      const { error: balanceErr } = await supabase
        .from("profiles")
        .update({ balance: Number(profile.balance) - total })
        .eq("id", user.id);

      if (balanceErr) throw new Error("เกิดข้อผิดพลาดในการตัดเครดิต");

      toast.success("สั่งซื้อสำเร็จ!");
      clearCart();
      setStep("success");
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการสั่งซื้อ");
      console.error(error);
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
          <p className="text-gray-400 mb-8">ขอบคุณที่ใช้บริการ คุณสามารถดูข้อมูลบัญชีที่สั่งซื้อได้ที่หน้า "ประวัติการสั่งซื้อ"</p>
          <Link href="/" className="block w-full bg-purple-600 py-4 rounded-2xl text-white font-bold hover:bg-purple-500 transition-all text-center">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/cart" className="hover:text-purple-400">ตะกร้าสินค้า</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">ชำระเงิน</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-8">ชำระเงิน</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl border border-purple-800/30 p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[12px]">1</span>
                วิธีการชำระเงิน
              </h3>
              <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-200">
                <div className="font-bold">ชำระด้วยเครดิตคงเหลือ</div>
                <div className="text-xs mt-1">ระบบจะหักเงินจากยอดคงเหลือในบัญชีเว็บของคุณ</div>
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-purple-800/30 p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[12px]">2</span>
                ตรวจสอบรายการสินค้า
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-purple-900/20 last:border-0">
                    <div className="text-white text-sm font-medium">{item.name} <span className="text-gray-500">x {item.quantity}</span></div>
                    <div className="text-white font-bold">฿{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="glass-card rounded-2xl border border-purple-800/30 p-6 sticky top-24">
              <h3 className="text-white font-bold mb-6">สรุปคำสั่งซื้อ</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>ยอดรวม</span>
                  <span>฿{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>ค่าธรรมเนียม</span>
                  <span className="text-emerald-400">ฟรี</span>
                </div>
                <div className="border-t border-purple-900/30 pt-3 flex justify-between items-center">
                  <span className="text-white font-bold">ยอดที่ต้องชำระ</span>
                  <span className="text-white font-black text-2xl">฿{formatPrice(total)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-6">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-yellow-200/80 leading-relaxed">
                  เมื่อกดปุ่มชำระเงิน ระบบจะหักยอดเงินทันทีและไม่สามารถคืนเงินได้ในกรณีที่สินค้าถูกส่งออกไปแล้ว
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    กำลังประมวลผล...
                  </>
                ) : (
                  `ยืนยันชำระเงิน ฿${formatPrice(total)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
