import { UniqueIdentifier } from "@dnd-kit/core"

export type TId = UniqueIdentifier

export interface IColumn {
    id: TId,
    title: string,
    tasks: ITask[]
}

export interface ITask {
    id: TId,
    columnId: TId,
    content: string,
}