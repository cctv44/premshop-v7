"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function AdminTopupsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const { data } = await supabase
      .from("topup_requests")
      .select("*, profiles(display_name)")
      .eq("status", "pending");
    setRequests(data || []);
  }

  async function handleApprove(id: string, userId: string, amount: number) {
    // 1. Update status
    await supabase.from("topup_requests").update({ status: "approved" }).eq("id", id);
    
    // 2. Add balance
    const { data: profile } = await supabase.from("profiles").select("balance").eq("id", userId).single();
    await supabase.from("profiles").update({ balance: (profile?.balance || 0) + amount }).eq("id", userId);

    toast.success("อนุมัติเครดิตสำเร็จ");
    fetchRequests();
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">จัดการคำขอเติมเครดิต</h1>
      <div className="bg-[#1A1633] rounded-2xl border border-purple-900/30 overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-[#241F47] text-gray-400 text-sm">
            <tr>
              <th className="p-4">ผู้ใช้</th>
              <th className="p-4">จำนวนเงิน</th>
              <th className="p-4">สลิป</th>
              <th className="p-4">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t border-purple-900/30">
                <td className="p-4">{req.profiles?.display_name || "ไม่ระบุชื่อ"}</td>
                <td className="p-4">฿{req.amount}</td>
                <td className="p-4">
                  <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slips/${req.slip_url}`} target="_blank" className="text-purple-400 underline">ดูสลิป</a>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleApprove(req.id, req.user_id, req.amount)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-sm"
                  >
                    อนุมัติ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
