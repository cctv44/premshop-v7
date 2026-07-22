"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Bell, Menu, X, Moon, Sun } from "lucide-react";
import { useCartStore } from "@/lib/store";

const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/products", label: "สินค้า" },
  { href: "/categories", label: "หมวดหมู่" },
  { href: "/promotions", label: "โปรโมชั่น" },
  { href: "/reviews", label: "รีวิว" },
  { href: "/how-to", label: "วิธีการสั่งซื้อ" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.getTotalItems());

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0D0820]/95 backdrop-blur-lg shadow-lg shadow-purple-900/20"
            : "bg-[#0D0820]"
        } border-b border-purple-900/30`}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-neon-purple">
                <span className="text-white font-black text-lg">P</span>
              </div>
              <div>
                <div className="font-black text-lg leading-none">
                  <span className="text-white">PREM</span>
                  <span className="text-purple-400">SHOP</span>
                </div>
                <div className="text-[9px] text-purple-400/80 leading-none">
                  ร้านขายดีอันดับ 1
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 ml-4">
              {navLinks.slice(0, 8).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white hover:bg-purple-900/30 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search - Desktop */}
            <div className="hidden md:flex items-center bg-dark-100/50 border border-purple-900/30 rounded-xl px-3 py-2 gap-2 min-w-[200px] flex-1 max-w-xs">
              <Search className="w-4 h-4 text-purple-400" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า เช่น Netflix, Spotify..."
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-purple-900/20 transition-all md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="w-5 h-5" />
              </button>

              <Link href="/cart" className="relative p-2 rounded-lg hover:bg-purple-900/20 transition-all text-gray-400 hover:text-white">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <div className="hidden sm:flex items-center gap-2 bg-dark-100/60 border border-purple-900/30 rounded-xl px-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">PREM</div>
                  <div className="text-[10px] text-purple-400">฿1,250.00</div>
                </div>
              </div>

              <button
                className="lg:hidden text-gray-400 hover:text-white p-2"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <div className="flex items-center bg-dark-100/50 border border-purple-900/30 rounded-xl px-3 py-2 gap-2">
                <Search className="w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="lg:hidden bg-[#0D0820] border-t border-purple-900/30 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-white hover:bg-purple-900/30 px-4 py-3 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
}
