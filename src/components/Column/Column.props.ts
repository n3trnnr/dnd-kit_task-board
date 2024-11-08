import { IColumn, ITask, TId } from '../../types/types';

export interface IColumnProps {
    column: IColumn
    deleteColumn: (id: TId) => void,
    changeTitle: (title: string, id: TId) => void,
    createTask: (columnId: TId) => void
    deleteTask: (columnId: TId, taskId: TId) => void,
    changeTask: (columnId: TId, content: string, id: TId) => void
}