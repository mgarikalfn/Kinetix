import { Task, TaskStatus } from "../types";
import { Pencil, Calendar, User, Layers, CheckCircle2 } from "lucide-react";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { format, formatDistanceToNow } from "date-fns";
import { SnakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskOverviewProps {
  task: Task;
}

const statusColors: Record<TaskStatus, { text: string; bg: string; border: string }> = {
  [TaskStatus.BACKLOG]: { text: "text-[#908fa0]", bg: "bg-[#908fa0]/10", border: "border-[#908fa0]/20" },
  [TaskStatus.TODO]: { text: "text-[#0284C7]", bg: "bg-[#0284C7]/10", border: "border-[#0284C7]/20" },
  [TaskStatus.IN_PROGRESS]: { text: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/20" },
  [TaskStatus.IN_REVIEW]: { text: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", border: "border-[#8B5CF6]/20" },
  [TaskStatus.DONE]: { text: "text-[#10B981]", bg: "bg-[#10B981]/10", border: "border-[#10B981]/20" },
};

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const statusStyle = statusColors[task.status] || statusColors[TaskStatus.TODO];

  return (
    <div className="bg-[#121216] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="font-label-micro text-xs text-[#A1A1AA]">
          Properties & Telemetry
        </h2>
        <button
          onClick={() => open(task.$id)}
          className="flex items-center gap-1 text-xs font-medium text-[#c0c1ff] hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
        >
          <Pencil className="size-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Assignee */}
        <div className="bg-[#18181B] border border-white/[0.06] p-3 rounded-xl flex items-center gap-3">
          <div className="relative">
            <MemberAvatar
              name={task.assignee?.name || "Unassigned"}
              className="size-8"
              fallbackClassName="text-xs bg-[#2A2A2D] text-white"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#4edea3] ring-1 ring-[#18181B]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-micro text-[10px] text-[#A1A1AA]">Assignee</p>
            <p className="text-body-md font-medium text-white truncate">
              {task.assignee?.name || "Unassigned"}
            </p>
          </div>
        </div>

        {/* Due Date */}
        <div className="bg-[#18181B] border border-white/[0.06] p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#202025] flex items-center justify-center text-[#c0c1ff] flex-shrink-0">
            <Calendar className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-micro text-[10px] text-[#A1A1AA]">Due Date</p>
            <p className="text-body-md font-medium text-white truncate font-mono">
              {dueDateObj ? format(dueDateObj, "MMM d, yyyy") : "No due date"}
            </p>
            {dueDateObj && (
              <p className="font-label-micro text-[10px] text-[#4edea3] truncate">
                {formatDistanceToNow(dueDateObj, { addSuffix: true })}
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-[#18181B] border border-white/[0.06] p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#202025] flex items-center justify-center text-[#8B5CF6] flex-shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-micro text-[10px] text-[#A1A1AA]">Status</p>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 mt-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {SnakeCaseToTitleCase(task.status)}
            </span>
          </div>
        </div>

        {/* Project */}
        <div className="bg-[#18181B] border border-white/[0.06] p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#202025] flex items-center justify-center text-[#4edea3] flex-shrink-0">
            <Layers className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-micro text-[10px] text-[#A1A1AA]">Project Context</p>
            <p className="text-body-md font-medium text-white truncate">
              {task.project?.name || "General"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};