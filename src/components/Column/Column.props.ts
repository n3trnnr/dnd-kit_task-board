import { IColumn, ITask, TId } from './../KanbanBoard/types';

export interface IColumnProps {
    column: IColumn
    deleteColumn: (id: TId) => void,
    changeTitle: (title: string, id: TId) => void,
    createTask: (columnId: TId) => void
    tasks: ITask[],
    deleteTask: (id: TId) => void,
    changeTask: (content: string, id: TId) => void
}