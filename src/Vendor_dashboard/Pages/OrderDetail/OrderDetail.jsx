import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Package, RefreshCw } from "lucide-react";
import { vendorService } from "../../../services/vendorService";
import Ayurvedaimage from "../../../Assests/Ayurvedaimage.png";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { PageEmpty, PageError, PageLoader } from "../../components/shared/PageState";
import StatusBadge from "../../components/shared/StatusBadge";
import Button from "../../components/shared/Button";
import {
    formatCurrency,
    formatOrderDate,
    formatPaymentLabel,
    formatStatusLabel,
} from "../Order/orderHelpers";
import "../../components/shared/vendor-shared.css";
import "../Order/Order.css";

function DetailRow({ label, children }) {
    return (
        <div className="order-detail-row">
            <dt>{label}</dt>
            <dd>{children}</dd>
        </div>
    );
}

function formatAddress(address) {
    if (!address) return "—";
    const parts = [
        address.address_line_1,
        address.address_line_2,
        address.city,
        address.state,
        address.zipcode,
        address.country,
    ].filter(Boolean);
    return parts.join(", ") || "—";
}

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadOrder = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError("");
        try {
            const response = await vendorService.getOrder(id);
            setOrder(response?.data?.data || null);
        } catch (err) {
            setOrder(null);
            setError(err?.response?.data?.message || err.message || "Failed to load order");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    const { date, time } = formatOrderDate(order?.created_at);
    const items = order?.items || [];

    return (
        <DashboardPageShell
            title="Order"
            accent="Detail"
            subtitle={order?.order_display_code || order?.order_code || "Vendor order details"}
            breadcrumbs={[
                { label: "Orders", href: "/vendor/orders" },
                { label: order?.order_display_code || order?.order_code || "Detail" },
            ]}
            contentClassName="order-page-content p-4 sm:p-6 lg:p-8"
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => navigate("/vendor/orders")} className="!text-sm">
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={loadOrder}
                        disabled={loading}
                        className="!text-sm"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </Button>
                </div>
            }
        >
            {loading ? (
                <PageLoader message="Loading order…" />
            ) : error ? (
                <PageError
                    message={error}
                    onRetry={loadOrder}
                />
            ) : !order ? (
                <PageEmpty
                    icon={Package}
                    title="Order not found"
                    description="This order may not include any of your products."
                    action={
                        <Button onClick={() => navigate("/vendor/orders")}>Back to Orders</Button>
                    }
                />
            ) : (
                <div className="order-detail-grid">
                    <div className="space-y-4">
                        <div className="ds-card order-detail-section">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {order.order_display_code || order.order_code}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {order.order_code}
                                        {date !== "—" ? ` · ${date}${time ? ` ${time}` : ""}` : ""}
                                    </p>
                                </div>
                                <StatusBadge
                                    status={order.order_status}
                                    label={formatStatusLabel(order.order_status)}
                                />
                            </div>

                            <h3>Your items</h3>
                            {items.length === 0 ? (
                                <p className="text-sm text-gray-500">No items for this vendor.</p>
                            ) : (
                                items.map((item) => {
                                    const variant = item.variant || {};
                                    return (
                                        <div key={item.id} className="order-item-card">
                                            <img
                                                src={variant.image_url || Ayurvedaimage}
                                                alt=""
                                                className="order-item-thumb"
                                                onError={(e) => {
                                                    e.currentTarget.src = Ayurvedaimage;
                                                }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-800 truncate">
                                                    {variant.variant_title || "Variant"}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {[variant.brand_name, item.sku_code]
                                                        .filter(Boolean)
                                                        .join(" · ") || "—"}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                                    <span>Qty {item.quantity}</span>
                                                    <span>{formatCurrency(item.selling_price)} each</span>
                                                    <span className="font-semibold text-[#0D614E]">
                                                        {formatCurrency(item.total_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="ds-card order-detail-section">
                            <h3>Order summary</h3>
                            <DetailRow label="Status">
                                <StatusBadge
                                    status={order.order_status}
                                    label={formatStatusLabel(order.order_status)}
                                />
                            </DetailRow>
                            <DetailRow label="Payment">
                                {formatPaymentLabel(order.payment_type, order.payment_method)}
                            </DetailRow>
                            <DetailRow label="Shipping">{order.shipping_method || "—"}</DetailRow>
                            <DetailRow label="Your subtotal">
                                <span className="text-[#0D614E] font-semibold">
                                    {formatCurrency(order.vendor_items_subtotal)}
                                </span>
                            </DetailRow>
                            <DetailRow label="Order total">
                                {formatCurrency(order.total_amount)}
                            </DetailRow>
                            {order.payment?.status ? (
                                <DetailRow label="Payment status">
                                    <StatusBadge status={order.payment.status} />
                                </DetailRow>
                            ) : null}
                        </div>

                        <div className="ds-card order-detail-section">
                            <h3 className="inline-flex items-center gap-2">
                                <MapPin size={14} />
                                Delivery address
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {formatAddress(order.delivery_address)}
                            </p>
                            {order.delivery_address?.address_type ? (
                                <p className="text-xs text-gray-400 mt-2 capitalize">
                                    {order.delivery_address.address_type}
                                </p>
                            ) : null}
                        </div>

                        <Link
                            to="/vendor/orders"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0D614E] hover:text-[#094c3d]"
                        >
                            <ArrowLeft size={14} />
                            Back to all orders
                        </Link>
                    </div>
                </div>
            )}
        </DashboardPageShell>
    );
}
