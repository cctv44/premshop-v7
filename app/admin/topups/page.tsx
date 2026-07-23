"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, ExternalLink, Image as ImageIcon } from "lucide-react";
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
      .select("*, profiles(display_name, email, balance)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setRequests(data || []);
  }

  async function handleAction(id: string, userId: string, amount: number, currentBalance: number, action: "approved" | "rejected") {
    if (!confirm(`ยืนยันการ ${action === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}?`)) return;

    try {
      if (action === "approved") {
        await supabase.from("profiles").update({ balance: Number(currentBalance) + amount }).eq("id", userId);
      }
      await supabase.from("topup_requests").update({ status: action }).eq("id", id);
      toast.success("ดำเนินการสำเร็จ");
      fetchRequests();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">ยืนยันการโอนเงิน</h1>
      
      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-600 bg-[#1A1633] rounded-3xl border border-dashed border-purple-900/30">
          ไม่พบรายการรออนุมัติ
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <div key={req.id} className="bg-[#1A1633] border border-purple-900/30 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <div className="text-white font-bold">{req.profiles?.display_name || 'User'}</div>
                  <div className="text-gray-500 text-xs">{req.profiles?.email}</div>
                  <div className="text-purple-400 text-[10px] font-bold mt-1">วันที่แจ้ง: {new Date(req.created_at).toLocaleString('th-TH')}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-gray-500 text-[10px] font-black uppercase">จำนวนเงิน</div>
                  <div className="text-emerald-400 font-black text-2xl">฿{req.amount}</div>
                </div>

                <div className="flex items-center gap-2">
                   <a 
                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slips/${req.slip_url}`} 
                    target="_blank" 
                    className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/10"
                   >
                    <ExternalLink size={18} />
                   </a>
                   <button 
                    onClick={() => handleAction(req.id, req.user_id, req.amount, req.profiles.balance, "approved")}
                    className="p-3 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-500/30 transition-all"
                   >
                    <Check size={18} />
                   </button>
                   <button 
                    onClick={() => handleAction(req.id, req.user_id, req.amount, req.profiles.balance, "rejected")}
                    className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/30 transition-all"
                   >
                    <X size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
