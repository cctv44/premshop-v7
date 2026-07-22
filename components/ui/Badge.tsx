"use client";

interface BadgeProps {
  type: "HOT" | "NEW" | "SALE";
}

export function Badge({ type }: BadgeProps) {
  const styles = {
    HOT: "bg-gradient-to-r from-red-500 to-orange-500",
    NEW: "bg-gradient-to-r from-emerald-500 to-cyan-500",
    SALE: "bg-gradient-to-r from-purple-600 to-pink-500",
  };
  return (
    <span
      className={`absolute -top-1 -right-1 z-10 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-sm ${styles[type]}`}
    >
      {type}
    </span>
  );
}
