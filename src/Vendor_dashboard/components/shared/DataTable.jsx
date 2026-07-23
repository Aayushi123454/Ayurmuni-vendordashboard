import React from "react";

/** Table wrapper matching Doctor Dashboard table styling. */
export default function DataTable({ columns, children, emptyMessage }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-[1]">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key || col.label}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">{children}</tbody>
                </table>
            </div>
            {!children && emptyMessage && (
                <p className="text-center py-8 text-gray-500 text-sm">{emptyMessage}</p>
            )}
        </div>
    );
}

export function TableRow({ children, onClick, className = "" }) {
    return (
        <tr
            className={`hover:bg-gray-50 transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`}
            onClick={onClick}
        >
            {children}
        </tr>
    );
}

export function TableCell({ children, className = "" }) {
    return <td className={`px-6 py-4 text-sm text-gray-700 ${className}`}>{children}</td>;
}
