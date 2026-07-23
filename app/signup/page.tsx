import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-md p-8 bg-[#1A1633] rounded-2xl border border-purple-900/30 shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-6 text-center">สมัครสมาชิก</h1>
        <AuthForm type="signup" />
        <p className="text-gray-400 text-center mt-4 text-sm">มีบัญชีแล้ว? <Link href="/login" className="text-purple-400">เข้าสู่ระบบ</Link></p>
      </div>
    </div>
  );
}
