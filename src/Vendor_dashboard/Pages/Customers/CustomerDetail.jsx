import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  IndianRupee,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  StickyNote,
  UserRound,
} from "lucide-react";
import Ayurvedaimage from "../../../Assests/Ayurvedaimage.png";
import { customerService } from "../../../services/customerService";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import {
  Button,
  PageEmpty,
  PageError,
  PageLoader,
  PaginationBar,
  StatusBadge,
} from "../../components/shared";
import {
  customerInitials,
  filterCustomerOrders,
  formatCustomerStatusLabel,
  formatDateOnly,
  formatDeliveryAddress,
  getOrderItemCount,
  getOrderTotal,
  parseCustomerDetailResponse,
  sortAddresses,
  summarizeOrderStatuses,
} from "./customerHelpers";
import {
  formatCurrency,
  formatOrderDate,
  formatPaymentLabel,
  formatStatusLabel,
} from "../Order/orderHelpers";
import "../../components/shared/vendor-shared.css";
import "../Order/Order.css";
import "./CustomerDetail.css";

const STATUS_BAR_COLORS = {
  processing: "#3b82f6",
  shipped: "#0ea5e9",
  delivered: "#059669",
  cancelled: "#ef4444",
  pending: "#8b5cf6",
  confirmed: "#16a34a",
  returned: "#d97706",
};

const STATUS_FILTER_ORDER = [
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "pending",
  "confirmed",
  "returned",
];

