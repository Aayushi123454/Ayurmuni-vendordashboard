import React, { useEffect, useState } from "react";
import "./Inventory.css";
import InventoryIcon from "../../../Assests/InventoryIcon.png";
import Brahmiicon from "../../../Assests/Brahmniicon.png";
import TimerIcon from "../../../Assests/TimerIcon1.png";
import filter from "../../../Assests/filter.png";
import Ayurvedaimage from "../../../Assests/Ayurvedaimage.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { IoInformation } from "react-icons/io5";
import toast from "react-hot-toast";
import { vendorService } from "../../../services/vendorService";

// Helper function to get status based on stock and threshold
const getVariantStatus = (stock, threshold) => {
  if (stock <= 0) return "outofstock";
  if (stock <= threshold) return "lowstock";
  return "instock";
};

// Helper to format quantity display
const formatQuantity = (stock, threshold) => {
  if (stock <= 0) return "0 Units";
  return `${stock} Units`;
};

// Helper to get tag class based on product category or name
const getTagClass = (product) => {
  const name = product.name.toLowerCase();
  if (name.includes("ashwagandha") || name.includes("herb")) return "iv-tag-ayurveda";
  if (name.includes("tea") || name.includes("beverage")) return "iv-tag-beverage";
  if (product.is_nutrition) return "iv-tag-nutrition";
  return "iv-tag-ayurveda";
};

// Helper to get tag label
const getTagLabel = (product) => {
  const name = product.name.toLowerCase();
  if (name.includes("ashwagandha") || name.includes("herb")) return "Ayurveda Herbs";
  if (name.includes("tea") || name.includes("beverage")) return "Beverage";
  if (product.is_nutrition) return "Nutrition";
  return "Ayurveda Herbs";
};

// Mock alerts data - in real app this would come from API
const ALERTS = [
  { id: 1, icon: InventoryIcon, name: "Ashwagandha Extract (Grade A)", meta: "4 units left · Min: 25" },
  { id: 2, icon: Brahmiicon, name: "Organic Brahmi Powder", meta: "12 units left · Min: 50" },
];

const EXPIRY_ROWS = [
  { label: "Expiring in 30 days", count: "14 Batches", width: "65%", badgeClass: "iv-badge-red", fillClass: "iv-fill-red" },
  { label: "Expiring in 90 days", count: "40 Batches", width: "48%", badgeClass: "iv-badge-orange", fillClass: "iv-fill-orange" },
];

const STATUS_MAP = {
  instock: { label: "In Stock", cls: "iv-chip-instock" },
  lowstock: { label: "Low Stock", cls: "iv-chip-lowstock" },
  outofstock: { label: "Out of Stock", cls: "iv-chip-outofstock" },
};

function CriticalAlerts() {
  return (
    <div className="iv-card iv-card-alerts">
      <div className="iv-alerts-header">
        <div className="iv-alert-badge">
          <IoInformation size={16} className="iv-dot-red" />
          Critical Alerts
        </div>
      </div>

      <div className="iv-alerts-title">12 Items Below Safety Threshold</div>

      {ALERTS.map((a) => (
        <div key={a.id} className="iv-alert-item">
          <div className="iv-alert-icon">
            <img src={a.icon} className="inventoryicon" alt="" />
          </div>
          <div className="iv-alert-info">
            <div className="iv-alert-name">{a.name}</div>
            <div className="iv-alert-meta">{a.meta}</div>
          </div>
          <button className="iv-btn-restock">Restock</button>
        </div>
      ))}

      <span className="iv-show-more">Show More</span>
    </div>
  );
}

