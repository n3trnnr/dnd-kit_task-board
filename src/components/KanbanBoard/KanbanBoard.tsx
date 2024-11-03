import { useEffect, useMemo, useState } from "react";
import { IColumn, TId } from "./types";
import Column from "../Column/Column";
import Icons from "../UI/Icons";
import styles from './KanbanBoard.module.css'

import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null)
    // console.log('activeColumn', activeColumn);

    const sensors = useSensors(
        useSensor(PointerSensor, {//Решение проблемы с удалением доски
            activationConstraint: {
                distance: 3 // Расстояние на которое должна переместиться доска чтобы активироваться
            }
        })
    )

    useEffect(() => {
        const getStorage = localStorage.getItem('columns')
        if (getStorage) {
            const data = JSON.parse(getStorage) as IColumn[]
            setColumns([...data])
        }
    }, [])

    const columnsId = useMemo(() => {
        return columns.map((column) => column.id)
    }, [columns])
    // console.log('columnsId', columnsId);

    //Создание доски
    const handleCreateColumn = () => {
        const newColumn: IColumn = {
            id: columns.length + 1,
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

    //Получение и установка текушей доски для создания оверлея
    const onDragStart = (event: DragStartEvent) => {
        console.log('onDragStart', event);
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)
        }
    }

    //Получение текущей доски и конечной доски
    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        const activeIndex = columns.findIndex((column) => { return column.id === event.active.id })
        const overIndex = columns.findIndex((column) => { return column.id === event.over?.id })

        if (active.id === over?.id) {
            return;
        }

        setColumns(
            arrayMove(columns, activeIndex, overIndex)
        )
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

    return (
        <div className="
            w-full min-h-screen
            m-auto
            px-[40px]
            flex items-center gap-5
            overflow-x-auto overflow-y-hidden
            "
        >
            <div className="flex gap-x-5">
                {/*Контекст для работы dnd-kit*/}
                <DndContext
                    collisionDetection={closestCorners}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    sensors={sensors}
                >
                    {/*Контекст который предоставляет данные для useSortable*/}
                    <SortableContext items={columns}>
                        {Boolean(columns.length) && columns.map(column => (
                            <Column
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                deleteColumn={handleDeleteColumn}
                                changeTitle={handleChangeTitle}
                            />
                        ))}
                    </SortableContext>

                    {//createPortal - функция создает внепоточный реакт элемент встраиваемый в document.body
                        createPortal(<DragOverlay>
                            {/*Создани оверлея активной доки*/}
                            {activeColumn && <Column
                                key={activeColumn.id}
                                title={activeColumn.title}
                                id={activeColumn.id}
                                deleteColumn={handleDeleteColumn}
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
                    "
                >
                    <Icons iconName={'plus'} styles={`${styles['icon-plus']}`} /> Добавить доску
                </button>
            </div>

        </div>
    );
}

export default KanbanBoard;