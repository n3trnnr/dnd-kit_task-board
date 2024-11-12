import { ITaskOverlayProps } from "./TaskOverlay.props";

const TaskOverlay = ({ task }: ITaskOverlayProps) => {
    return (
        <div
            className="
            relative 
            flex flex-col justify-between 
            min-h-[150px]
            max-h-[150px] 
            px-5 pt-5 pb-2
            rounded-lg 
            bg-main-bg-color
            hover:ring-2 hover: ring-inset hover:ring-rose-500
            cursor-grab
            break-words
            ">
            <p className="h-full w-[90%] overflow-x-hidden overflow-y-auto whitespace-pre-wrap">
                {Boolean(task.content.trim().length) ? task.content : <span className="text-gray-500">Опишите задачу</span>}
            </p>

            <div className="flex justify-between items-center text-gray-500 text-sm">
                <div>
                    {task.priority}
                </div>
                <div>
                    {task.creationDate}
                </div>
            </div>

        </div>
    );
}

export default TaskOverlay;