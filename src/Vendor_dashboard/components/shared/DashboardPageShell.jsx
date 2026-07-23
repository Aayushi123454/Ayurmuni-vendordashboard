import React from "react";
import { ChevronRight } from "lucide-react";

export default function DashboardPageShell({
    title,
    accent,
    subtitle,
    actions,
    breadcrumbs = [],
    hidePageHeader = false,
    children,
    contentClassName = "p-4 sm:p-6 lg:p-8",
}) {
    const showTitle = !hidePageHeader && Boolean(title);
    const showBreadcrumbs = !hidePageHeader && breadcrumbs.length > 0;
    const showHeaderBar = showTitle || showBreadcrumbs || subtitle || actions;

    return (
        <div className="min-h-screen bg-gray-50 ds-animate-in">
            {showHeaderBar && (
                <div className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
                    <div className={`px-4 sm:px-6 lg:px-8 ${hidePageHeader ? "py-4" : "py-5 lg:py-6"}`}>
                        {showBreadcrumbs && (
                            <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-gray-500" aria-label="Breadcrumb">
                                {breadcrumbs.map((crumb, index) => (
                                    <span key={crumb.label} className="inline-flex items-center gap-1">
                                        {index > 0 && <ChevronRight size={12} className="text-gray-400" aria-hidden />}
                                        {crumb.href ? (
                                            <a href={crumb.href} className="text-[#0D614E] hover:underline transition-colors duration-200">
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
                        <div className={`flex flex-wrap items-center gap-4 ${hidePageHeader ? "justify-between" : "justify-between"}`}>
                            {showTitle ? (
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                                        {title}
                                        {accent && <span className="text-[#0D614E]"> {accent}</span>}
                                    </h1>
                                    {subtitle && <p className="text-gray-500 mt-1 text-sm sm:text-base">{subtitle}</p>}
                                </div>
                            ) : (
                                subtitle && <p className="text-gray-500 text-sm sm:text-base min-w-0">{subtitle}</p>
                            )}
                            {actions && (
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">{actions}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className={`${contentClassName} ds-animate-in`}>{children}</div>
        </div>
    );
}
