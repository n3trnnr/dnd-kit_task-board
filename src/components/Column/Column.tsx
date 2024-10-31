import { IColumnProps } from "./Column.props";

const Column = ({ id, title, deleteColumn }: IColumnProps) => {
    return (
        <div className="
        w-[350px]
        h-[500px]
        max-h-[500px]
        flex justify-start items-center flex-col
        rounded-lg
        border-2
        border-board-bg-color
        ring-rose-500
        bg-board-bg-color
        hover:ring-2
        ">
            <div className="
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
                    size-5 
                    rounded-lg
                    flex justify-center items-center
                ">x</button>
            </div>

            <div className="flex flex-grow">Список задач</div>
            <div><span className="text-lg">+</span> Add task</div>
        </div>
    );
}

export default Column;