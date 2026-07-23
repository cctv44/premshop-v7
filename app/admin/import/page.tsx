"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminImportPage() {
  const [apiUrl, setApiUrl] = useState("");
  const [marginType, setMarginType] = useState<"percent" | "fixed">("percent");
  const [marginValue, setMarginValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: JSON.stringify({ apiUrl, marginType, marginValue }),
      });
      if (!response.ok) throw new Error("Import failed");
      toast.success("นำเข้าสินค้าสำเร็จ!");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการนำเข้า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black text-white mb-8">นำเข้าสินค้าผ่าน API</h1>
      <div className="bg-[#1A1633] p-8 rounded-2xl border border-purple-900/30 space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">API URL ของเว็บแม่</label>
          <input
            type="text"
            className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-3 text-white"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">ประเภทกำไร</label>
            <select
              className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-3 text-white"
              value={marginType}
              onChange={(e) => setMarginType(e.target.value as any)}
            >
              <option value="percent">เปอร์เซ็นต์ (%)</option>
              <option value="fixed">จำนวนเงิน (+)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">ค่ากำไร</label>
            <input
              type="number"
              className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-3 text-white"
              value={marginValue}
              onChange={(e) => setMarginValue(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? "กำลังนำเข้า..." : "เริ่มนำเข้าสินค้า"}
        </button>
      </div>
    </div>
  );
}
