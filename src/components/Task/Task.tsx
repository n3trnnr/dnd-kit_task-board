import Icons from "../UI/Icons";
import { ITaskProps } from "./Task.props";
import styles from './Task.module.css'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";


const Task = ({ task, deleteTask }: ITaskProps) => {

    const [editMode, setEditMode] = useState(false)
    const toogleEditMode = () => {

    }

    // const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    //     id: task.id,
    //     data: {
    //         task: {
    //             id: task.id,
    //             content: task.content,
    //             columnId: task.columnId
    //         },
    //         type: 'Task'
    //     }
    // })

    // const style = {
    //     transition,
    //     transform: CSS.Transform.toString(transform)
    // }

    return (
        <div
            // style={style}
            // {...attributes}
            // {...listeners}
            // ref={setNodeRef}
            className="
            relative 
            min-h-[150px] 
            rounded-lg 
            bg-main-bg-color
            hover:ring-2
            hover: ring-inset
            hover:ring-rose-500
            p-5
            cursor-grab
            ">
            {task.content}
            <button
                onClick={() => deleteTask(task.id)}
                className="absolute top-3 right-3 size-7 flex justify-center items-center
            ">
                <Icons iconName="trash" styles={styles['icon']} />
            </button>
        </div>
    );
}

export default Task;