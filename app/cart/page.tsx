"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, ChevronRight, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { formatPrice } from "@/lib/utils";
import { products } from "@/lib/data";
import toast from "react-hot-toast";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const total = useCartStore((s) => s.getTotalPrice());

  if (items.length === 0) {
    return (
      <div className="bg-[#0F0A1E] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-black text-white mb-2">ตะกร้าสินค้าว่างเปล่า</h2>
          <p className="text-gray-400 mb-6">เลือกสินค้าที่ชอบเพิ่มลงตะกร้าได้เลย</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            <ShoppingBag className="w-4 h-4" /> ดูสินค้าทั้งหมด
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">ตะกร้าสินค้า</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-6">ตะกร้าสินค้า ({items.length} รายการ)</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.id);
              return (
                <div key={`${item.id}-${item.variant}`} className="glass-card rounded-2xl border border-purple-800/30 p-4 flex items-center gap-4">
                  {product && (
                    <ProductLogo name={item.name} color={product.color} bgColor={product.bgColor} size="md" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm">{item.name}</div>
                    <div className="text-gray-400 text-xs">{item.variant} · {item.duration}</div>
                    <div className="text-purple-400 font-bold mt-1">{formatPrice(item.price)} ฿ / {item.duration}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-purple-800/40 text-white hover:bg-purple-900/30 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-purple-800/40 text-white hover:bg-purple-900/30 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-white font-black min-w-[80px] text-right">
                    {formatPrice(item.price * item.quantity)} ฿
                  </div>
                  <button
                    onClick={() => {
                      removeItem(item.id, item.variant);
                      toast.success("นำออกจากตะกร้าแล้ว", {
                        style: { background: "#1A1033", color: "#fff", border: "1px solid rgba(124,58,237,0.4)" },
                      });
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div>
            <div className="glass-card rounded-2xl border border-purple-800/30 p-5 sticky top-20">
              <h3 className="text-white font-bold text-lg mb-4">สรุปคำสั่งซื้อ</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ราคารวม</span>
                  <span className="text-white">{formatPrice(total)} ฿</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ส่วนลด</span>
                  <span className="text-emerald-400">-0 ฿</span>
                </div>
                <div className="border-t border-purple-900/30 pt-2 flex justify-between">
                  <span className="text-white font-bold">รวมทั้งสิ้น</span>
                  <span className="text-white font-black text-xl">{formatPrice(total)} ฿</span>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="รหัสส่วนลด (ถ้ามี)"
                  className="w-full bg-dark-100/50 border border-purple-900/30 text-white text-sm rounded-xl px-4 py-2.5 outline-none placeholder-gray-500"
                />
              </div>

              <Link
                href="/checkout"
                className="block text-center bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-purple-900/40"
              >
                ดำเนินการชำระเงิน →
              </Link>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {["QR Code", "VISA", "MC", "LINE Pay"].map((p) => (
                  <div key={p} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
