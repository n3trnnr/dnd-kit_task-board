import Icons from "../UI/Icons";
import { IColumnProps } from "./Column.props";
import styles from './Column.module.css'
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import Task from "../Task/Task";

const Column = ({ column, deleteColumn, changeTitle, handleCurrentColumnId, deleteTask, changeTask, showModal }: IColumnProps) => {

    //Состояние для возможности отредактировать заголовок доски
    const [editMode, setEditMode] = useState(false)

    const tasksId = useMemo(() => {
        return column.tasks.map((task) => {
            return task.id
        })
    }, [column.tasks])


    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging //Если доска активная то возвращает true
    } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column
        },
        disabled: editMode,//При редактировании заголовка доски, перетаскиевание становится не активным,
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    //Возвращает оверлей без контента!!! Который на заднем фоне!!!
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
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
            "/>
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
                //Двойной клик для возможности отредактировать заголовок доски
                onDoubleClick={() => setEditMode(true)}

                {...attributes}
                {...listeners}

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
                cursor-default
                ">
                    <div className="size-3 rounded-full bg-green-500"></div>
                    <div className="flex justify-center items-center">{column.tasks.length}</div>

                    {/*Условие для редактирование заголовка и отображение заголовка*/}
                    {!editMode ? column.title :
                        <input
                            className="bg-board-bg-color focus: outline-rose-500 rounded-md outline-none font-normal px-2"
                            autoFocus
                            onChange={(event) => changeTitle(event.target.value, column.id)}
                            value={column.title}
                            onBlur={() => setEditMode(false)}
                            onKeyDown={(event) => {
                                if (event.code !== 'Enter') return;
                                setEditMode(false)
                            }}
                        />
                    }
                </h3>

                <button
                    onClick={() => deleteColumn(column.id)}
                    className="
                    size-7 
                    rounded-md
                    flex justify-center items-center
                    ">
                    <Icons iconName="trash" styles={`${styles['icon']}`} />
                </button>
            </div>

            <div className="flex flex-grow flex-col gap-5 overflow-x-hidden overflow-y-auto p-2 w-full">
                <SortableContext items={tasksId}>
                    {Boolean(column.tasks.length) && column.tasks.map((task) => (
                        <Task
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            changeTask={changeTask}
                        />
                    ))}
                </SortableContext>
            </div>

            <div
                onClick={() => {
                    handleCurrentColumnId(column.id)
                    showModal({ type: 'task', active: true })
                }}
                className="
                flex justify-center            
                w-full 
                p-3
                border-4 
                text-rose-500
                border-board-bg-color 
                rounded-b-lg rounded-t-none
                hover:bg-main-bg-color hover:text-white
                cursor-pointer
                ">
                <button className="flex justify-between items-center gap-x-2">
                    <Icons iconName={'plus'} styles={`${styles['icon-plus']}`} /> Добавить задачу
                </button>
            </div>

        </div>
    );
}

export default Column;