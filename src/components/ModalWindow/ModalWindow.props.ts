import { IFormData } from "../../types/types";

export interface IModalWindow {
    type: 'column' | 'task',
    createColumn: (formData: IFormData) => void,
    showModal: (show: boolean) => void
}