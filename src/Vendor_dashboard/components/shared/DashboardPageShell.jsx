import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * Page shell matching Doctor Dashboard layout:
 * sticky white header (px-8 py-6) + gray-50 body (p-8).
 */
export default function DashboardPageShell({
    title,
    accent,
    subtitle,
    actions,
    breadcrumbs = [],
    children,
    contentClassName = "p-8",
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
                <div className="px-8 py-6">
                    {breadcrumbs.length > 0 && (
                        <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-gray-500" aria-label="Breadcrumb">
                            {breadcrumbs.map((crumb, index) => (
                                <span key={crumb.label} className="inline-flex items-center gap-1">
                                    {index > 0 && <ChevronRight size={12} className="text-gray-400" />}
                                    {crumb.href ? (
                                        <a href={crumb.href} className="text-[#0D614E] hover:underline">
                                            {crumb.label}
                                        </a>
                                    ) : (
                                        <span className={index === breadcrumbs.length - 1 ? "font-medium text-gray-700" : ""}>
                                            {crumb.label}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {title}
                                {accent && <span className="text-[#0D614E]"> {accent}</span>}
                            </h1>
                            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
                        </div>
                        {actions && (
                            <div className="flex flex-wrap items-center gap-3">{actions}</div>
                        )}
                    </div>
                </div>
            </div>
            <div className={contentClassName}>{children}</div>
        </div>
    );
}
