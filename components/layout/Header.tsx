"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Menu, X, User, LayoutDashboard, CreditCard, 
  ShoppingBag, LogOut, Home, Bot, LifeBuoy, 
  Package, History, Settings, ChevronRight, Clock, Plus 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState("");
  const supabase = createClient();
  const router = useRouter();

  // ระบบนาฬิกา Real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
      setCurrentTime(`${timeStr} · ${dateStr}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!error && data) {
          setProfile(data);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, [supabase]);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    fetchProfile();
    return () => window.removeEventListener("scroll", handler);
  }, [fetchProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    window.location.href = "/";
  };

  const closeMenu = () => setIsMobileOpen(false);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled ? "bg-[#0D0820]/95 backdrop-blur-lg border-b border-purple-900/30" : "bg-[#0D0820] border-b border-purple-900/10"}`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center h-16 justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-neon-purple">
                <span className="text-white font-black text-lg">P</span>
              </div>
              <div className="font-black text-lg leading-none">
                <span className="text-white">PREM</span><span className="text-purple-400">SHOP</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">หน้าแรก</Link>
              <Link href="/products" className="text-sm text-gray-300 hover:text-white transition-colors">สินค้าทั้งหมด</Link>
              <Link href="/topup" className="text-sm text-gray-300 hover:text-white transition-colors">เติมเงิน</Link>
            </nav>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileOpen(!isMobileOpen)} 
              className="p-2.5 text-purple-400 hover:text-white bg-purple-900/20 rounded-xl border border-purple-500/30 transition-all active:scale-95"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay (User Panel Style) */}
        {isMobileOpen && (
          <div className="fixed inset-0 top-16 bg-[#0D0820] z-[70] overflow-y-auto">
            <div className="max-w-md mx-auto p-4 space-y-6 pb-20">
              
              {/* 1. Profile Card */}
              {profile ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 rounded-[2rem] p-6 text-white shadow-2xl">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl">
                      👤
                    </div>
                    <div>
                      <div className="text-xs text-purple-100 opacity-80 font-bold uppercase tracking-widest">สวัสดี</div>
                      <div className="text-xl font-black truncate max-w-[180px]">{profile.display_name || profile.email || 'User'}</div>
                      <div className="mt-1 inline-flex items-center gap-1 bg-yellow-400 text-purple-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        ⭐ สมาชิก
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-purple-100/70 flex items-center gap-1 mb-1">
                        <CreditCard className="w-3 h-3" /> ยอดเงินคงเหลือ
                      </div>
                      <div className="text-2xl font-black">฿{(profile.balance || 0).toLocaleString()}</div>
                    </div>
                    <Link href="/topup" onClick={closeMenu} className="w-10 h-10 bg-white text-purple-600 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                      <Plus className="w-6 h-6" />
                    </Link>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[10px] text-purple-100/60 font-medium">
                    <Clock className="w-3 h-3" /> {currentTime}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-[2rem] p-8 text-center text-white shadow-xl">
                   <h2 className="text-xl font-black mb-4">ยินดีต้อนรับสู่ PREMSHOP</h2>
                   <Link href="/login" onClick={closeMenu} className="inline-block bg-white text-purple-600 px-8 py-3 rounded-2xl font-bold shadow-lg">
                      เข้าสู่ระบบ / สมัครสมาชิก
                   </Link>
                </div>
              )}

              {/* 2. Quick Actions */}
              <div className="grid grid-cols-4 gap-4">
                <QuickAction icon={<Home />} label="หน้าแรก" href="/" onClick={closeMenu} />
                <QuickAction icon={<Bot />} label="AI" href="#" onClick={closeMenu} />
                <QuickAction icon={<CreditCard />} label="เติมเงิน" href="/topup" onClick={closeMenu} />
                <QuickAction icon={<LifeBuoy />} label="ช่วยเหลือ" href="/contact" onClick={closeMenu} />
              </div>

              {/* 3. Menu Groups */}
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2 mb-3">เมนูหลัก</div>
                  <MenuItem href="/" icon={<Home size={18} />} label="หน้าแรก" onClick={closeMenu} />
                </div>

                <div>
                  <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2 mb-3">หมวดสินค้า</div>
                  <MenuItem href="/products" icon={<Package size={18} />} label="สินค้าทั้งหมด" onClick={closeMenu} />
                </div>

                {profile?.is_admin && (
                  <div>
                    <div className="text-[11px] font-black text-emerald-500/80 uppercase tracking-widest px-2 mb-3">เครื่องมือ</div>
                    <MenuItem href="/admin" icon={<Settings size={18} />} label="Admin Dashboard" onClick={closeMenu} isAdmin />
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2 mb-3">ประวัติของฉัน</div>
                  <MenuItem href="/orders" icon={<History size={18} />} label="ประวัติการสั่งซื้อ (ดูรหัส)" onClick={closeMenu} />
                </div>
              </div>

              {/* 4. Logout */}
              {profile && (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut className="w-5 h-5" /> ออกจากระบบ
                </button>
              )}
              
              <div className="text-center text-[10px] text-gray-600 font-medium py-4">
                PremShop Premium Store &middot; Version 7.0
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
}

// Sub-component สำหรับรายการเมนูแบบ List
function MenuItem({ href, icon, label, onClick, isAdmin = false }: { href: string, icon: React.ReactNode, label: string, onClick: () => void, isAdmin?: boolean }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl border border-white/5 transition-all active:scale-[0.98] mb-2 ${isAdmin ? 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
          {icon}
        </div>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 opacity-30" />
    </Link>
  );
}

// Sub-component สำหรับเมนูไอคอน Quick Action
function QuickAction({ icon, label, href, onClick }: { icon: React.ReactNode, label: string, href: string, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex flex-col items-center gap-2 group">
      <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center transition-all group-hover:bg-purple-600 group-hover:text-white text-gray-400">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
      </div>
      <span className="text-[10px] text-gray-400 font-bold">{label}</span>
    </Link>
  );
}
