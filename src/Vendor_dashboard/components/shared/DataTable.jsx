import React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function DataTable({
    columns,
    children,
    emptyMessage,
    sortKey,
    sortDir,
    onSort,
    stickyActions = false,
    className = "",
}) {
    const hasRows = React.Children.count(children) > 0;

    return (
        <div className={`ds-card overflow-hidden ${className}`}>
            <div className="overflow-x-auto ds-scroll max-h-[70vh]">
                <table className="w-full">
                    <thead className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            {columns.map((col) => {
                                const isSortable = col.sortable && onSort;
                                const isActive = sortKey === col.key;
                                return (
                                    <th
                                        key={col.key || col.label}
                                        className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                                            stickyActions && col.key === "actions" ? "sticky right-0 bg-gray-50/95 backdrop-blur-sm shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.06)]" : ""
                                        } ${col.className || ""}`}
                                    >
                                        {isSortable ? (
                                            <button
                                                type="button"
                                                onClick={() => onSort(col.key)}
                                                className="inline-flex items-center gap-1.5 hover:text-[#0D614E] transition-colors duration-200 ds-focus rounded"
                                            >
                                                {col.label}
                                                {isActive ? (
                                                    sortDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                                ) : (
                                                    <ArrowUpDown size={14} className="opacity-40" />
                                                )}
                                            </button>
                                        ) : (
                                            col.label
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">{children}</tbody>
                </table>
            </div>
            {!hasRows && emptyMessage && (
                <p className="text-center py-10 text-gray-500 text-sm">{emptyMessage}</p>
            )}
        </div>
    );
}

export function TableRow({ children, onClick, selected = false, className = "" }) {
    return (
        <tr
            className={`ds-table-row group ${onClick ? "cursor-pointer" : ""} ${
                selected ? "bg-[#0D614E]/5" : ""
            } ${className}`}
            onClick={onClick}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onClick(e);
                          }
                      }
                    : undefined
            }
        >
            {children}
        </tr>
    );
}

export function TableCell({ children, className = "", sticky = false }) {
    return (
        <td
            className={`px-6 py-4 text-sm text-gray-700 align-middle group-hover:text-gray-900 transition-colors duration-200 ${
                sticky ? "sticky right-0 bg-white group-hover:bg-gray-50 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.04)]" : ""
            } ${className}`}
        >
            {children}
        </td>
    );
}
