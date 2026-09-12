"use client";

import { useEffect, useRef } from "react";
import {
  Bell,
  X,
  CheckCheck,
  Plus,
  Pencil,
  Trash2,
  MessageSquare,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";

type ActivityLog = {
  $id: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  entityType: string;
  entityName: string;
  action: string;
};

const actionIcons: Record<string, React.ReactNode> = {
  create: <Plus className="w-3 h-3" />,
  update: <Pencil className="w-3 h-3" />,
  delete: <Trash2 className="w-3 h-3" />,
  comment: <MessageSquare className="w-3 h-3" />,
  login: <Activity className="w-3 h-3" />,
  logout: <Activity className="w-3 h-3" />,
  join: <ShieldCheck className="w-3 h-3" />,
};

const actionColors: Record<string, { bg: string; text: string }> = {
  create: { bg: "bg-[#10B981]/15", text: "text-[#4edea3]" },
  update: { bg: "bg-[#6366F1]/15", text: "text-[#c0c1ff]" },
  delete: { bg: "bg-rose-500/15", text: "text-rose-400" },
  comment: { bg: "bg-[#8B5CF6]/15", text: "text-[#d0bcff]" },
  login: { bg: "bg-white/10", text: "text-[#A1A1AA]" },
  logout: { bg: "bg-white/10", text: "text-[#A1A1AA]" },
  join: { bg: "bg-amber-500/15", text: "text-amber-400" },
};

function NotificationItem({ log }: { log: ActivityLog }) {
  const colors = actionColors[log.action] || actionColors.update;
  const icon = actionIcons[log.action] || <Activity className="w-3 h-3" />;

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#571bc1] to-[#6366F1] flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 mt-0.5">
        {log.userName ? log.userName[0].toUpperCase() : "U"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-white">{log.userName}</span>
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${colors.bg} ${colors.text}`}
          >
            {icon}
            <span className="capitalize">{log.action}</span>
          </span>
          <span className="text-[10px] text-[#71717A] font-mono uppercase">{log.entityType}</span>
        </div>
        <p className="text-xs text-[#A1A1AA] mt-0.5 truncate">{log.entityName}</p>
        <p className="text-[10px] text-[#52525B] mt-0.5 font-mono">
          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const workspaceId = useWorkspaceId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const { data = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["notifications", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const res = await fetch(`/api/activity-log?workspaceId=${workspaceId}`);
      if (!res.ok) return [];
      const responseData = await res.json();
      return (responseData.data || []).map((log: ActivityLog & { userName?: string }) => ({
        ...log,
        userName: log.userName || log.userEmail?.split("@")[0] || "User",
        entityName: log.entityName || log.entityType || "Unknown",
      }));
    },
    enabled: !!workspaceId,
  });

  // Show latest 15 notifications
  const latest = data.slice(0, 15);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[340px] max-h-[520px] bg-[#1A1A1E] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px rgba(0,0,0,0.6)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-[#c0c1ff]" />
          <span className="text-sm font-semibold text-white">Notifications</span>
          {latest.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#6366F1] text-white font-mono text-[9px] min-w-[18px] text-center">
              {latest.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-lg hover:bg-white/[0.08] flex items-center justify-center text-[#71717A] hover:text-white transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#71717A]">
            Loading activity...
          </div>
        ) : latest.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#202025] flex items-center justify-center">
              <Bell className="size-5 text-[#3F3F46]" />
            </div>
            <p className="text-xs text-[#71717A]">No activity yet</p>
          </div>
        ) : (
          latest.map((log) => <NotificationItem key={log.$id} log={log} />)
        )}
      </div>

      {/* Footer */}
      {latest.length > 0 && (
        <div className="px-4 py-3 border-t border-white/[0.06] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 w-full text-xs text-[#6366F1] hover:text-[#818cf8] transition-colors font-medium"
          >
            <CheckCheck className="size-3.5" />
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}
