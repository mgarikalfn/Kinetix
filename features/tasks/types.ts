import { Models } from "node-appwrite";
import { Project } from "../projects/types";

export enum TaskStatus {
    BACKLOG ="BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE="DONE",
}

export enum TaskPriority{
    HIGH="HIGH",
    MEDIUM="MEDIUM",
    LOW="LOW"
}

export enum TaskType{
    BUG = "BUG",
    USERSTORY="USERSTORY",
    TASK="TASK"
}

export type Task = Models.Document & {
    name:string;
    status:TaskStatus;
    assigneeId:string;
    projectId:string;
    position:number;
    dueDate:string;
    workspaceId:string;
    description?:string;

     project?: Project
    assignee?: {
    $id: string;
    name: string;
    email: string;
  };
}