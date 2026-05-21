import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Md Sefat Ullah Fahad | Full Stack Developer",
  description: "Hi, I'm Sefatullah Fahad, a passionate Full-Stack Web Developer. I love building fast, scalable, and user-friendly web applications from scratch.",
};

export default function RootLayout({ children }) {
  return (
    <html
      data-theme="light"
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* নেভিগেশন বারটি এখন সুরক্ষিতভাবে body ট্যাগের ভেতরে রেন্ডার হচ্ছে */}
        <Navbar />
        
        {/* আপনার ওয়েবসাইটের মূল কন্টেন্টসমূহ */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}