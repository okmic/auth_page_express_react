import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/slices/auth.slice"
import type { RootState } from "../../store/store"

export default function UserPage() {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    const [showInfo, setShowInfo] = useState(false)

    const avatarLetter = user?.name?.charAt(0).toUpperCase() || "?"

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className={`
                    relative bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden
                    transition-all duration-700 ease-in-out
                    ${showInfo ? "shadow-2xl shadow-indigo-500/10" : "shadow-lg shadow-black/20"}
                `}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
                    
                    <div className="relative p-8 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-indigo-500/20">
                                {avatarLetter}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            {user?.name || "Пользователь"}
                        </h2>
                        
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                            Роль: User
                        </span>

                        <div className={`
                            w-full overflow-hidden transition-all duration-500 ease-in-out
                            ${showInfo ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"}
                        `}>
                            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                                        ID
                                    </span>
                                    <span className="text-sm text-gray-300 font-mono">
                                        {user?._id || "—"}
                                    </span>
                                </div>
                                <div className="w-full h-px bg-white/[0.04]" />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                                        Почта
                                    </span>
                                    <span className="text-sm text-gray-300">
                                        {user?.email || "—"}
                                    </span>
                                </div>
                                <div className="w-full h-px bg-white/[0.04]" />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                                        Статус
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Активен
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className="flex-1 py-3 px-6 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-medium text-sm transition-all duration-300 hover:bg-indigo-500/30 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] backdrop-blur-sm"
                            >
                                {showInfo ? "Скрыть" : "Информация"}
                            </button>
                            
                            <button
                                onClick={() => dispatch(logout())}
                                className="py-3 px-6 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-400 font-medium text-sm transition-all duration-300 hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-400 active:scale-[0.98] backdrop-blur-sm"
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-600 italic">
                    У вас ограниченный доступ. Обратитесь к администратору для расширения прав.
                </p>
            </div>
        </div>
    )
}