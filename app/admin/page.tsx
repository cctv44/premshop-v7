export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#1A1633] rounded-2xl border border-purple-900/30">
          <h3 className="text-gray-400 text-sm">ยอดขายรวม</h3>
          <p className="text-3xl font-bold text-white mt-2">฿ 0.00</p>
        </div>
        <div className="p-6 bg-[#1A1633] rounded-2xl border border-purple-900/30">
          <h3 className="text-gray-400 text-sm">ออเดอร์ที่รอดำเนินการ</h3>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="p-6 bg-[#1A1633] rounded-2xl border border-purple-900/30">
          <h3 className="text-gray-400 text-sm">คำขอเติมเครดิตที่รออนุมัติ</h3>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
