import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}

export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) => {
  const isUp = variant === "up";
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#18181B] border border-white/[0.08] hover:border-white/[0.16] p-4 flex flex-col justify-between shadow-md transition-all hover:bg-[#1F1F22] group min-w-[180px]">
      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#6366F1]/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between gap-2">
        <span className="font-label-micro text-[10px] text-[#A1A1AA] uppercase tracking-wider">
          {title}
        </span>
        <div className="w-6 h-6 rounded-lg bg-[#2A2A2D] flex items-center justify-center text-[#c0c1ff]">
          <TrendingUp className="size-3" />
        </div>
      </div>

      <div className="my-2">
        <div className="text-2xl font-bold text-white tracking-tight font-mono">
          {value}
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs">
        <span
          className={cn(
            "flex items-center font-mono font-medium text-[11px]",
            isUp ? "text-[#4edea3]" : "text-rose-400"
          )}
        >
          <Icon className="size-3 mr-0.5" />
          {isUp ? `+${increaseValue}` : `${increaseValue}`}
        </span>
        <span className="text-[#71717A] text-[10px]">trend</span>
      </div>
    </div>
  );
};