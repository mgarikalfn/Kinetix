"use client";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { RoleGuard } from "./role-guard";
import { MemberRole } from "@/features/members/types";
import { useCurrent } from "@/features/auth/api/use-current";

const Projects = () => {
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });
  const { data: user } = useCurrent();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="font-label-micro text-neutral-400">Projects</p>
        <RoleGuard
          role={MemberRole.ADMIN}
          workspaceId={workspaceId}
          userId={user?.$id}
        >
          <button
            onClick={open}
            className="w-5 h-5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all"
            title="Create Project"
          >
            <Plus className="size-3.5" />
          </button>
        </RoleGuard>
      </div>

      <div className="flex flex-col gap-y-1">
        {data?.documents.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;

          return (
            <Link href={href} key={project.$id}>
              <div
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-md transition-all text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-white/[0.04]",
                  isActive && "bg-[#1F1F22] text-white shadow-sm border-l-2 border-[#8B5CF6]"
                )}
              >
                <ProjectAvatar
                  image={project.imageUrl}
                  name={project.name}
                  className="size-5 rounded-md text-[10px]"
                />
                <span className="truncate font-medium">{project.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;