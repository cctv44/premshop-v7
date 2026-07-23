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
      // ใช้สัญลักษณ์ ! เพื่อระบุ Foreign Key ให้ชัดเจน ป้องกันการดึงข้อมูลพลาด
      const { data, error } = await supabase
        .from("topup_requests")
        .select(`
          *,
          profiles!user_id (
            display_name,
            email,
            balance
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        // ถ้า Join พลาด ให้ลองดึงแบบธรรมดามาโชว์ก่อนเพื่อไม่ให้หน้าว่าง
        const { data: simpleData } = await supabase
          .from("topup_requests")
          .select("*")
          .eq("status", "pending");
        
        if (simpleData) setRequests(simpleData);
        toast.error("ดึงข้อมูลโปรไฟล์ลูกค้าไม่ได้ แต่ดึงรายการได้");
      } else {
        setRequests(data || []);
      }
    } catch (err) {
      console.error("System Error:", err);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleAction(id: string, userId: string, amount: number, currentBalance: number, action: "approved" | "rejected") {
    if (!confirm(`ยืนยันการ ${action === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'} ฿${amount}?`)) return;

    try {
      if (action === "approved") {
        const { error: updateErr } = await supabase
          .from("profiles")
          .update({ balance: Number(currentBalance || 0) + Number(amount) })
          .eq("id", userId);
        if (updateErr) throw updateErr;
      }

      const { error: statusErr } = await supabase
        .from("topup_requests")
        .update({ status: action })
        .eq("id", id);
      if (statusErr) throw statusErr;

      toast.success("ดำเนินการสำเร็จ");
      fetchRequests();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">ยืนยันการโอนเงิน</h1>
        <button onClick={fetchRequests} className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-xl border border-purple-500/20 text-xs font-bold">
          รีเฟรช
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-500" /></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1633] rounded-[2rem] border border-dashed border-purple-900/30 text-gray-500">
          ไม่พบรายการรออนุมัติ
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <div key={req.id} className="bg-[#1A1633] border border-purple-900/30 p-5 rounded-[2rem] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-400"><User size={24} /></div>
                <div>
                  <div className="text-white font-bold">{req.profiles?.display_name || 'ลูกค้าทั่วไป'}</div>
                  <div className="text-gray-500 text-xs">{req.profiles?.email || 'ไม่ได้ระบุอีเมล'}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-emerald-400 font-black text-2xl">฿{req.amount}</div>
                  <div className="text-[9px] text-gray-600">{new Date(req.created_at).toLocaleString('th-TH')}</div>
                </div>

                <div className="flex items-center gap-2">
                   <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slips/${req.slip_url}`} target="_blank" className="p-3 bg-white/5 text-gray-400 rounded-xl border border-white/10 hover:text-white"><ExternalLink size={18} /></a>
                   <button onClick={() => handleAction(req.id, req.user_id, req.amount, req.profiles?.balance || 0, "approved")} className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><Check size={18} /></button>
                   <button onClick={() => handleAction(req.id, req.user_id, req.amount, req.profiles?.balance || 0, "rejected")} className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20"><X size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
