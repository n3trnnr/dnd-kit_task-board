import { useEffect, useMemo, useState } from "react";
import { IColumn, IFormData, ITask, TId } from "../../types/types";
import Column from "../Column/Column";
import Icons from "../UI/Icons";
import styles from './KanbanBoard.module.css'

import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { idGenerator } from "../../helpers/idGenerator";
import ColumnOverlay from "../ColumnOverlay/ColumnOverlay";
import TaskOverlay from "../TaskOverlay/TaskOverlay";
import { getStorage, setStorage } from "../../localStorage/localStorage";
import Dashboard from "../Dashboard/Dashboard";
import ModalWindow from "../ModalWindow/ModalWindow";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<IColumn[]>([])

    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)
    const [activeTask, setActiveTask] = useState<ITask | null>(null)

    const [isModal, setIsModal] = useState<{ type: 'column' | 'task' | null, active: boolean }>({ type: null, active: false })

    const [currentColumnId, setCurrentColumnId] = useState<TId | null>(null)

    const columnsId = useMemo(() => {
        return columns.map((column) => {
            return column.id
        })
    }, [columns])

    useEffect(() => {
        const data = getStorage('columns')
        if (data) {
            setColumns(data)
        }
    }, [])

    useEffect(() => {
        setStorage('columns', columns)
    }, [columns])

    const sensors = useSensors(
        useSensor(PointerSensor, {//Решение проблемы с удалением доски
            activationConstraint: {
                distance: 3, // Расстояние на которое должна переместиться доска чтобы активироваться,
            }
        })
    )

    //Поиск конкретной колонки или задачи
    const findItem = (id: TId, type: 'Column' | 'Task') => {
        if (type = 'Column') {
            return columns.find((column) => { return column.id === id })
        }

        if (type === 'Task') {
            return columns.find((column) => {
                return column.tasks.find((task) => { return task.id === id })
            })
        }
    }

    //Поиск конкретного индекса колонки или задачи
    const findIndex = (arr: IColumn[] | ITask[], id: TId) => {
        return arr.findIndex((item) => {
            return item.id === id
        })
    }

    //Получение и установка текушей доски или задачи для создания оверлея
    const onDragStart = (event: DragStartEvent) => {
        setActiveColumn(null)
        setActiveTask(null)
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)
        }

        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task)
        }
    }

    //Получение текущей доски и конечной доски, фильтрация массива с досками
    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            return;
        }

        if (active.data.current?.type === 'Task') {
            return;
        }

        const activeId = active.id
        const overId = over.id

        if (active.id === over.id) {
            return;
        }


        setColumns((columns) => {
            const activeIndex = findIndex(columns, activeId)
            const overIndex = findIndex(columns, overId)
            return arrayMove(columns, activeIndex, overIndex)
        })
    }

    //Реализация перемещения задач из одной доски в другую и в рамках одной доски
    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) {
            return;
        };

        const activeId = active.id
        const overId = over.id

        const isActiveTask = active.data.current?.type === 'Task'
        const isOverTask = over.data.current?.type === 'Task'

        if (active.id === over.id) {
            return;
        };

        //Исключает ошибку если перетаскивать доску а не задачу
        if (!isActiveTask) {
            return;
        }

        //Перемещение задачи в рамках одной доски
        if (isActiveTask === isOverTask && active.data.current?.task.columnId === over.data.current?.task.columnId) {
            const updatedColumn = [...columns]
            const activeColumn = findItem(active.data.current?.task.columnId, 'Column')

            if (activeColumn) {
                const activeColumnIndex = findIndex(updatedColumn, activeColumn.id)
                const activeIndex = findIndex(activeColumn.tasks, activeId)
                const overIndex = findIndex(activeColumn.tasks, overId)

                updatedColumn[activeColumnIndex].tasks = arrayMove(activeColumn.tasks, activeIndex, overIndex)

                setColumns(updatedColumn)
            }
        }

        //Перенос задачи в другую доску поверх другой задачи
        if (isActiveTask && isOverTask && active.data.current?.task.columnId !== over.data.current?.task.columnId) {
            const updatedColumns = [...columns]
            const activeColumn = findItem(active.data.current?.task.columnId, 'Column')
            const overColumn = findItem(over.data.current?.task.columnId, 'Column')

            if (activeColumn && overColumn) {
                const activeColumnIndex = findIndex(updatedColumns, activeColumn.id)
                const overColumnIndex = findIndex(updatedColumns, overColumn.id)

                const activeTaskIndex = findIndex(activeColumn.tasks, activeId)
                const overTaskIndex = findIndex(overColumn.tasks, overId)

                const [removedTask] = updatedColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1)
                removedTask.columnId = overColumn.id

                updatedColumns[overColumnIndex].tasks.splice(overTaskIndex, 0, removedTask)

                setColumns(updatedColumns)
            }
        }

        //Перенос задачи поверх доски или в пустую доску
        const isOverColumn = over.data.current?.type === 'Column'
        if (isActiveTask && isOverColumn && active.data.current?.task.columnId !== overId) {
            const updatedColumns = [...columns]
            const activeColumn = findItem(active.data.current?.task.columnId, 'Column')
            const overColumn = findItem(overId, 'Column')

            if (activeColumn && overColumn) {
                const activeColumnIndex = findIndex(updatedColumns, activeColumn.id)
                const overColumnIndex = findIndex(updatedColumns, overColumn.id)

                const activeTaskIndex = findIndex(activeColumn.tasks, activeId)

                const [removedTask] = updatedColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1)
                removedTask.columnId = overColumn.id

                updatedColumns[overColumnIndex].tasks.push(removedTask)

                setColumns(updatedColumns)
            }
        }
    }

    //Создание доски
    const handleCreateColumn = (formData: IFormData) => {

        const newColumn: IColumn = {
            id: idGenerator(),
            title: formData.description,
            tasks: [],
        }

        if (formData.isCompleted && typeof formData.isCompleted === 'boolean') {
            newColumn.isCompleted = formData.isCompleted
        }

        if (columns.length < 10) {
            setColumns([...columns, newColumn])
        }
    }

    //Удаление доски
    const handleDeleteColumn = (id: TId) => {
        setColumns((columns) => {
            return columns.filter((column) => {
                return column.id !== id
            })
        })

        // const newTask = tasks.filter((task) => task.columnId !== id)
        // setTasks(newTask)
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

    //Получение id колонки для создания новой задачи
    const handleCurrentColumnId = (columnsId: TId) => {
        if (columnsId) {
            setCurrentColumnId(columnsId)
        }
    }

    //Установка доски для завершенных колонок
    const setComplitingColumn = (columnId: TId) => {
        const updatedColumn = [...columns]

        if (columnId) {
            const complitingColumn = updatedColumn.find((column) => {
                return column.id === columnId
            })

            if (complitingColumn) {

                updatedColumn.forEach((column) => {
                    if ('isCompleted' in column) {
                        column.isCompleted = false
                    }
                })

                complitingColumn.isCompleted = true
            }
            setColumns(updatedColumn)
        }
    }

    //Создание новой задачи
    const handleCreateTask = (formData: IFormData) => {

        if (currentColumnId && formData.priority) {
            const newTask: ITask = {
                id: idGenerator(),
                columnId: currentColumnId,
                content: formData.description,
                priority: formData.priority,
                creationDate: new Date().toLocaleDateString()
            }
            setColumns((columns) => {
                return columns.map((column) => {
                    if (column.id !== currentColumnId) {
                        return column;
                    };
                    column.tasks.push(newTask)
                    return column
                })
            })
        }
    }

    //Удаление задачи
    const handleDeleteTask = (columnId: TId, taskId: TId) => {
        setColumns((columns) => {
            return columns.map((column) => {
                if (column.id !== columnId) {
                    return column
                }
                return {
                    ...column, tasks: column.tasks.filter((task) => {
                        return task.id !== taskId
                    })
                }
            })
        })
    }

    //Редактирование описания задачи
    const handleChangeTask = (columnId: TId, content: string, id: TId) => {
        setColumns((columns) => {
            return columns.map((column) => {
                if (column.id !== columnId) {
                    return column;
                }

                const editedTask = column.tasks.map((task) => {
                    if (task.id !== id) {
                        return task
                    }
                    return { ...task, content: content }
                })

                return { ...column, tasks: editedTask }
            })
        })
    }

    return (
        <>
            {isModal.active && <ModalWindow
                createColumn={handleCreateColumn}
                createTask={handleCreateTask}
                showModal={setIsModal}
                isModal={isModal}
            />}

            <div className={isModal.active ? `${styles['main-container__blur']}` : `${styles['main-container']}`}>

                <div className={`${columns.length > 0 ? 'flex justify-between items-start my-auto h-[150px]' : 'flex flex-col m-auto gap-10'}`}>
                    {Boolean(columns.length) && <Dashboard columns={columns} />}

                    <button
                        onClick={() => setIsModal({ type: "column", active: true })}
                        className={`${columns.length > 0 ? styles['button'] : styles['button-animation']}`}>
                        <Icons iconName={'plus'} styles={`${styles['icon-plus']}`} /> Добавить колонку
                    </button>
                </div>

                {Boolean(columns.length) && <div className="flex my-auto overflow-y-auto">
                    {/*Контекст для работы dnd-kit*/}
                    <DndContext
                        sensors={sensors}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                        collisionDetection={closestCorners}
                    >
                        <div className="flex gap-x-[24px] mb-[10px]">
                            {/*Контекст который предоставляет данные для useSortable*/}
                            <SortableContext items={columnsId}>
                                {Boolean(columns.length) && columns.map(column => (
                                    <Column
                                        key={column.id}
                                        column={column}
                                        deleteColumn={handleDeleteColumn}
                                        changeTitle={handleChangeTitle}
                                        handleCurrentColumnId={handleCurrentColumnId}
                                        deleteTask={handleDeleteTask}
                                        changeTask={handleChangeTask}
                                        showModal={setIsModal}
                                        setComplitingColumn={setComplitingColumn}
                                    />
                                ))}
                            </SortableContext>

                            {//createPortal - функция создает внепоточный реакт элемент встраиваемый в document.body
                                createPortal(
                                    <DragOverlay>
                                        {/*Создани оверлея активной доски - доска с контентом а не заглушка!!!*/}
                                        {activeColumn &&
                                            <ColumnOverlay
                                                key={activeColumn.id}
                                                column={activeColumn}
                                                tasks={activeColumn.tasks.filter((task) => { return task.columnId === activeColumn.id })}
                                            />
                                        }

                                        {/*Создани оверлея активной задачи - задача с контентом а не заглушка!!!*/}
                                        {activeTask && <TaskOverlay key={activeTask.id} task={activeTask} />}
                                    </DragOverlay>,
                                    document.body
                                )}
                        </div>
                    </DndContext>
                </div>}

            </div>
        </>
    );
}

export default KanbanBoard;