import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
    AlertTriangle,
    Boxes,
    Cloud,
    CloudOff,
    Lock,
    Package,
    Pencil,
    RefreshCw,
    Trash2,
    TrendingDown,
    Warehouse,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { vendorService } from "../../../services/vendorService";
import usePersistedState from "../../hooks/usePersistedState";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { PageEmpty, PageError, PaginationBar, TableCard } from "../../components/shared/PageState";
import { MetricSkeleton, StockCardGridSkeleton } from "../../components/shared/Skeleton";
import StatusBadge from "../../components/shared/StatusBadge";
import SearchToolbar, { SelectFilter } from "../../components/shared/SearchToolbar";
import Modal from "../../components/shared/Modal";
import Button from "../../components/shared/Button";
import PremiumKPICard from "../Dashboard/components/PremiumKPICard";
import {
    extractApiErrorMessage,
    isUnicommerceSyncError,
    isApprovalRelatedStockError,
    isVariantApproved,
    STOCK_APPROVAL_BLOCKED,
} from "../../../utils/unicommerceHelpers";
import {
    LOW_STOCK_THRESHOLD,
    STOCK_FILTERS,
    KPI_FILTER_MAP,
    computeInventorySummary,
    computeFilterCounts,
    filterInventoryItems,
    formatDateTime,
    getStockHealthKey,
    getProductCardAccent,
    STOCK_HEALTH_LABELS,
    parseInventoryListResponse,
    canManageStock,
    fetchAllVendorProducts,
    enrichInventoryWithApproval,
    fetchVariantApprovalStatus,
} from "./stockHelpers";
import "../../components/shared/vendor-shared.css";
import "./Stock.css";

const QTY_PRESETS = [10, 25, 50, 100];

function SyncBadge({ item }) {
    const approved = isVariantApproved(item);
    return approved ? (
        <span className="stock-sync-badge stock-sync-badge--live" title="Updates sync to Unicommerce">
            <Cloud size={12} aria-hidden />
            Unicommerce
        </span>
    ) : (
        <span className="stock-sync-badge stock-sync-badge--pending" title="Awaiting admin approval before sync">
            <CloudOff size={12} aria-hidden />
            Awaiting approval
        </span>
    );
}

function QuantityUnavailableModal({ item, open, onClose, onViewProduct }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={STOCK_APPROVAL_BLOCKED.title}
            subtitle={
                item ? `${item.product_name} · ${item.variant_title || "Default variant"}` : undefined
            }
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onViewProduct}>
                        View Product Status
                    </Button>
                    <Button onClick={onClose}>Got it</Button>
                </>
            }
        >
            <p className="text-sm text-gray-600 leading-relaxed">{STOCK_APPROVAL_BLOCKED.description}</p>
        </Modal>
    );
}