function ExpiryPipeline() {
  return (
    <div className="iv-card">
      <div className="iv-expiry-top-row">
        <div>
          <div className="iv-expiry-label">Batch Health</div>
          <div className="iv-expiry-title">Expiry Pipeline</div>
        </div>
        <div className="iv-circle-icon">
          <img className="InventoryTimer" src={TimerIcon} alt="" />
        </div>
      </div>

      {EXPIRY_ROWS.map((row) => (
        <div key={row.label} className="iv-expiry-row">
          <div className="iv-expiry-row-top">
            <div className="iv-expiry-row-label">{row.label}</div>
            <span className={`iv-expiry-badge ${row.badgeClass}`}>{row.count}</span>
          </div>
          <div className="iv-progress-bar-wrap">
            <div className={`iv-progress-bar-fill ${row.fillClass}`} style={{ width: row.width }} />
          </div>
        </div>
      ))}

      <div className="iv-pro-tip">
        <div className="iv-pro-tip-label">PRO-TIP</div>
        <div className="iv-pro-tip-text">
          Ayurvedic oils have extended shelf life if stored in Level 3 darkness. Check temperature logs.
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className="iv-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="iv-toggle-slider" />
    </label>
  );
}

function VariantRow({ variant, productName }) {
  const [active, setActive] = useState(variant.is_active);
  const status = getVariantStatus(variant.stock, variant.low_stock_threshold);
  const statusConfig = STATUS_MAP[status];

  // Get cover image URL or use default
  const avatarUrl = variant.cover_image?.media_url || variant.media?.[0]?.media_url || Ayurvedaimage;

  return (
    <tr>
      <td>
        <div className="iv-variant-cell flex items-center gap-4">
          <div className="iv-variant-avatar shadow-md">
            <img src={avatarUrl} className=" max-w-[50px] w-full h-full max-h-[50px] " alt={variant.title} />
          </div>
          <span className="font-[600]">{variant.title}</span>
        </div>
      </td>
      <td><span className="iv-sku-badge">{variant.variant_code}</span></td>
      <td><span className="iv-price-mrp">Rs.{parseFloat(variant.mrp).toLocaleString()}</span></td>
      <td><span className="iv-price-sell">Rs.{parseFloat(variant.selling_price).toLocaleString()}</span></td>
      <td>
        <span className={`iv-qty ${status}`}>
          {formatQuantity(variant.stock, variant.low_stock_threshold)}
        </span>
      </td>
      <td>
        <span className={`iv-status-chip ${statusConfig.cls}`}>
          <span className="iv-status-dot" />
          {statusConfig.label}
        </span>
      </td>
      <td>
        <Toggle checked={active} onChange={() => setActive((v) => !v)} />
      </td>
      <td>
        <div className="iv-actions-cell">
          <Link to={"edit-product/:id"} className="iv-act-btn"><span className="greenicon"><FaEdit /></span></Link>
          <Link className="iv-act-btn"><span className="redicon"><FiTrash2 /></span></Link>
        </div>
      </td>
    </tr>
  );
}

