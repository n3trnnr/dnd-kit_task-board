import { useEffect, useMemo, useState } from "react";
import { IColumn, ITask, TId } from "./types";
import Column from "../Column/Column";
import Icons from "../UI/Icons";
import styles from './KanbanBoard.module.css'

import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Task from "../Task/Task";
import { idGenerator } from "../../helpers/idGenerator";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)

    const [tasks, setTasks] = useState<ITask[]>([])
    const [activeTask, setActiveTask] = useState<ITask | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {//Решение проблемы с удалением доски
            activationConstraint: {
                distance: 3, // Расстояние на которое должна переместиться доска чтобы активироваться,
            }
        })
    )

    // useEffect(() => {
    //     const getStorage = localStorage.getItem('columns')
    //     if (getStorage) {
    //         const data = JSON.parse(getStorage) as IColumn[]
    //         setColumns([...data])
    //     }
    // }, [])

    const columnsId = useMemo(() => {
        return columns.map((column) => {
            return column.id
        })
    }, [columns])

    //Создание доски
    const handleCreateColumn = () => {
        const newColumn: IColumn = {
            id: idGenerator(),
            title: `Доска ${columns.length + 1}`
        }
        setColumns([...columns, newColumn])
    }

    //Удаление доски
    const handleDeleteColumn = (id: TId) => {
        setColumns((columns) => {
            return columns.filter((column) => {
                return column.id !== id
            })
        })
    }

    //Получение и установка текушей доски и задачи для создания оверлея
    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Column') {
            setActiveTask(null)
            setActiveColumn(event.active.data.current.column)
        }

        if (event.active.data.current?.type === 'Task') {
            setActiveColumn(null)
            setActiveTask(event.active.data.current.task)
        }
    }

    //Получение текущей доски и конечной доски, фильтрация массива с досками
    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        console.log(event);

        if (!over) {
            return;
        }

        const activeId = active.id
        const overId = over.id

        if (active.id === over.id) {
            return;
        }

        setColumns((columns) => {
            const activeIndex = columns.findIndex((column) => { return column.id === activeId })
            const overIndex = columns.findIndex((column) => { return column.id === overId })
            return arrayMove(columns, activeIndex, overIndex)
        })
    }

    //Редактирование заголовка доски
    const handleChangeTitle = (title: string, id: TId) => {
        const editedColumnTitle = columns.map((column) => {
            if (column.id !== id) {
                return column
            }
            return { ...column, title: title }
        })
        setColumns(editedColumnTitle)
    }

    //Создание новой задачи
    const handleCreateTask = (columnId: TId) => {
        const newTask: ITask = {
            id: idGenerator(),
            columnId: columnId,
            content: `Задача ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask])
    }

    //Удаление задачи
    const handleDeleteTask = (id: TId) => {
        console.log(id);

        setTasks((tasks) => {
            return tasks.filter((task) => task.id !== id)
        })
    }

    //Редактирование описания задачи
    const handleChangeTask = (content: string, id: TId) => {
        const editedTask = tasks.map((task) => {
            if (task.id !== id) {
                return task
            }
            return { ...task, content: content }
        })
        setTasks(editedTask)
    }

    return (
        <div className="
            w-full min-h-screen
            m-auto
            px-[40px]
            flex items-center gap-5
            overflow-x-auto overflow-y-hidden
            ">
            <div className="flex gap-x-5">
                {/*Контекст для работы dnd-kit*/}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                >
                    {/*Контекст который предоставляет данные для useSortable*/}
                    <SortableContext items={columnsId}>
                        {Boolean(columns.length) && columns.map(column => (
                            <Column
                                key={column.id}
                                column={column}
                                deleteColumn={handleDeleteColumn}
                                changeTitle={handleChangeTitle}
                                createTask={handleCreateTask}
                                tasks={tasks.filter((task) => { return task.columnId === column.id })}
                                deleteTask={handleDeleteTask}
                                changeTask={handleChangeTask}
                            />
                        ))}
                    </SortableContext>

                    {//createPortal - функция создает внепоточный реакт элемент встраиваемый в document.body
                        createPortal(
                            <DragOverlay>
                                {/*Создани оверлея активной доски - доска с контентом а не заглушка!!!*/}
                                {activeColumn && <Column
                                    key={activeColumn.id}
                                    column={activeColumn}
                                    deleteColumn={handleDeleteColumn}
                                    changeTitle={handleChangeTitle}
                                    createTask={handleCreateTask}
                                    tasks={tasks.filter((task) => { return task.columnId === activeColumn.id })}
                                    deleteTask={handleDeleteTask}
                                    changeTask={handleChangeTask}
                                />}

                                {/*Создани оверлея активной задачи - задача с контентом а не заглушка!!!*/}
                                {activeTask && <Task
                                    key={activeTask.id}
                                    task={activeTask}
                                    deleteTask={handleDeleteTask}
                                    changeTask={handleChangeTask}
                                />}
                            </DragOverlay>,
                            document.body
                        )}

                </DndContext>
            </div>

            <div className="m-auto">
                <button
                    onClick={handleCreateColumn}
                    className="
                    h-[60px] w-[350px] min-w-[350px]
                    flex items-center justify-center gap-5
                    p-4
                    rounded-lg 
                    bg-main-bg-color
                    border-2 border-board-bg-color ring-rose-500
                    hover:ring-2
                    cursor-pointer
                    ">
                    <Icons iconName={'plus'} styles={`${styles['icon-plus']}`} /> Добавить доску
                </button>
            </div>

        </div>
    );
}

export default KanbanBoard;