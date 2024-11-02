import Icons from "../UI/Icons";
import { IColumnProps } from "./Column.props";
import styles from './Column.module.css'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Column = ({ id, title, deleteColumn }: IColumnProps) => {

    const { attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging //Если доска активная то возвращает true
    } = useSortable({
        id,
        data: {
            column: {
                id: id,
                title: title
            },
            type: 'Column'
        }
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
        w-[350px]
        h-[500px]
        opacity-40
        max-h-[500px]
        flex justify-start items-center flex-col
        rounded-lg
        border-2
        border-rose-500
        bg-board-bg-color
        ">

            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
        w-[350px]
        h-[500px]
        max-h-[500px]
        flex justify-start items-center flex-col
        rounded-lg
        border-2
        border-board-bg-color
        bg-board-bg-color
        ">
            <div
                {...listeners}
                {...attributes}
                className="
            flex justify-between items-center
            h-[60px] w-full
            p-3
            border-4 border-board-bg-color 
            rounded-t-lg rounded-b-none
            bg-main-bg-color
            cursor-grab
            ">
                <h3 className="
            text-md font-bold
            flex justify-center items-center gap-x-3
            ">
                    <div className="
                flex justify-center items-center
            ">0</div>
                    {title}
                </h3>
                <button
                    onClick={() => deleteColumn(id)}
                    className="
                    size-7 
                    rounded-md
                    flex justify-center items-center
                    
                "><Icons iconName="trash" styles={`${styles['icon']}`} /></button>
            </div>

            <div className="flex flex-grow">Список задач</div>
            <div className="flex justify-between items-center gap-x-2 mb-5"><Icons iconName={'plus'} styles={`${styles['icon-plus']}`} /> Добавить задачу</div>
        </div>
    );
}

export default Column;