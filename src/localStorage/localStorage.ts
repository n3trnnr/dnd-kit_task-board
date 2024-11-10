import { IColumn } from "../types/types"

export const setStorage = (key: 'columns', data: IColumn[]) => {
    if (key && data) {
        localStorage.setItem(key, JSON.stringify(data))
    }
}

export const getStorage = (key: 'columns') => {
    const rawData = localStorage.getItem(key)
    if (rawData) {
        const data = JSON.parse(rawData) as IColumn[]
        return data
    }
    return;
}