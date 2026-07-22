import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { apiUrl, marginType, marginValue } = await req.json();
  const supabase = createClient();

  try {
    // 1. Fetch products from API
    const response = await fetch(apiUrl);
    const apiProducts = await response.json();

    // 2. Process and import to Supabase
    for (const p of apiProducts) {
      let finalPrice = p.price;
      if (marginType === "percent") {
        finalPrice = p.price * (1 + marginValue / 100);
      } else {
        finalPrice = p.price + marginValue;
      }

      await supabase.from("products").insert({
        name: p.name,
        slug: p.slug, // Should ensure unique slug
        category: p.category,
        price: finalPrice,
        is_active: false, // Inactive by default for review
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
