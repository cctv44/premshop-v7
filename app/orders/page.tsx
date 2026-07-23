"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Key, Calendar, CheckCircle, Loader2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // ดึงรายการ order_items พร้อมข้อมูลวันที่จากตาราง orders
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          id,
          product_name,
          price,
          account_data,
          orders (
            created_at
          )
        `)
        .order("id", { ascending: false });
      
      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="bg-[#0F0A1E] min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="text-purple-500 w-8 h-8" />
          <h1 className="text-3xl font-black text-white">ประวัติการสั่งซื้อ</h1>
        </div>
        <p className="text-gray-400 text-sm mb-8">คุณสามารถดูรหัสสินค้าที่ซื้อไปแล้วได้ที่บรรทัดสีม่วง</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl border border-purple-900/30 overflow-hidden transition-all hover:border-purple-500/30">
                <div className="p-4 bg-purple-900/10 flex justify-between items-center border-b border-purple-900/30">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> {item.product_name}
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-xs">฿{formatPrice(item.price)}</div>
                    <div className="text-[9px] text-gray-500 flex items-center justify-end gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> 
                      {item.orders?.created_at ? new Date(item.orders.created_at).toLocaleDateString('th-TH') : '-'}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider font-bold">
                    <Key className="w-3 h-3 text-purple-400" /> ข้อมูลบัญชี / รหัสสินค้าของคุณ:
                  </div>
                  <div className="bg-[#0D0820] p-4 rounded-xl border border-purple-500/20 font-mono text-purple-300 text-sm break-all shadow-inner">
                    {item.account_data || "กำลังจัดเตรียมข้อมูล..."}
                  </div>
                  <button 
                    onClick={() => { 
                      navigator.clipboard.writeText(item.account_data || ""); 
                      toast.success('คัดลอกรหัสแล้ว'); 
                    }}
                    className="mt-3 text-[10px] text-purple-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    คลิกเพื่อคัดลอกข้อมูล
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-purple-900/50">
                <div className="text-4xl mb-4 opacity-20">🛒</div>
                <div className="text-gray-500 text-sm">คุณยังไม่มีประวัติการสั่งซื้อในขณะนี้</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// นำเข้า toast สำหรับปุ่มคัดลอก
import toast from "react-hot-toast";