function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  if (!value) return null;

  return (
    <button type="button" className="order-copy-btn" onClick={handleCopy} aria-label={label}>
      {copied ? <CheckCircle2 size={13} /> : <ClipboardCopy size={13} />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

function MetaStat({ icon: Icon, label, value, hint }) {
  return (
    <div className="order-meta-stat">
      <div className="order-meta-stat-icon">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="order-meta-stat-label">{label}</p>
        <p className="order-meta-stat-value truncate">{value}</p>
        {hint ? <p className="order-meta-stat-hint">{hint}</p> : null}
      </div>
    </div>
  );
}

function ProductThumb({ src, alt }) {
  return (
    <img
      src={src || Ayurvedaimage}
      alt={alt || ""}
      className="order-item-thumb !w-12 !h-12"
      onError={(event) => {
        event.currentTarget.src = Ayurvedaimage;
      }}
    />
  );
}

function OrderItems({ items = [] }) {
  if (!items.length) {
    return <p className="text-sm text-gray-500">No items on this order.</p>;
  }

  return (
    <div className="order-item-list">
      {items.map((item) => (
        <div key={item.order_item_id} className="order-item-card">
          <ProductThumb
            src={item.cover_image || item.product_image}
            alt={item.product_name || "Product"}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800">
                  {item.variant_title || item.product_name || "Product"}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {[item.product_name && item.variant_title ? item.product_name : null, item.sku_code]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </p>
              </div>
              <p className="font-semibold text-[#0D614E] whitespace-nowrap">
                {formatCurrency(item.total_amount)}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              <span>Qty {item.quantity}</span>
              <span>{formatCurrency(item.price)} each</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, expanded, onToggle, onOpen }) {
  const { date, time } = formatOrderDate(order.date);
  const { lines, quantity } = getOrderItemCount(order);
  const address = formatDeliveryAddress(order.delivery_address);

  return (
    <article className={`customer-order-card ${expanded ? "is-open" : ""}`}>
      <button type="button" className="customer-order-toggle" onClick={onToggle}>
        <div className="flex items-start gap-3 min-w-0">
          <span className="mt-1 text-gray-400">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-900">
                {order.order_display_code || order.order_code}
              </span>
              <StatusBadge status={order.status} label={formatStatusLabel(order.status)} />
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">{order.order_code}</p>
            <p className="text-xs text-gray-500 mt-1">
              {date}
              {time ? ` · ${time}` : ""}
              {" · "}
              {formatPaymentLabel(order.payment_type, order.payment_method)}
            </p>
          </div>
        </div>
        <div className="text-right ml-auto">
          <p className="text-base font-bold text-[#0D614E]">{formatCurrency(getOrderTotal(order))}</p>
          <p className="text-xs text-gray-500 mt-1">
            {lines} item{lines === 1 ? "" : "s"} · {quantity} unit{quantity === 1 ? "" : "s"}
          </p>
        </div>
      </button>

      {expanded ? (
        <div className="customer-order-body">
          <div className="flex items-start gap-2 py-4">
            <MapPin size={16} className="text-[#0D614E] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Deliver to</p>
              <p className="text-sm text-gray-800 mt-1">{address}</p>
              {order.delivery_address?.address_type_name ? (
                <p className="text-xs text-gray-500 mt-1">
                  {order.delivery_address.address_type_name}
                  {order.delivery_address.is_default ? " · Default" : ""}
                </p>
              ) : null}
            </div>
          </div>
          <OrderItems items={order.items} />
          <div className="flex justify-end pt-3">
            <Button variant="secondary" className="!text-sm !py-2" onClick={onOpen}>
              Open order
            </Button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await customerService.get(id);
      setCustomer(parseCustomerDetailResponse(response));
    } catch (err) {
      setCustomer(null);
      setError(err?.response?.data?.message || err.message || "Failed to load customer");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const orderHistory = customer?.order_history || [];
  const addresses = useMemo(() => sortAddresses(customer?.addresses || []), [customer]);
  const statusCounts = useMemo(() => summarizeOrderStatuses(orderHistory), [orderHistory]);
  const hasNotes = Boolean(customer?.notes);

  const tabs = useMemo(() => {
    const next = [
      { id: "overview", label: "Overview" },
      { id: "orders", label: `Orders (${orderHistory.length})` },
      { id: "addresses", label: `Addresses (${addresses.length})` },
    ];
    if (hasNotes) next.push({ id: "notes", label: "Notes" });
    return next;
  }, [addresses.length, hasNotes, orderHistory.length]);

  const filteredOrders = useMemo(
    () =>
      filterCustomerOrders(orderHistory, {
        status: statusFilter,
        search: searchInput,
      }),
    [orderHistory, searchInput, statusFilter]
  );

  useEffect(() => {
    setPage(1);
    setExpandedOrderId(null);
  }, [statusFilter, searchInput, activeTab]);

  const pagedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  const statusMix = useMemo(() => {
    const known = STATUS_FILTER_ORDER.filter((key) => statusCounts[key]);
    const extras = Object.keys(statusCounts).filter((key) => !STATUS_FILTER_ORDER.includes(key));
    return [...known, ...extras].map((key) => ({
      key,
      count: statusCounts[key],
      color: STATUS_BAR_COLORS[key] || "#9ca3af",
    }));
  }, [statusCounts]);

  const latestDeliveryAddress =
    orderHistory[0]?.delivery_address || addresses.find((address) => address.is_default) || addresses[0] || null;

  const openOrdersTab = (status = "all") => {
    setStatusFilter(status);
    setActiveTab("orders");
  };

  const customersPath = "/vendor/orders?view=customers";

  return (
    <DashboardPageShell
      title="Customer"
      accent="Profile"
      subtitle={customer?.name || "Customer details"}
      breadcrumbs={[
        { label: "Customers", href: customersPath },
        { label: customer?.name || "Detail" },
      ]}
      contentClassName="vendor-page-content order-page-content customer-page-content"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate(customersPath)} className="!text-sm">
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button variant="secondary" onClick={fetchCustomer} disabled={isLoading} className="!text-sm">
            <RefreshCw size={16} className={isLoading ? "animate-spin" : undefined} />
            Refresh
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <PageLoader message="Loading customer…" />
      ) : error ? (
        <PageError message={error} onRetry={fetchCustomer} />
      ) : !customer ? (
        <PageEmpty
          icon={UserRound}
          title="Customer not found"
          description="This customer may have been removed or is not linked to your orders."
          action={<Button onClick={() => navigate(customersPath)}>Back to customers</Button>}
        />
      ) : (
        <div className="order-detail-layout ds-stagger">
          <section className="ds-card order-detail-hero">
            <div className="order-detail-hero-top">
              <div className="flex items-start gap-4 min-w-0">
                <div className="customer-avatar" aria-hidden>
                  {customerInitials(customer.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                      {customer.name || "Customer"}
                    </h2>
                    <StatusBadge
                      status={customer.status === "active" ? "active" : "inactive"}
                      label={formatCustomerStatusLabel(customer.status)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {customer.phone ? (
                      <span className="customer-contact-chip">
                        <Phone size={13} />
                        <a href={`tel:${customer.phone}`} className="truncate hover:underline">
                          {customer.phone}
                        </a>
                        <CopyButton value={customer.phone} label="Copy" />
                      </span>
                    ) : null}
                    {customer.email ? (
                      <span className="customer-contact-chip">
                        <Mail size={13} />
                        <a href={`mailto:${customer.email}`} className="truncate hover:underline">
                          {customer.email}
                        </a>
                        <CopyButton value={customer.email} label="Copy" />
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="order-detail-hero-amount">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Lifetime value
                </p>
                <p className="text-2xl font-bold text-[#0D614E] mt-0.5">
                  {formatCurrency(customer.lifetime_value)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {customer.currency || "INR"} · {customer.orders_count ?? 0} orders
                </p>
              </div>
            </div>

            <div className="order-meta-grid">
              <MetaStat
                icon={ShoppingBag}
                label="Total orders"
                value={String(customer.orders_count ?? orderHistory.length)}
                hint={`${orderHistory.length} in history`}
              />
              <MetaStat
                icon={IndianRupee}
                label="Lifetime value"
                value={formatCurrency(customer.lifetime_value)}
                hint={customer.currency || "INR"}
              />
              <MetaStat
                icon={Package}
                label="Last order"
                value={formatDateOnly(customer.last_order_at)}
                hint={
                  orderHistory[0]
                    ? orderHistory[0].order_display_code || orderHistory[0].order_code
                    : "No orders yet"
                }
              />
              <MetaStat
                icon={MapPin}
                label="Addresses"
                value={`${addresses.length} saved`}
                hint={addresses.find((address) => address.is_default)?.city || "From past orders"}
              />
            </div>
          </section>

          <div className="order-view-tabs" role="tablist" aria-label="Customer sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`order-view-tab ${activeTab === tab.id ? "order-view-tab--active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="order-detail-grid">
              <div className="space-y-4">
                {statusMix.length > 0 ? (
                  <section className="ds-card order-detail-section">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h3>Order mix</h3>
                      <button
                        type="button"
                        className="text-sm text-[#0D614E] hover:underline"
                        onClick={() => openOrdersTab("all")}
                      >
                        View all
                      </button>
                    </div>
                    <div className="customer-status-mix mb-4" aria-hidden>
                      {statusMix.map((item) => (
                        <span
                          key={item.key}
                          className="customer-status-mix-seg"
                          style={{
                            width: `${(item.count / orderHistory.length) * 100}%`,
                            background: item.color,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statusMix.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          className="customer-status-chip"
                          onClick={() => openOrdersTab(item.key)}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: item.color }}
                            aria-hidden
                          />
                          <span>{formatStatusLabel(item.key)}</span>
                          <span className="customer-status-chip-count">{item.count}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="ds-card order-detail-section">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3>Recent orders</h3>
                    {orderHistory.length > 3 ? (
                      <button
                        type="button"
                        className="text-sm text-[#0D614E] hover:underline"
                        onClick={() => openOrdersTab("all")}
                      >
                        View all
                      </button>
                    ) : null}
                  </div>
                  {orderHistory.length === 0 ? (
                    <p className="text-sm text-gray-500">No orders found for this customer.</p>
                  ) : (
                    <div className="space-y-2">
                      {orderHistory.slice(0, 3).map((order) => {
                        const { date } = formatOrderDate(order.date);
                        return (
                          <button
                            key={order.order_id}
                            type="button"
                            className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-3 text-left hover:bg-gray-50"
                            onClick={() => navigate(`/vendor/orders/${order.order_id}`)}
                          >
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {order.order_display_code || order.order_code}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {date} · {formatPaymentLabel(order.payment_type, order.payment_method)}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-semibold text-[#0D614E]">
                                {formatCurrency(getOrderTotal(order))}
                              </p>
                              <StatusBadge
                                status={order.status}
                                label={formatStatusLabel(order.status)}
                                className="mt-1"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              <div className="space-y-4">
                <section className="ds-card order-detail-section">
                  <h3>Contact</h3>
                  <dl>
                    <div className="order-detail-row">
                      <dt>Phone</dt>
                      <dd>{customer.phone || "—"}</dd>
                    </div>
                    <div className="order-detail-row">
                      <dt>Email</dt>
                      <dd>{customer.email || "—"}</dd>
                    </div>
                    <div className="order-detail-row">
                      <dt>Status</dt>
                      <dd>{formatCustomerStatusLabel(customer.status)}</dd>
                    </div>
                    <div className="order-detail-row">
                      <dt>Last order</dt>
                      <dd>{formatDateOnly(customer.last_order_at)}</dd>
                    </div>
                  </dl>
                </section>

                <section className="ds-card order-detail-section">
                  <h3>Latest delivery address</h3>
                  {latestDeliveryAddress ? (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#0D614E]/10 text-[#0D614E]">
                        <MapPin size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          {latestDeliveryAddress.address_type_name || latestDeliveryAddress.type || "Address"}
                          {latestDeliveryAddress.is_default ? (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              Default
                            </span>
                          ) : null}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDeliveryAddress(latestDeliveryAddress)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No delivery address on file yet.</p>
                  )}
                </section>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="ds-card p-4">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    type="button"
                    className={`order-view-tab ${statusFilter === "all" ? "order-view-tab--active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All · {orderHistory.length}
                  </button>
                  {statusMix.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`order-view-tab ${statusFilter === item.key ? "order-view-tab--active" : ""}`}
                      onClick={() => setStatusFilter(item.key)}
                    >
                      {formatStatusLabel(item.key)} · {item.count}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search order code, product, SKU, or address…"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D614E]/30"
                  />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <PageEmpty
                  icon={Package}
                  title="No matching orders"
                  description={
                    searchInput || statusFilter !== "all"
                      ? "Try a different status or search term."
                      : "Orders will appear here once this customer places one."
                  }
                />
              ) : (
                <div className="ds-card overflow-hidden">
                  <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    Showing <strong>{pagedOrders.length}</strong> of{" "}
                    <strong>{filteredOrders.length}</strong> orders
                  </div>
                  <div className="px-4 pb-4 space-y-3">
                    {pagedOrders.map((order) => (
                      <OrderCard
                        key={order.order_id}
                        order={order}
                        expanded={expandedOrderId === order.order_id}
                        onToggle={() =>
                          setExpandedOrderId((current) =>
                            current === order.order_id ? null : order.order_id
                          )
                        }
                        onOpen={() => navigate(`/vendor/orders/${order.order_id}`)}
                      />
                    ))}
                  </div>
                  <PaginationBar
                    page={page}
                    pageSize={pageSize}
                    totalCount={filteredOrders.length}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                    itemLabel="orders"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="grid gap-3 md:grid-cols-2">
              {addresses.length === 0 ? (
                <PageEmpty
                  className="md:col-span-2"
                  icon={MapPin}
                  title="No delivery addresses"
                  description="Addresses will appear here from this customer's orders."
                />
              ) : (
                addresses.map((address) => (
                  <article
                    key={address.id}
                    className={`ds-card customer-address-card ${address.is_default ? "is-default" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#0D614E]/10 text-[#0D614E]">
                        <MapPin size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs uppercase font-semibold text-gray-500">
                            {address.address_type_name || address.type || "Address"}
                          </span>
                          {address.is_default ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              Default
                            </span>
                          ) : null}
                        </div>
                        <p className="text-gray-800 mt-2 font-medium">
                          {formatDeliveryAddress(address)}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs text-gray-500">
                          {address.address_line_1 ? <p>Line 1: {address.address_line_1}</p> : null}
                          {address.address_line_2 ? <p>Line 2: {address.address_line_2}</p> : null}
                          {address.city ? <p>City: {address.city}</p> : null}
                          {address.state ? <p>State: {address.state}</p> : null}
                          {address.zipcode ? <p>PIN: {address.zipcode}</p> : null}
                          {address.country ? <p>Country: {address.country}</p> : null}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {activeTab === "notes" && hasNotes ? (
            <section className="ds-card order-detail-section">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote size={16} className="text-[#0D614E]" />
                <h3 className="!mb-0">Notes</h3>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
            </section>
          ) : null}
        </div>
      )}
    </DashboardPageShell>
  );
};

export default CustomerDetail;
