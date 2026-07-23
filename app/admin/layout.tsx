"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Settings, CreditCard, Layers, Menu, X, Home, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const adminMenus = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/admin/products", label: "จัดการสินค้า", icon: <Package size={20} /> },
  { href: "/admin/orders", label: "จัดการออเดอร์", icon: <ShoppingCart size={20} /> },
  { href: "/admin/topups", label: "ยืนยันการโอนเงิน", icon: <CreditCard size={20} /> },
  { href: "/admin/users", label: "จัดการผู้ใช้งาน", icon: <Users size={20} /> },
  { href: "/admin/categories", label: "จัดการหมวดหมู่", icon: <Layers size={20} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0D0820] flex">
      {/* --- Sidebar สำหรับ Desktop --- */}
      <aside className="hidden lg:flex w-72 bg-[#1A1633]/50 backdrop-blur-xl border-r border-purple-900/30 flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-purple-900/30">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-neon-purple">P</div>
            <span className="text-white font-black text-xl">ADMIN <span className="text-purple-400">PANEL</span></span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenus.map((item) => (
            <AdminNavLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>
        <div className="p-4 border-t border-purple-900/30">
          <Link href="/" className="flex items-center gap-3 text-gray-500 hover:text-white p-3 transition-all">
            <Home size={20} /> <span>กลับหน้าหลักเว็บ</span>
          </Link>
        </div>
      </aside>

      {/* --- Header สำหรับ Mobile --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-[#1A1633] border-b border-purple-900/30 p-4 flex items-center justify-between sticky top-0 z-[100]">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-purple-400">
            <Menu size={24} />
          </button>
          <span className="text-white font-black text-sm">ADMIN PANEL</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 lg:p-10 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>

      {/* --- Mobile Sidebar (Drawer) --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 w-80 bg-[#1A1633] z-[120] p-6 lg:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                 <span className="text-white font-black">ADMIN MENU</span>
                 <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400"><X /></button>
              </div>
              <nav className="space-y-2">
                {adminMenus.map((item) => (
                  <AdminNavLink key={item.href} {...item} active={pathname === item.href} onClick={() => setIsSidebarOpen(false)} />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminNavLink({ href, label, icon, active, onClick }: any) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
        active 
        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" 
        : "text-gray-400 hover:bg-purple-900/20 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold">{label}</span>
      </div>
      {active && <ChevronRight size={14} />}
    </Link>
  );
}
