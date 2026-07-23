import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Package, Pencil, Trash2 } from "lucide-react";
import { vendorService } from "../../../services/vendorService";
import usePersistedState from "../../hooks/usePersistedState";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { PageEmpty, PageError, PageLoader, PaginationBar } from "../../components/shared/PageState";
import { TableSkeleton } from "../../components/shared/Skeleton";
import StatusBadge from "../../components/shared/StatusBadge";
import SearchToolbar from "../../components/shared/SearchToolbar";
import DataTable, { TableRow, TableCell } from "../../components/shared/DataTable";
import Modal from "../../components/shared/Modal";
import Button, { IconButton } from "../../components/shared/Button";
import UnicommerceNotice from "../../components/shared/UnicommerceNotice";
import {
    extractApiErrorMessage,
    isUnicommerceSyncError,
    UNICOMMERCE_NOTICES,
} from "../../../utils/unicommerceHelpers";

const LOW_STOCK_THRESHOLD = 10;

const COLUMNS = [
    { key: "product", label: "Product" },
    { key: "vendor_sku", label: "Vendor SKU" },
    { key: "system_sku", label: "System SKU" },
    { key: "variant", label: "Variant" },
    { key: "qty", label: "Quantity", sortable: true },
    { key: "status", label: "Status" },
    { key: "updated", label: "Updated" },
    { key: "actions", label: "Actions" },
];

export default function StockManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = usePersistedState("vendor:stock:pageSize", 10);
    const [sortKey, setSortKey] = useState("");
    const [sortDir, setSortDir] = useState("desc");
    const [editingItem, setEditingItem] = useState(null);
    const [editQuantity, setEditQuantity] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchInventory = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await vendorService.getInventory({
                page,
                page_size: pageSize,
                search: search || undefined,
            });
            const data = response.data?.data;
            setItems(data?.results || []);
            setTotalCount(data?.count || 0);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to load stock");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const sortedItems = React.useMemo(() => {
        if (sortKey !== "qty") return items;
        return [...items].sort((a, b) => {
            const diff = (a.quantity || 0) - (b.quantity || 0);
            return sortDir === "asc" ? diff : -diff;
        });
    }, [items, sortKey, sortDir]);

    const saveQuantity = async () => {
        if (!editingItem) return;
        const quantity = Number(editQuantity);
        if (Number.isNaN(quantity) || quantity < 0) {
            toast.error("Enter a valid quantity");
            return;
        }
        try {
            setSaving(true);
            await vendorService.updateInventory(editingItem.id, { quantity });
            toast.success("Stock updated");
            setEditingItem(null);
            fetchInventory();
        } catch (err) {
            const message = extractApiErrorMessage(err, "Failed to update stock");
            toast.error(isUnicommerceSyncError(err) ? `Unicommerce sync: ${message}` : message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete inventory record for ${item.product_name}?`)) return;
        try {
            await vendorService.deleteInventory(item.id);
            toast.success("Inventory record deleted");
            fetchInventory();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete inventory");
        }
    };

    const lowStockCount = items.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD).length;

    return (
        <DashboardPageShell
            title="Stock"
            accent="Management"
            subtitle="Track and update inventory quantities for your product variants. Updates sync to Unicommerce for approved variants."
            breadcrumbs={[{ label: "Dashboard" }, { label: "Stock" }]}
            actions={
                lowStockCount > 0 ? (
                    <Button variant="pill">{lowStockCount} low stock on this page</Button>
                ) : null
            }
        >
            <SearchToolbar
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSubmit={() => {
                    setPage(1);
                    setSearch(searchInput.trim());
                }}
                onClear={
                    search || searchInput
                        ? () => {
                              setSearch("");
                              setSearchInput("");
                              setPage(1);
                          }
                        : undefined
                }
                placeholder="Search SKU, product name, variant..."
            />

            <UnicommerceNotice>
                {UNICOMMERCE_NOTICES.approvedStock} {UNICOMMERCE_NOTICES.systemSku}
            </UnicommerceNotice>

            {loading ? (
                <TableSkeleton columns={8} rows={pageSize > 10 ? 8 : pageSize} />
            ) : error ? (
                <PageError message={error} onRetry={fetchInventory} />
            ) : items.length === 0 ? (
                <PageEmpty
                    title="No stock records found"
                    description={
                        search
                            ? "Try a different search term."
                            : "Stock records appear when you add products with quantities or create inventory entries."
                    }
                />
            ) : (
                <>
                    <DataTable
                        columns={COLUMNS}
                        sortKey={sortKey}
                        sortDir={sortDir}
                        onSort={handleSort}
                        stickyActions
                    >
                        {sortedItems.map((item) => {
                            const isLow = item.quantity <= LOW_STOCK_THRESHOLD;
                            const isOut = item.quantity <= 0;
                            const stockStatus = isOut ? "out-of-stock" : isLow ? "low-stock" : "instock";
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#0D614E]/10 flex items-center justify-center text-[#0D614E] transition-transform duration-200 group-hover:scale-105">
                                                <Package size={16} />
                                            </div>
                                            <span className="font-medium text-gray-800">{item.product_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.vendor_sku_code || "—"}</code></TableCell>
                                    <TableCell><code className="text-xs text-gray-500">{item.sku_code || "—"}</code></TableCell>
                                    <TableCell>{item.variant_title || "—"}</TableCell>
                                    <TableCell><span className="font-semibold tabular-nums">{item.quantity}</span></TableCell>
                                    <TableCell><StatusBadge status={stockStatus} /></TableCell>
                                    <TableCell className="text-gray-500">{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "—"}</TableCell>
                                    <TableCell sticky>
                                        <div className="flex items-center gap-2">
                                            <IconButton title="Update quantity" onClick={() => { setEditingItem(item); setEditQuantity(String(item.quantity ?? 0)); }}>
                                                <Pencil size={15} />
                                            </IconButton>
                                            <IconButton title="Delete record" className="!text-rose-600 !bg-rose-50 hover:!bg-rose-100" onClick={() => handleDelete(item)}>
                                                <Trash2 size={15} />
                                            </IconButton>
                                        </div>
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
                        onPageSizeChange={setPageSize}
                        storageKey="vendor:stock"
                        itemLabel="records"
                    />
                </>
            )}

            <Modal
                open={Boolean(editingItem)}
                onClose={() => !saving && setEditingItem(null)}
                title="Update Stock"
                subtitle={editingItem ? `${editingItem.product_name} · Vendor SKU: ${editingItem.vendor_sku_code || "—"}` : ""}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setEditingItem(null)} disabled={saving}>Cancel</Button>
                        <Button onClick={saveQuantity} loading={saving}>{saving ? "Saving..." : "Save"}</Button>
                    </>
                }
            >
                {editingItem?.sku_code && (
                    <p className="mb-4 text-sm text-gray-500">
                        System SKU (Unicommerce): <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{editingItem.sku_code}</code>
                    </p>
                )}
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                    id="quantity"
                    type="number"
                    min="0"
                    autoFocus
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0D614E]/30 focus:border-[#0D614E]/40"
                />
            </Modal>
        </DashboardPageShell>
    );
}
