import { useState } from "react";
import { Send, Bold, Code, Paperclip } from "lucide-react";
import { Task } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateComment } from "../api/use-create-comment";

interface CreateCommentFormProps {
  task: Task;
  onSuccess?: () => void;
}

const CreateCommentForm = ({ task, onSuccess }: CreateCommentFormProps) => {
  const [value, setValue] = useState("");
  const taskId = task.$id;
  const workspaceId = useWorkspaceId();
  const { mutate, isPending: isCreating } = useCreateComment();

  const handleSave = () => {
    if (!value.trim()) return;
    mutate(
      {
        json: { content: value, workspaceId: workspaceId },
        param: { taskId: taskId },
      },
      {
        onSuccess: () => {
          setValue("");
          onSuccess?.();
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="bg-[#0e0e11] border border-white/[0.08] rounded-xl p-3 space-y-2 shadow-md">
      <textarea
        placeholder="Write a comment or drag telemetry traces... (⌘ + Enter to send)"
        rows={3}
        className="w-full bg-transparent font-body-md text-body-md text-[#E4E1E6] placeholder:text-[#71717A] focus:outline-none resize-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isCreating}
      />

      <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
        <div className="flex items-center gap-1 text-[#A1A1AA]">
          <button
            type="button"
            className="w-7 h-7 rounded hover:bg-white/[0.06] flex items-center justify-center transition-colors text-xs"
            title="Bold"
          >
            <Bold className="size-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded hover:bg-white/[0.06] flex items-center justify-center transition-colors text-xs"
            title="Inline Code"
          >
            <Code className="size-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded hover:bg-white/[0.06] flex items-center justify-center transition-colors text-xs"
            title="Attach Spec"
          >
            <Paperclip className="size-3.5" />
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={isCreating || !value.trim()}
          className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-medium shadow-[0_0_12px_rgba(99,102,241,0.35)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{isCreating ? "Posting..." : "Send"}</span>
          <Send className="size-3" />
        </button>
      </div>
    </div>
  );
};

export default CreateCommentForm;