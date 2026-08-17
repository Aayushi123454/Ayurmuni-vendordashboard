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
        <section className="relative overflow-hidden rounded-xl border border-[#0D614E]/10 bg-gradient-to-r from-white to-[#0D614E]/[0.04] px-4 py-3.5 sm:px-5 sm:py-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                        <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl border border-white shadow-sm overflow-hidden bg-[#0D614E]/10 flex items-center justify-center">
                            {logoUrl ? (
                                <img src={logoUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <Store size={22} className="text-[#0D614E]" />
                            )}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" title="Active" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">
                                {getGreeting()}, {businessName}
                            </h1>
                            <StatusBadge status={approvalStatus} />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                            {summary && <p className="text-xs sm:text-sm text-gray-500 truncate">{summary}</p>}
                            {lastSync && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                                    <RefreshCw size={10} className="text-[#0D614E]" />
                                    Synced {lastSync}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button onClick={onAddProduct} className="!py-2 !px-3 text-sm">
                        <Plus size={15} />
                        Add Product
                    </Button>
                    <Button variant="secondary" onClick={onManageStock} className="!py-2 !px-3 text-sm">
                        <Layers size={15} />
                        Stock
                    </Button>
                    <Button variant="secondary" onClick={onViewProducts} className="!py-2 !px-3 text-sm">
                        <Package size={15} />
                        Catalog
                    </Button>
                </div>
            </div>
        </section>
    );
}
