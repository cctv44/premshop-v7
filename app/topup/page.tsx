"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { CreditCard, Upload, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TopupPage() {
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || Number(amount) <= 0) return toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
    if (!file) return toast.error("กรุณาเลือกรูปภาพสลิปการโอนเงิน");

    setLoading(true);
    try {
      // 1. ตรวจสอบ User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("กรุณาเข้าสู่ระบบก่อนทำรายการ");
        return;
      }

      // 2. Upload รูปสลิป
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("slips")
        .upload(fileName, file);

      if (uploadError) throw new Error("ไม่สามารถอัปโหลดรูปภาพได้: " + uploadError.message);

      // 3. บันทึกข้อมูลลงฐานข้อมูล
      const { error: dbError } = await supabase.from("topup_requests").insert({
        user_id: user.id,
        amount: parseFloat(amount),
        slip_url: uploadData.path,
        status: "pending"
      });

      if (dbError) throw new Error("ไม่สามารถบันทึกข้อมูลได้: " + dbError.message);

      toast.success("ส่งคำขอสำเร็จ! กรุณารอแอดมินตรวจสอบ");
      setAmount("");
      setFile(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0820] pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft size={18} /> กลับหน้าหลัก
        </Link>

        <div className="glass-card rounded-[2.5rem] border border-purple-900/30 p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <CreditCard size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white leading-none">เติมเครดิต</h1>
              <p className="text-gray-500 text-xs mt-1 font-bold uppercase tracking-widest">Top up Balance</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">
                จำนวนเงินที่โอน (บาท)
              </label>
              <input
                type="number"
                placeholder="ระบุตัวเลข เช่น 100"
                className="w-full bg-[#0D0820] border border-purple-900/30 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-purple-500 transition-all placeholder:text-gray-700"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">
                แนบรูปสลิปการโอน
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="slip-upload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="slip-upload"
                  className="flex flex-col items-center justify-center w-full min-h-[140px] bg-white/5 border-2 border-dashed border-purple-900/30 rounded-3xl cursor-pointer hover:bg-white/10 hover:border-purple-500/50 transition-all p-4 text-center"
                >
                  {file ? (
                    <div className="text-purple-400 font-bold text-sm">
                      <div className="bg-purple-500/20 p-3 rounded-2xl mb-2 inline-block">📸</div>
                      <div className="truncate max-w-[200px]">{file.name}</div>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-gray-600 mb-2 group-hover:text-purple-400 transition-colors" />
                      <span className="text-gray-500 text-xs font-bold">เลือกรูปภาพสลิป</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-purple-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="animate-spin w-5 h-5" /> กำลังส่งข้อมูล...</>
              ) : (
                "ส่งสลิปแจ้งเติมเงิน"
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
            <div className="text-[10px] text-yellow-500 font-black uppercase mb-1">คำแนะนำ</div>
            <p className="text-gray-500 text-[10px] leading-relaxed">
              * กรุณาตรวจสอบยอดเงินและวันเวลาในสลิปให้ถูกต้อง<br />
              * แอดมินจะใช้เวลาตรวจสอบ 5-15 นาที ในเวลาทำการ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
