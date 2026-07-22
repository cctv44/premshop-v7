import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, PlusCircle } from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "จัดการสินค้า", icon: Package },
  { href: "/admin/orders", label: "จัดการออเดอร์", icon: ShoppingCart },
  { href: "/admin/users", label: "จัดการผู้ใช้", icon: Users },
  { href: "/admin/categories", label: "จัดการหมวดหมู่", icon: PlusCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0D0820]">
      <aside className="w-64 border-r border-purple-900/30 p-6">
        <h2 className="text-xl font-black text-white mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-purple-900/30 px-4 py-3 rounded-xl transition-all"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
