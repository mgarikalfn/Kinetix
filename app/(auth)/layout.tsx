"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { KinetixLogo } from "@/components/kinetix-logo";

interface LayoutPageProps {
  children: React.ReactNode;
}

const LayoutPage = ({ children }: LayoutPageProps) => {
  const pathname = usePathname();

  return (
    <main className="bg-[#09090B] text-[#E4E1E6] min-h-screen relative overflow-hidden flex flex-col justify-between p-4 sm:p-6">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-screen-xl w-full">
        <nav className="flex justify-between items-center py-2">
          <Link href="/">
            <KinetixLogo size={32} />
          </Link>
          <Link
            href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
            className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#1F1F22] border border-white/[0.08] text-xs font-medium text-white transition-all shadow-sm"
          >
            {pathname === "/sign-in" ? "Sign Up" : "Login"}
          </Link>
        </nav>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-8">
        {children}
      </div>

      <div className="relative z-10 text-center py-4">
        <span className="font-mono text-[11px] text-[#71717A]">
          Kinetix Telemetry • Keyboard-First Orchestration
        </span>
      </div>
    </main>
  );
};

export default LayoutPage;
