import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-md p-8 bg-[#1A1633] rounded-2xl border border-purple-900/30 shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-6 text-center">เข้าสู่ระบบ</h1>
        <AuthForm type="login" />
        <p className="text-gray-400 text-center mt-4 text-sm">ยังไม่มีบัญชี? <Link href="/signup" className="text-purple-400">สมัครสมาชิก</Link></p>
      </div>
    </div>
  );
}
