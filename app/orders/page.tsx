"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Key, Calendar, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("order_items")
        .select("*, orders(created_at)")
        .order("id", { ascending: false });
      
      setOrders(data || []);
    }
    fetchOrders();
  }, [supabase]);

  return (
    <div className="bg-[#0F0A1E] min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">ประวัติการสั่งซื้อ</h1>
        <p className="text-gray-400 text-sm mb-8">ข้อมูลรหัสสินค้าทั้งหมดของคุณจะแสดงที่นี่</p>

        <div className="space-y-4">
          {orders.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl border border-purple-900/30 overflow-hidden">
              <div className="p-4 bg-purple-900/10 flex justify-between items-center border-b border-purple-900/30">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> {item.product_name}
                </div>
                <div className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(item.orders?.created_at).toLocaleDateString('th-TH')}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                  <Key className="w-3 h-3" /> ข้อมูลบัญชี/รหัสสินค้า:
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-purple-500/20 font-mono text-purple-300 text-sm break-all">
                  {item.account_data}
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(item.account_data); alert('คัดลอกรหัสแล้ว'); }}
                  className="mt-3 text-[10px] text-purple-400 hover:text-white underline"
                >
                  คัดลอกข้อมูล
                </button>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20 text-gray-600">ยังไม่มีประวัติการสั่งซื้อ</div>
          )}
        </div>
      </div>
    </div>
  );
}
