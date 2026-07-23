"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, UserCircle, Edit, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
  }

  async function updateBalance(id: string, amount: number) {
    const newAmount = prompt("ระบุจำนวนเครดิตใหม่:", amount.toString());
    if (newAmount !== null) {
      const { error } = await supabase.from("profiles").update({ balance: Number(newAmount) }).eq("id", id);
      if (error) toast.error("เกิดข้อผิดพลาด");
      else {
        toast.success("อัปเดตยอดเงินแล้ว");
        fetchUsers();
      }
    }
  }

  const filtered = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.display_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white">จัดการผู้ใช้งาน</h1>
      
      <div className="flex bg-[#1A1633] p-4 rounded-2xl border border-purple-900/30 items-center gap-3">
        <Search className="text-gray-500" />
        <input 
          type="text" placeholder="ค้นหา Email หรือ ชื่อผู้ใช้..." 
          className="bg-transparent border-none outline-none text-white w-full"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map(user => (
          <div key={user.id} className="bg-[#1A1633] border border-purple-900/30 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400">
                <UserCircle size={28} />
              </div>
              <div>
                <div className="text-white font-bold flex items-center gap-2">
                  {user.display_name || 'No Name'} 
                  {user.is_admin && <ShieldCheck size={14} className="text-emerald-400" />}
                </div>
                <div className="text-gray-500 text-xs">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-gray-500 text-[10px] uppercase font-black">เครดิตคงเหลือ</div>
                <div className="text-white font-black text-xl">฿{user.balance?.toLocaleString()}</div>
              </div>
              <button 
                onClick={() => updateBalance(user.id, user.balance)}
                className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-all"
              >
                <Edit size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
