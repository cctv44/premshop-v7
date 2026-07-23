"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?.id));

  // ป้องกันกรณีไม่มีข้อมูล product
  if (!product) return null;

  // รองรับทั้ง review_count (DB) และ reviewCount (Mockup)
  const reviewCount = product.review_count !== undefined ? product.review_count : (product.reviewCount || 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      variant: product.variants?.[0]?.name || product.name,
      duration: product.variants?.[0]?.duration || "1 เดือน",
      price: product.price,
      quantity: 1,
      image: product.image || "",
      color: product.color || "#7C3AED",
    });
    toast.success(`เพิ่ม ${product.name} ในตะกร้าแล้ว`, {
      style: { background: "#1A1033", color: "#fff", border: "1px solid rgba(124,58,237,0.4)" },
      icon: "🛒",
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/products/${product.slug || product.id}`}>
      <div className="product-card glass-card rounded-2xl p-4 border border-purple-900/20 hover:border-purple-700/40 flex flex-col gap-3 h-full cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <ProductLogo
              name={product.name || ""}
              color={product.color || "#7C3AED"}
              bgColor={product.bgColor || "rgba(124,58,237,0.1)"}
              size="md"
            />
            {product.badge && <Badge type={product.badge} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white text-sm truncate">{product.name}</div>
            <div className="text-xs text-gray-400 whitespace-pre-line leading-relaxed mt-0.5 line-clamp-2">
              {product.description}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-yellow-400 text-xs font-semibold">{product.rating || "5.0"}</span>
              <span className="text-gray-500 text-xs">({reviewCount.toLocaleString()})</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{formatPrice(product.price || 0)}</span>
            <span className="text-sm text-gray-400">฿</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            ซื้อเลย
          </button>
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              isWishlisted ? "bg-pink-900/30 border-pink-700/50 text-pink-400" : "border-purple-800/40 text-gray-400"
            }`}
          >
            <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </Link>
  );
}
