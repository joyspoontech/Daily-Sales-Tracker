'use client'

import { useState } from 'react'

export function ProbabilitySlider({ initialValue = 50 }: { initialValue?: number }) {
    const [value, setValue] = useState(initialValue)

    return (
        <div className="flex flex-col gap-1.5 mt-2 col-span-1 sm:col-span-2">
            <label className="text-sm font-medium text-[var(--color-secondary)] flex justify-between" htmlFor="probability">
                <span>Conversion Probability</span>
                <span className="font-bold text-[var(--color-cta)]">{value}%</span>
            </label>
            <input
                type="range"
                className="w-full accent-[var(--color-cta)] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                name="probability"
                id="probability"
                min="0"
                max="100"
                value={value}
                step="5"
                onChange={(e) => setValue(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0% (Low)</span>
                <span>100% (High)</span>
            </div>
        </div>
    )
}
