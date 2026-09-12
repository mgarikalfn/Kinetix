"use client";

import Link from "next/link";
import { FileText, Pencil } from "lucide-react";

import { useGetProject } from "@/features/projects/api/use-get-project";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";
import { RoleGuard } from "@/components/role-guard";
import { MemberRole } from "@/features/members/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCurrent } from "@/features/auth/api/use-current";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrent();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingAnalytics || isLoadingProject;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }
  if (!user) {
    return <PageError message="User not authenticated" />;
  }

  return (
    <div className="flex flex-col gap-y-5 pb-10">
      {/* Project Top Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121216] border border-white/[0.06] shadow-sm">
        <div className="flex items-center gap-3">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-10 rounded-xl"
            fallbackClassName="text-base"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">{project.name}</h1>
            <p className="text-xs text-[#A1A1AA] font-mono">Project Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RoleGuard
            role={MemberRole.ADMIN}
            workspaceId={workspaceId}
            userId={user.$id}
          >
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#18181B] hover:bg-[#202025] border border-white/[0.08] text-xs font-medium text-[#A1A1AA] hover:text-white transition-all"
            >
              <Pencil className="size-3.5" />
              <span>Edit</span>
            </Link>
          </RoleGuard>

          <RoleGuard
            role={MemberRole.ADMIN}
            workspaceId={workspaceId}
            userId={user.$id}
          >
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/report`}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#18181B] hover:bg-[#202025] border border-white/[0.08] text-xs font-medium text-[#c0c1ff] hover:text-white transition-all"
            >
              <FileText className="size-3.5" />
              <span>Velocity Report</span>
            </Link>
          </RoleGuard>
        </div>
      </div>

      {analytics ? <Analytics data={analytics} /> : null}

      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectIdClient;
