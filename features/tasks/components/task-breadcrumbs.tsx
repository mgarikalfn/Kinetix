import { Project } from "@/features/projects/types";
import { Task } from "../types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface TaskBreadCrumbsProps {
  project?: Project;
  task: Task;
}

export const TaskBreadCrumbs = ({ project, task }: TaskBreadCrumbsProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task?",
    "This action cannot be undone",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  const shortKey = `ENG-${task.$id.slice(-3).toUpperCase()}`;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#121216] border border-white/[0.06] rounded-2xl">
      <ConfirmDialog />
      <div className="flex items-center gap-2 min-w-0 text-xs">
        {project && (
          <>
            <ProjectAvatar
              name={project.name}
              image={project.imageUrl}
              className="size-5 rounded-md text-[10px]"
            />
            <Link
              href={`/workspaces/${workspaceId}/projects/${project.$id}`}
              className="text-[#A1A1AA] hover:text-white transition-colors truncate max-w-[120px]"
            >
              {project.name}
            </Link>
            <ChevronRight className="size-3.5 text-[#71717A] flex-shrink-0" />
          </>
        )}
        <span className="px-1.5 py-0.5 rounded bg-[#2A2A2D] font-mono text-[10px] text-[#c0c1ff] font-medium flex-shrink-0">
          {shortKey}
        </span>
        <ChevronRight className="size-3.5 text-[#71717A] flex-shrink-0" />
        <span className="font-medium text-white truncate max-w-[200px] sm:max-w-md">
          {task.name}
        </span>
      </div>

      <button
        onClick={handleDeleteTask}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-all ml-auto disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
        <span className="hidden sm:inline">Delete</span>
      </button>
    </div>
  );
};
