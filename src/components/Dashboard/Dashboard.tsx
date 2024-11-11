import { IDashboard } from "./Dashboard.props";
// import styles from './Dashboard.module.css'

const Dashboard = ({ columns }: IDashboard) => {

    const tasksCount = () => {
        if (columns) {
            const count = columns.reduce((sum, item) => {
                return sum += item.tasks.length
            }, 0)
            return count
        }
        return 0
    }

    const completedTasks = () => {
        if (Boolean(columns.length)) {
            const complitingColumn = columns.find((column) => {
                return column.isCompleted === true
            })
            if (complitingColumn) {
                return complitingColumn.tasks.length
            }
        }
        return 0
    }

    const percentageCompletedTasks = () => {
        const percentage = Math.round((completedTasks() * 100) / tasksCount())
        if (Number.isNaN(percentage)) {
            return 0
        }
        return percentage.toString()
    }

    const percentageNotCompletedTasks = () => {
        const percentage = Math.round(((tasksCount() - completedTasks()) * 100) / tasksCount())
        if (Number.isNaN(percentage)) {
            return 0
        }
        return percentage.toString()
    }



    return (
        <div className="flex h-full justify-center items-center gap-x-[24px]">

            <div className="w-[350px] h-full rounded-lg bg-board-bg-color flex flex-col justify-between p-5 overflow-hidden">
                <div>
                    Колонки и задачи
                </div>
                <div className="  flex justify-start items-end gap-x-[21px] ">
                    {columns.map((column) => (
                        <div className='flex flex-col justify-center items-center' key={column.id}>
                            <div className={`w-3 rounded-t-sm rounded-b-sm ${column.isCompleted ? 'bg-sky-500' : 'bg-rose-500'}`} style={{ height: `${column.tasks.length * 6}px` }}></div>
                            {column.tasks.length}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-[350px] h-full p-5 rounded-lg bg-board-bg-color flex flex-col justify-between ">
                <div>
                    Прогресс
                </div>
                <div className=" flex justify-evenly items-center gap-2 ">
                    <span>{percentageNotCompletedTasks()}%</span>
                    <div className={`flex justify-end w-full h-3 rounded-sm ${tasksCount() === 0 ? 'bg-main-bg-color' : 'bg-rose-500'}`}>
                        <div className={`h-3 rounded-sm bg-sky-500`} style={{ width: `${percentageCompletedTasks()}%` }} />
                    </div>
                    <span>{percentageCompletedTasks()}%</span>
                </div>
            </div>


        </div>
    );
}

export default Dashboard;