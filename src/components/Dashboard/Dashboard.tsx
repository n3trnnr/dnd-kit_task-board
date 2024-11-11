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
    }

    return (
        <div className="flex h-full justify-center items-center gap-x-5">

            <div className="w-[350px] h-full rounded-lg bg-main-bg-color flex justify-start items-end gap-x-[21px] p-5 overflow-hidden">
                {columns.map((column) => (
                    <div className='flex flex-col justify-center items-center' key={column.id}>
                        <div className='w-3 rounded-t-sm rounded-b-sm bg-rose-500' style={{ height: `${column.tasks.length * 6}px` }}></div>
                        {column.tasks.length}
                    </div>
                ))}
            </div>

            <div className="w-[350px] h-full rounded-lg bg-main-bg-color flex justify-evenly items-center">
                <div>
                    Задачи: {`${tasksCount()}`} шт
                </div>
            </div>

        </div>
    );
}

export default Dashboard;