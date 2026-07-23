"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, ExternalLink, Image as ImageIcon, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTopupsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      // ดึงข้อมูลคำขอเติมเงิน และ Join กับ Profiles
      const { data, error } = await supabase
        .from("topup_requests")
        .select(`
          *,
          profiles:user_id (
            display_name,
            email,
            balance
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch Error:", error);
        toast.error("ไม่สามารถดึงข้อมูลได้");
      } else {
        setRequests(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleAction(id: string, userId: string, amount: number, currentBalance: number, action: "approved" | "rejected") {
    if (!confirm(`ยืนยันการ ${action === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'} จำนวนเงิน ฿${amount}?`)) return;

    try {
      if (action === "approved") {
        // 1. เพิ่มเครดิตให้ลูกค้า
        const { error: updateErr } = await supabase
          .from("profiles")
          .update({ balance: Number(currentBalance || 0) + Number(amount) })
          .eq("id", userId);
        
        if (updateErr) throw updateErr;
      }

      // 2. อัปเดตสถานะคำขอ
      const { error: statusErr } = await supabase
        .from("topup_requests")
        .update({ status: action })
        .eq("id", id);

      if (statusErr) throw statusErr;

      toast.success(action === "approved" ? "อนุมัติเครดิตสำเร็จ" : "ปฏิเสธรายการแล้ว");
      fetchRequests();
    } catch (error: any) {
      toast.error("เกิดข้อผิดพลาด: " + error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">ยืนยันการโอนเงิน</h1>
        <button 
          onClick={fetchRequests}
          className="text-xs bg-purple-600/20 text-purple-400 px-4 py-2 rounded-xl border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all"
        >
          รีเฟรชข้อมูล
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-24 text-gray-600 bg-[#1A1633]/50 rounded-[2.5rem] border border-dashed border-purple-900/30">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-bold">ไม่มีรายการรออนุมัติในขณะนี้</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <div key={req.id} className="bg-[#1A1633] border border-purple-900/30 p-6 rounded-[2rem] flex flex-wrap items-center justify-between gap-6 transition-all hover:border-purple-500/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner">
                  <User size={28} />
                </div>
                <div>
                  <div className="text-white font-black text-lg">{req.profiles?.display_name || 'ไม่ระบุชื่อ'}</div>
                  <div className="text-gray-500 text-xs font-medium">{req.profiles?.email || 'ไม่มีอีเมล'}</div>
                  <div className="text-purple-400 text-[10px] font-black mt-1 uppercase tracking-widest">
                    {new Date(req.created_at).toLocaleString('th-TH')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-tighter">ยอดเงินที่แจ้ง</div>
                  <div className="text-emerald-400 font-black text-3xl">฿{req.amount.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-3">
                   {/* ปุ่มดูสลิป */}
                   <a 
                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slips/${req.slip_url}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-4 bg-white/5 text-gray-400 hover:text-white rounded-2xl border border-white/10 transition-all hover:bg-white/10"
                    title="ดูรูปสลิป"
                   >
                    <ExternalLink size={20} />
                   </a>
                   
                   {/* ปุ่มอนุมัติ */}
                   <button 
                    onClick={() => handleAction(req.id, req.user_id, req.amount, req.profiles?.balance || 0, "approved")}
                    className="p-4 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-2xl border border-emerald-500/20 transition-all shadow-lg shadow-emerald-900/20"
                   >
                    <Check size={20} strokeWidth={3} />
                   </button>

                   {/* ปุ่มปฏิเสธ */}
                   <button 
                    onClick={() => handleAction(req.id, req.user_id, req.amount, req.profiles?.balance || 0, "rejected")}
                    className="p-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl border border-red-500/20 transition-all"
                   >
                    <X size={20} strokeWidth={3} />
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
