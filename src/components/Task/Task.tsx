import Icons from "../UI/Icons";
import { ITaskProps } from "./Task.props";
import styles from './Task.module.css'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";


const Task = ({ task, deleteTask, changeTask }: ITaskProps) => {

    const [editMode, setEditMode] = useState(false)
    const [mouseIsOver, setMouseIsOver] = useState(false)

    const toogleEditMode = () => {
        setEditMode((prevState) => !prevState)
        setMouseIsOver((prevState) => !prevState)
    }

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task
        },
        disabled: editMode,//При редактировании заголовка доски, перетаскиевание становится не активным
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    useEffect(() => {
        if (isDragging) {
            setMouseIsOver(false)
        }
    }, [isDragging])

    //Редактирование карточки с задачей
    if (editMode) {
        return (
            <div
                ref={setNodeRef}

                className="
            relative 
            min-h-[150px] 
            rounded-lg 
            bg-main-bg-color
            hover:ring-2 hover: ring-inset hover:ring-sky-500
            p-5
            cursor-grab
            ">
                {<textarea
                    className="bg-main-bg-color focus: outline-none rounded-md font-normal px-2 resize-none h-full w-[90%] task"
                    value={task.content}
                    autoFocus
                    placeholder="Опишите задачу"
                    onChange={(event) => changeTask(task.columnId, event.target.value, task.id)}
                    onBlur={toogleEditMode}
                    onKeyDown={(event) => {
                        if (event.code === 'Enter' && event.shiftKey) return;
                        if (event.code === 'Enter') toogleEditMode();
                    }}
                />}
            </div>
        )
    }

    //Оверлей при перемещении задачи
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}

                className="
                min-h-[150px]
                max-h-[150px] 
                rounded-lg 
                bg-main-bg-color
                opacity-40
                ring-2 ring-inset ring-rose-500
            "/>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}

            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            onDoubleClick={() => {
                setMouseIsOver(false)
                toogleEditMode()
            }}

            className="
            relative 
            min-h-[150px]
            max-h-[150px] 
            p-5
            rounded-lg 
            bg-main-bg-color
            hover:ring-2 hover: ring-inset hover:ring-rose-500
            cursor-grab
            break-words
            ">
            <p className="my-auto h-full w-[90%] overflow-x-hidden overflow-y-auto whitespace-pre-wrap">
                {Boolean(task.content.trim().length) ? task.content : <span className="text-gray-500">Опишите задачу</span>}
            </p>

            {mouseIsOver && <button
                onClick={() => deleteTask(task.columnId, task.id)}
                className="absolute top-3 right-3 size-7 flex justify-center items-center
            ">
                <Icons iconName="trash" styles={styles['icon']} />
            </button>}
        </div>
    );
}

export default Task;