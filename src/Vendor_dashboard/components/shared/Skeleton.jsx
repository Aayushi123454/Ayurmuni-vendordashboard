import React from "react";

export function Skeleton({ className = "", style }) {
    return <div className={`ds-skeleton ${className}`} style={style} aria-hidden />;
}

export function TableSkeleton({ columns = 5, rows = 6 }) {
    return (
        <div className="ds-card overflow-hidden" aria-busy="true" aria-label="Loading table">
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/80 flex gap-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-3 flex-1 max-w-[120px]" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, row) => (
                <div key={row} className="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
                    <Skeleton className="h-4 flex-1 max-w-[200px]" />
                    <Skeleton className="h-4 w-20 hidden sm:block" />
                    <Skeleton className="h-6 w-16 rounded-full hidden md:block" />
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </div>
            ))}
        </div>
    );
}

export function CardGridSkeleton({ count = 3 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ds-stagger">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="ds-card p-6 space-y-4">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
    );
}

export function ProductListSkeleton({ count = 4 }) {
    return (
        <div className="space-y-4 ds-stagger" aria-busy="true" aria-label="Loading products">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="ds-card p-5 flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48 max-w-full" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-lg hidden sm:block" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

export function MetricSkeleton({ count = 5 }) {
    return (
        <div className="flex flex-wrap gap-5 ds-stagger">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="ds-card flex-1 min-w-[160px] p-5 space-y-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-16" />
                </div>
            ))}
        </div>
    );
}
