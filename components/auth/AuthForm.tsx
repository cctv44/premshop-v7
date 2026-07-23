"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function AuthForm({ type }: { type: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (type === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else {
        toast.success("เข้าสู่ระบบสำเร็จ");
        router.push("/");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) toast.error(error.message);
      else toast.success("สมัครสมาชิกสำเร็จ โปรดยืนยันอีเมลของคุณ");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="อีเมล"
        className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-3 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="รหัสผ่าน"
        className="w-full bg-[#0D0820] border border-purple-900/30 rounded-xl px-4 py-3 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
        disabled={loading}
      >
        {loading ? "กำลังโหลด..." : type === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
      </button>
    </form>
  );
}
