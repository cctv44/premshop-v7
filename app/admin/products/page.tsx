"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const supabase = createClient();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    category: "streaming",
    price: 0,
    description: "",
    is_active: true,
    slug: "",
    image: "",
    color: "#7C3AED",
    bgColor: "rgba(124, 58, 237, 0.1)",
    unit: "เดือน"
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data);
  }

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "streaming",
        price: 0,
        description: "",
        is_active: true,
        slug: "",
        image: "",
        color: "#7C3AED",
        bgColor: "rgba(124, 58, 237, 0.1)",
        unit: "เดือน"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.name.toLowerCase().replace(/ /g, "-");
    
    const payload = { ...formData, slug };

    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) toast.error("แก้ไขไม่สำเร็จ");
      else toast.success("แก้ไขสินค้าแล้ว");
    } else {
      const { error } = await supabase.from("products").insert([payload]);
      if (error) toast.error("เพิ่มไม่สำเร็จ");
      else toast.success("เพิ่มสินค้าแล้ว");
    }

    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (confirm("ยืนยันการลบสินค้า?")) {
      await supabase.from("products").delete().eq("id", id);
      toast.success("ลบสินค้าแล้ว");
      fetchProducts();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">จัดการสินค้า</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
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
            {products.map((product) => (
              <tr key={product.id} className="border-t border-purple-900/30">
                <td className="p-4">{product.name}</td>
                <td className="p-4 uppercase">{product.category}</td>
                <td className="p-4">฿{product.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] ${product.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {product.is_active ? "เปิด" : "ปิด"}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleOpenModal(product)} className="text-purple-400 hover:text-white mr-3"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1633] border border-purple-900/30 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">ชื่อสินค้า</label>
                <input required className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-2 text-white outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">หมวดหมู่</label>
                  <select className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-2 text-white outline-none"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="streaming">Streaming</option>
                    <option value="music">Music</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">ราคา (บาท)</label>
                  <input type="number" required className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-2 text-white outline-none"
                    value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">รายละเอียด (แยกบรรทัดด้วย \n)</label>
                <textarea rows={3} className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-2 text-white outline-none"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">รูป Logo URL</label>
                <input className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-2 text-white outline-none"
                  value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="/logos/name.svg" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                <label className="text-sm text-white">เปิดใช้งานสินค้า</label>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl">
                บันทึกข้อมูล
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
