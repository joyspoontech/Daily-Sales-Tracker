'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

type Rep = {
    id: string;
    first_name: string;
    last_name: string;
}

export function TeamActivityFilters({ reps }: { reps: Rep[] }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [isPending, setIsPending] = useState(false)

    // Current values
    const q = searchParams.get('q') || ''
    const repId = searchParams.get('rep') || ''
    const temp = searchParams.get('temp') || ''

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPending(true)
        router.push(pathname + '?' + createQueryString('q', e.target.value))
        // Basic debounce simulation for visual state, Next.js handles the actual transition
        setTimeout(() => setIsPending(false), 300)
    }

    const handleRepFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsPending(true)
        router.push(pathname + '?' + createQueryString('rep', e.target.value))
        setTimeout(() => setIsPending(false), 300)
    }

    const handleTempFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsPending(true)
        router.push(pathname + '?' + createQueryString('temp', e.target.value))
        setTimeout(() => setIsPending(false), 300)
    }

    const handleClear = () => {
        setIsPending(true)
        router.push(pathname)
        setTimeout(() => setIsPending(false), 300)
    }

    const hasFilters = q || repId || temp;

    return (
        <div className="card !p-4 mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    defaultValue={q}
                    onChange={handleSearch}
                    placeholder="Search by lead or company..."
                    className="input pl-9"
                />
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 sm:w-48">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        className="input pl-9 appearance-none"
                        value={repId}
                        onChange={handleRepFilter}
                    >
                        <option value="">All Reps</option>
                        {reps.map(rep => (
                            <option key={rep.id} value={rep.id}>
                                {rep.first_name} {rep.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative w-32">
                    <select
                        className="input appearance-none"
                        value={temp}
                        onChange={handleTempFilter}
                    >
                        <option value="">Any Temp</option>
                        <option value="Hot">🔥 Hot</option>
                        <option value="Cold">❄️ Cold</option>
                    </select>
                </div>

                {hasFilters && (
                    <button
                        onClick={handleClear}
                        className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                        title="Clear Filters"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
            {isPending && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)] animate-pulse rounded-t-xl" />
            )}
        </div>
    )
}
