"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function TopupPage() {
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !file) return toast.error("กรุณากรอกจำนวนเงินและเลือกรูปสลิป");

    setLoading(true);
    try {
      // 1. Upload slip to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("slips")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Create topup request record
      const { error: dbError } = await supabase.from("topup_requests").insert({
        amount: parseFloat(amount),
        slip_url: uploadData.path,
      });

      if (dbError) throw dbError;

      toast.success("ส่งคำขอเติมเครดิตสำเร็จ รอแอดมินตรวจสอบ");
      setAmount("");
      setFile(null);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-[#1A1633] rounded-2xl border border-purple-900/30">
      <h1 className="text-2xl font-black text-white mb-6">เติมเครดิต</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="จำนวนเงินที่โอน"
          className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-3 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full text-white"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl"
          disabled={loading}
        >
          {loading ? "กำลังส่ง..." : "ส่งสลิป"}
        </button>
      </form>
    </div>
  );
}
