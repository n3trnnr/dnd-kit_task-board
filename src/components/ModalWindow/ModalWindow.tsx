import { IFormData } from "../../types/types";
import { IModalWindow } from "./ModalWindow.props";

const ModalWindow = ({ createColumn, showModal, createTask, isModal }: IModalWindow) => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const target = event.target as HTMLFormElement
        const formData = new FormData(target)
        const data = Object.fromEntries(formData) as unknown as IFormData

        if (isModal.type === 'column') {
            if (data.isCompleted) {
                const updatedData = { ...data, isCompleted: true }
                createColumn(updatedData)
            }
            createColumn(data)
        } else {
            createTask(data)
        }
        showModal({ type: null, active: false })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="
        w-[400px] h-[180px] 
        flex flex-col justify-center items-center gap-y-5
        p-5 
        bg-board-bg-color 
        rounded-lg 
        absolute 
        z-10
        m-auto
        left-0 right-0 top-0 bottom-0">
            <input className="
                h-[60px] w-full
                board-bg-color focus:outline-rose-500 outline-none 
                rounded-md
                font-normal px-2px] 
                bg-main-bg-color
                px-5
                "
                type="text" name="description" placeholder="Описание" required
            />

            {/* {type === 'column' && <div className="flex justify-evenly items-center w-full h-[60px] rounded-md bg-main-bg-color">

                <input className="size-5 accent-rose-500" type="checkbox" name="isCompleted" />
                <input className="size-5 accent-rose-500" type="checkbox" name="isCompleted" />
                <input className="size-5 accent-rose-500" type="checkbox" name="isCompleted" />
            </div>} */}

            <div className="w-full flex justify-between gap-5">
                <button
                    className="
                    h-[60px]
                    w-full 
                    px-5 rounded-md 
                    bg-main-bg-color
                    ring-rose-500 hover:ring-2
                    cursor-pointer
            ">
                    Отправить
                </button>

                <input
                    onClick={() => showModal({ type: null, active: false })}
                    className="
                    h-[60px]
                    w-full 
                    px-5 rounded-md 
                    bg-main-bg-color
                    ring-rose-500 hover:ring-2
                    cursor-pointer
                "
                    type="button" value="Отменить" />
            </div>
        </form>
    );
}

export default ModalWindow;