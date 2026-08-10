import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    CheckCircle2,
    Clock3,
    Package,
    RefreshCw,
    ShoppingCart,
    Users,
    XCircle,
} from "lucide-react";
import { vendorService } from "../../../services/vendorService";
import Ayurvedaimage from "../../../Assests/Ayurvedaimage.png";
import usePersistedState from "../../hooks/usePersistedState";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import {
    PageEmpty,
    PageError,
    PaginationBar,
    TableCard,
} from "../../components/shared/PageState";
import { MetricSkeleton, TableSkeleton } from "../../components/shared/Skeleton";
import StatusBadge from "../../components/shared/StatusBadge";
import SearchToolbar, { SelectFilter } from "../../components/shared/SearchToolbar";
import Button from "../../components/shared/Button";
import DataTable, { TableRow, TableCell } from "../../components/shared/DataTable";
import PremiumKPICard from "../Dashboard/components/PremiumKPICard";
import {
    EMPTY_ORDER_SUMMARY,
    ORDER_STATUS_FILTERS,
    PAYMENT_TYPE_FILTERS,
    formatCurrency,
    formatOrderDate,
    formatPaymentLabel,
    formatStatusLabel,
    parseOrdersListResponse,
    parseOrdersSummaryResponse,
} from "./orderHelpers";
import OrderCustomersPanel from "./OrderCustomersPanel";
import "../../components/shared/vendor-shared.css";
import "./Order.css";

const ORDER_VIEWS = [
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
];

