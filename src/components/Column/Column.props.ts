import { IColumn, TId } from './../KanbanBoard/types';
export interface IColumnProps extends IColumn {
    deleteColumn: (id: TId) => void
}