"use client";

import { Activity, SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import { cn } from "@/lib/utils";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";
import { RoleGuard } from "@/components/role-guard";
import { MemberRole } from "@/features/members/types";
import { useCurrent } from "@/features/auth/api/use-current";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
    requiredRole: [MemberRole.ADMIN],
  },
  {
    label: "Activity Logs",
    href: "/activity-logs",
    icon: Activity,
    activeIcon: Activity,
    requiredRole: [MemberRole.ADMIN],
  },
];

interface NavigationItemProps {
  item: typeof routes[0];
  workspaceId: string;
  pathname: string;
}

const NavigationItem = ({ item, workspaceId, pathname }: NavigationItemProps) => {
  const fullHref = `/workspaces/${workspaceId}${item.href}`;
  const isActive = pathname === fullHref;
  const Icon = isActive ? item.activeIcon : item.icon;
  const { data: user } = useCurrent();

  const linkContent = (
    <div
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-md font-medium transition-all text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-white/[0.04]",
        isActive && "bg-[#1F1F22] text-white shadow-sm border-l-2 border-[#6366F1]"
      )}
    >
      <Icon className={cn("size-4 text-[#A1A1AA] transition-colors", isActive && "text-[#c0c1ff]")} />
      <span>{item.label}</span>
      {item.requiredRole && (
        <span className="font-label-micro text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#571bc1]/30 text-[#c4abff] border border-[#571bc1]/40 ml-auto">
          Admin
        </span>
      )}
    </div>
  );

  if (item.requiredRole) {
    return (
      <RoleGuard
        role={item.requiredRole}
        workspaceId={workspaceId}
        userId={user?.$id}
        fallback={null}
      >
        <Link href={fullHref}>{linkContent}</Link>
      </RoleGuard>
    );
  }

  return <Link href={fullHref}>{linkContent}</Link>;
};

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-y-1">
      <p className="font-label-micro text-neutral-400 px-3 py-1 mb-1">Menu</p>
      {routes.map((item) => (
        <NavigationItem
          key={item.href}
          item={item}
          workspaceId={workspaceId}
          pathname={pathname}
        />
      ))}
    </div>
  );
};