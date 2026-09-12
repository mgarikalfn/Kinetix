"use client"
// components/RoleGuard.tsx
import { ReactNode } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { MemberRole } from "@/features/members/types";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  role: MemberRole | MemberRole[];
  workspaceId?: string;
  userId?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({
  role,
  workspaceId,
  userId,
  children,
  fallback = null,
}: RoleGuardProps) {
  // Must call hook unconditionally — pass empty strings when ids are missing;
  // the hook itself handles missing/empty ids gracefully.
  const { role: userRole, isLoading } = useUserRole({
    workspaceId: workspaceId ?? "",
    userId: userId ?? "",
  });

  if (!workspaceId || !userId) {
    return <>{fallback}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  const hasAccess = userRole && allowedRoles.includes(userRole);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}