import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    Box,
    Clock,
    IndianRupee,
    Layers,
    Package,
    ShoppingBag,
} from "lucide-react";
import { vendorService } from "../../../services/vendorService";
import { notificationService } from "../../../services/notificationService";
import { PageError } from "../../components/shared/PageState";
import { MetricSkeleton } from "../../components/shared/Skeleton";
import image from "../../../Assests/image 4.png";
import DashboardWelcome from "./components/DashboardWelcome";
import PremiumKPICard from "./components/PremiumKPICard";
import DashboardAnalytics from "./components/DashboardAnalytics";
import DashboardRightPanel from "./components/DashboardRightPanel";
import DashboardProductsTable from "./components/DashboardProductsTable";

const LOW_STOCK_THRESHOLD = 10;

function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function buildSparkline(values) {
    return values.map((v, i) => ({ v, i }));
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [profile, setProfile] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentNotifications, setRecentNotifications] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const notifParams = new URLSearchParams({ view: "list", page: 1, page_size: 5 });
            const [productsRes, inventoryRes, profileRes, notificationsRes, notifListRes] = await Promise.all([
                vendorService.getProducts({ page: 1, page_size: 100 }),
                vendorService.getInventory({ page: 1, page_size: 100 }),
                vendorService.getProfile(),
                notificationService.get({ view: "unread_count" }),
                notificationService.get(notifParams),
            ]);

            setProducts(productsRes.data?.data?.results || []);
            setInventory(inventoryRes.data?.data?.results || []);
            setProfile(profileRes.data?.data || null);
            setUnreadCount(notificationsRes.data?.data?.unread_count || 0);
            const notifResults = notifListRes.data?.data?.results || [];
            setRecentNotifications(
                notifResults.map((n) => ({
                    ...n,
                    timeAgo: n.created_at ? timeAgo(n.created_at) : "",
                }))
            );
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const stats = useMemo(() => {
        const allVariants = products.flatMap((p) => p.variants || []);
        const pendingVariants = allVariants.filter((v) => v.approval_status === "pending");
        const approvedVariants = allVariants.filter((v) => v.approval_status === "approved").length;
        const lowStockItems = inventory.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD);
        const totalStockUnits = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);

        return {
            totalProducts: products.length,
            totalVariants: allVariants.length,
            pendingVariants,
            pendingCount: pendingVariants.length,
            approvedVariants,
            lowStockItems,
            lowStockCount: lowStockItems.length,
            totalStockUnits,
            unreadCount,
            businessName: profile?.vendor?.business_name || "Vendor",
            approvalStatus: profile?.vendor?.approval_status || "pending",
            logoUrl: profile?.vendor?.documents?.company_logo || profile?.documents?.company_logo,
        };
    }, [products, inventory, unreadCount, profile]);

    const lastSync = useMemo(() => {
        const dates = inventory.map((i) => i.updated_at).filter(Boolean);
        if (!dates.length) return null;
        const latest = new Date(Math.max(...dates.map((d) => new Date(d).getTime())));
        return latest.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    }, [inventory]);

    const stockChartData = useMemo(() => {
        return [...inventory]
            .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
            .slice(0, 8)
            .map((item) => {
                const label = item.product_name || "Product";
                return {
                    name: label.length > 14 ? `${label.slice(0, 12)}…` : label,
                    fullName: label,
                    quantity: item.quantity || 0,
                };
            });
    }, [inventory]);

    const categoryChartData = useMemo(() => {
        const map = {};
        products.forEach((product) => {
            const key = product.product_subcategory_name || product.brand_name || "Uncategorized";
            map[key] = (map[key] || 0) + 1;
        });
        return Object.entries(map)
            .map(([name, count]) => ({
                name: name.length > 14 ? `${name.slice(0, 12)}…` : name,
                fullName: name,
                count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [products]);

    const approvalChartData = useMemo(() => {
        const allVariants = products.flatMap((p) => p.variants || []);
        const counts = { approved: 0, pending: 0, rejected: 0 };
        allVariants.forEach((v) => {
            const status = v.approval_status || "pending";
            if (status in counts) counts[status] += 1;
            else counts.pending += 1;
        });
        return [
            { name: "Approved", value: counts.approved, color: "#10B981" },
            { name: "Pending", value: counts.pending, color: "#8B5CF6" },
            { name: "Rejected", value: counts.rejected, color: "#F43F5E" },
        ].filter((d) => d.value > 0);
    }, [products]);

    const stockActivityData = useMemo(() => {
        const monthMap = {};
        inventory.forEach((item) => {
            if (!item.updated_at) return;
            const date = new Date(item.updated_at);
            const key = date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
            monthMap[key] = (monthMap[key] || 0) + 1;
        });
        return Object.entries(monthMap)
            .map(([month, updates]) => ({ month, updates }))
            .sort((a, b) => {
                const parse = (m) => {
                    const [mon, yr] = m.split(" ");
                    return new Date(`${mon} 1, 20${yr}`).getTime();
                };
                return parse(a.month) - parse(b.month);
            });
    }, [inventory]);

    const topProductsData = useMemo(() => {
        return products.slice(0, 6).map((product) => {
            const variant = product.variants?.[0];
            const stock = variant?.quantity ?? variant?.stock ?? 0;
            const name = product.name || "Product";
            return {
                name: name.length > 12 ? `${name.slice(0, 10)}…` : name,
                fullName: name,
                stock,
            };
        });
    }, [products]);

    const sparklines = useMemo(() => {
        const stockTrend = stockActivityData.map((d) => d.updates);
        const productTrend = categoryChartData.map((d) => d.count);
        return {
            products: buildSparkline(productTrend.length ? productTrend : [stats.totalProducts]),
            inventory: buildSparkline(stockTrend.length ? stockTrend : [stats.totalStockUnits]),
            pending: buildSparkline([stats.pendingCount, stats.approvedVariants, stats.pendingCount]),
            notifications: buildSparkline([stats.unreadCount, stats.unreadCount]),
        };
    }, [stockActivityData, categoryChartData, stats]);

    const recentProducts = useMemo(() => {
        return products.slice(0, 12).map((product) => {
            const variant = product.variants?.[0];
            const stock = variant?.quantity ?? variant?.stock ?? 0;
            return {
                id: product.id,
                name: product.name,
                price: variant?.selling_price || variant?.mrp || 0,
                stock,
                status: variant?.approval_status || "pending",
                image: variant?.cover_image?.media_url || variant?.media?.[0]?.media_url || image,
            };
        });
    }, [products]);

    const lowStockPanelItems = useMemo(() => {
        return stats.lowStockItems.slice(0, 5).map((item) => ({
            id: item.id,
            sku: item.sku_code,
            name: item.product_name || "Unknown",
            qty: item.quantity,
        }));
    }, [stats.lowStockItems]);

    const pendingPanelVariants = useMemo(() => {
        return stats.pendingVariants.slice(0, 5).map((v) => ({
            id: v.id,
            title: v.title || "Variant",
        }));
    }, [stats.pendingVariants]);

    const todaySummary = `${stats.totalProducts} products · ${stats.totalVariants} variants · ${stats.totalStockUnits.toLocaleString()} units in stock`;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="h-40 ds-skeleton rounded-2xl" />
                <MetricSkeleton count={6} />
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 xl:col-span-8 h-80 ds-skeleton rounded-2xl" />
                    <div className="col-span-12 xl:col-span-4 h-80 ds-skeleton rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6 lg:p-8">
                <PageError message={error} onRetry={fetchDashboardData} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
                {/* Section 1 — Welcome */}
                <DashboardWelcome
                    businessName={stats.businessName}
                    approvalStatus={stats.approvalStatus}
                    logoUrl={stats.logoUrl}
                    summary={todaySummary}
                    lastSync={lastSync}
                    onAddProduct={() => navigate("/vendor/new-product")}
                    onManageStock={() => navigate("/vendor/stock")}
                    onViewProducts={() => navigate("/vendor/products")}
                />

                {/* Section 2 — KPI Cards */}
                <section className="grid grid-cols-12 gap-4 lg:gap-5">
                    <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                        <PremiumKPICard
                            variant="hero"
                            icon={Package}
                            label="Products"
                            value={stats.totalProducts}
                            subtitle={`${stats.totalVariants} active variants`}
                            trend={`+${stats.approvedVariants} approved`}
                            sparkData={sparklines.products}
                            onAction={() => navigate("/vendor/products")}
                            actionLabel="Catalog"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                        <PremiumKPICard
                            variant="accent"
                            icon={Layers}
                            label="Inventory"
                            value={stats.totalStockUnits}
                            subtitle="Total units on hand"
                            trend={stats.lowStockCount > 0 ? `${stats.lowStockCount} low stock` : "All healthy"}
                            trendDirection={stats.lowStockCount > 0 ? "down" : "up"}
                            sparkData={sparklines.inventory}
                            onAction={() => navigate("/vendor/stock")}
                            actionLabel="Stock"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                        <PremiumKPICard
                            variant="muted"
                            icon={ShoppingBag}
                            label="Orders"
                            value="—"
                            subtitle="Order management"
                            badge="Soon"
                            disabled
                            onAction={() => navigate("/vendor/orders")}
                            actionLabel="Preview"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                        <PremiumKPICard
                            variant="soft"
                            icon={IndianRupee}
                            label="Revenue"
                            value="—"
                            subtitle="Financial overview"
                            badge="Soon"
                            disabled
                            onAction={() => navigate("/vendor/finance")}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                        <PremiumKPICard
                            variant="alert"
                            icon={Clock}
                            label="Pending Approvals"
                            value={stats.pendingCount}
                            subtitle="Variants awaiting review"
                            trend={stats.pendingCount > 0 ? "Action needed" : "All clear"}
                            trendDirection={stats.pendingCount > 0 ? "down" : "up"}
                            sparkData={sparklines.pending}
                            onAction={() => navigate("/vendor/products")}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                        <PremiumKPICard
                            variant="soft"
                            icon={Bell}
                            label="Notifications"
                            value={stats.unreadCount}
                            subtitle="Unread messages"
                            trend={stats.unreadCount > 0 ? "New updates" : "Up to date"}
                            sparkData={sparklines.notifications}
                            onAction={() => navigate("/vendor/notifications")}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                        <PremiumKPICard
                            variant="accent"
                            icon={Box}
                            label="Low Stock"
                            value={stats.lowStockCount}
                            subtitle={`Threshold: ${LOW_STOCK_THRESHOLD} units`}
                            trend={stats.lowStockCount > 0 ? "Restock needed" : "Healthy levels"}
                            trendDirection={stats.lowStockCount > 0 ? "down" : "up"}
                            onAction={() => navigate("/vendor/stock")}
                        />
                    </div>
                </section>

                {/* Main + Right Panel */}
                <div className="grid grid-cols-12 gap-6 lg:gap-8">
                    <div className="col-span-12 xl:col-span-8 space-y-6 lg:space-y-8">
                        <DashboardAnalytics
                            stockChartData={stockChartData}
                            categoryChartData={categoryChartData}
                            approvalChartData={approvalChartData}
                            stockActivityData={stockActivityData}
                            topProductsData={topProductsData}
                        />
                        <DashboardProductsTable
                            products={recentProducts}
                            onEdit={(id) => navigate(`/vendor/edit-product/${id}`)}
                        />
                    </div>

                    <div className="col-span-12 xl:col-span-4">
                        <div className="xl:sticky xl:top-24">
                            <DashboardRightPanel
                                notifications={recentNotifications}
                                lowStockItems={lowStockPanelItems}
                                pendingVariants={pendingPanelVariants}
                                approvalStatus={stats.approvalStatus}
                                onNavigate={navigate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
