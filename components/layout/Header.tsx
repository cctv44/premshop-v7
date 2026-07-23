"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, User, LayoutDashboard, CreditCard, 
  ShoppingBag, LogOut, Home, Bot, LifeBuoy, 
  Package, History, Settings, ChevronRight, Clock, Plus, Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

// --- Types ---
interface Profile {
  id: string;
  display_name: string;
  email: string;
  balance: number;
  is_admin: boolean;
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const pathname = usePathname();

  // 1. Real-time Clock logic
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('th-TH', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
      }) + ' · ' + now.toLocaleDateString('th-TH', { 
        day: 'numeric', month: 'short', year: 'numeric' 
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Profile Fetching
  const fetchProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    } catch (error) {
      console.error("Auth Error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchProfile]);

  // Close menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled 
          ? "bg-[#0D0820]/80 backdrop-blur-xl border-b border-purple-500/20 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
          : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3 transition-transform active:scale-95">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600 blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center border border-white/20 shadow-2xl">
                <span className="text-white font-black text-xl tracking-tighter">P</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tight leading-none">PREM<span className="text-purple-400">SHOP</span></span>
              <span className="text-[10px] text-purple-400/60 font-bold uppercase tracking-widest mt-0.5">Premium Store</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-2xl px-2 py-1 backdrop-blur-md">
            <NavLink href="/" label="หน้าแรก" />
            <NavLink href="/products" label="สินค้าทั้งหมด" />
            <NavLink href="/topup" label="เติมเงิน" />
          </nav>

          {/* Mobile Toggle Button */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-3 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/20 transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </header>

      {/* Professional Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[380px] bg-[#0D0820] z-[120] border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                
                {/* 1. Profile Header Section */}
                <section>
                  {loading ? (
                    <div className="h-48 rounded-[2rem] bg-white/5 animate-pulse" />
                  ) : profile ? (
                    <div className="relative group overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(124,58,237,0.3)]">
                      <div className="relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-2xl ring-4 ring-white/10">
                            👤
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">ยินดีต้อนรับ</span>
                            <h2 className="text-xl font-black text-white truncate">{profile.display_name || 'Premium User'}</h2>
                            <div className="mt-1 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                              <Sparkles size={10} className="text-yellow-300 fill-yellow-300" />
                              <span className="text-[10px] font-black text-white uppercase">Member Gold</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-4">
                          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between group/balance">
                            <div>
                              <p className="text-[10px] text-white/50 font-bold uppercase mb-1 flex items-center gap-1">
                                <CreditCard size={12} /> ยอดเงินคงเหลือ
                              </p>
                              <p className="text-3xl font-black text-white tracking-tight">฿{formatPrice(profile.balance || 0)}</p>
                            </div>
                            <Link href="/topup" className="w-12 h-12 bg-white text-purple-600 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                              <Plus size={28} strokeWidth={3} />
                            </Link>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between text-[10px] text-white/40 font-bold px-2">
                           <span className="flex items-center gap-1"><Clock size={12}/> {currentTime}</span>
                           <span className="uppercase tracking-tighter">Encrypted Session</span>
                        </div>
                      </div>
                      {/* Decorative Orbs */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl -ml-12 -mb-12" />
                    </div>
                  ) : (
                    <Link href="/login" className="block p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2.5rem] text-center shadow-xl hover:scale-[1.02] transition-transform">
                      <User size={40} className="mx-auto mb-3 text-white/80" />
                      <h2 className="text-white font-black text-xl">เข้าสู่ระบบเพื่อเริ่มช้อป</h2>
                      <p className="text-white/60 text-xs mt-1">รับสิทธิพิเศษมากมายสำหรับสมาชิก</p>
                    </Link>
                  )}
                </section>

                {/* 2. Grid Quick Actions */}
                <section className="grid grid-cols-4 gap-3">
                  <ActionIcon icon={<Home />} label="หน้าแรก" href="/" color="bg-orange-500/10 text-orange-400" />
                  <ActionIcon icon={<Bot />} label="AI บอท" href="#" color="bg-blue-500/10 text-blue-400" />
                  <ActionIcon icon={<CreditCard />} label="เติมเงิน" href="/topup" color="bg-pink-500/10 text-pink-400" />
                  <ActionIcon icon={<LifeBuoy />} label="ช่วยเหลือ" href="/contact" color="bg-purple-500/10 text-purple-400" />
                </section>

                {/* 3. Main Navigation List */}
                <section className="space-y-6">
                  <MenuCategory label="รายการหลัก">
                    <MenuListItem href="/" icon={<Home />} label="หน้าแรก" />
                    <MenuListItem href="/products" icon={<Package />} label="สินค้าทั้งหมด" />
                  </MenuCategory>

                  <MenuCategory label="ประวัติการใช้งาน">
                    <MenuListItem href="/orders" icon={<History />} label="ประวัติการสั่งซื้อ" subLabel="ตรวจสอบรหัสสินค้าได้ที่นี่" />
                  </MenuCategory>

                  {profile?.is_admin && (
                    <MenuCategory label="ผู้ดูแลระบบ" color="text-emerald-400">
                      <MenuListItem href="/admin" icon={<LayoutDashboard />} label="Admin Console" isAdmin />
                    </MenuCategory>
                  )}

                  <MenuCategory label="อื่นๆ">
                    <MenuListItem href="/how-to" icon={<Settings />} label="วิธีการใช้งาน" />
                  </MenuCategory>
                </section>

                {/* 4. Logout Action */}
                {profile && (
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full py-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 font-black text-sm flex items-center justify-center gap-3 transition-colors mb-10"
                  >
                    <LogOut size={18} /> ออกจากระบบอย่างปลอดภัย
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// --- Sub-components (Clean & Reusable) ---

const NavLink = memo(({ href, label }: { href: string; label: string }) => (
  <Link 
    href={href} 
    className="px-5 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
  >
    {label}
  </Link>
));
NavLink.displayName = "NavLink";

const ActionIcon = memo(({ icon, label, href, color }: { icon: any; label: string; href: string; color: string }) => (
  <Link href={href} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 group-active:scale-90 transition-all shadow-lg`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{label}</span>
  </Link>
));
ActionIcon.displayName = "ActionIcon";

const MenuCategory = memo(({ label, children, color = "text-gray-500" }: { label: string; children: React.ReactNode; color?: string }) => (
  <div className="space-y-3">
    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 ${color}`}>{label}</h3>
    <div className="space-y-1">{children}</div>
  </div>
));
MenuCategory.displayName = "MenuCategory";

const MenuListItem = memo(({ href, icon, label, subLabel, isAdmin }: { href: string; icon: any; label: string; subLabel?: string; isAdmin?: boolean }) => (
  <Link 
    href={href} 
    className={`flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all active:scale-[0.98] group ${isAdmin ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-white/5 hover:bg-white/10'}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#0D0820] text-purple-400 shadow-inner'}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      <div>
        <div className={`text-sm font-black ${isAdmin ? 'text-emerald-400' : 'text-gray-200'}`}>{label}</div>
        {subLabel && <div className="text-[10px] text-gray-500 font-bold">{subLabel}</div>}
      </div>
    </div>
    <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
  </Link>
));
MenuListItem.displayName = "MenuListItem";
