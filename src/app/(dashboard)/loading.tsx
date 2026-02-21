export default function Loading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-40 bg-gray-200 rounded-lg mb-2" />
                    <div className="h-4 w-56 bg-gray-100 rounded" />
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg hidden sm:block" />
            </div>

            {/* Metric cards skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="card !p-4">
                        <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                        <div className="h-8 w-12 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            {/* Lead list skeleton */}
            <div>
                <div className="h-6 w-44 bg-gray-200 rounded mb-4" />
                <div className="flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="card !p-4 flex items-center justify-between">
                            <div>
                                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                                <div className="h-3 w-24 bg-gray-100 rounded" />
                            </div>
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
