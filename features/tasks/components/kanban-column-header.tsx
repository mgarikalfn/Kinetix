import { SnakeCaseToTitleCase } from "@/lib/utils";
import { TaskStatus } from "../types";
import { Plus } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; dotColor: string; ping?: boolean }
> = {
  [TaskStatus.BACKLOG]: {
    label: "Backlog",
    dotColor: "bg-[#64748B]",
  },
  [TaskStatus.TODO]: {
    label: "Todo",
    dotColor: "bg-[#0284C7]",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    dotColor: "bg-[#F59E0B]",
    ping: true,
  },
  [TaskStatus.IN_REVIEW]: {
    label: "In Review",
    dotColor: "bg-[#8B5CF6]",
  },
  [TaskStatus.DONE]: {
    label: "Done",
    dotColor: "bg-[#10B981]",
  },
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  const config = statusConfig[board] || {
    label: SnakeCaseToTitleCase(board),
    dotColor: "bg-[#64748B]",
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1B1B1E] border border-white/[0.06] shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
          {config.ping && (
            <span
              className={`absolute w-3.5 h-3.5 rounded-full ${config.dotColor}/30 animate-ping`}
            />
          )}
        </div>
        <h2 className="font-headline-md text-sm font-medium text-[#F4F4F5]">
          {config.label}
        </h2>
        <span className="flex items-center justify-center px-2 h-5 rounded-full bg-[#2A2A2D] text-[#A1A1AA] font-mono text-[11px] font-medium">
          {taskCount}
        </span>
      </div>

      <button
        onClick={open}
        className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#202025] hover:bg-[#2A2A2D] text-[#A1A1AA] hover:text-white transition-colors"
        title="Add task to column"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
};