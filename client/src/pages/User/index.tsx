import { useDispatch } from "react-redux"
import { logout } from "../../store/slices/auth.slice"

export default function UserPage() {
    const dispatch = useDispatch()

    return <div className="flex justift-center items-center gap-[1em]">
        <h1>Вы зашли из роли User</h1>
        <button className="border p-3 rounded-[8px] cursor-pointer" onClick={ () => dispatch(logout()) }>Выйти</button>
    </div>
}