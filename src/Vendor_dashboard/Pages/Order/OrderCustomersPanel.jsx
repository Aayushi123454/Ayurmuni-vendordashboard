import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { customerService } from "../../../services/customerService";
import {
    PageEmpty,
    PageError,
    PaginationBar,
    TableCard,
} from "../../components/shared/PageState";
import { TableSkeleton } from "../../components/shared/Skeleton";
import SearchToolbar from "../../components/shared/SearchToolbar";
import StatusBadge from "../../components/shared/StatusBadge";
import DataTable, { TableCell, TableRow } from "../../components/shared/DataTable";
import {
    formatCustomerStatusLabel,
    parseCustomersListResponse,
} from "../Customers/customerHelpers";

const COLUMNS = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "orders", label: "Orders" },
    { key: "ltv", label: "Lifetime value" },
    { key: "status", label: "Status" },
];

export default function OrderCustomersPanel({ refreshToken = 0 }) {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchCustomers = useCallback(async () => {
        setError("");
        setLoading(true);
        try {
            const response = await customerService.list({
                page,
                page_size: pageSize,
                search: search || undefined,
            });
            const parsed = parseCustomersListResponse(response);
            setCustomers(parsed.results);
            setCount(parsed.count);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to load customers");
            setCustomers([]);
            setCount(0);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers, refreshToken]);

    const hasSearch = Boolean(search || searchInput);

    return (
        <>
            <SearchToolbar
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSubmit={() => {
                    setPage(1);
                    setSearch(searchInput.trim());
                }}
                onClear={
                    hasSearch
                        ? () => {
                              setSearch("");
                              setSearchInput("");
                              setPage(1);
                          }
                        : undefined
                }
                placeholder="Search by name, email, or phone…"
            />

            {loading ? (
                <TableSkeleton columns={COLUMNS.length} rows={Math.min(pageSize, 8)} />
            ) : error ? (
                <PageError message={error} onRetry={fetchCustomers} />
            ) : customers.length === 0 ? (
                <PageEmpty
                    icon={Users}
                    title="No customers found"
                    description={
                        search
                            ? "Try a different search term."
                            : "Customers will appear here once orders are placed."
                    }
                />
            ) : (
                <TableCard>
                    <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        Showing <strong>{customers.length}</strong> of{" "}
                        <strong>{count.toLocaleString()}</strong> customers
                    </div>
                    <DataTable columns={COLUMNS}>
                        {customers.map((customer) => (
                            <TableRow
                                key={customer.id}
                                onClick={() => navigate(`/vendor/customers/${customer.id}`)}
                            >
                                <TableCell className="font-semibold text-gray-800">
                                    {customer.name || "—"}
                                </TableCell>
                                <TableCell>{customer.email || "—"}</TableCell>
                                <TableCell>{customer.orders_count ?? 0}</TableCell>
                                <TableCell className="font-semibold text-[#0D614E]">
                                    ₹{(customer.lifetime_value ?? 0).toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge
                                        status={customer.status === "active" ? "active" : "inactive"}
                                        label={formatCustomerStatusLabel(customer.status)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </DataTable>
                    <PaginationBar
                        page={page}
                        pageSize={pageSize}
                        totalCount={count}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setPage(1);
                        }}
                        storageKey="vendor:order-customers"
                        itemLabel="customers"
                    />
                </TableCard>
            )}
        </>
    );
}
