import { IColumn } from "../types/types";

export const summator = (columns: IColumn[]) => {
    if (Boolean(columns.length)) {
        const filtered = columns.filter((column) => {
            return !column.isCompleted
        })

        const sum = filtered.map((column) => {
            return column.tasks
        }).reduce((acc, item) => {
            item.forEach((task) => {
                if (task.priority === 'Низкий') {
                    acc.low += 1
                } else if (task.priority === 'Средний') {
                    acc.med += 1
                } else {
                    acc.high += 1
                }
            })

            return acc

        }, { low: 0, med: 0, high: 0 })

        return sum
    }

    return { low: 0, med: 0, high: 0 }
}