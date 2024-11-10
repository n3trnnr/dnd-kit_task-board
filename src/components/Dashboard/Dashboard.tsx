import { IDashboard } from "./Dashboard.props";

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
        <div className="flex justify-center items-center gap-x-5">

            <div className="w-[350px] h-[60px] rounded-lg bg-main-bg-color flex justify-evenly items-center">
                <div>
                    Доски: {`${columns.length}`} шт
                </div>
            </div>

            <div className="w-[350px] h-[60px] rounded-lg bg-main-bg-color flex justify-evenly items-center">
                <div>
                    Задачи: {`${tasksCount()}`} шт
                </div>
            </div>

        </div>
    );
}

export default Dashboard;