"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, User, LayoutDashboard, CreditCard, ShoppingBag, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);

    // ตรวจสอบการ Login และดึง Profile
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(prof);
      }
    };
    getUser();

    return () => window.removeEventListener("scroll", handler);
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#0D0820]/95 backdrop-blur-lg border-b border-purple-900/30" : "bg-[#0D0820] border-b border-purple-900/10"}`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center h-16 justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-neon-purple">
                <span className="text-white font-black text-lg">P</span>
              </div>
              <div className="font-black text-lg leading-none">
                <span className="text-white">PREM</span><span className="text-purple-400">SHOP</span>
              </div>
            </Link>

            {/* Desktop Center Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/products" className="text-sm text-gray-300 hover:text-white px-3 py-2">สินค้า</Link>
              <Link href="/promotions" className="text-sm text-gray-300 hover:text-white px-3 py-2">โปรโมชั่น</Link>
              <Link href="/how-to" className="text-sm text-gray-300 hover:text-white px-3 py-2">วิธีซื้อ/เติมเงิน</Link>
            </nav>

            {/* Right Side UI */}
            <div className="flex items-center gap-3">
              {profile ? (
                <div className="hidden sm:flex items-center gap-2 bg-purple-900/20 border border-purple-500/30 rounded-xl px-3 py-1.5">
                  <div className="text-right">
                    <div className="text-[10px] text-purple-400 font-bold uppercase">Balance</div>
                    <div className="text-sm font-black text-white">฿{profile.balance?.toLocaleString()}</div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                  เข้าสู่ระบบ
                </Link>
              )}

              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10">
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (เมนู 3 ขีด) */}
        {isMobileOpen && (
          <div className="lg:absolute top-16 left-0 right-0 bg-[#0D0820] border-b border-purple-900/50 p-4 space-y-2 shadow-2xl">
            {profile && (
              <div className="p-4 mb-4 bg-gradient-to-r from-purple-900/40 to-transparent rounded-2xl border border-purple-500/20">
                <div className="text-gray-400 text-xs">ยินดีต้อนรับคุณ</div>
                <div className="text-white font-bold">{profile.display_name || user?.email}</div>
                <div className="text-purple-400 font-black mt-1">เครดิต: ฿{profile.balance?.toLocaleString()}</div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-1">
              <Link href="/" onClick={()=>setIsMobileOpen(false)} className="flex items-center gap-3 text-gray-300 p-3 hover:bg-white/5 rounded-xl"><ShoppingBag className="w-5 h-5"/> หน้าหลักสินค้า</Link>
              
              {profile ? (
                <>
                  <Link href="/profile" onClick={()=>setIsMobileOpen(false)} className="flex items-center gap-3 text-gray-300 p-3 hover:bg-white/5 rounded-xl"><User className="w-5 h-5"/> โปรไฟล์ของฉัน</Link>
                  <Link href="/topup" onClick={()=>setIsMobileOpen(false)} className="flex items-center gap-3 text-gray-300 p-3 hover:bg-white/5 rounded-xl"><CreditCard className="w-5 h-5"/> เติมเงินเครดิต</Link>
                  <Link href="/orders" onClick={()=>setIsMobileOpen(false)} className="flex items-center gap-3 text-gray-300 p-3 hover:bg-white/5 rounded-xl"><ShoppingBag className="w-5 h-5"/> ประวัติการสั่งซื้อ (ดูรหัสที่นี่)</Link>
                  
                  {/* แสดงเฉพาะ Admin */}
                  {profile.is_admin && (
                    <Link href="/admin" onClick={()=>setIsMobileOpen(false)} className="flex items-center gap-3 text-emerald-400 p-3 bg-emerald-500/10 rounded-xl mt-2"><LayoutDashboard className="w-5 h-5"/> Admin Dashboard</Link>
                  )}
                  
                  <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 p-3 hover:bg-red-500/10 rounded-xl w-full text-left"><LogOut className="w-5 h-5"/> ออกจากระบบ</button>
                </>
              ) : (
                <Link href="/login" onClick={()=>setIsMobileOpen(false)} className="flex items-center gap-3 text-purple-400 p-3 bg-purple-500/10 rounded-xl font-bold"> เข้าสู่ระบบ / สมัครสมาชิก</Link>
              )}
            </div>
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
}
