"use client";

import { Plus } from "lucide-react";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { RoleGuard } from "./role-guard";
import { useCurrent } from "@/features/auth/api/use-current";
import { MemberRole } from "@/features/members/types";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrent();
  const router = useRouter();
  const { data: workspaces } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();

  const onselect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="font-label-micro text-neutral-400">Workspace</p>
        <RoleGuard
          role={MemberRole.ADMIN}
          workspaceId={workspaceId}
          userId={user?.$id}
        >
          <button
            onClick={open}
            className="w-5 h-5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-all"
            title="Create Workspace"
          >
            <Plus className="size-3.5" />
          </button>
        </RoleGuard>
      </div>

      <Select onValueChange={onselect} value={workspaceId}>
        <SelectTrigger className="w-full bg-[#18181B] hover:bg-[#1F1F22] border border-white/[0.08] hover:border-white/[0.16] text-[#F4F4F5] rounded-xl h-10 px-3 transition-all focus:ring-1 focus:ring-[#6366F1]">
          <SelectValue placeholder="Select workspace" />
        </SelectTrigger>
        <SelectContent className="bg-[#1F1F22] border border-white/[0.1] text-[#F4F4F5] rounded-xl shadow-2xl">
          {workspaces?.documents.map((workspace) => (
            <SelectItem
              key={workspace.$id}
              value={workspace.$id}
              className="hover:bg-white/[0.08] focus:bg-white/[0.08] focus:text-white cursor-pointer rounded-lg my-0.5"
            >
              <div className="flex justify-start items-center gap-2.5 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                  className="size-6 rounded-md"
                />
                <span className="truncate text-body-md">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
