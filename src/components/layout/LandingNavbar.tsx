import Link from "next/link";
import { Moon } from "lucide-react";

export default function LandingNavbar() {
  return (
    <nav className="h-[60px] sticky top-0 z-50 bg-[#09090b]/85 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[960px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6c63ff] animate-pulse"></div>
          <span className="font-['Syne'] font-extrabold text-[18px] tracking-[-0.03em] text-[#f0f0f8]">ExamEdge</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="btn-ghost flex items-center justify-center">
            Login →
          </Link>
          <button className="btn-icon">
            <Moon className="w-4 h-4 text-[#a0a0c0]" />
          </button>
        </div>
      </div>
    </nav>
  );
}
