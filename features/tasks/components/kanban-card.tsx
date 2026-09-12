import { MoreHorizontal, Calendar } from "lucide-react";
import { Task } from "../types";
import { TaskActions } from "./task-actions";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { format, isPast, isToday } from "date-fns";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  const workspaceId = useWorkspaceId();
  const shortKey = task.$id ? `ENG-${task.$id.slice(-3).toUpperCase()}` : "TASK";

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj ? isPast(dueDateObj) && !isToday(dueDateObj) : false;
  const isDueToday = dueDateObj ? isToday(dueDateObj) : false;

  return (
    <div className="group relative flex flex-col gap-2.5 p-3.5 rounded-xl bg-[#18181B] hover:bg-[#1F1F22] border border-white/[0.08] hover:border-white/[0.16] shadow-md transition-all duration-200 active:scale-[0.99] cursor-grab">
      {/* Top identifier row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="px-1.5 py-0.5 rounded bg-[#2A2A2D] font-mono text-[10px] text-[#c0c1ff] font-medium flex-shrink-0">
            {shortKey}
          </span>
          {task.project?.name && (
            <span className="px-2 py-0.5 rounded-full bg-[#202025] text-[#A1A1AA] font-label-micro text-[9px] uppercase truncate max-w-[110px]">
              {task.project.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <TaskActions id={task.$id} projectId={task.projectId}>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-6 h-6 rounded flex items-center justify-center text-[#71717A] hover:text-[#F4F4F5] hover:bg-white/[0.08] transition-colors"
            >
              <MoreHorizontal className="size-3.5" />
            </button>
          </TaskActions>
        </div>
      </div>

      {/* Task title with direct link to details */}
      <Link
        href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
        className="block"
      >
        <h3 className="text-body-md font-medium text-[#F4F4F5] hover:text-white leading-snug line-clamp-2 transition-colors">
          {task.name}
        </h3>
      </Link>

      {/* Card Metadata Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          {dueDateObj && (
            <div
              className={`flex items-center gap-1 font-mono text-[11px] ${
                isOverdue
                  ? "text-rose-400 font-medium"
                  : isDueToday
                  ? "text-amber-400 font-medium"
                  : "text-[#A1A1AA]"
              }`}
            >
              <Calendar className="size-3 flex-shrink-0" />
              <span>{format(dueDateObj, "MMM d")}</span>
            </div>
          )}
        </div>

        <div className="relative">
          <MemberAvatar
            name={task.assignee?.name || "Unassigned"}
            className="size-5 text-[10px]"
            fallbackClassName="text-[10px] bg-[#2A2A2D] text-white"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#4edea3] ring-1 ring-[#18181B]" />
        </div>
      </div>
    </div>
  );
};