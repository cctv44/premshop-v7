import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { apiUrl, marginType, marginValue } = await req.json();
  const supabase = createClient();

  try {
    const response = await fetch(apiUrl);
    const apiProducts = await response.json();

    const importResults = apiProducts.map((p: any) => {
      let finalPrice = p.price;
      if (marginType === "percent") {
        finalPrice = p.price * (1 + marginValue / 100);
      } else {
        finalPrice = p.price + marginValue;
      }

      return {
        name: p.name,
        slug: `${p.slug}-${Date.now()}`,
        category: p.category,
        description: p.description,
        price: Number(finalPrice.toFixed(2)),
        is_active: false,
      };
    });

    const { error } = await supabase.from("products").insert(importResults);

    if (error) throw error;

    return NextResponse.json({ success: true, count: importResults.length });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
