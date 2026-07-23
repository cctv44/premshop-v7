"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ sales: 0, orders: 0, topups: 0 });
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    const { data: orders } = await supabase.from("orders").select("total");
    const totalSales = orders?.reduce((sum, item) => sum + item.total, 0) || 0;
    const { count: orderCount } = await supabase.from("orders").select("*", { count: 'exact', head: true });
    const { count: topupCount } = await supabase.from("topup_requests").select("*", { count: 'exact', head: true }).eq("status", "pending");

    setStats({ sales: totalSales, orders: orderCount || 0, topups: topupCount || 0 });
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#1A1633] rounded-2xl border border-purple-900/30">
          <h3 className="text-gray-400 text-sm">ยอดขายรวม</h3>
          <p className="text-3xl font-bold text-white mt-2">฿ {stats.sales.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-[#1A1633] rounded-2xl border border-purple-900/30">
          <h3 className="text-gray-400 text-sm">ออเดอร์ทั้งหมด</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.orders}</p>
        </div>
        <div className="p-6 bg-[#1A1633] rounded-2xl border border-purple-900/30">
          <h3 className="text-gray-400 text-sm">คำขอเติมเงินที่รออนุมัติ</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.topups}</p>
        </div>
      </div>
    </div>
  );
}
