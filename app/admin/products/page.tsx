import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from("products").select("*");

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">จัดการสินค้า</h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold">
          เพิ่มสินค้าใหม่
        </button>
      </div>
      <div className="bg-[#1A1633] rounded-2xl border border-purple-900/30 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#241F47] text-gray-400 text-sm">
            <tr>
              <th className="p-4">ชื่อสินค้า</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-white text-sm">
            {products?.map((product) => (
              <tr key={product.id} className="border-t border-purple-900/30">
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">฿{product.price}</td>
                <td className="p-4">{product.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}</td>
                <td className="p-4">
                  <button className="text-purple-400 hover:text-white mr-2">แก้ไข</button>
                  <button className="text-red-400 hover:text-white">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
