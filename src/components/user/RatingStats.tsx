"use client"

import { Star, ChevronDown, ChevronUp } from "lucide-react"

export default function RatingStats({ ratingStats, totalRatings }: { ratingStats: Record<number, number>, totalRatings: number }) {
    const scoresToShow = [5, 4, 3, 2, 1]

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 sticky top-24">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Statistik Rating</h3>
            </div>

            <div className="space-y-3">
                {scoresToShow.map(score => (
                    <div key={score} className="flex items-center gap-3">
                        <div className="w-8 flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold">{score}</span>
                        </div>
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${totalRatings > 0 ? (ratingStats[score] / totalRatings) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <div className="w-6 text-xs text-gray-500 text-right">{ratingStats[score] || 0}</div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                <span className="text-gray-400 text-sm">{totalRatings} total ulasan</span>
            </div>
        </div>
    )
}