function ProductBlock({ product, collaps, setcollaps }) {
  const tagClass = getTagClass(product);
  const tagLabel = getTagLabel(product);
  const avatarUrl = product.variants[0]?.cover_image?.media_url ||
    product.variants[0]?.media?.[0]?.media_url ||
    Ayurvedaimage;

  return (
    <div className="iv-product-block">
      <div className="iv-product-header">
        <div className="iv-product-avatar shadow-md">
          <img src={avatarUrl} alt={product.name} />
        </div>
        <div className="iv-product-info">
          <div className="iv-product-name">
            {product.name}
            <span className={`iv-product-tag ${tagClass}`}>{tagLabel}</span>
          </div>
          <div className="iv-product-meta">
            <span className="iv-meta-label">Brand:</span>
            <span className="iv-meta-value">{product.brand_name}</span>

            <span className="iv-meta-dot">•</span>

            <span className="iv-meta-label">Variants:</span>
            <span className="iv-meta-value">
              {product.variants.length} available
            </span>
          </div>
        </div>
        <button className="iv-btn-view-all" onClick={e => setcollaps(product.id)}>View Variants</button>
      </div>
      {
        collaps == product.id &&
        <table className="iv-variants-table">
          <thead>
            <tr>
              <th>Variant Name</th>
              <th>SKU</th>
              <th>MRP</th>
              <th>Selling Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {product.variants.map((variant) => (
              <VariantRow key={variant.id} variant={variant} productName={product.name} />
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

function Pagination({ currentPage, totalCount, onPageChange }) {
  const totalPages = Math.ceil(totalCount / 10);
  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalCount);

  return (
    <div className="iv-pagination-row">
      <div className="iv-pagination-info">
        Showing <strong className="text-green-800">{startItem}-{endItem}</strong> of <strong className="text-green-800">{totalCount}</strong> Products
      </div>
      <div className="iv-pagination-btns">
        <button
          className="iv-page-btn"
          onClick={() => onPageChange(Math.max(2, currentPage - 1))}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`iv-page-btn${currentPage === n ? " active" : ""}`}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))}
        {totalPages > 3 && <span className="iv-page-dots">...</span>}
        {totalPages > 3 && (
          <button className="iv-page-btn" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        )}
        <button
          className="iv-page-btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    </div>
  );
}

function BatchOrigin() {
  return (
    <div className="iv-card iv-batch-origin">
      <h3>Batch Origin Integrity</h3>
      <p>
        Every batch is tracked from its source farm in Kerala and Uttarakhand.
        High-resolution logs for temperature-sensitive extractions are available for QA audit.
      </p>
      <div className="iv-farm-imgs">
        <div className="iv-farm-thumb">🌿</div>
        <div className="iv-farm-thumb">🏔️</div>
      </div>
    </div>
  );
}

function StockIntelligence() {
  return (
    <div className="spotlight-card">
      <h3>Seller Spotlight</h3>
      <p className="text-white">
        "Your top selling item 'Ashwagandha Elixir' has
        reached 500 sales this week. Consider featuring
        it on your homepage." Your top selling item
        'Ashwagandha Elixir' has reached 500 sales this
        week. Consider featuring it on your homepage."
      </p>
    </div>
  );
}

export default function InventoryVault() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collaps, setcollaps] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response2 = await vendorService.getsingleProducts();
      const response = await vendorService.getProducts();

      if (response.data.success) {
        setProducts(response.data.data.results);
        setTotalCount(response.data.data.count);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // In a real implementation, you would fetch the specific page here
    // For now, we're just updating the UI state
  };

  return (
    <div className="notification-page">
      <div className="iv-header">
        <div className="iv-header-title">
          <h1>Inventory <span className="inventoryspan">Vault</span></h1>
          <p>
            Manage your botanical stock with precision. Real-time expiry tracking and batch
            integrity for premium Ayurvedic distribution.
          </p>
        </div>
        <button className="iv-btn-add" onClick={() => navigate("/vendor/new-product")}>
          <span className="iv-btn-add-icon">+</span> Add Product
        </button>
      </div>

      <div className="iv-top-grid">
        <CriticalAlerts />
        <ExpiryPipeline />
      </div>

      {/* <div className="iv-ledger-header">
        <div className="iv-ledger-title">Batch Inventory Ledger</div>
        <div className="orders-filter">
          <button className="filter-btn">
            <img src={filter} alt="filter" />
            Filter
          </button>

          <button className="filter-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div> */}

      {loading ? (
        <div className="iv-loading-state">
          <div className="iv-loader"></div>
          <p>Loading inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="iv-empty-state">
          <p>No products found. Click "Add Product" to get started.</p>
        </div>
      ) : (
        products.map((product) => (
          <ProductBlock key={product.id} product={product} collaps={collaps} setcollaps={setcollaps} />
        ))
      )}

      {!loading && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          onPageChange={handlePageChange}
        />
      )}

      <div className="iv-bottom-grid">
        <BatchOrigin />
        <StockIntelligence />
      </div>
    </div>
  );
}