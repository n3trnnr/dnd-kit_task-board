import { IFormData } from "../../types/types";

export interface IModalWindow {
    createColumn: (formData: IFormData) => void,
    createTask: (formData: IFormData) => void,
    showModal: ({ type, active }: { type: 'column' | 'task' | null, active: boolean }) => void,
    isModal: { type: 'column' | 'task' | null, active: boolean }
}