"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@/features/auth/components/user-button";
import { Mobilesidebar } from "./mobile-sidebar";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { NotificationPanel } from "./notification-panel";

const pathnameMap: Record<string, { title: string; description: string }> = {
  tasks: {
    title: "My Tasks",
    description: "Engineering backlog, active issues & telemetry",
  },
  projects: {
    title: "Project Workspace",
    description: "Sprint velocity, pipeline boards & team cadence",
  },
  members: {
    title: "Team Members",
    description: "Manage contributors, access permissions & roles",
  },
  settings: {
    title: "Workspace Settings",
    description: "Configuration, telemetry schema & preferences",
  },
  "activity-logs": {
    title: "Audit Trail",
    description: "Deterministic timeline & immutable actor logs",
  },
};

const defaultMap = {
  title: "Dashboard",
  description: "Monitor high-velocity projects, flow rates & sprint metrics",
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3];

  const { title, description } = (pathnameKey && pathnameMap[pathnameKey]) || defaultMap;

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="h-16 px-4 lg:px-8 flex items-center justify-between border-b border-white/[0.06] bg-[#121216]/60 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-xl font-semibold tracking-tight text-[#F4F4F5]">{title}</h1>
        <p className="text-xs text-[#A1A1AA]">{description}</p>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-[#1B1B1E] border border-white/[0.08] text-[#A1A1AA] hover:border-white/[0.16] transition-colors cursor-pointer">
          <Search className="size-4 text-[#A1A1AA]" />
          <span className="text-xs">Quick search...</span>
          <kbd className="font-mono text-[10px] bg-[#2A2A2D] text-[#E4E1E6] px-1.5 py-0.5 rounded border border-white/[0.06]">
            ⌘K
          </kbd>
        </div>

        {/* Notification Bell with Panel */}
        <div className="relative">
          <button
            id="notification-bell"
            onClick={() => setShowNotifications((v) => !v)}
            className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              showNotifications
                ? "bg-[#202025] border-[#6366F1]/50 text-[#c0c1ff]"
                : "bg-[#1B1B1E] hover:bg-[#202025] border-white/[0.08] text-[#A1A1AA] hover:text-[#F4F4F5]"
            }`}
            title="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] ring-2 ring-[#121216]" />
          </button>

          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <Mobilesidebar />
        <UserButton />
      </div>
    </nav>
  );
};