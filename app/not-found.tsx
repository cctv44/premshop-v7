import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#0F0A1E] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-black text-purple-700/40 mb-4">404</div>
        <h2 className="text-2xl font-black text-white mb-2">ไม่พบหน้าที่ต้องการ</h2>
        <p className="text-gray-400 mb-6">หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือลบแล้ว</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