function StockKpiSection({ summary, listTotalCount, summaryLoading, hasActiveQuery, onFilterSelect }) {
    if (summaryLoading) {
        return <MetricSkeleton count={5} />;
    }

    const catalogNote =
        summary.totalRecords >= 500
            ? "Based on latest 500 records"
            : "Catalog-wide snapshot";

    return (
        <>
            <div className="stock-overview-label">
                <span className="stock-overview-label__title">Inventory overview</span>
                <span className="stock-overview-label__note">{catalogNote}</span>
            </div>
            <div className="stock-kpi-grid ds-stagger">
                <PremiumKPICard
                    variant="hero"
                    icon={Warehouse}
                    label={hasActiveQuery ? "Matching records" : "Inventory records"}
                    value={listTotalCount}
                    subtitle={hasActiveQuery ? "Current search / filter" : "Total in your catalog"}
                    className="stock-kpi-clickable"
                    onAction={() => onFilterSelect("all")}
                    actionLabel="View all"
                />
                <PremiumKPICard
                    variant="soft"
                    icon={Boxes}
                    label="Total units"
                    value={summary.totalUnits}
                    subtitle="On-hand quantity"
                />
                <PremiumKPICard
                    variant={summary.lowStock > 0 ? "alert" : "soft"}
                    icon={TrendingDown}
                    label="Low stock"
                    value={summary.lowStock}
                    subtitle={`≤ ${LOW_STOCK_THRESHOLD} units`}
                    trend={summary.lowStock > 0 ? "Needs attention" : "Healthy levels"}
                    trendDirection={summary.lowStock > 0 ? "down" : "up"}
                    className="stock-kpi-clickable"
                    onAction={summary.lowStock > 0 ? () => onFilterSelect("low-stock") : undefined}
                    actionLabel="Review"
                />
                <PremiumKPICard
                    variant={summary.outOfStock > 0 ? "alert" : "muted"}
                    icon={AlertTriangle}
                    label="Out of stock"
                    value={summary.outOfStock}
                    subtitle="Zero units on hand"
                    trend={summary.outOfStock > 0 ? "Restock needed" : "None flagged"}
                    trendDirection={summary.outOfStock > 0 ? "down" : "up"}
                    className="stock-kpi-clickable"
                    onAction={summary.outOfStock > 0 ? () => onFilterSelect("out-of-stock") : undefined}
                    actionLabel="Review"
                />
                <PremiumKPICard
                    variant="accent"
                    icon={Package}
                    label="Pending approval"
                    value={summary.pendingApproval}
                    subtitle="Updates locked until approved"
                    className="stock-kpi-clickable"
                    onAction={summary.pendingApproval > 0 ? () => onFilterSelect("pending") : undefined}
                    actionLabel="Review"
                />
            </div>
        </>
    );
}

function StockProductCard({ item, onEdit, onDelete, onBlocked }) {
    const health = getStockHealthKey(item.quantity);
    const accent = getProductCardAccent(item);
    const { date, time } = formatDateTime(item.updated_at);
    const canEdit = canManageStock(item);
    return (
        <article className={`stock-product-card stock-product-card--${accent} ds-animate-in`}>
            <div className="stock-product-card__header">
                <div className="stock-product-card__title-wrap">
                    <div className="stock-product-icon">
                        <img
                            src={item.cover_image?.media_url}
                            alt={item.media?.media_type || "Varient Image"}
                        // onError={(e) => e.target.src = "https://via.placeholder.com/50"}
                        />
                        <Package size={16} aria-hidden />
                    </div>
                    <div className="min-w-0">
                        <p className="stock-product-name truncate iv-product-name">{item.product_name}</p>
                        <p className="stock-product-variant truncate iv-meta-value">{item.variant_title || "Default variant"}</p>
                    </div>
                </div>
                <StatusBadge status={health} label={STOCK_HEALTH_LABELS[health]} />
            </div>

            <div className="stock-product-card__metrics">
                <div className="stock-product-card__metric">
                    <p className="stock-product-card__metric-label">Quantity</p>
                    <p className="stock-product-card__metric-value">{item.quantity ?? 0}</p>
                </div>
                <div className="stock-product-card__metric">
                    <p className="stock-product-card__metric-label">Approval</p>
                    <StatusBadge status={item.approval_status || "pending"} />
                </div>
                <div className="stock-product-card__metric">
                    <p className="stock-product-card__metric-label">Sync</p>
                    <SyncBadge item={item} />
                </div>
            </div>

            <div className="stock-product-card__meta">
                <div className="stock-product-card__sku">
                    <span className="stock-product-card__metric-label">Vendor SKU</span>
                    <code className="stock-product-card__sku-value">{item.vendor_sku_code || "—"}</code>
                </div>
                <p className="stock-product-card__updated">
                    Updated {date}{time ? ` · ${time}` : ""}
                </p>
            </div>

            <div className="stock-product-card__actions">
                {canEdit ? (
                    <button
                        type="button"
                        className="stock-card-btn stock-card-btn--update ds-focus"
                        onClick={() => onEdit(item)}
                    >
                        <Pencil size={13} />
                        Update
                    </button>
                ) : (
                    <button
                        type="button"
                        className="stock-card-btn stock-card-btn--locked ds-focus"
                        onClick={() => onBlocked(item)}
                        title="Quantity update unavailable"
                    >
                        <Lock size={13} />
                        Locked
                    </button>
                )}
                <button
                    type="button"
                    className="stock-card-btn stock-card-btn--delete ds-focus"
                    onClick={() => onDelete(item)}
                >
                    <Trash2 size={13} />
                    Delete
                </button>
            </div>
        </article>
    );
}

