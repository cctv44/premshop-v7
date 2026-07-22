"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Heart, ChevronRight, Star, Shield, Zap, Clock, CheckCircle } from "lucide-react";
import { products } from "@/lib/data";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/home/ProductCard";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const variant = product.variants[selectedVariant];
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      variant: variant.name,
      duration: variant.duration,
      price: variant.price,
      quantity,
      image: product.image,
      color: product.color,
    });
    toast.success(`เพิ่ม ${product.name} (${variant.duration}) ในตะกร้าแล้ว`, {
      style: { background: "#1A1033", color: "#fff", border: "1px solid rgba(124,58,237,0.4)" },
      icon: "🛒",
    });
  };

  return (
    <div className="bg-[#0F0A1E] min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-400">หน้าแรก</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-purple-400">สินค้า</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-400">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product visual */}
          <div className="glass-card rounded-2xl border border-purple-800/30 p-8 flex flex-col items-center justify-center min-h-[300px] relative">
            {product.badge && (
              <div className="absolute top-4 right-4">
                <Badge type={product.badge} />
              </div>
            )}
            <ProductLogo name={product.name} color={product.color} bgColor={product.bgColor} size="lg" />
            <h1 className="text-3xl font-black text-white mt-4 text-center">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
              ))}
              <span className="text-yellow-400 font-semibold ml-1">{product.rating}</span>
              <span className="text-gray-500 text-sm">({product.reviewCount.toLocaleString()} รีวิว)</span>
            </div>

            {/* Features */}
            <div className="mt-6 w-full space-y-2">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex gap-3 flex-wrap justify-center">
              {[
                { icon: Zap, text: "ส่งใน 1 นาที", color: "text-yellow-400" },
                { icon: Shield, text: "ปลอดภัย 100%", color: "text-emerald-400" },
                { icon: Clock, text: "บริการ 24 ชม.", color: "text-blue-400" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-1.5 bg-dark-card/50 border border-purple-900/20 rounded-full px-3 py-1">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-xs text-gray-300">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase panel */}
          <div className="space-y-5">
            {/* Variants */}
            <div className="glass-card rounded-2xl border border-purple-800/30 p-5">
              <h3 className="text-white font-bold mb-3">เลือกแพ็กเกจ</h3>
              <div className="space-y-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      selectedVariant === i
                        ? "border-purple-500 bg-purple-900/20"
                        : "border-purple-900/30 hover:border-purple-700/40"
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-white text-sm font-medium">{v.name}</div>
                      <div className="text-gray-400 text-xs">{v.duration}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{formatPrice(v.price)} ฿</div>
                      <div className="text-gray-500 text-xs">/ {v.duration.includes("เดือน") ? "เดือน" : "ปี"}</div>
                    </div>
                    {selectedVariant === i && (
                      <div className="ml-3 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Cart */}
            <div className="glass-card rounded-2xl border border-purple-800/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">จำนวน</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg border border-purple-800/40 text-white hover:bg-purple-900/30 transition-all"
                  >
                    -
                  </button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg border border-purple-800/40 text-white hover:bg-purple-900/30 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black text-white">{formatPrice(variant.price * quantity)}</span>
                <span className="text-gray-400">บาท</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-purple-900/40 active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                  เพิ่มในตะกร้า
                </button>
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success(isWishlisted ? "นำออกจากรายการโปรด" : "เพิ่มในรายการโปรดแล้ว", {
                      style: { background: "#1A1033", color: "#fff", border: "1px solid rgba(124,58,237,0.4)" },
                    });
                  }}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                    isWishlisted ? "bg-pink-900/30 border-pink-700/50 text-pink-400" : "border-purple-800/40 text-gray-400"
                  }`}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              <Link
                href="/cart"
                onClick={handleAddToCart}
                className="mt-3 block text-center py-3.5 rounded-xl border-2 border-purple-600 text-purple-300 hover:bg-purple-900/20 font-bold transition-all"
              >
                ซื้อเลย →
              </Link>
            </div>

            {/* Payment methods */}
            <div className="glass-card rounded-2xl border border-purple-800/30 p-4">
              <div className="text-sm text-gray-400 mb-2">ช่องทางการชำระเงิน</div>
              <div className="flex flex-wrap gap-2">
                {["QR Code", "VISA", "Mastercard", "TrueMoney", "LINE Pay"].map((p) => (
                  <div key={p} className="px-2.5 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-white mb-4">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
