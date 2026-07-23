import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  // Assuming a separate categories table or a distinct list of categories from products
  const { data: products } = await supabase.from("products").select("category");
  const uniqueCategories = Array.from(new Set(products?.map(p => p.category)));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">จัดการหมวดหมู่</h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold">
          เพิ่มหมวดหมู่ใหม่
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueCategories.map((category) => (
          <div key={category} className="p-6 bg-[#1A1633] rounded-2xl border border-purple-900/30 flex justify-between items-center">
            <span className="text-white font-semibold">{category}</span>
            <div>
              <button className="text-purple-400 hover:text-white mr-4">แก้ไข</button>
              <button className="text-red-400 hover:text-white">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
