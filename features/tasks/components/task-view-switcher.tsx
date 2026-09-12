"use client";

import { Loader, Plus, LayoutGrid, Table, CalendarDays } from "lucide-react";
import { useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DataKanban } from "./data-kanban";
import { useCallback } from "react";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/use-bulk-update-task";
import { DataCalendar } from "./data-calendar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "kanban",
  });

  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();
  const paramProjectId = useProjectId();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    status,
    dueDate,
  });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({
        json: { tasks },
      });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full flex flex-col gap-y-4"
    >
      {/* View Switcher Bar & Live Telemetry Metrics */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121216] border border-white/[0.06] p-2.5 rounded-2xl shadow-sm">
        <TabsList className="bg-[#0e0e11] p-1 rounded-full border border-white/[0.06] h-10 w-fit">
          <TabsTrigger
            value="kanban"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium data-[state=active]:bg-[#571bc1] data-[state=active]:text-[#c4abff] text-[#A1A1AA] transition-all"
          >
            <LayoutGrid className="size-3.5" />
            <span>Kanban</span>
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium data-[state=active]:bg-[#571bc1] data-[state=active]:text-[#c4abff] text-[#A1A1AA] transition-all"
          >
            <Table className="size-3.5" />
            <span>Table</span>
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium data-[state=active]:bg-[#571bc1] data-[state=active]:text-[#c4abff] text-[#A1A1AA] transition-all"
          >
            <CalendarDays className="size-3.5" />
            <span>Calendar</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* Telemetry Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181B] border border-white/[0.06]">
            <div className="flex flex-col items-end">
              <span className="font-label-micro text-[9px] text-[#A1A1AA]">
                Telemetry
              </span>
              <span className="font-mono text-xs text-[#4edea3] font-medium">
                {tasks?.total ?? 0} active
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
          </div>

          {/* Kinetic Action Button */}
          <button
            onClick={open}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-medium shadow-[0_0_15px_rgba(99,102,241,0.35)] hover:shadow-[0_0_22px_rgba(128,131,255,0.6)] active:scale-95 transition-all"
          >
            <Plus className="size-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Stream */}
      <div className="p-3 bg-[#121216] border border-white/[0.06] rounded-2xl">
        <DataFilters hideProjectFilter={hideProjectFilter} />
      </div>

      {/* View Content */}
      {isLoadingTasks ? (
        <div className="w-full bg-[#121216] border border-white/[0.06] rounded-2xl h-[300px] flex flex-col items-center justify-center gap-2">
          <Loader className="size-6 animate-spin text-[#6366F1]" />
          <span className="text-xs text-[#A1A1AA] font-mono">Syncing task telemetry...</span>
        </div>
      ) : (
        <>
          <TabsContent value="table" className="mt-0">
            <div className="bg-[#121216] border border-white/[0.06] rounded-2xl p-4">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </div>
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            <DataKanban onChange={onKanbanChange} data={tasks?.documents ?? []} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-0 h-full pb-4">
            <div className="bg-[#121216] border border-white/[0.06] rounded-2xl p-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </div>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};