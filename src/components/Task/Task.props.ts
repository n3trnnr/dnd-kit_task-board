import { ITask, TId } from "../KanbanBoard/types";

export interface ITaskProps {
    task: ITask,
    deleteTask: (id: TId) => void,
    changeTask: (content: string, id: TId) => void
}