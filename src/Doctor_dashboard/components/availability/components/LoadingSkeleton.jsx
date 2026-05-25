// components/LoadingSkeleton.jsx
import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="min-h-screen ">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Skeleton */}
                <div className="mb-6">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                </div>

                {/* Stats Skeleton */}
                {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                    ))}
                </div> */}

                {/* Calendar Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0D614E] to-emerald-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="h-6 bg-white/20 rounded w-32 animate-pulse"></div>
                            <div className="h-10 bg-white/20 rounded w-48 animate-pulse"></div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {[...Array(35)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;