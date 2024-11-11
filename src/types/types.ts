import { UniqueIdentifier } from "@dnd-kit/core"

export type TId = UniqueIdentifier

export interface IColumn {
    id: TId,
    title: string,
    tasks: ITask[],
    isCompleted?: boolean
}

export interface ITask {
    id: TId,
    columnId: TId,
    content: string,
}

export interface IFormData {
    description: string,
    isCompleted?: string | boolean
}