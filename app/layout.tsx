import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PremShop - ซื้อบัญชีพรีเมียม ง่ายๆ ได้ทันที 24 ชม.",
  description:
    "บริการอัตโนมัติ รวดเร็ว ปลอดภัย 100% พร้อมใช้งานได้ทันทีหลังชำระเงิน ราคาถูกที่สุด Netflix, Disney+, Spotify, YouTube Premium และอีกมากมาย",
  keywords: "Netflix, Disney+, Spotify, YouTube Premium, premium account, บัญชีพรีเมียม, ราคาถูก",
  openGraph: {
    title: "PremShop - ซื้อบัญชีพรีเมียม ง่ายๆ ได้ทันที 24 ชม.",
    description: "บริการอัตโนมัติ รวดเร็ว ปลอดภัย 100%",
    type: "website",
    locale: "th_TH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
