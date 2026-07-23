"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleQuickBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนซื้อสินค้า");
      router.push("/login");
      return;
    }

    if (!confirm(`ยืนยันการซื้อ ${product.name} ราคา ฿${product.price}?`)) return;

    setLoading(true);
    try {
      // 1. เช็คโปรไฟล์และเครดิต
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (!profile || Number(profile.balance) < Number(product.price)) {
        toast.error("เครดิตไม่เพียงพอ กรุณาเติมเงิน");
        setLoading(false);
        return;
      }

      // 2. เช็คสต็อก (Account Data)
      const { data: stock, error: stockErr } = await supabase
        .from("product_stocks")
        .select("id, account_data")
        .eq("product_id", product.id)
        .eq("is_sold", false)
        .limit(1)
        .maybeSingle();

      if (stockErr || !stock) {
        toast.error("ขออภัย สินค้าหมดชั่วคราว");
        setLoading(false);
        return;
      }

      // 3. หักเงิน
      const newBalance = Number(profile.balance) - Number(product.price);
      await supabase.from("profiles").update({ balance: newBalance }).eq("id", user.id);

      // 4. สร้างออเดอร์
      const { data: order } = await supabase.from("orders").insert({
        user_id: user.id,
        email: user.email,
        total: product.price,
        status: "delivered"
      }).select().single();

      if (order) {
        // 5. บันทึกข้อมูลรหัสสินค้าลงในรายการสั่งซื้อ
        await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          account_data: stock.account_data
        });

        // 6. อัปเดตสต็อกว่าขายแล้ว
        await supabase.from("product_stocks").update({ is_sold: true }).eq("id", stock.id);

        toast.success("ซื้อสินค้าสำเร็จ!");
        router.push("/orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการทำรายการ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card glass-card rounded-2xl p-4 border border-purple-900/20 hover:border-purple-700/40 flex flex-col h-full transition-all duration-300">
      <div className="flex items-start gap-3 mb-4">
        <ProductLogo 
          name={product.name || ""} 
          color={product.color || "#7C3AED"} 
          bgColor={product.bgColor || "rgba(124,58,237,0.1)"} 
          size="md" 
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm truncate">{product.name}</div>
          <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">{product.description}</div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-xl font-black text-white">฿{formatPrice(product.price || 0)}</span>
        </div>

        <button
          onClick={handleQuickBuy}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4 fill-current" /> ซื้อทันที</>}
        </button>
      </div>
    </div>
  );
}
