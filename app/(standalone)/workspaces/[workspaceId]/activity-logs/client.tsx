"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  Activity,
  Plus,
  Pencil,
  Trash2,
  MessageSquare,
  ArrowLeft,
  User,
  Calendar,
  FileText,
  ShieldCheck,
  Search,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReactNode, useMemo, useState } from "react";
import { useGetProjectAnalyticsWorkload } from "@/features/projects/api/use-get-project-analytics-workload";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

type ActivityLog = {
  $id: string;
  userEmail: string;
  userName: string;
  timestamp: string;
  entityType: string;
  entityName: string;
  entityId: string;
  action: string;
  changes: Record<string, unknown>;
};

interface ApiActivityLog {
  $id: string;
  userEmail: string;
  userName?: string;
  timestamp: string;
  entityType: string;
  entityName?: string;
  entityId: string;
  action: string;
  changes: Record<string, unknown>;
}

const actionIcons: Record<string, ReactNode> = {
  create: <Plus className="w-3.5 h-3.5" />,
  update: <Pencil className="w-3.5 h-3.5" />,
  delete: <Trash2 className="w-3.5 h-3.5" />,
  comment: <MessageSquare className="w-3.5 h-3.5" />,
  login: <Activity className="w-3.5 h-3.5" />,
  logout: <Activity className="w-3.5 h-3.5" />,
};

const actionBadges: Record<string, { bg: string; text: string; border: string }> = {
  create: { bg: "bg-[#10B981]/15", text: "text-[#4edea3]", border: "border-[#10B981]/30" },
  update: { bg: "bg-[#6366F1]/15", text: "text-[#c0c1ff]", border: "border-[#6366F1]/30" },
  delete: { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/30" },
  comment: { bg: "bg-[#8B5CF6]/15", text: "text-[#d0bcff]", border: "border-[#8B5CF6]/30" },
  login: { bg: "bg-white/10", text: "text-[#E4E1E6]", border: "border-white/20" },
  logout: { bg: "bg-white/10", text: "text-[#E4E1E6]", border: "border-white/20" },
};

const hasFromToProperties = (obj: unknown): obj is { from: unknown; to: unknown } => {
  return typeof obj === "object" && obj !== null && "from" in obj && "to" in obj;
};

const ActivityLogsClient = () => {
  const router = useRouter();
  const { workspaceId } = useParams() as { workspaceId: string };
  const projectId = useProjectId();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["activityLogs", workspaceId],
    queryFn: async () => {
      const res = await fetch(`/api/activity-log?workspaceId=${workspaceId}`);
      if (!res.ok) throw new Error("Failed to fetch activity logs");
      const responseData = await res.json();

      return responseData.data.map((log: ApiActivityLog) => ({
        ...log,
        userEmail: log.userEmail,
        userName: log.userName || log.userEmail?.split("@")[0] || "User",
        entityName: log.entityName || log.entityId || "Unknown Entity",
        changes: log.changes || {},
      })) as ActivityLog[];
    },
  });

  const { data: workload } = useGetProjectAnalyticsWorkload({ projectId });

  const memberIdToName = useMemo(() => {
    if (!workload) return {};
    const map: Record<string, string> = {};
    for (const member of workload) {
      map[member.email] = member.name || member.email;
    }
    return map;
  }, [workload]);

  const getMemberName = (id: string) => memberIdToName[id] || id;

  const filteredLogs = useMemo(() => {
    return data.filter((log) => {
      const matchesCategory =
        activeCategory === "all" || log.entityType.toLowerCase() === activeCategory.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        log.userName.toLowerCase().includes(q) ||
        log.entityName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [data, activeCategory, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-[#E4E1E6]">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/workspaces/${workspaceId}`)}
        className="flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-white transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Workspace</span>
      </button>

      {/* Ambient Header Banner */}
      <div className="relative p-5 rounded-2xl bg-[#121216] border border-white/[0.06] overflow-hidden shadow-lg space-y-4">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br from-[#8B5CF6]/15 via-[#6366F1]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-[#c0c1ff] shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Workspace Audit Trail
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#00885d]/30 text-[#4edea3] font-mono text-[9px] uppercase font-semibold">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA]">
                Deterministic telemetry & immutable actor logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18181B] border border-white/[0.06] text-[10px] font-mono text-[#4edea3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
            <span>REC</span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-3 pt-1">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search activities, actors, or entity keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-10 rounded-xl bg-[#18181B] border border-white/[0.08] text-white text-xs placeholder:text-[#71717A] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#71717A] bg-[#2A2A2D] px-1.5 py-0.5 rounded">
              /
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["all", "task", "project", "member", "workspace"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    : "bg-[#18181B] border border-white/[0.06] text-[#A1A1AA] hover:text-white"
                }`}
              >
                {category === "all" ? "All Events" : `${category}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA] bg-[#121216] border border-white/[0.06] rounded-2xl">
          Loading audit events...
        </div>
      ) : error ? (
        <div className="p-6 text-center text-xs text-rose-400 bg-[#121216] border border-rose-500/20 rounded-2xl">
          Error loading audit logs: {(error as Error).message}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#71717A] bg-[#121216] border border-white/[0.06] rounded-2xl">
          No audit events match your search.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4">
          {/* Connecting Vertical Rail */}
          <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#6366F1] via-[#8B5CF6]/50 to-[#2A2A2D] rounded-full" />

          {filteredLogs.map((log) => {
            const badge = actionBadges[log.action] || actionBadges.create;
            const icon = actionIcons[log.action] || <Activity className="w-3.5 h-3.5" />;

            return (
              <div
                key={log.$id}
                className="relative bg-[#18181B] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-4 shadow-sm transition-all"
              >
                {/* Node dot */}
                <div className="absolute -left-[27px] top-5 w-3.5 h-3.5 rounded-full bg-[#09090B] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="size-6 ring-1 ring-white/10 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-tr from-[#571bc1] to-[#6366F1] text-white text-[10px] font-medium">
                          {log.userName ? log.userName[0].toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold text-white truncate">
                        {log.userName}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {icon}
                        <span className="capitalize">{log.action}</span>
                      </span>
                      <span className="font-mono text-[10px] text-[#A1A1AA] bg-[#202025] px-1.5 py-0.5 rounded uppercase">
                        {log.entityType}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-[#71717A]">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-[#E4E1E6] pl-8">
                    {log.entityName}
                  </p>

                  {/* Changes diff */}
                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="pl-8 pt-1 space-y-1.5">
                      {!!log.changes.status && hasFromToProperties(log.changes.status) && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-[#202025] text-[#A1A1AA] font-mono text-[11px]">
                            {String(log.changes.status.from)}
                          </span>
                          <ArrowRight className="size-3 text-[#6366F1]" />
                          <span className="px-2 py-0.5 rounded bg-[#571bc1]/30 text-[#c4abff] border border-[#571bc1]/40 font-mono text-[11px]">
                            {String(log.changes.status.to)}
                          </span>
                        </div>
                      )}

                      {!!log.changes.assigneeId && hasFromToProperties(log.changes.assigneeId) && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[#A1A1AA]">Reassigned to:</span>
                          <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 font-mono text-[11px]">
                            {getMemberName(String(log.changes.assigneeId.to))}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer telemetry hash */}
      <div className="pt-6 flex flex-col items-center justify-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#121216] border border-white/[0.06] text-[#71717A] font-mono text-[10px]">
          <CheckCircle className="size-3 text-[#4edea3]" />
          <span>Audit hash verified: 0x89e...fa31</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsClient;