import React from "react";
import { Plus, Package, Layers, RefreshCw, Store } from "lucide-react";
import StatusBadge from "../../../components/shared/StatusBadge";
import Button from "../../../components/shared/Button";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

export default function DashboardWelcome({
    businessName,
    approvalStatus,
    logoUrl,
    summary,
    lastSync,
    onAddProduct,
    onManageStock,
    onViewProducts,
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-[#0D614E]/10 bg-gradient-to-br from-white via-white to-[#0D614E]/[0.06] p-6 sm:p-8 shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(13,97,78,0.08),transparent_55%)] pointer-events-none" />

            <div className="relative grid grid-cols-12 gap-6 items-center">
                <div className="col-span-12 lg:col-span-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="relative flex-shrink-0">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-[#0D614E]/10 flex items-center justify-center">
                            {logoUrl ? (
                                <img src={logoUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <Store size={32} className="text-[#0D614E]" />
                            )}
                        </div>
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" title="Active session" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-500">{getGreeting()}</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-0.5 truncate">
                            {businessName}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <StatusBadge status={approvalStatus} />
                            {lastSync && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                    <RefreshCw size={12} className="text-[#0D614E]" />
                                    Last sync {lastSync}
                                </span>
                            )}
                        </div>
                        {summary && (
                            <p className="mt-3 text-sm text-gray-600 max-w-xl leading-relaxed">{summary}</p>
                        )}
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-wrap lg:flex-col gap-2 lg:items-stretch">
                    <Button onClick={onAddProduct} className="flex-1 lg:flex-none justify-center">
                        <Plus size={16} />
                        Add Product
                    </Button>
                    <Button variant="secondary" onClick={onManageStock} className="flex-1 lg:flex-none justify-center">
                        <Layers size={16} />
                        Manage Stock
                    </Button>
                    <Button variant="secondary" onClick={onViewProducts} className="flex-1 lg:flex-none justify-center">
                        <Package size={16} />
                        View Catalog
                    </Button>
                </div>
            </div>
        </section>
    );
}
