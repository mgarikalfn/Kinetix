"use client";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MoreVerticalIcon, Users, ShieldCheck, UserCircle } from "lucide-react";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/use-confirm";
import { RoleGuard } from "@/components/role-guard";
import { useCurrent } from "@/features/auth/api/use-current";
import { PageError } from "@/components/page-error";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrent();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );

  const { data } = useGetMembers({ workspaceId });

  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  if (!user) {
    return <PageError message="user not found" />;
  }

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const total = data?.documents.length ?? 0;

  return (
    <div className="w-full space-y-5">
      <ConfirmDialog />

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] rounded-lg"
        >
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4 mr-1.5" />
            Back
          </Link>
        </Button>
      </div>

      {/* Title card */}
      <div className="relative p-5 rounded-2xl bg-[#121216] border border-white/[0.06] overflow-hidden shadow-lg">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-[#6366F1]/15 via-[#8B5CF6]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-[#c0c1ff]">
              <Users className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Team Members</h1>
                <span className="px-2 py-0.5 rounded-full bg-[#202025] text-[#A1A1AA] font-mono text-[10px]">
                  {total}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA]">Manage access, roles & permissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members list */}
      <div className="rounded-2xl bg-[#121216] border border-white/[0.06] overflow-hidden shadow-md">
        {data?.documents.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <UserCircle className="size-10 text-[#3F3F46]" />
            <p className="text-sm text-[#71717A]">No members in this workspace yet.</p>
          </div>
        )}

        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors">
              {/* Avatar */}
              <MemberAvatar
                className="size-10 rounded-full ring-1 ring-white/10 flex-shrink-0"
                fallbackClassName="text-sm bg-gradient-to-tr from-[#571bc1] to-[#6366F1] text-white"
                name={member.name}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                  {member.role === MemberRole.ADMIN && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#571bc1]/30 text-[#c4abff] border border-[#571bc1]/40 font-mono text-[9px] uppercase font-semibold flex-shrink-0">
                      <ShieldCheck className="size-2.5" />
                      Admin
                    </span>
                  )}
                  {member.role === MemberRole.MEMBER && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#202025] text-[#A1A1AA] border border-white/[0.06] font-mono text-[9px] uppercase font-semibold flex-shrink-0">
                      Member
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#71717A] font-mono truncate">{member.email}</p>
              </div>

              {/* Actions dropdown (admin only) */}
              <RoleGuard
                role={[MemberRole.ADMIN]}
                workspaceId={workspaceId}
                userId={user.$id}
                fallback={null}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="w-8 h-8 rounded-lg bg-transparent hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] text-[#A1A1AA] hover:text-white transition-all flex-shrink-0"
                      variant="ghost"
                      size="icon"
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="bg-[#1F1F22] border border-white/[0.08] rounded-xl shadow-xl min-w-[180px]"
                  >
                    <DropdownMenuItem
                      className="text-xs text-[#E4E1E6] hover:bg-white/[0.06] rounded-lg cursor-pointer"
                      onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                      disabled={isUpdatingMember}
                    >
                      <ShieldCheck className="size-3.5 mr-2 text-[#c4abff]" />
                      Set as Administrator
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-xs text-[#E4E1E6] hover:bg-white/[0.06] rounded-lg cursor-pointer"
                      onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                      disabled={isUpdatingMember}
                    >
                      <UserCircle className="size-3.5 mr-2 text-[#A1A1AA]" />
                      Set as Member
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/[0.06]" />

                    <DropdownMenuItem
                      className="text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                      onClick={() => handleDeleteMember(member.$id)}
                      disabled={isDeletingMember}
                    >
                      Remove {member.name}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </RoleGuard>
            </div>

            {index < (data?.documents.length ?? 0) - 1 && (
              <div className="mx-5">
                <Separator className="bg-white/[0.04]" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
