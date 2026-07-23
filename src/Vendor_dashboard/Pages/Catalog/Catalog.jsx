import React, { useCallback, useEffect, useState } from "react";
import { vendorService } from "../../../services/vendorService";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { PageEmpty, PageError, PageLoader } from "../../components/shared/PageState";
import StatusBadge from "../../components/shared/StatusBadge";
import SearchToolbar, { SelectFilter } from "../../components/shared/SearchToolbar";
import DataTable, { TableRow, TableCell } from "../../components/shared/DataTable";
import Button from "../../components/shared/Button";

const TABS = [
    { id: "categories", label: "Categories" },
    { id: "subcategories", label: "Subcategories" },
    { id: "brands", label: "Brands" },
    { id: "tax", label: "Tax Classes" },
];

export default function Catalog() {
    const [activeTab, setActiveTab] = useState("categories");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);

    const fetchCategories = useCallback(async () => {
        const response = await vendorService.getFieldInfo("product-category");
        setCategories(response.data?.data || []);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            let response;

            if (activeTab === "categories") {
                response = await vendorService.getFieldInfo("product-category");
            } else if (activeTab === "subcategories") {
                response = await vendorService.getFieldInfo("product-subcategory", {
                    product_category_id: selectedCategory || undefined,
                });
            } else if (activeTab === "brands") {
                response = await vendorService.getFieldInfo("brand-name");
            } else {
                response = await vendorService.getTaxClasses({ search: search || undefined });
            }

            let data = response.data?.data || [];
            if (search && activeTab !== "tax") {
                const term = search.toLowerCase();
                data = data.filter((item) =>
                    (item.name || item.title || "").toLowerCase().includes(term) ||
                    (item.code || "").toLowerCase().includes(term)
                );
            }
            setItems(data);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to load catalog data");
        } finally {
            setLoading(false);
        }
    }, [activeTab, search, selectedCategory]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        ...(activeTab === "subcategories" ? [{ key: "hsn", label: "HSN" }, { key: "tax", label: "Tax Class" }] : []),
        ...(activeTab === "tax" ? [{ key: "type", label: "Tax Type" }, { key: "rate", label: "Rate" }, { key: "calc", label: "Calculated On" }] : []),
        { key: "status", label: "Status" },
    ];

    return (
        <DashboardPageShell
            title="Product"
            accent="Catalog"
            subtitle="Browse read-only category, brand, and tax reference data for product creation."
            breadcrumbs={[{ label: "Dashboard" }, { label: "Catalog Reference" }]}
        >
            <div className="flex flex-wrap gap-2 mb-6">
                {TABS.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "primary" : "secondary"}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setSearch("");
                            setSearchInput("");
                        }}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            <SearchToolbar
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSubmit={() => setSearch(searchInput.trim())}
                onClear={searchInput ? () => { setSearch(""); setSearchInput(""); } : undefined}
                placeholder="Search by name or code..."
            >
                {activeTab === "subcategories" && (
                    <SelectFilter
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        placeholder="All categories"
                        aria-label="Filter by category"
                        options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                    />
                )}
            </SearchToolbar>

            {loading ? (
                <PageLoader message="Loading catalog..." />
            ) : error ? (
                <PageError message={error} onRetry={fetchData} />
            ) : items.length === 0 ? (
                <PageEmpty title="No records found" description="Try adjusting your search or filters." />
            ) : (
                <>
                    <DataTable columns={columns}>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-gray-800">{item.name}</TableCell>
                                <TableCell><code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.code || "—"}</code></TableCell>
                                {activeTab === "subcategories" && (
                                    <>
                                        <TableCell>{item.hsn_code || "—"}</TableCell>
                                        <TableCell>{item.tax_class_name || item.tax_class_code || "—"}</TableCell>
                                    </>
                                )}
                                {activeTab === "tax" && (
                                    <>
                                        <TableCell>{item.tax_type_display || item.tax_type || "—"}</TableCell>
                                        <TableCell>{item.percentage != null ? `${item.percentage}%` : "—"}</TableCell>
                                        <TableCell>{item.tax_calculated_on_display || item.tax_calculated_on || "—"}</TableCell>
                                    </>
                                )}
                                <TableCell>
                                    <StatusBadge status={item.is_active === false ? "inactive" : "active"} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </DataTable>
                    <p className="text-sm text-gray-500 mt-4">{items.length} record{items.length !== 1 ? "s" : ""}</p>
                </>
            )}
        </DashboardPageShell>
    );
}
