import React from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

export function PageLoader({ message = "Loading..." }) {
    return (
        <div className="flex justify-center items-center py-12">
            <div className="text-center">
                <div className="w-12 h-12 mx-auto border-4 border-[#0D614E] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 mt-4 text-sm">{message}</p>
            </div>
        </div>
    );
}

export function PageEmpty({ title, description, action, icon: Icon = Inbox }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-12 px-6">
            <Icon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {description && <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

export function PageError({ message, onRetry }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-12 px-6">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Something went wrong</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">{message}</p>
            {onRetry && (
                <div className="mt-6">
                    <Button onClick={onRetry}>Try again</Button>
                </div>
            )}
        </div>
    );
}

export function PaginationBar({ page, pageSize, totalCount, onPageChange, itemLabel = "items" }) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalCount);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push("...");
            const startPage = Math.max(2, page - 1);
            const endPage = Math.min(totalPages - 1, page + 1);
            for (let i = startPage; i <= endPage; i++) pages.push(i);
            if (page < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl mt-0">
            <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{start}</span> to{" "}
                <span className="font-medium">{end}</span> of{" "}
                <span className="font-medium">{totalCount}</span> {itemLabel}
            </p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 bg-white"
                >
                    <ChevronLeft size={18} />
                </button>
                {getPageNumbers().map((pageNum, index) => (
                    <button
                        key={`${pageNum}-${index}`}
                        type="button"
                        disabled={pageNum === "..."}
                        onClick={() => typeof pageNum === "number" && onPageChange(pageNum)}
                        className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                            pageNum === page
                                ? "bg-[#0D614E] text-white"
                                : pageNum === "..."
                                  ? "cursor-default text-gray-400"
                                  : "hover:bg-gray-200 text-gray-700 bg-white border border-gray-200"
                        }`}
                    >
                        {pageNum}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 bg-white"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}

export function TableCard({ children, className = "" }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 ${className}`}>
            {children}
        </div>
    );
}

export function FilterCard({ children, className = "" }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 ${className}`}>
            {children}
        </div>
    );
}
