<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import "./Dashboard.css";
import icon1 from "../../../Assests/dashboard1.png"
import icon2 from "../../../Assests/dashboard2.png"
import icon3 from "../../../Assests/dashboard3.png"
import icon4 from "../../../Assests/dashboard4.png"
import icon5 from "../../../Assests/dashboard5.png"
import arrow from "../../../Assests/arrow.png"
import arrowtrend from "../../../Assests/arrowtrend.png"
import arrowtrendred from "../../../Assests/arrowtrendred.png"
import Revenue from "./Revenue";
import facecream from "../../../Assests/face cream.jpg"
import image from "../../../Assests/image 4.png"
import productimage from "../../../Assests/productImg/product1.png"
import NewlyArrivedStock from './Newarrivalstock';
import searchIcon from "../../../Assests/search.png";
import Crtical from "../../../Assests/Critical.png";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState("");



  const categories = [
    { name: "Chikitsa Yoga", value: 45, color: "#ff6b00" },
    { name: "Essential Oils", value: 28, color: "#3b82f6" },
    { name: "Medicinal Herbs", value: 18, color: "#facc15" },
    { name: "Supplements", value: 78, color: "#31c813" },

  ];

  const salesData = [
    {
      name: "Aloevera Gel",
      id: "#ORD900",
      price: 350,
      discount: 10,
      status: "completed",
      stock: 25,
      image: image

    },
    {
      name: "Cough Syrup",
      id: "#ORD901",
      price: 450,
      discount: 5,
      status: "InProgress",
      stock: 18,
      image: image
    },
    {
      name: "Amla Powder",
      id: "#ORD902",
      price: 280,
      discount: 15,
      status: "cancelled",
      stock: 12,
      image: image
    },
    {
      name: "Face Cream",
      id: "#ORD903",
      price: 520,
      discount: 8,
      status: "pending",
      stock: 30,
      image: image
    },
    {
      name: "Neem Extract",
      id: "#ORD904",
      price: 180,
      discount: 12,
      status: "InProgress",
      stock: 20,
      image: image
    },
    {
      name: "Tulsi Drops",
      id: "#ORD905",
      price: 220,
      discount: 6,
      status: "pending",
      stock: 14,
      image: image
    },
    {
      name: "Ashwagandha Powder",
      id: "#ORD906",
      price: 310,
      discount: 9,
      status: "completed",
      stock: 22,
      image: image
    },
    {
      name: "Triphala Tablet",
      id: "#ORD907",
      price: 390,
      discount: 11,
      status: "InProgress",
      stock: 16,
      image: image
    },
    {
      name: "Brahmi Tablet",
      id: "#ORD908",
      price: 260,
      discount: 7,
      status: "cancelled",
      stock: 10,
      image: image
    },
    {
      name: "Chyawanprash",
      id: "#ORD909",
      price: 480,
      discount: 5,
      status: "completed",
      stock: 28,
      image: image
    }
  ];

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const product = {
    name: "Face Cream",
    demand: 100,
    stock: 25,

  };

  const capacity = {
    safe: 70,
    warning: 50,
    risk: 30,
  };

  const Arc = ({ radius, percent, color }) => {
    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (percent / 100) * circumference;

    return (
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    );
  };
  const safe = capacity.safe || 0;
  const warning = capacity.warning || 0;
  const risk = capacity.risk || 0;

  const total = safe + warning + risk || 1;

  const safePercent = (safe / total) * 100;
  const warningPercent = (warning / total) * 100;

  return (

    <div className='notification-page'>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon1} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>

          <div className="metric-label">Total Orders</div>
          <div className="metric-value">231</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow"><img src={arrowtrend} /></span>
            <span className='trend-arrow-text'>Since Last Week</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon2} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>
          <div className="metric-label">Total Earnings</div>
          <div className="metric-value">Rs. 23,5684</div>
          <div className="metric-change trend-down">
            <span className="trend-arrow"><img src={arrowtrendred} /></span>
            <span className='trend-arrow-text'>Since Last month</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon3} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>
          <div className="metric-label">Seller Ratings</div>
          <div className="metric-value">460</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow"><img src={arrowtrend} /></span>
            <span className='trend-arrow-text'>Since Last Week</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon4} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>
          <div className="metric-label">Pending orders</div>
          <div className="metric-value">7350</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow"><img src={arrowtrend} /></span>
            <span className='trend-arrow-text'>Since Last Week</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon5} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>
          <div className="metric-label">Total Items</div>
          <div className="metric-value">152 Items</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow"><img src={arrowtrendred} /></span>
            <span className='trend-arrow-text'>Since Last Week</span>
          </div>
        </div>
      </div>


      <div className="main-grid">

        <div className="left-column">
          <div className="revenue-section">
            <Revenue />
          </div>
          <div className="table-section">
            <div className="sales-header">

              <h2 className="header2">Sales & Order</h2>

              <div className="header-right">


                <div className="sales-search-box">
                  <img src={searchIcon} alt="search" className="sales-search-icon" />
                  <input
                    type="text"
                    placeholder="Search products, orders..."
                  />
                </div>

                <select className="rc-period second">
                  <option>Monthly</option>
                </select>

              </div>

            </div>


            <table className="sales-table">
              <thead>
                <tr>
                  <th>Product's Details</th>
                  <th>Order I'D</th>
                  <th>Price</th>
                  <th className="statuscenter">Delivery Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="10"><div className="sale-product-cell skeleton-row"></div></td>
                    </tr>
                  ))
                ) : Error ? (
                  <tr>
                    <td colSpan="5" style={{ color: "red", textAlign: "center" }}>
                      {Error}
                    </td>
                  </tr>
                ) : salesData.length > 0 ? (
                  salesData.map((item, index) => (
                    <tr key={index}>
                      <td className="sale-product-cell">
                        <div className="sale-product-img">
                          <img src={item.image} alt="product" />
                        </div>

                        <div className="sale-product-info">
                          <p className="sale-product-name">{item.name}</p>
                          <span className="sale-stock-text">{item.stock} in stock</span>
                        </div>
                      </td>
                      <td>{item.id}</td>
                      <td>RS. {item.price}</td>
                      <td>
                        <span className={`status ${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn">view</button>
                      </td>
                    </tr>
                  ))) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        <div className="right-column">

          <div className="categories-card">
            <h3>Top Categories</h3>

            <div className="category-list">
              {categories.map((item, index) => (
                <div key={index} className="category-item-wrapper">

                  <div className="category-item">
                    <span className="category-name">{item.name}</span>
                    <span className="category-percentage">
                      {item.value}%
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(item.value, 100)}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>

                </div>
              ))}
            </div>
          </div>


          <div className="best-selling-card">


            <div className="card-header">
              <h3>Best selling Products</h3>
              <div className="arrows">
                <button>{<ArrowLeft size={16} />}</button>
                <button>{<ArrowRight size={16} />}</button>
              </div>
            </div>

            <div className='cardbest'>

              <div className="product-box">
                <img src={productimage} alt="product" />
              </div>

              <div className="product-info">
                <div>
                  <h4>{product.name}</h4>
                  <p>
                    Demand<span> {product.demand}  +</span>  | In Stock <span>{product.stock}</span>
                  </p>
                </div>
                <div>
                  <button className="restock-btn">Re-stock</button>
                </div>

              </div>

            </div>




            <div className="capacity ">
              <h4>Capacity Guide</h4>

              <div className="capacity-content">
                <div className="semi-chart">
                  <svg width="140" height="140">
                    <g transform="rotate(-90 70 70)">
                      <Arc radius={48} percent={safe} color="#10B981" />
                      <Arc radius={42} percent={warning} color="#FFC107" />
                      <Arc radius={36} percent={risk} color="#F43F5E" />
                    </g>
                  </svg>

                  <div className="center-text">
                    <h3>{safe}%</h3>
                    <p>Safe</p>
                  </div>
                </div>

                <div className="legend">
                  <p><span className="dot green"></span>{safe}% <span className="innerspan"> Safe</span></p>
                  <p><span className="dot yellow"></span>{warning}% <span className="innerspan">Products In Warning Zone</span></p>
                  <p><span className="dot red"></span>{risk}% <span className="innerspan">Product share In Risk Zone</span></p>
                </div>
              </div>
            </div>

            {/* Dead Stock */}
            <div className="dead-stock">
              <p>Dead Stocks</p>
              <h2>25 Items</h2>
              <p className="down"> <span><img src={arrowtrendred} /></span>Since last month</p>
            </div>



          </div>

          <div className='revenue-section1'>
            <NewlyArrivedStock />
          </div>
        </div>
      </div>




    </div>

  )
=======
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
import { reviewService } from "../../../services/reviewService";
import { parseReviewsListResponse } from "../Ratings/ratingHelpers";
import { parseFinanceMetricsResponse } from "../Finance/financeHelpers";
import { formatCurrency } from "../Order/orderHelpers";
import { getVariantCoverImageUrl } from "../../../utils/unicommerceHelpers";
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
>>>>>>> 8f191bbe844823d0bd23134c03498929df78b772
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
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [financeMetrics, setFinanceMetrics] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const notifParams = new URLSearchParams({ view: "list", page: 1, page_size: 5 });
            const [productsRes, inventoryRes, profileRes, notificationsRes, notifListRes, ordersRes, reviewsRes, financeRes] =
                await Promise.all([
                    vendorService.getProducts({ page: 1, page_size: 100 }),
                    vendorService.getInventory({ page: 1, page_size: 100 }),
                    vendorService.getProfile(),
                    notificationService.get({ view: "unread_count" }),
                    notificationService.get(notifParams),
                    vendorService.getOrders({ page: 1, page_size: 5 }).catch(() => null),
                    reviewService.getVendorReviews({ page: 1, page_size: 5, sort: "newest" }).catch(() => null),
                    vendorService.getFinanceMetrics({ details_limit: 5 }).catch(() => null),
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
            setRecentOrders(ordersRes?.data?.data?.results || []);
            const parsedReviews = parseReviewsListResponse(reviewsRes);
            setRecentReviews(parsedReviews.results.slice(0, 5));
            setFinanceMetrics(parseFinanceMetricsResponse(financeRes));
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
            const variantWithImage =
                (product.variants || []).find((v) => getVariantCoverImageUrl(v)) || product.variants?.[0];
            const stock = variantWithImage?.quantity ?? variantWithImage?.stock ?? 0;
            return {
                id: product.id,
                name: product.name,
                price: variantWithImage?.selling_price || variantWithImage?.mrp || 0,
                stock,
                status: variantWithImage?.approval_status || "pending",
                image: getVariantCoverImageUrl(variantWithImage) || image,
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
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:gap-5">
                    <div className="h-full">
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
                    <div className="h-full">
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
                    <div className="h-full sm:col-span-2 xl:col-span-1">
                        <PremiumKPICard
                            variant="muted"
                            icon={ShoppingBag}
                            label="Orders"
                            value={recentOrders.length > 0 ? recentOrders.length : "0"}
                            subtitle="Recent order activity"
                            onAction={() => navigate("/vendor/orders")}
                            actionLabel="Orders"
                        />
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-5">
                    <div className="h-full">
                        <PremiumKPICard
                            variant="soft"
                            icon={IndianRupee}
                            label="Revenue"
                            value={formatCurrency(financeMetrics?.total_revenue?.value ?? 0)}
                            subtitle="Delivered order revenue"
                            trend={
                                financeMetrics?.total_revenue?.trend_percent != null
                                    ? `${financeMetrics.total_revenue.trend_percent > 0 ? "+" : ""}${financeMetrics.total_revenue.trend_percent}% vs last month`
                                    : undefined
                            }
                            onAction={() => navigate("/vendor/finance")}
                            actionLabel="Finance"
                        />
                    </div>
                    <div className="h-full">
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
                    <div className="h-full">
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
                    <div className="h-full">
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
                                recentOrders={recentOrders}
                                recentReviews={recentReviews}
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
