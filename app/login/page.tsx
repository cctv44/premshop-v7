import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-md p-8 bg-[#1A1633] rounded-2xl border border-purple-900/30 shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-6 text-center">เข้าสู่ระบบ</h1>
        {/* Auth form component to be implemented */}
        <p className="text-gray-400 text-center">ฟอร์มเข้าสู่ระบบกำลังจะมาเร็วๆ นี้</p>
      </div>
    </div>
  );
}
