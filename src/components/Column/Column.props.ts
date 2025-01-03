import { IColumn, TId } from '../../types/types';

export interface IColumnProps {
    column: IColumn,
    isCompleted?: boolean
    deleteColumn: (id: TId) => void,
    changeTitle: (title: string, id: TId) => void,
    handleCurrentColumnId: (columnId: TId) => void
    deleteTask: (columnId: TId, taskId: TId) => void,
    changeTask: (columnId: TId, content: string, id: TId) => void,
    showModal: ({ type, active }: { type: 'column' | 'task' | null, active: boolean }) => void,
    setComplitingColumn: (columnId: TId) => void
}