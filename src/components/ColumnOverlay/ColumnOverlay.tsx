import TaskOverlay from "../TaskOverlay/TaskOverlay";
import Icons from "../UI/Icons";
import styles from './ColumnOverlay.module.css'
import { IColumnOverlayProps } from "./ColumnOverlay.props";

const ColumnOverlay = ({ column, tasks }: IColumnOverlayProps) => {
    return (
        <div
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
                    <div className="flex justify-center items-center">{tasks.length}</div>
                    {column.title}
                </h3>

                <button
                    className="
                size-7 
                rounded-md
                flex justify-center items-center
                ">
                    <Icons iconName="trash" styles={`${styles['icon']}`} />
                </button>
            </div>

            <div className="flex flex-grow flex-col gap-5 overflow-x-hidden overflow-y-auto p-2 w-full">
                {Boolean(tasks.length) && tasks.map((task) => (
                    <TaskOverlay
                        key={task.id}
                        task={task}
                    />
                ))}
            </div>

            <div
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

export default ColumnOverlay;