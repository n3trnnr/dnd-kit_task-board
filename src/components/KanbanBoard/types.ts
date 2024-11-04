export type TId = number | string

export interface IColumn {
    id: TId,
    title: string
}

export interface ITask {
    id: TId,
    columnId: TId,
    content: string,
}