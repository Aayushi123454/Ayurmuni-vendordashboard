import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import icon1 from "../../../Assests/dashboard1.png";
import icon2 from "../../../Assests/dashboard2.png";
import icon3 from "../../../Assests/dashboard3.png";
import icon4 from "../../../Assests/dashboard4.png";
import icon5 from "../../../Assests/dashboard5.png";
import arrow from "../../../Assests/arrow.png";
import searchIcon from "../../../Assests/search.png";
import image from "../../../Assests/image 4.png";
import productimage from "../../../Assests/productImg/product1.png";
import NewlyArrivedStock from "./Newarrivalstock";
import VendorDashboardCharts from "./VendorDashboardCharts";
import { vendorService } from "../../../services/vendorService";
import { notificationService } from "../../../services/notificationService";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { PageError, PageLoader } from "../../components/shared/PageState";
import StatusBadge from "../../components/shared/StatusBadge";

const LOW_STOCK_THRESHOLD = 10;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [search, setSearch] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [productsRes, inventoryRes, profileRes, notificationsRes] = await Promise.all([
        vendorService.getProducts({ page: 1, page_size: 100 }),
        vendorService.getInventory({ page: 1, page_size: 100 }),
        vendorService.getProfile(),
        notificationService.get({ view: "unread_count" }),
      ]);

      setProducts(productsRes.data?.data?.results || []);
      setInventory(inventoryRes.data?.data?.results || []);
      setProfile(profileRes.data?.data || null);
      setUnreadCount(notificationsRes.data?.data?.unread_count || 0);
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
    const pendingVariants = allVariants.filter((v) => v.approval_status === "pending").length;
    const approvedVariants = allVariants.filter((v) => v.approval_status === "approved").length;
    const lowStockItems = inventory.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD).length;
    const totalStockUnits = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return {
      totalProducts: products.length,
      totalVariants: allVariants.length,
      pendingVariants,
      approvedVariants,
      lowStockItems,
      totalStockUnits,
      unreadCount,
      businessName: profile?.vendor?.business_name || "Vendor",
      approvalStatus: profile?.vendor?.approval_status || "pending",
    };
  }, [products, inventory, unreadCount, profile]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    products.forEach((product) => {
      const key = product.product_subcategory_name || product.brand_name || "Uncategorized";
      map[key] = (map[key] || 0) + 1;
    });
    const entries = Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
    const max = entries[0]?.count || 1;
    const colors = ["#0D614E", "#10B981", "#3b82f6", "#F59E0B"];
    return entries.map((item, index) => ({
      name: item.name,
      value: Math.round((item.count / max) * 100),
      color: colors[index % colors.length],
    }));
  }, [products]);

  const stockChartData = useMemo(() => {
    return [...inventory]
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 8)
      .map((item) => {
        const label = item.product_name || "Product";
        return {
          name: label.length > 18 ? `${label.slice(0, 16)}…` : label,
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

  const recentProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products
      .filter((p) => !term || p.name?.toLowerCase().includes(term))
      .slice(0, 8)
      .map((product) => {
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
  }, [products, search]);

  const stockRows = useMemo(() => {
    return inventory.slice(0, 5).map((item) => ({
      sku: item.sku_code || item.vendor_sku_code,
      name: item.product_name,
      qty: item.quantity,
      price: 0,
    }));
  }, [inventory]);

  const bestProduct = recentProducts[0] || null;
  const safe = stats.totalStockUnits > 0
    ? Math.round(((stats.totalStockUnits - stats.lowStockItems) / stats.totalStockUnits) * 100)
    : 0;
  const warning = stats.lowStockItems > 0 && stats.totalVariants > 0
    ? Math.round((stats.lowStockItems / stats.totalVariants) * 100)
    : 0;
  const risk = stats.pendingVariants > 0 && stats.totalVariants > 0
    ? Math.round((stats.pendingVariants / stats.totalVariants) * 100)
    : 0;

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

  if (loading) {
    return (
      <DashboardPageShell title="Vendor" accent="Dashboard" subtitle="Overview of your products, stock, and account status.">
        <PageLoader message="Loading dashboard..." />
      </DashboardPageShell>
    );
  }

  if (error) {
    return (
      <DashboardPageShell title="Vendor" accent="Dashboard" subtitle="Overview of your products, stock, and account status.">
        <PageError message={error} onRetry={fetchDashboardData} />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell
      title="Vendor"
      accent="Dashboard"
      subtitle={`Welcome back, ${stats.businessName}. Account status: ${stats.approvalStatus}.`}
    >
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon1} alt="" /></div>
            <button type="button" className="arrow-button" onClick={() => navigate("/vendor/products")}>
              <img src={arrow} alt="" />
            </button>
          </div>
          <div className="metric-label">Total Products</div>
          <div className="metric-value">{stats.totalProducts}</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow-text">{stats.totalVariants} variants</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon2} alt="" /></div>
            <button type="button" className="arrow-button" onClick={() => navigate("/vendor/stock")}>
              <img src={arrow} alt="" />
            </button>
          </div>
          <div className="metric-label">Stock Units</div>
          <div className="metric-value">{stats.totalStockUnits.toLocaleString()}</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow-text">{stats.lowStockItems} low stock items</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon3} alt="" /></div>
            <button type="button" className="arrow-button" onClick={() => navigate("/vendor/products")}>
              <img src={arrow} alt="" />
            </button>
          </div>
          <div className="metric-label">Approved Variants</div>
          <div className="metric-value">{stats.approvedVariants}</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow-text">{stats.pendingVariants} pending review</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon4} alt="" /></div>
            <button type="button" className="arrow-button" onClick={() => navigate("/vendor/notifications")}>
              <img src={arrow} alt="" />
            </button>
          </div>
          <div className="metric-label">Unread Notifications</div>
          <div className="metric-value">{stats.unreadCount}</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow-text">Account: {stats.approvalStatus}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon5} alt="" /></div>
            <button type="button" className="arrow-button" onClick={() => navigate("/vendor/banners")}>
              <img src={arrow} alt="" />
            </button>
          </div>
          <div className="metric-label">Business</div>
          <div className="metric-value" style={{ fontSize: "18px" }}>{stats.businessName}</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow-text">Manage banners & catalog</span>
          </div>
        </div>
      </div>

      <VendorDashboardCharts
        stockChartData={stockChartData}
        categoryChartData={categoryChartData}
        approvalChartData={approvalChartData}
        stockActivityData={stockActivityData}
      />

      <div className="main-grid">
        <div className="left-column">
          <div className="table-section">
            <div className="sales-header">
              <h2 className="header2">Product Overview</h2>
              <div className="header-right">
                <div className="sales-search-box">
                  <img src={searchIcon} alt="search" className="sales-search-icon" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <table className="sales-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Price</th>
                  <th className="statuscenter">Approval</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.length > 0 ? (
                  recentProducts.map((item) => (
                    <tr key={item.id}>
                      <td className="sale-product-cell">
                        <div className="sale-product-img">
                          <img src={item.image} alt="product" />
                        </div>
                        <div className="sale-product-info">
                          <p className="sale-product-name">{item.name}</p>
                          <span className="sale-stock-text">{item.stock} in stock</span>
                        </div>
                      </td>
                      <td>Rs. {Number(item.price).toLocaleString()}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>{item.stock}</td>
                      <td>
                        <button type="button" className="action-btn" onClick={() => navigate(`/vendor/edit-product/${item.id}`)}>
                          view
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>No products found</td>
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
              {categoryBreakdown.length > 0 ? categoryBreakdown.map((item, index) => (
                <div key={index} className="category-item-wrapper">
                  <div className="category-item">
                    <span className="category-name">{item.name}</span>
                    <span className="category-percentage">{item.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(item.value, 100)}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              )) : (
                <p style={{ color: "#6b7280", fontSize: "14px" }}>Add products to see category distribution.</p>
              )}
            </div>
          </div>

          <div className="best-selling-card">
            <div className="card-header">
              <h3>Featured Product</h3>
            </div>
            {bestProduct ? (
              <div className="cardbest">
                <div className="product-box">
                  <img src={bestProduct.image || productimage} alt="product" />
                </div>
                <div className="product-info">
                  <div>
                    <h4>{bestProduct.name}</h4>
                    <p>
                      In Stock <span>{bestProduct.stock}</span> | Rs. {Number(bestProduct.price).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <button type="button" className="restock-btn" onClick={() => navigate("/vendor/stock")}>
                      Manage Stock
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ padding: "12px", color: "#6b7280" }}>No products available yet.</p>
            )}

            <div className="capacity ">
              <h4>Inventory Health</h4>
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
                    <p>Healthy</p>
                  </div>
                </div>
                <div className="legend">
                  <p><span className="dot green"></span>{safe}% <span className="innerspan">Healthy stock</span></p>
                  <p><span className="dot yellow"></span>{warning}% <span className="innerspan">Low stock items</span></p>
                  <p><span className="dot red"></span>{risk}% <span className="innerspan">Pending approval</span></p>
                </div>
              </div>
            </div>

            <div className="dead-stock">
              <p>Low Stock Alerts</p>
              <h2>{stats.lowStockItems} Items</h2>
              <p className="down"><span>Threshold: {LOW_STOCK_THRESHOLD} units</span></p>
            </div>
          </div>

          <div className="revenue-section1">
            <NewlyArrivedStock products={stockRows} loading={false} />
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
};

export default Dashboard;
