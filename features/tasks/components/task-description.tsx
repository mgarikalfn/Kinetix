import { Task } from "../types";
import { Pencil, X, FileText, Check } from "lucide-react";
import { useUpdateTask } from "../api/use-update-task";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description || "");
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="bg-[#121216] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-[#6366F1]" />
          <h3 className="font-headline-md text-sm font-medium text-white">
            Specification & Scope
          </h3>
        </div>

        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#E4E1E6] text-xs font-medium transition-colors"
        >
          {isEditing ? (
            <>
              <X className="size-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Pencil className="size-3.5" />
              <span>Edit Spec</span>
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-y-3">
          <Textarea
            placeholder="Write task specifications, acceptance criteria, or technical notes..."
            value={value}
            rows={5}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
            className="w-full bg-[#18181B] border border-white/[0.1] rounded-xl text-[#F4F4F5] placeholder:text-[#71717A] text-sm focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] resize-y"
          />
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-medium shadow-[0_0_12px_rgba(99,102,241,0.35)] hover:opacity-90 active:scale-95 transition-all ml-auto disabled:opacity-50"
          >
            <Check className="size-3.5" />
            <span>{isPending ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#18181B] border border-white/[0.06] text-body-md text-[#A1A1AA] leading-relaxed whitespace-pre-wrap font-sans">
          {task.description ? (
            task.description
          ) : (
            <span className="text-[#71717A] italic text-xs">
              No technical specification provided yet. Click "Edit Spec" to add requirements.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
