"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetProjectAnalytics } from "../api/use-get-project-analytics";
import LoadingPage from "@/app/loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetProjectAnalyticsWorkload } from "../api/use-get-project-analytics-workload";
import {
  Clock,
  Zap,
  AlertCircle,
  PieChart as PieChartIcon,
  Layers,
  FileDown,
  CheckCircle2,
  Users,
} from "lucide-react";

// Obsidian Kinetic Status Colors
const STATUS_COLORS: Record<string, string> = {
  todo: "#0284C7",
  "in progress": "#F59E0B",
  "in review": "#8B5CF6",
  done: "#10B981",
  backlog: "#64748B",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "#64748B",
  medium: "#F59E0B",
  high: "#F43F5E",
  urgent: "#E11D48",
};

const DEFAULT_CHART_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#4EDEA3",
  "#F59E0B",
  "#E11D48",
  "#0284C7",
];

interface ReportDashboardProps {
  projectId: string;
}

const ReportDashboard = ({ projectId }: ReportDashboardProps) => {
  const { data: initialValues, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });
  const { data: workload = [], isLoading: isLoadingWorkload } =
    useGetProjectAnalyticsWorkload({ projectId });

  if (isLoadingAnalytics || isLoadingWorkload) {
    return <LoadingPage />;
  }

  if (!initialValues || !workload) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4 bg-[#121216] border border-white/[0.06] rounded-2xl p-8">
        <AlertCircle className="w-12 h-12 text-[#A1A1AA]" />
        <h3 className="text-lg font-medium text-white">No analytics data available</h3>
        <p className="text-xs text-[#71717A] text-center">
          Create and assign tasks in this project to generate real-time velocity metrics.
        </p>
      </div>
    );
  }

  // Convert objects to chart-ready arrays
  const toChartData = (obj: Record<string, number>) =>
    Object.entries(obj).map(([name, value]) => ({ name, value }));

  const statusData = toChartData(initialValues.status);
  const priorityData = toChartData(initialValues.priority);

  const totalTasks = statusData.reduce((sum, item) => sum + item.value, 0);
  const doneTasks = initialValues.status["done"] || 0;
  const completionRate = totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Context & Live Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121216] border border-white/[0.06] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
            <span className="font-mono text-[10px] text-[#4edea3] uppercase tracking-wider font-semibold">
              Telemetry Live
            </span>
            <span className="text-[#71717A] text-[10px]">•</span>
            <span className="font-mono text-[10px] text-[#A1A1AA]">Real-time Sync</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sprint Velocity & Project Telemetry
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Engineering throughput, status pipeline flow & contributor capacity
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#18181B] hover:bg-[#202025] border border-white/[0.08] text-xs font-medium text-white transition-all shadow-sm self-start sm:self-auto"
        >
          <FileDown className="size-3.5 text-[#6366F1]" />
          <span>Export Dossier</span>
        </button>
      </div>

      {/* 2x2 Bento Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="relative overflow-hidden rounded-2xl bg-[#18181B] border border-white/[0.08] p-5 shadow-md group">
          <div className="flex items-center justify-between">
            <span className="font-label-micro text-[10px] text-[#A1A1AA]">Total Tasks</span>
            <div className="w-6 h-6 rounded-lg bg-[#2A2A2D] flex items-center justify-center text-[#c0c1ff]">
              <Layers className="size-3" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-white font-mono">{totalTasks}</div>
          </div>
          <span className="font-mono text-[11px] text-[#4edea3] font-medium">Pipeline active</span>
        </div>

        {/* Completion Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-[#18181B] border border-white/[0.08] p-5 shadow-md group">
          <div className="flex items-center justify-between">
            <span className="font-label-micro text-[10px] text-[#A1A1AA]">Completion Rate</span>
            <div className="w-6 h-6 rounded-lg bg-[#2A2A2D] flex items-center justify-center text-[#4edea3]">
              <CheckCircle2 className="size-3" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-white font-mono">{completionRate}%</div>
          </div>
          <span className="font-mono text-[11px] text-[#4edea3] font-medium">{doneTasks} resolved</span>
        </div>

        {/* Active Contributors */}
        <div className="relative overflow-hidden rounded-2xl bg-[#18181B] border border-white/[0.08] p-5 shadow-md group">
          <div className="flex items-center justify-between">
            <span className="font-label-micro text-[10px] text-[#A1A1AA]">Contributors</span>
            <div className="w-6 h-6 rounded-lg bg-[#2A2A2D] flex items-center justify-center text-[#8B5CF6]">
              <Users className="size-3" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-white font-mono">{workload.length}</div>
          </div>
          <span className="font-mono text-[11px] text-[#8B5CF6] font-medium">Active members</span>
        </div>

        {/* Average Cycle Time */}
        <div className="relative overflow-hidden rounded-2xl bg-[#18181B] border border-white/[0.08] p-5 shadow-md group">
          <div className="flex items-center justify-between">
            <span className="font-label-micro text-[10px] text-[#A1A1AA]">Avg Cycle Time</span>
            <div className="w-6 h-6 rounded-lg bg-[#2A2A2D] flex items-center justify-center text-[#F59E0B]">
              <Clock className="size-3" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-white font-mono">
              {workload.length > 0
                ? (
                    workload.reduce((sum, member) => sum + member.cycleTime, 0) /
                    workload.length
                  ).toFixed(1)
                : "0"}
              <span className="text-sm text-[#71717A] ml-1 font-sans font-normal">days</span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-[#F59E0B] font-medium">Turnaround pace</span>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Status Pipeline Donut Chart */}
        <div className="rounded-2xl bg-[#121216] border border-white/[0.06] p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#6366F1]" />
              <h2 className="text-sm font-semibold text-white">Task Status Pipeline</h2>
            </div>
            <span className="font-mono text-xs text-[#A1A1AA]">{totalTasks} tasks</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <div className="w-48 h-48 flex-shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[entry.name.toLowerCase()] || DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]}
                        stroke="#121216"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val} tasks`, "Volume"]}
                    contentStyle={{
                      backgroundColor: "#1F1F22",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#F4F4F5",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-white leading-none">
                  {totalTasks}
                </span>
                <span className="font-label-micro text-[9px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
                  Total
                </span>
              </div>
            </div>

            {/* Custom Legend Badges */}
            <div className="grid grid-cols-2 gap-2.5 w-full flex-1">
              {statusData.map((item, i) => {
                const color = STATUS_COLORS[item.name.toLowerCase()] || DEFAULT_CHART_COLORS[i % DEFAULT_CHART_COLORS.length];
                const pct = totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(0) : "0";
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#18181B] border border-white/[0.04]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs text-[#E4E1E6] truncate capitalize">{item.name}</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-white ml-2">
                      {item.value} <span className="text-[10px] text-[#71717A]">({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-2xl bg-[#121216] border border-white/[0.06] p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Priority Intensity</h2>
            </div>
            <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 border border-[#4edea3]/20 px-2 py-0.5 rounded-full">
              Optimal Spread
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {priorityData.map((item) => {
              const color = PRIORITY_COLORS[item.name.toLowerCase()] || "#64748B";
              const pct = totalTasks > 0 ? (item.value / totalTasks) * 100 : 0;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize font-medium text-[#E4E1E6] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      {item.name}
                    </span>
                    <span className="font-mono text-[#A1A1AA]">
                      {item.value} tasks ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#18181B] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Throughput Matrix */}
      <div className="rounded-2xl bg-[#121216] border border-white/[0.06] p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-base font-semibold text-white">Team Throughput Matrix</h2>
            <p className="text-xs text-[#A1A1AA]">Workload distribution across team members</p>
          </div>
          <span className="font-mono text-xs text-[#A1A1AA]">{workload.length} contributors</span>
        </div>

        <div className="space-y-3 pt-2">
          {workload.map((member, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#18181B] border border-white/[0.06] hover:border-white/[0.12] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 ring-1 ring-white/10">
                  <AvatarFallback className="bg-gradient-to-tr from-[#571bc1] to-[#6366F1] text-white text-xs font-medium">
                    {member.name ? member.name[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm truncate">{member.name}</span>
                    <span className="font-label-micro text-[9px] px-1.5 py-0.5 rounded bg-[#202025] text-[#c0c1ff]">
                      Contributor
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#71717A] truncate block max-w-xs">
                    {member.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between sm:justify-end">
                <div className="text-right">
                  <span className="font-mono text-xs font-semibold text-[#4edea3]">
                    {Number(member.percentage).toFixed(0)}% Flow
                  </span>
                  <div className="font-mono text-[11px] text-[#A1A1AA]">{member.tasks} tasks assigned</div>
                </div>

                <div className="w-24 sm:w-32 bg-[#202025] h-1.5 rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-500"
                    style={{ width: `${member.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;