export default function StockManagement() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [summaryItems, setSummaryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [productFilter, setProductFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = usePersistedState("vendor:stock:pageSize", 10);
    const [editingItem, setEditingItem] = useState(null);
    const [editQuantity, setEditQuantity] = useState("");
    const [deletingItem, setDeletingItem] = useState(null);
    const [blockedItem, setBlockedItem] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [productsLoaded, setProductsLoaded] = useState(false);

    // Cache refs to prevent redundant API calls
    const productsCache = useRef(null);
    const productsPromiseRef = useRef(null);
    const fetchTimeoutRef = useRef(null);

    const hasActiveQuery = Boolean(search || productFilter);

    const productOptions = useMemo(
        () => products.map((product) => ({ value: product.id, label: product.name })),
        [products]
    );

    // --- FIX 1: Single source of truth for fetching products with caching ---
    const fetchProducts = useCallback(async (forceRefresh = false) => {
        // Return cached products if available and not forcing refresh
        if (!forceRefresh && productsCache.current) {
            return productsCache.current;
        }

        // Prevent multiple concurrent fetch attempts
        if (productsPromiseRef.current && !forceRefresh) {
            return productsPromiseRef.current;
        }

        productsPromiseRef.current = (async () => {
            try {
                const normalized = await fetchAllVendorProducts(vendorService);
                productsCache.current = normalized;
                setProducts(normalized);
                setProductsLoaded(true);
                return normalized;
            } catch (error) {
                console.error('Failed to fetch products:', error);
                throw error;
            } finally {
                productsPromiseRef.current = null;
            }
        })();

        return productsPromiseRef.current;
    }, []);

    const enrichRows = useCallback(async (results, productList, options = {}) => {
        return enrichInventoryWithApproval(results, productList, vendorService, options);
    }, []);

    // --- FIX 2: Combined data fetching to avoid multiple calls ---
    const fetchAllData = useCallback(async (options = {}) => {
        const { skipInventory = false, skipSummary = false, forceRefresh = false } = options;
        
        try {
            // Fetch products first (or get from cache)
            const productList = await fetchProducts(forceRefresh);
            
            // Fetch inventory and summary in parallel
            const promises = [];
            
            if (!skipInventory) {
                promises.push(
                    (async () => {
                        try {
                            const inventoryRes = await vendorService.getInventory({
                                page,
                                page_size: pageSize,
                                search: search || undefined,
                                product_id: productFilter || undefined,
                            });
                            const { results, count } = parseInventoryListResponse(inventoryRes);
                            const enrichedItems = await enrichRows(results, productList, { verifyLive: true });
                            return { items: enrichedItems, count };
                        } catch (err) {
                            const status = err?.response?.status;
                            const message = err?.response?.data?.message || err.message || "Failed to load stock";
                            setError(
                                status === 403
                                    ? message || "Your vendor account must be approved before managing inventory."
                                    : message
                            );
                            throw err;
                        }
                    })()
                );
            }
            
            if (!skipSummary) {
                promises.push(
                    (async () => {
                        try {
                            setSummaryLoading(true);
                            const response = await vendorService.getInventory({ page_size: 500 });
                            const { results } = parseInventoryListResponse(response);
                            const enrichedSummary = await enrichRows(results, productList);
                            return enrichedSummary;
                        } catch (error) {
                            console.error('Failed to fetch summary:', error);
                            return [];
                        } finally {
                            setSummaryLoading(false);
                        }
                    })()
                );
            }
            
            // Wait for all promises to resolve
            const results = await Promise.allSettled(promises);
            
            // Process results
            let inventoryResult = null;
            let summaryResult = null;
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    if (!skipInventory && index === 0) {
                        inventoryResult = result.value;
                    } else if (!skipSummary && (skipInventory ? index === 0 : index === 1)) {
                        summaryResult = result.value;
                    }
                }
            });
            
            // Update state
            if (inventoryResult) {
                setItems(inventoryResult.items);
                setTotalCount(inventoryResult.count);
            }
            
            if (summaryResult) {
                setSummaryItems(summaryResult);
            }
            
            return { inventory: inventoryResult, summary: summaryResult };
            
        } catch (error) {
            console.error('Failed to fetch all data:', error);
            throw error;
        }
    }, [page, pageSize, search, productFilter, fetchProducts, enrichRows]);

    // --- FIX 3: Dedicated fetch functions that use the combined approach ---
    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            await fetchAllData({ skipSummary: true });
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchAllData]);

    const fetchSummary = useCallback(async () => {
        try {
            const productList = await fetchProducts();
            setSummaryLoading(true);
            const response = await vendorService.getInventory({ page_size: 500 });
            const { results } = parseInventoryListResponse(response);
            const enrichedSummary = await enrichRows(results, productList);
            setSummaryItems(enrichedSummary);
        } catch (error) {
            console.error('Failed to fetch summary:', error);
            setSummaryItems([]);
        } finally {
            setSummaryLoading(false);
        }
    }, [fetchProducts, enrichRows]);

    // --- FIX 4: Combined reload function ---
    const reloadAll = useCallback(async (forceRefresh = false) => {
        setLoading(true);
        setRefreshing(true);
        setError("");
        try {
            await fetchAllData({ forceRefresh, skipSummary: false, skipInventory: false });
        } catch (error) {
            console.error('Failed to reload all data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [fetchAllData]);

    // --- FIX 5: Optimized initial load ---
    useEffect(() => {
        let mounted = true;
        
        const initialLoad = async () => {
            if (!mounted) return;
            
            try {
                const productList = await fetchProducts();
                if (mounted) {
                    await fetchSummary();
                }
            } catch (error) {
                console.error('Initial load failed:', error);
                if (mounted) {
                    setError('Failed to load initial data');
                    setLoading(false);
                }
            }
        };
        
        initialLoad();
        
        return () => {
            mounted = false;
            // Clear any pending timeouts
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, []); // Empty dependency array - run only once

    // --- FIX 6: Debounced inventory fetch for search/filter changes ---
    useEffect(() => {
        // Clear existing timeout
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }

        // Only fetch if products are loaded
        if (productsLoaded) {
            fetchTimeoutRef.current = setTimeout(() => {
                fetchInventory();
            }, 300); // Debounce search/filter changes
        }
        
        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [page, pageSize, search, productFilter, productsLoaded, fetchInventory]);

    // --- FIX 7: Handle editing item blocked check ---
    useEffect(() => {
        if (editingItem && !canManageStock(editingItem)) {
            setEditingItem(null);
            setBlockedItem(editingItem);
        }
    }, [editingItem]);

    const handleRefresh = async () => {
        await reloadAll(true); // Force refresh
    };

    const summary = useMemo(() => computeInventorySummary(summaryItems), [summaryItems]);
    const filterCounts = useMemo(() => computeFilterCounts(items), [items]);
    const filteredItems = useMemo(() => filterInventoryItems(items, stockFilter), [items, stockFilter]);

    const applyStockFilter = (key) => {
        const mapped = KPI_FILTER_MAP[key] || key;
        setStockFilter(mapped);
    };

    const showApprovalBlocked = useCallback((item) => {
        setBlockedItem(item);
    }, []);

    const closeApprovalBlocked = useCallback(() => {
        setBlockedItem(null);
    }, []);

    const openEdit = (item) => {
        if (!canManageStock(item)) {
            showApprovalBlocked(item);
            return;
        }
        setEditingItem(item);
        setEditQuantity(String(item.quantity ?? 0));
    };

    const viewBlockedProductStatus = () => {
        if (!blockedItem?.product_id) {
            closeApprovalBlocked();
            navigate("/vendor/products");
            return;
        }
        closeApprovalBlocked();
        navigate(`/vendor/edit-product/${blockedItem.product_id}`);
    };

    const adjustQuantity = (delta) => {
        setEditQuantity((prev) => String(Math.max(0, (Number(prev) || 0) + delta)));
    };

    const setPresetQuantity = (value) => {
        setEditQuantity(String(Math.max(0, value)));
    };

    // --- FIX 8: Save quantity with optimistic update ---
    const saveQuantity = async () => {
        if (!editingItem) return;

        setSaving(true);
        try {
            let liveApproval;
            try {
                liveApproval = await fetchVariantApprovalStatus(
                    editingItem.product_id,
                    editingItem.variant_id,
                    vendorService
                );
            } catch {
                toast.error("Could not verify variant approval status. Please try again.");
                setSaving(false);
                return;
            }

            if (liveApproval !== "approved") {
                setEditingItem(null);
                showApprovalBlocked({ ...editingItem, approval_status: liveApproval });
                await reloadAll(true);
                setSaving(false);
                return;
            }

            const quantity = Number(editQuantity);
            if (Number.isNaN(quantity) || quantity < 0) {
                toast.error("Enter a valid quantity (0 or greater)");
                setSaving(false);
                return;
            }
            if (quantity === (editingItem.quantity ?? 0)) {
                toast.error("Quantity is unchanged");
                setSaving(false);
                return;
            }

            // Optimistic update
            const optimisticItems = items.map(item => 
                item.id === editingItem.id ? { ...item, quantity } : item
            );
            setItems(optimisticItems);

            await vendorService.updateInventory(editingItem.id, {
                action: "set",
                quantity,
            });
            toast.success("Stock updated successfully");
            setEditingItem(null);
            
            // Refresh data in background
            await reloadAll(true);
        } catch (err) {
            // Rollback optimistic update
            await reloadAll(true);
            
            if (isApprovalRelatedStockError(err)) {
                setEditingItem(null);
                showApprovalBlocked(editingItem);
            } else {
                const message = extractApiErrorMessage(err, "Failed to update stock");
                toast.error(isUnicommerceSyncError(err) ? `Unicommerce sync: ${message}` : message);
            }
        } finally {
            setSaving(false);
        }
    };

    // --- FIX 9: Delete with optimistic update ---
    const confirmDelete = async () => {
        if (!deletingItem) return;
        try {
            setDeleting(true);
            
            // Optimistic delete
            const optimisticItems = items.filter(item => item.id !== deletingItem.id);
            setItems(optimisticItems);
            
            await vendorService.deleteInventory(deletingItem.id);
            toast.success("Inventory record deleted");
            setDeletingItem(null);
            
            // Refresh data in background
            await reloadAll(true);
        } catch (err) {
            // Rollback optimistic delete
            await reloadAll(true);
            toast.error(err?.response?.data?.message || "Failed to delete inventory");
        } finally {
            setDeleting(false);
        }
    };

    const editDelta = editingItem ? (Number(editQuantity) || 0) - (editingItem.quantity || 0) : 0;
    const editQuantityUnchanged = editingItem && (Number(editQuantity) || 0) === (editingItem.quantity ?? 0);
    const editBlocked = editingItem && !canManageStock(editingItem);

    const activeFilterLabels = [
        search && `Search: "${search}"`,
        productFilter && products.find((p) => p.id === productFilter)?.name,
        stockFilter !== "all" && STOCK_FILTERS.find((f) => f.key === stockFilter)?.label,
    ].filter(Boolean);

    return (
        <div className="stock-page">
            <DashboardPageShell
                title="Stock"
                accent="Management"
                subtitle="View and manage on-hand inventory across your product variants."
                breadcrumbs={[]}
                contentClassName="stock-page-content p-4 sm:p-6 lg:p-8"
                actions={
                    <Button
                        variant="secondary"
                        onClick={handleRefresh}
                        loading={refreshing}
                        disabled={loading}
                        className="!text-sm"
                    >
                        {!refreshing && <RefreshCw size={16} />}
                        Refresh
                    </Button>
                }
            >
                <StockKpiSection
                    summary={summary}
                    listTotalCount={totalCount}
                    summaryLoading={summaryLoading}
                    hasActiveQuery={hasActiveQuery}
                    onFilterSelect={applyStockFilter}
                />

                <div className="stock-toolbar-panel">
                    <div className="stock-toolbar-shell">
                        <SearchToolbar
                            className="stock-toolbar-search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onSubmit={() => {
                                setPage(1);
                                setSearch(searchInput.trim());
                            }}
                            onClear={
                                search || searchInput || productFilter
                                    ? () => {
                                        setSearch("");
                                        setSearchInput("");
                                        setProductFilter("");
                                        setStockFilter("all");
                                        setPage(1);
                                    }
                                    : undefined
                            }
                            placeholder="Search system SKU, vendor SKU, variant, or product name…"
                        >
                            <SelectFilter
                                value={productFilter}
                                onChange={(e) => {
                                    setProductFilter(e.target.value);
                                    setPage(1);
                                }}
                                options={productOptions}
                                placeholder="All products"
                                aria-label="Filter by product"
                                className="w-[14rem] min-w-[10rem] max-w-[16rem]"
                            />
                        </SearchToolbar>

                        <div className="stock-filter-row">
                            {STOCK_FILTERS.map((filter) => (
                                <button
                                    key={filter.key}
                                    type="button"
                                    className={`stock-filter-chip ${stockFilter === filter.key ? "stock-filter-chip--active" : ""}`}
                                    onClick={() => setStockFilter(filter.key)}
                                >
                                    {filter.label}
                                    <span className="stock-filter-count">{filterCounts[filter.key] ?? 0}</span>
                                </button>
                            ))}
                            <span className="stock-filter-hint">Filters apply to the current page</span>
                        </div>
                    </div>
                </div>

                <div className={`stock-content-shell ${refreshing ? "stock-content-shell--refreshing" : ""}`}>
                    {loading ? (
                        <StockCardGridSkeleton count={Math.min(pageSize, 6)} />
                    ) : error ? (
                        <PageError message={error} onRetry={reloadAll} />
                    ) : filteredItems.length === 0 ? (
                        <PageEmpty
                            title={items.length === 0 ? "No stock records found" : "No records match this filter"}
                            description={
                                items.length === 0
                                    ? search || productFilter
                                        ? "Try adjusting your search or product filter."
                                        : "Inventory records are created when you add products with variants. Manage quantities here after catalog setup."
                                    : "Try a different stock health filter or clear your selection."
                            }
                            action={
                                items.length === 0 && !search && !productFilter ? (
                                    <Button onClick={() => navigate("/vendor/products")}>Go to Products</Button>
                                ) : stockFilter !== "all" ? (
                                    <Button variant="secondary" onClick={() => setStockFilter("all")}>
                                        Show all on this page
                                    </Button>
                                ) : null
                            }
                        />
                    ) : (
                        <TableCard className="stock-records-panel">
                            <div className="stock-results-meta">
                                <span>
                                    Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong>{" "}
                                    on this page · <strong>{totalCount.toLocaleString()}</strong> total records
                                </span>
                                {activeFilterLabels.length > 0 && (
                                    <div className="stock-active-filters">
                                        {activeFilterLabels.map((label) => (
                                            <span key={label} className="stock-active-filter-tag">
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="stock-card-grid">
                                {filteredItems.map((item) => (
                                    <StockProductCard
                                        key={item.id}
                                        item={item}
                                        onEdit={openEdit}
                                        onDelete={setDeletingItem}
                                        onBlocked={showApprovalBlocked}
                                    />
                                ))}
                            </div>

                            <PaginationBar
                                page={page}
                                pageSize={pageSize}
                                totalCount={totalCount}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                                storageKey="vendor:stock"
                                itemLabel="records"
                            />
                        </TableCard>
                    )}
                </div>

                <QuantityUnavailableModal
                    item={blockedItem}
                    open={Boolean(blockedItem)}
                    onClose={closeApprovalBlocked}
                    onViewProduct={viewBlockedProductStatus}
                />

                <Modal
                    open={Boolean(editingItem)}
                    onClose={() => !saving && setEditingItem(null)}
                    title="Update stock quantity"
                    subtitle={
                        editingItem
                            ? `${editingItem.product_name} · ${editingItem.variant_title || "Default variant"}`
                            : ""
                    }
                    size="md"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setEditingItem(null)} disabled={saving}>
                                Cancel
                            </Button>
                            <Button
                                onClick={saveQuantity}
                                loading={saving}
                                disabled={editQuantityUnchanged || saving || editBlocked}
                            >
                                Save quantity
                            </Button>
                        </>
                    }
                >
                    {editingItem && (
                        <>
                            <div className="stock-sku-stack mb-4">
                                <span className="text-xs text-gray-500">Vendor SKU</span>
                                <code className="stock-sku-vendor">{editingItem.vendor_sku_code || "—"}</code>
                                {editingItem.sku_code && (
                                    <>
                                        <span className="text-xs text-gray-500 mt-2">System SKU</span>
                                        <code className="stock-sku-system">{editingItem.sku_code}</code>
                                    </>
                                )}
                            </div>

                            <div className="stock-update-preview">
                                <div className="stock-update-stat">
                                    <p className="stock-update-stat-label">Current</p>
                                    <p className="stock-update-stat-value">{editingItem.quantity ?? 0}</p>
                                </div>
                                <div className="stock-update-stat">
                                    <p className="stock-update-stat-label">New</p>
                                    <p className="stock-update-stat-value">{Number(editQuantity) || 0}</p>
                                </div>
                                <div className="stock-update-stat">
                                    <p className="stock-update-stat-label">Change</p>
                                    <p
                                        className={`stock-update-stat-value ${editDelta > 0
                                            ? "stock-update-stat-value--delta-positive"
                                            : editDelta < 0
                                                ? "stock-update-stat-value--delta-negative"
                                                : ""
                                            }`}
                                    >
                                        {editDelta > 0 ? "+" : ""}
                                        {editDelta}
                                    </p>
                                </div>
                            </div>

                            <label htmlFor="stock-quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity on hand
                            </label>
                            <div className="stock-qty-stepper">
                                <button
                                    type="button"
                                    className="stock-qty-stepper-btn"
                                    onClick={() => adjustQuantity(-1)}
                                    disabled={saving || (Number(editQuantity) || 0) <= 0}
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>
                                <input
                                    id="stock-quantity"
                                    type="number"
                                    min="0"
                                    step="1"
                                    autoFocus
                                    value={editQuantity}
                                    onChange={(e) => setEditQuantity(e.target.value)}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !editQuantityUnchanged && !saving) {
                                            e.preventDefault();
                                            saveQuantity();
                                        }
                                    }}
                                    className="stock-qty-stepper-input"
                                />
                                <button
                                    type="button"
                                    className="stock-qty-stepper-btn"
                                    onClick={() => adjustQuantity(1)}
                                    disabled={saving}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <div className="stock-qty-presets">
                                {QTY_PRESETS.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        className="stock-qty-preset"
                                        disabled={saving}
                                        onClick={() => setPresetQuantity(preset)}
                                    >
                                        Set {preset}
                                    </button>
                                ))}
                            </div>

                            <div className="stock-modal-notice stock-modal-notice--sync">
                                <strong>Unicommerce sync:</strong> Saving updates inventory and syncs to Unicommerce.
                                If sync fails, you will see an error and the quantity will not be saved.
                            </div>
                        </>
                    )}
                </Modal>

                <Modal
                    open={Boolean(deletingItem)}
                    onClose={() => !deleting && setDeletingItem(null)}
                    title="Delete inventory record"
                    subtitle={deletingItem ? deletingItem.product_name : ""}
                    size="sm"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setDeletingItem(null)} disabled={deleting}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={confirmDelete} loading={deleting}>
                                Delete record
                            </Button>
                        </>
                    }
                >
                    {deletingItem && (
                        <div className="stock-delete-warning">
                            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" aria-hidden />
                            <div>
                                <p className="font-semibold">This action cannot be undone.</p>
                                <p className="mt-1">
                                    Delete inventory for{" "}
                                    <strong>{deletingItem.variant_title || "this variant"}</strong> (
                                    {deletingItem.quantity ?? 0} units on hand)? The variant itself remains in your
                                    catalog.
                                </p>
                            </div>
                        </div>
                    )}
                </Modal>
            </DashboardPageShell>
        </div>
    );
}