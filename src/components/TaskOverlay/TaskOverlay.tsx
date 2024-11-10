import { ITaskOverlayProps } from "./TaskOverlay.props";

const TaskOverlay = ({ task }: ITaskOverlayProps) => {
    return (
        <div
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
            <p className="my-auto h-full w-[90%] overflow-x-hidden overflow-y-auto whitespace-pre-wrap">{Boolean(task.content.trim().length) ? task.content : <span className="text-gray-500">Опишите задачу</span>}</p>
        </div>
    );
}

export default TaskOverlay;