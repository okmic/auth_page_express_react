import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { logout } from "../../store/slices/auth.slice"
import apiUserService from "../../libs/api/api.user.service"
import type { IUser } from "../../pkg/types/user"

export default function AdminPage() {
    const dispatch = useDispatch()
    const [users, setUsers] = useState<IUser[]>([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [isFormVisible, setIsFormVisible] = useState(false)

    const getUsers = async () => {
        const data = await apiUserService.find()
        setUsers(data)
    }

    const onUpdateStatusUser = async (id: string, status: boolean) => {
        await apiUserService.updateStatus(id, status)
    }

    const onCreateUser = async (data: { name: string; email: string; psw: string; role: IUser["role"] }) => {
        await apiUserService.signupAdmin(data)
        await getUsers()
        handleCloseForm()
    }

    const handleOpenForm = () => {
        setShowCreateForm(true)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsFormVisible(true)
            })
        })
    }

    const handleCloseForm = () => {
        setIsFormVisible(false)
        setTimeout(() => {
            setShowCreateForm(false)
        }, 500)
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white/90 tracking-tight">
                        Пользователи
                    </h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={showCreateForm ? handleCloseForm : handleOpenForm}
                            className="px-5 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-medium text-sm transition-all duration-300 hover:bg-indigo-500/30 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 backdrop-blur-sm"
                        >
                            {showCreateForm ? "Закрыть" : "Создать пользователя"}
                        </button>
                        <button
                            onClick={() => dispatch(logout())}
                            className="px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-400 font-medium text-sm transition-all duration-300 hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-400 active:scale-[0.98] backdrop-blur-sm"
                        >
                            Выйти
                        </button>
                    </div>
                </div>

                <div className={`
                    grid transition-all duration-500 ease-in-out
                    ${showCreateForm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                `}>
                    <div className="overflow-hidden">
                        <div className={`
                            mb-10 transition-all duration-500 ease-in-out
                            ${isFormVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
                        `}>
                            <CreateUserForm
                                onSubmit={onCreateUser}
                                onCancel={handleCloseForm}
                            />
                        </div>
                    </div>
                </div>

                {users && users.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map(u => (
                            <UserCard
                                key={u._id}
                                user={u}
                                onToggleActive={onUpdateStatusUser}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <svg className="w-16 h-16 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-lg">Пользователей пока нет</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const CreateUserForm = ({
    onSubmit,
    onCancel,
}: {
    onSubmit: (data: { name: string; email: string; psw: string; role: IUser["role"] }) => void
    onCancel: () => void
}) => {
    const [formData, setFormData] = useState<{ name: string; email: string; psw: string; role: IUser["role"] }>({
        name: "",
        email: "",
        psw: "",
        role: "User",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name || formData.name.length < 2) newErrors.name = "Минимум 2 символа"
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Неверный email"
        if (!formData.psw || formData.psw.length < 6) newErrors.psw = "Минимум 6 символов"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setIsLoading(true)
        try {
            await onSubmit(formData)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${focusedField === "name" ? "text-indigo-400" : "text-gray-400"}`}>
                            Имя
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Иван Иванов"
                            className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border text-white placeholder-gray-500 outline-none transition-all duration-300 ${errors.name ? "border-red-500/50 bg-red-500/5" : focusedField === "name" ? "border-indigo-400/50 bg-white/[0.08]" : "border-white/[0.08]"} hover:border-white/20`}
                        />
                        {errors.name && <p className="text-xs text-red-400 animate-fadeIn">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${focusedField === "email" ? "text-indigo-400" : "text-gray-400"}`}>
                            Почта
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="user@example.com"
                            className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border text-white placeholder-gray-500 outline-none transition-all duration-300 ${errors.email ? "border-red-500/50 bg-red-500/5" : focusedField === "email" ? "border-indigo-400/50 bg-white/[0.08]" : "border-white/[0.08]"} hover:border-white/20`}
                        />
                        {errors.email && <p className="text-xs text-red-400 animate-fadeIn">{errors.email}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${focusedField === "psw" ? "text-indigo-400" : "text-gray-400"}`}>
                            Пароль
                        </label>
                        <input
                            type="password"
                            name="psw"
                            value={formData.psw}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("psw")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border text-white placeholder-gray-500 outline-none transition-all duration-300 ${errors.psw ? "border-red-500/50 bg-red-500/5" : focusedField === "psw" ? "border-indigo-400/50 bg-white/[0.08]" : "border-white/[0.08]"} hover:border-white/20`}
                        />
                        {errors.psw && <p className="text-xs text-red-400 animate-fadeIn">{errors.psw}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Роль
                        </label>
                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white outline-none transition-all duration-300 appearance-none cursor-pointer hover:border-white/20 focus:border-indigo-400/50"
                            >
                                <option value="User" className="bg-gray-900">User</option>
                                <option value="Admin" className="bg-gray-900">Admin</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 px-6 rounded-xl bg-indigo-500/80 border border-indigo-400/30 text-white font-semibold text-sm transition-all duration-300 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                    >
                        {isLoading ? "Создание..." : "Создать"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="py-3 px-6 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-400 font-medium text-sm transition-all duration-300 hover:bg-white/[0.06] hover:text-gray-300 active:scale-[0.98] backdrop-blur-sm"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </form>
    )
}

const UserCard = ({
    user,
    onToggleActive,
}: {
    user: IUser
    onToggleActive?: (id: string, newValue: boolean) => void
}) => {
    const [active, setActive] = useState(user.isActive)

    const handleToggle = () => {
        const newVal = !active
        setActive(newVal)
        onToggleActive?.(user._id, newVal)
    }

    const avatarLetter = user.name?.charAt(0).toUpperCase() || "?"

    return (
        <div className="group relative bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/25">
                            {avatarLetter}
                        </div>
                        <span
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-900 transition-colors duration-300 ${
                                active ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-gray-600"
                            }`}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate leading-tight">
                            {user.name}
                        </h3>
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-white/10 text-white/70 backdrop-blur-sm border border-white/5">
                            {user.role}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                            ID
                        </span>
                        <span className="text-sm text-gray-300 font-mono truncate max-w-[180px]">
                            {user._id}
                        </span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                            Почта
                        </span>
                        <span className="text-sm text-gray-300 truncate max-w-[180px]">
                            {user.email}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                            Статус
                        </span>
                        <span
                            className={`text-xs font-semibold transition-colors duration-300 ${
                                active ? "text-emerald-400" : "text-gray-500"
                            }`}
                        >
                            {active ? "Активен" : "Не активен"}
                        </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={active}
                            onChange={handleToggle}
                        />
                        <div className="w-12 h-7 bg-gray-700/50 backdrop-blur-sm rounded-full border border-white/10 peer-checked:bg-emerald-500/80 peer-checked:border-emerald-400/30 transition-all duration-300 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white/90 after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 after:shadow-md peer-checked:after:translate-x-[20px] peer-checked:after:bg-white" />
                    </label>
                </div>
            </div>
        </div>
    )
}