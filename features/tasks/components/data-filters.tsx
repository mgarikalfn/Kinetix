import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DatePicker } from "@/components/ui/date-picker";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full sm:w-auto h-9 px-3 rounded-xl bg-[#18181B] border border-white/[0.08] hover:border-white/[0.16] text-[#F4F4F5] text-xs transition-colors">
          <div className="flex items-center gap-2">
            <ListCheckIcon className="size-3.5 text-[#6366F1]" />
            <SelectValue placeholder="Status: All" />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-[#1F1F22] border border-white/[0.1] text-[#F4F4F5] rounded-xl shadow-2xl">
          <SelectItem value="all" className="hover:bg-white/[0.06] rounded-lg">All Statuses</SelectItem>
          <SelectSeparator className="bg-white/[0.08]" />
          <SelectItem value={TaskStatus.BACKLOG} className="hover:bg-white/[0.06] rounded-lg">Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO} className="hover:bg-white/[0.06] rounded-lg">Todo</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS} className="hover:bg-white/[0.06] rounded-lg">In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW} className="hover:bg-white/[0.06] rounded-lg">In Review</SelectItem>
          <SelectItem value={TaskStatus.DONE} className="hover:bg-white/[0.06] rounded-lg">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full sm:w-auto h-9 px-3 rounded-xl bg-[#18181B] border border-white/[0.08] hover:border-white/[0.16] text-[#F4F4F5] text-xs transition-colors">
          <div className="flex items-center gap-2">
            <UserIcon className="size-3.5 text-[#8B5CF6]" />
            <SelectValue placeholder="Assignee: All" />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-[#1F1F22] border border-white/[0.1] text-[#F4F4F5] rounded-xl shadow-2xl">
          <SelectItem value="all" className="hover:bg-white/[0.06] rounded-lg">All Assignees</SelectItem>
          <SelectSeparator className="bg-white/[0.08]" />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value} className="hover:bg-white/[0.06] rounded-lg">
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="w-full sm:w-auto h-9 px-3 rounded-xl bg-[#18181B] border border-white/[0.08] hover:border-white/[0.16] text-[#F4F4F5] text-xs transition-colors">
            <div className="flex items-center gap-2">
              <FolderIcon className="size-3.5 text-[#4edea3]" />
              <SelectValue placeholder="Project: All" />
            </div>
          </SelectTrigger>

          <SelectContent className="bg-[#1F1F22] border border-white/[0.1] text-[#F4F4F5] rounded-xl shadow-2xl">
            <SelectItem value="all" className="hover:bg-white/[0.06] rounded-lg">All Projects</SelectItem>
            <SelectSeparator className="bg-white/[0.08]" />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value} className="hover:bg-white/[0.06] rounded-lg">
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Filter Due Date"
        className="h-9 w-full sm:w-auto rounded-xl bg-[#18181B] border border-white/[0.08] hover:border-white/[0.16] text-[#F4F4F5] text-xs"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
