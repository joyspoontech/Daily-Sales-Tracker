'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Building2, Users } from 'lucide-react'
import { logout } from '@/app/(auth)/login/actions'

export function TopNav({ firstName }: { firstName: string }) {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--color-primary)] text-white flex items-center justify-between px-4 z-50 shadow-md">
            <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--color-cta)]" />
                <span className="font-bold text-lg tracking-tight">Joyspoon</span>
            </div>

            <form action={logout}>
                <div className="flex flex-col items-end gap-0.5">
                    {firstName && (
                        <span className="text-xs text-white/60 leading-none">{firstName}</span>
                    )}
                    <button className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity leading-none">
                        Sign Out
                    </button>
                </div>
            </form>
        </nav>
    )
}

export function BottomNav({ role }: { role: string }) {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:hidden">
            {role === 'manager' && (
                <Link
                    href="/manager"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname === '/manager' ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                        }`}
                >
                    <Users className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Team</span>
                </Link>
            )}

            <Link
                href="/"
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${pathname === '/' ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                    }`}
            >
                <LayoutDashboard className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Me</span>
            </Link>

            <Link
                href="/leads/add"
                className="flex flex-col items-center justify-center w-full h-full text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
                <div className={`p-2 rounded-full -mt-6 shadow-lg transition-all ${pathname === '/leads/add'
                    ? 'bg-[var(--color-primary)] text-white scale-110'
                    : 'bg-[var(--color-cta)] text-white hover:opacity-90'
                    }`}>
                    <PlusCircle className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-medium mt-1">Add Lead</span>
            </Link>
        </nav>
    )
}

export function SideNav({ role }: { role: string }) {
    const pathname = usePathname()

    return (
        <aside className="hidden sm:flex flex-col w-64 fixed top-16 bottom-0 left-0 bg-white border-r border-gray-200 py-6 px-4 z-40">
            <div className="flex flex-col gap-2">
                {role === 'manager' && (
                    <Link
                        href="/manager"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${pathname === '/manager'
                            ? 'bg-gray-100 text-[var(--color-primary)] shadow-sm border border-gray-200'
                            : 'text-[var(--color-secondary)] hover:bg-gray-50 hover:text-[var(--color-primary)]'
                            }`}
                    >
                        <Users className={`w-5 h-5 ${pathname === '/manager' ? 'text-[var(--color-cta)]' : ''}`} />
                        Team Activity
                    </Link>
                )}

                <Link
                    href="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${pathname === '/'
                        ? 'bg-gray-100 text-[var(--color-primary)] shadow-sm border border-gray-200'
                        : 'text-[var(--color-secondary)] hover:bg-gray-50 hover:text-[var(--color-primary)]'
                        }`}
                >
                    <LayoutDashboard className={`w-5 h-5 ${pathname === '/' ? 'text-[var(--color-cta)]' : ''}`} />
                    My Pipeline
                </Link>

                <Link
                    href="/leads/add"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${pathname === '/leads/add'
                        ? 'bg-gray-100 text-[var(--color-primary)] shadow-sm border border-gray-200'
                        : 'text-[var(--color-secondary)] hover:bg-gray-50 hover:text-[var(--color-primary)]'
                        }`}
                >
                    <PlusCircle className={`w-5 h-5 ${pathname === '/leads/add' ? 'text-[var(--color-cta)]' : ''}`} />
                    Add Lead
                </Link>
            </div>
        </aside>
    )
}