const COLUMNS = [
    { key: "order", label: "Order" },
    { key: "product", label: "Product" },
    { key: "qty", label: "Qty" },
    { key: "amount", label: "Amount" },
    { key: "payment", label: "Payment" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
];

function OrdersKpiSection({ summary, loading, onStatusSelect }) {
    if (loading) {
        return <MetricSkeleton count={4} />;
    }

    return (
        <div className="order-kpi-grid ds-stagger">
            <PremiumKPICard
                variant="hero"
                icon={ShoppingCart}
                label="Total line items"
                value={summary.total}
                subtitle="Across all your orders"
                className="stock-kpi-clickable"
                onAction={() => onStatusSelect("")}
                actionLabel="View all"
            />
            <PremiumKPICard
                variant="soft"
                icon={Clock3}
                label="Pending"
                value={summary.pending}
                subtitle="Awaiting confirmation"
                className="stock-kpi-clickable"
                onAction={summary.pending > 0 ? () => onStatusSelect("pending") : undefined}
                actionLabel="Review"
            />
            <PremiumKPICard
                variant="accent"
                icon={CheckCircle2}
                label="Confirmed"
                value={summary.confirmed}
                subtitle="Ready for fulfillment"
                className="stock-kpi-clickable"
                onAction={summary.confirmed > 0 ? () => onStatusSelect("confirmed") : undefined}
                actionLabel="Review"
            />
            <PremiumKPICard
                variant={summary.cancelled > 0 ? "alert" : "muted"}
                icon={XCircle}
                label="Cancelled"
                value={summary.cancelled}
                subtitle="Payment failed / cancelled"
                className="stock-kpi-clickable"
                onAction={summary.cancelled > 0 ? () => onStatusSelect("cancelled") : undefined}
                actionLabel="Review"
            />
        </div>
    );
}

export default function Order() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeView = searchParams.get("view") === "customers" ? "customers" : "orders";
    const [customersRefreshToken, setCustomersRefreshToken] = useState(0);
    const [items, setItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [summary, setSummary] = useState(EMPTY_ORDER_SUMMARY);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = usePersistedState("vendor:orders:pageSize", 10);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const hasActiveQuery = Boolean(search || statusFilter || paymentType || fromDate || toDate);

    const fetchList = useCallback(async () => {
        const response = await vendorService.getOrders({
            page,
            page_size: pageSize,
            status: statusFilter || undefined,
            search: search || undefined,
            payment_type: paymentType || undefined,
            from_date: fromDate || undefined,
            to_date: toDate || undefined,
        });
        const parsed = parseOrdersListResponse(response);
        setItems(parsed.results);
        setTotalCount(parsed.count);
    }, [page, pageSize, statusFilter, search, paymentType, fromDate, toDate]);

    const fetchSummary = useCallback(async () => {
        const response = await vendorService.getOrdersSummary();
        setSummary(parseOrdersSummaryResponse(response));
    }, []);

    const reloadAll = useCallback(async () => {
        setError("");
        setLoading(true);
        setSummaryLoading(true);
        try {
            await Promise.all([fetchList(), fetchSummary()]);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to load orders");
            setItems([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
            setSummaryLoading(false);
        }
    }, [fetchList, fetchSummary]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setError("");
            setLoading(true);
            try {
                await fetchList();
            } catch (err) {
                if (!cancelled) {
                    setError(err?.response?.data?.message || err.message || "Failed to load orders");
                    setItems([]);
                    setTotalCount(0);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [fetchList]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setSummaryLoading(true);
            try {
                await fetchSummary();
            } catch {
                if (!cancelled) setSummary(EMPTY_ORDER_SUMMARY);
            } finally {
                if (!cancelled) setSummaryLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [fetchSummary]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (activeView === "customers") {
                setCustomersRefreshToken((n) => n + 1);
            } else {
                await reloadAll();
            }
        } finally {
            setRefreshing(false);
        }
    };

    const setActiveView = (viewId) => {
        if (viewId === "customers") {
            setSearchParams({ view: "customers" }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    };

    const clearFilters = () => {
        setSearch("");
        setSearchInput("");
        setStatusFilter("");
        setPaymentType("");
        setFromDate("");
        setToDate("");
        setPage(1);
    };

    const applyStatusFilter = (status) => {
        setStatusFilter(status);
        setPage(1);
    };

    const statusOptions = useMemo(
        () => ORDER_STATUS_FILTERS.map((f) => ({ value: f.key, label: f.label })),
        []
    );
    const paymentOptions = useMemo(
        () => PAYMENT_TYPE_FILTERS.map((f) => ({ value: f.key, label: f.label })),
        []
    );

    return (
        <DashboardPageShell
            compact
            hidePageHeader
            contentClassName="vendor-page-content order-page-content"
            actions={
                <Button
                    variant="secondary"
                    onClick={handleRefresh}
                    loading={refreshing && activeView === "orders"}
                    disabled={loading && activeView === "orders"}
                    className="!text-sm"
                >
                    {!refreshing && <RefreshCw size={16} />}
                    Refresh
                </Button>
            }
        >
            <div className="order-view-tabs" role="tablist" aria-label="Orders and customers">
                {ORDER_VIEWS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={activeView === id}
                        className={`order-view-tab ${activeView === id ? "order-view-tab--active" : ""}`}
                        onClick={() => setActiveView(id)}
                    >
                        <Icon size={16} aria-hidden />
                        {label}
                    </button>
                ))}
            </div>

            {activeView === "customers" ? (
                <OrderCustomersPanel refreshToken={customersRefreshToken} />
            ) : (
                <>
            <OrdersKpiSection
                summary={summary}
                loading={summaryLoading}
                onStatusSelect={applyStatusFilter}
            />

            <SearchToolbar
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSubmit={() => {
                    setPage(1);
                    setSearch(searchInput.trim());
                }}
                onClear={hasActiveQuery || searchInput ? clearFilters : undefined}
                placeholder="Search order code, SKU, product, or variant…"
            >
                <SelectFilter
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    options={statusOptions}
                    placeholder="All statuses"
                    aria-label="Filter by status"
                    className="w-[10rem] min-w-[8.5rem] shrink-0"
                />
                <SelectFilter
                    value={paymentType}
                    onChange={(e) => {
                        setPaymentType(e.target.value);
                        setPage(1);
                    }}
                    options={paymentOptions}
                    placeholder="All payments"
                    aria-label="Filter by payment type"
                    className="w-[9rem] min-w-[8rem] shrink-0"
                />
                <div className="order-date-group shrink-0">
                    <label className="order-date-label" htmlFor="order-from-date">
                        From
                    </label>
                    <input
                        id="order-from-date"
                        type="date"
                        className="order-date-input"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className="order-date-group shrink-0">
                    <label className="order-date-label" htmlFor="order-to-date">
                        To
                    </label>
                    <input
                        id="order-to-date"
                        type="date"
                        className="order-date-input"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </SearchToolbar>

            {loading ? (
                <TableSkeleton columns={COLUMNS.length} rows={Math.min(pageSize, 8)} />
            ) : error ? (
                <PageError message={error} onRetry={reloadAll} />
            ) : items.length === 0 ? (
                <PageEmpty
                    icon={Package}
                    title="No orders found"
                    description={
                        hasActiveQuery
                            ? "Try adjusting your search or filters."
                            : "Orders that include your products will appear here."
                    }
                    action={
                        hasActiveQuery ? (
                            <Button variant="secondary" onClick={clearFilters}>
                                Clear filters
                            </Button>
                        ) : null
                    }
                />
            ) : (
                <TableCard>
                    <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        Showing <strong>{items.length}</strong> of{" "}
                        <strong>{totalCount.toLocaleString()}</strong> line items
                        {statusFilter ? (
                            <>
                                {" "}
                                · status <strong>{formatStatusLabel(statusFilter)}</strong>
                            </>
                        ) : null}
                    </div>
                    <DataTable columns={COLUMNS}>
                        {items.map((row) => {
                            const { date, time } = formatOrderDate(row.date);
                            return (
                                <TableRow
                                    key={row.order_item_id}
                                    onClick={() => navigate(`/vendor/orders/${row.order_id}`)}
                                >
                                    <TableCell>
                                        <div className="font-semibold text-gray-800">
                                            {row.order_display_code || row.order_code || "—"}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            {row.order_code}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="order-product-cell">
                                            <img
                                                src={row.product_image || Ayurvedaimage}
                                                alt=""
                                                className="order-product-thumb"
                                                onError={(e) => {
                                                    e.currentTarget.src = Ayurvedaimage;
                                                }}
                                            />
                                            <div className="order-product-meta">
                                                <div className="order-product-name">
                                                    {row.product_name || "Product"}
                                                </div>
                                                <div className="order-product-variant">
                                                    {row.variant_title || "—"}
                                                    {row.sku_code ? ` · ${row.sku_code}` : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{row.quantity ?? "—"}</TableCell>
                                    <TableCell className="font-semibold text-[#0D614E]">
                                        {formatCurrency(row.total_amount)}
                                    </TableCell>
                                    <TableCell>
                                        {formatPaymentLabel(row.payment_type, row.payment_method)}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={row.status}
                                            label={formatStatusLabel(row.status)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div>{date}</div>
                                        {time ? (
                                            <div className="text-xs text-gray-400">{time}</div>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </DataTable>
                    <PaginationBar
                        page={page}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setPage(1);
                        }}
                        storageKey="vendor:orders"
                        itemLabel="items"
                    />
                </TableCard>
            )}
                </>
            )}
        </DashboardPageShell>
    );
}
