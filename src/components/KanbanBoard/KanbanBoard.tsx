import { useState } from "react";
import { IColumn, TId } from "./types";
import Column from "../Column/Column";

const KanbanBoard = () => {
    const [columns, setColumns] = useState<IColumn[]>([])
    // console.log('columns - ', columns);


    const handleCreateColumn = () => {
        const newColumn: IColumn = {
            id: columns.length + 1,
            title: `Column ${columns.length + 1}`
        }

        setColumns([...columns, newColumn])
    }

    const handleDeleteColumn = (id: TId) => {
        setColumns((columns) => {
            return columns.filter((column) => {
                return column.id !== id
            })
        })
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

            {Boolean(columns.length) && columns.map(column => (
                <Column
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    deleteColumn={handleDeleteColumn}
                />
            ))}

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
                    <span className="text-lg">+</span> Add board
                </button>
            </div>

        </div>
    );
}

export default KanbanBoard;