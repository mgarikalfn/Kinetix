import { AnalyticsCard } from "./analytics-card";

export interface AnalyticsProps {
  data: {
    taskCount: number;
    taskDifference: number;
    assignedTaskCount: number;
    assignedTaskDifference: number;
    completedTaskCount: number;
    completedTaskDifference: number;
    incompleteTaskCount: number;
    incompleteTaskDifference: number;
    overdueTaskCount: number;
    overdueTaskDifference: number;
  };
}

export const Analytics = ({ data }: AnalyticsProps) => {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <AnalyticsCard
        title="Total Tasks"
        value={data.taskCount}
        variant={data.taskDifference >= 0 ? "up" : "down"}
        increaseValue={data.taskDifference}
      />
      <AnalyticsCard
        title="Assigned"
        value={data.assignedTaskCount}
        variant={data.assignedTaskDifference >= 0 ? "up" : "down"}
        increaseValue={data.assignedTaskDifference}
      />
      <AnalyticsCard
        title="Completed"
        value={data.completedTaskCount}
        variant={data.completedTaskDifference >= 0 ? "up" : "down"}
        increaseValue={data.completedTaskDifference}
      />
      <AnalyticsCard
        title="Overdue"
        value={data.overdueTaskCount}
        variant={data.overdueTaskDifference > 0 ? "down" : "up"}
        increaseValue={data.overdueTaskDifference}
      />
      <AnalyticsCard
        title="Incomplete"
        value={data.incompleteTaskCount}
        variant={data.incompleteTaskDifference > 0 ? "down" : "up"}
        increaseValue={data.incompleteTaskDifference}
      />
    </div>
  );
};