import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Task } from "../types";
import { MessageSquare, Heart, Trash2 } from "lucide-react";
import { useGetComments } from "@/features/comments/api/use-get-comments";
import { formatDistanceToNow } from "date-fns";
import { PageLoader } from "@/components/page-loader";
import { AppComment } from "@/features/comments/types";
import CreateCommentForm from "@/features/comments/components/create-comment-form";
import { useDeleteComment } from "@/features/comments/api/use-delete-comment";
import { useCurrent } from "@/features/auth/api/use-current";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleCommentLike } from "@/features/comments/api/use-toggle-like-comment";

interface TaskCommentProps {
  task: Task;
}

export const TaskComment = ({ task }: TaskCommentProps) => {
  const taskId = task.$id;
  const { data: comments = [], isPending } = useGetComments({ taskId });

  return (
    <div className="bg-[#121216] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-md col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-[#6366F1]" />
          <h3 className="font-headline-md text-sm font-medium text-white">
            Discussion Stream
          </h3>
        </div>
        <span className="font-mono text-xs text-[#A1A1AA]">
          {comments.length} {comments.length === 1 ? "update" : "updates"}
        </span>
      </div>

      {/* Docked Rich Composer */}
      <CreateCommentForm task={task} />

      {/* Comments Timeline */}
      {isPending ? (
        <PageLoader />
      ) : comments.length === 0 ? (
        <div className="p-6 text-center text-xs text-[#71717A] bg-[#18181B] rounded-xl border border-white/[0.04]">
          No comments yet. Start the discussion above.
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {comments.map((comment) => (
            <CommentItem key={comment.$id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: AppComment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { data: currentUser } = useCurrent();
  const toggleLike = useToggleCommentLike();
  const deleteComment = useDeleteComment();

  const [DeleteConfirm, confirmDelete] = useConfirm(
    "Delete Comment",
    "Are you sure you want to delete this comment? This action cannot be undone.",
    "destructive"
  );

  const canDelete = comment.authorId === currentUser?.$id;

  const handleLikeToggle = () => {
    toggleLike.mutate({ commentId: comment.$id });
  };

  const handleDeleteClick = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteComment.mutate({ param: { commentId: comment.$id } });
  };

  return (
    <>
      <DeleteConfirm />
      <div className="flex items-start gap-3 bg-[#18181B] border border-white/[0.06] hover:border-white/[0.12] p-3.5 rounded-xl transition-all">
        <div className="relative flex-shrink-0">
          <MemberAvatar
            name={comment.authorName || "Unknown"}
            className="size-8"
            fallbackClassName="text-xs bg-[#2A2A2D] text-white"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#4edea3] ring-1 ring-[#18181B]" />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-body-md font-medium text-white truncate">
                {comment.authorName || "Unknown"}
              </span>
              <span className="font-mono text-[11px] text-[#71717A]">
                {formatDistanceToNow(new Date(comment.$updatedAt), { addSuffix: true })}
              </span>
            </div>

            {canDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={deleteComment.isPending}
                className="w-6 h-6 rounded flex items-center justify-center text-[#71717A] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete comment"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>

          <p className="text-body-md text-[#E4E1E6] leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleLikeToggle}
              disabled={toggleLike.isPending}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#202025] hover:bg-[#2A2A2D] text-[#A1A1AA] hover:text-rose-400 transition-colors text-xs disabled:opacity-50"
            >
              <Heart className="size-3" />
              <span className="font-mono text-[11px]">Like</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};