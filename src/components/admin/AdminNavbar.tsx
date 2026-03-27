'use client';

import Link from "next/link";
import { LogOut, Bell } from "lucide-react";

export default function AdminNavbar() {
  return (
    <nav className="h-[60px] flex-shrink-0 flex items-center justify-between px-6 bg-[var(--bg-elevated)] border-b border-[var(--border)] relative z-20">
      <div className="flex items-center gap-3">
        {/* Placeholder if sidebar is hidden on small screens */}
      </div>
      
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 mr-2">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-bold text-[var(--text-primary)] leading-tight">Admin User</div>
            <div className="text-[11px] text-[var(--accent)] font-semibold">Super Admin</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[var(--accent-bg)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] font-bold text-[12px]">
            AU
          </div>
        </div>

        <button className="relative text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#f43f5e]"></span>
        </button>

        <Link href="/" className="btn-ghost flex items-center gap-2 text-[var(--error)] hover:!text-[#f43f5e] hover:!bg-[rgba(244,63,94,0.1)]">
          <LogOut className="w-3.5 h-3.5" />
          Exit Admin
        </Link>
      </div>
    </nav>
  );
}
