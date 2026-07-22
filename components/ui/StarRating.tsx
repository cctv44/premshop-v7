"use client";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const sizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={cn(sizes[size], star <= Math.round(rating) ? "text-yellow-400" : "text-gray-600")}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
