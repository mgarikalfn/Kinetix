"use client";

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Project } from "@/features/projects/types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { Task } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Plus, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col space-y-6 pb-12">
      <Analytics data={analytics} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <div className="xl:col-span-2">
          <MembersList data={members.documents} total={members.total} />
        </div>
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1 bg-[#121216] border border-white/[0.06] rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-white">Active Tasks</h2>
          <span className="flex items-center justify-center px-2 h-5 rounded-full bg-[#202025] text-[#A1A1AA] font-mono text-[11px]">
            {total}
          </span>
        </div>
        <button
          onClick={createTask}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#18181B] hover:bg-[#202025] border border-white/[0.08] text-[#A1A1AA] hover:text-white transition-all"
          title="Create Task"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <ul className="flex flex-col gap-y-2.5">
        {data.slice(0, 5).map((task) => (
          <li key={task.$id}>
            <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
              <div className="p-3.5 rounded-xl bg-[#18181B] border border-white/[0.06] hover:border-white/[0.14] hover:bg-[#1F1F22] transition-all space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-body-md font-medium text-white truncate">
                    {task.name}
                  </p>
                  <span className="font-mono text-[10px] text-[#c0c1ff] bg-[#2A2A2D] px-1.5 py-0.5 rounded flex-shrink-0">
                    ENG-{task.$id.slice(-3).toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#A1A1AA] pt-1">
                  <span className="truncate max-w-[150px] text-[11px] text-[#A1A1AA]">
                    {task.project?.name || "General"}
                  </span>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="size-3 text-[#71717A]" />
                      <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}

        {data.length === 0 && (
          <li className="text-xs text-[#71717A] text-center py-6">
            No active tasks found in this workspace.
          </li>
        )}
      </ul>

      {data.length > 0 && (
        <Link
          href={`/workspaces/${workspaceId}/tasks`}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#18181B] hover:bg-[#1F1F22] border border-white/[0.08] text-xs font-medium text-[#c0c1ff] hover:text-white transition-all mt-2"
        >
          <span>Show all {total} tasks</span>
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1 bg-[#121216] border border-white/[0.06] rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-white">Projects</h2>
          <span className="flex items-center justify-center px-2 h-5 rounded-full bg-[#202025] text-[#A1A1AA] font-mono text-[11px]">
            {total}
          </span>
        </div>
        <button
          onClick={createProject}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#18181B] hover:bg-[#202025] border border-white/[0.08] text-[#A1A1AA] hover:text-white transition-all"
          title="Create Project"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.map((project) => (
          <li key={project.$id}>
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
              <div className="p-3.5 rounded-xl bg-[#18181B] border border-white/[0.06] hover:border-white/[0.14] hover:bg-[#1F1F22] flex items-center gap-3 transition-all">
                <ProjectAvatar
                  className="size-10 rounded-xl"
                  fallbackClassName="text-base"
                  name={project.name}
                  image={project.imageUrl}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-body-md font-medium text-white truncate">
                    {project.name}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA] font-mono">View board</p>
                </div>
              </div>
            </Link>
          </li>
        ))}

        {data.length === 0 && (
          <li className="text-xs text-[#71717A] text-center py-6 col-span-2">
            No projects in this workspace yet.
          </li>
        )}
      </ul>
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
}

export const MembersList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 bg-[#121216] border border-white/[0.06] rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-white">Contributors & Team</h2>
          <span className="flex items-center justify-center px-2 h-5 rounded-full bg-[#202025] text-[#A1A1AA] font-mono text-[11px]">
            {total}
          </span>
        </div>
        <Link
          href={`/workspaces/${workspaceId}/members`}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#18181B] hover:bg-[#202025] border border-white/[0.08] text-[#A1A1AA] hover:text-white transition-all"
          title="Manage Members"
        >
          <Settings className="size-4" />
        </Link>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {data.map((member) => (
          <li key={member.$id}>
            <div className="p-3.5 rounded-xl bg-[#18181B] border border-white/[0.06] hover:border-white/[0.12] flex items-center gap-3 transition-all">
              <MemberAvatar
                className="size-9 rounded-full ring-1 ring-white/10"
                fallbackClassName="text-xs bg-[#2A2A2D] text-white"
                name={member.name}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {member.name}
                </p>
                <p className="text-[11px] text-[#A1A1AA] truncate font-mono">
                  {member.email}
                </p>
              </div>
            </div>
          </li>
        ))}

        {data.length === 0 && (
          <li className="text-xs text-[#71717A] text-center py-6 col-span-4">
            No team members found.
          </li>
        )}
      </ul>
    </div>
  );
};