"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schemas";
import z from "zod";
import { useRef } from "react";

import { Avatar } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CopyIcon,
  ImageIcon,
  Settings,
  Link2,
  Trash2,
  RotateCcw,
  Save,
} from "lucide-react";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace.ts";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite.code";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const { mutate, isPending } = useUpdateWorkspace();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone",
    "destructive"
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate the current invite code",
    "destructive"
  );

  const router = useRouter();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {},
      }
    );
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate({
      form: finalValues,
      param: { workspaceId: initialValues.$id },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied"));
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      <DeleteDialog />
      <ResetDialog />

      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={
            onCancel
              ? onCancel
              : () => router.push(`/workspaces/${initialValues.$id}`)
          }
          className="text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] rounded-lg"
        >
          <ArrowLeft className="size-4 mr-1.5" />
          Back
        </Button>
      </div>

      {/* Header banner */}
      <div className="relative p-5 rounded-2xl bg-[#121216] border border-white/[0.06] overflow-hidden shadow-lg">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-[#6366F1]/15 via-[#8B5CF6]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-[#c0c1ff]">
            <Settings className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {initialValues.name}
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Configuration & workspace preferences
            </p>
          </div>
        </div>
      </div>

      {/* General Settings Card */}
      <div className="rounded-2xl bg-[#121216] border border-white/[0.06] shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">General</h2>
          <p className="text-xs text-[#71717A]">Update workspace name and icon</p>
        </div>
        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                      Workspace Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter workspace name"
                        className="bg-[#18181B] border-white/[0.08] text-white placeholder:text-[#71717A] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] rounded-xl h-10 text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Image field */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
                      Workspace Icon
                    </label>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#18181B] border border-white/[0.06]">
                      {field.value ? (
                        <div className="size-14 relative rounded-xl overflow-hidden border border-white/[0.08] flex-shrink-0">
                          <img
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt="workspace icon"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-14 rounded-xl bg-[#202025] border border-white/[0.08] flex-shrink-0">
                          <AvatarFallback className="flex items-center justify-center bg-transparent">
                            <ImageIcon className="size-6 text-[#71717A]" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-[#E4E1E6] font-medium">
                          {field.value ? "Change icon" : "Upload an icon"}
                        </p>
                        <p className="text-xs text-[#71717A]">
                          JPG, PNG, SVG or JPEG · max 1 MB
                        </p>
                        <input
                          className="hidden"
                          type="file"
                          accept=".jpg,.png,.jpeg,.svg"
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImageChange}
                        />
                        <div className="flex gap-2 mt-1">
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-3 text-xs rounded-lg bg-[#2A2A2D] hover:bg-[#353438] text-[#E4E1E6] border border-white/[0.08]"
                            onClick={() => inputRef.current?.click()}
                          >
                            {field.value ? "Change" : "Upload"}
                          </Button>
                          {field.value && (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="ghost"
                              size="sm"
                              className="h-7 px-3 text-xs rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />

              {/* Save button */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-9 px-5 rounded-xl bg-[#6366F1] hover:bg-[#5254cc] text-white text-sm font-medium transition-all"
                >
                  <Save className="size-3.5 mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Invite Link Card */}
      <div className="rounded-2xl bg-[#121216] border border-white/[0.06] shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Link2 className="size-4 text-[#6366F1]" />
            <h2 className="text-sm font-semibold text-white">Invite Link</h2>
          </div>
          <p className="text-xs text-[#71717A] mt-0.5">
            Share this link to invite members to your workspace
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={fullInviteLink}
              className="flex-1 h-10 px-3 rounded-xl bg-[#18181B] border border-white/[0.08] text-[#A1A1AA] font-mono text-xs focus:outline-none select-all"
            />
            <Button
              type="button"
              onClick={handleCopyInviteLink}
              className="h-10 px-3.5 rounded-xl bg-[#18181B] hover:bg-[#202025] border border-white/[0.08] text-[#A1A1AA] hover:text-white transition-all flex-shrink-0"
              variant="ghost"
            >
              <CopyIcon className="size-4" />
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              type="button"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
              className="h-8 px-3 text-xs rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all"
            >
              <RotateCcw className="size-3 mr-1.5" />
              Reset invite link
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="rounded-2xl bg-[#121216] border border-rose-500/20 shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-rose-500/20">
          <div className="flex items-center gap-2">
            <Trash2 className="size-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-rose-400">Danger Zone</h2>
          </div>
          <p className="text-xs text-[#71717A] mt-0.5">
            Deleting a workspace is irreversible and will remove all associated data
          </p>
        </div>
        <div className="p-5 flex justify-end">
          <Button
            size="sm"
            type="button"
            disabled={isPending || isDeletingWorkspace}
            onClick={handleDelete}
            className="h-8 px-4 text-xs rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
            variant="ghost"
          >
            <Trash2 className="size-3 mr-1.5" />
            Delete Workspace
          </Button>
        </div>
      </div>
    </div>
  );
};
