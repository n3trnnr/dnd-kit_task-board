import { ITask, TId } from "../../types/types";

export interface ITaskProps {
    task: ITask,
    deleteTask: (columnId: TId, taskId: TId) => void,
    changeTask: (columnId: TId, content: string, id: TId) => void
}