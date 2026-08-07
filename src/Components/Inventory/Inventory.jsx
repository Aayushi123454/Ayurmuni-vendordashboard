import React, { useState } from "react";
import "./Inventory.css";
import InventoryIcon from "../../Assests/InventoryIcon.png"
import Brahmiicon from "../../Assests/Brahmniicon.png"
import TimerIcon from "../../Assests/TimerIcon1.png"
import filter from "../../Assests/filter.png"
import Ayurvedaimage from "../../Assests/Ayurvedaimage.png"
import { useNavigate } from "react-router-dom";
import Frame from "../../Assests/Frame.png";
import { FaEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

const ALERTS = [
  { id: 1, icon: InventoryIcon, name: "Ashwagandha Extract (Grade A)", meta: "4 units left · Min: 25" },
  { id: 2, icon: Brahmiicon, name: "Organic Brahmi Powder",         meta: "12 units left · Min: 50" },
];

const EXPIRY_ROWS = [
  { label: "Expiring in 30 days", count: "14 Batches", width: "65%", badgeClass: "iv-badge-red",    fillClass: "iv-fill-red" },
  { label: "Expiring in 90 days", count: "40 Batches", width: "48%", badgeClass: "iv-badge-orange", fillClass: "iv-fill-orange" },
];

const PRODUCTS = [
  {
    id: 1,
    avatar: Ayurvedaimage,
    name: "Organic Ashwagandha Capsules",
    tag: "Ayurveda Herbs",
    tagClass: "iv-tag-ayurveda",
    brand: "Botanical Gold",
    variantCount: 2,
    variants: [
      { name: "60 Capsules Bottle",        sku: "ASH-60-CAP",  mrp: "Rs. 1,299", sell: "Rs. 899",   qty: "450 Units", status: "instock",    active: true },
      { name: "120 Capsules Economy Pack", sku: "ASH-120-CAP", mrp: "Rs. 2,199", sell: "Rs. 1,699", qty: "38 Units",  status: "lowstock",   active: true },
    ],
  },
  {
    id: 2,
    avatar:Ayurvedaimage,
    name: "Tulsi Holy Basil Herbal Tea",
    tag: "Beverage",
    tagClass: "iv-tag-beverage",
    brand: "Botanical Cord",
    variantCount: 1,
    variants: [
      { name: "Loose Leaf Tin - 100g", sku: "TEA-TUL-LBU", mrp: "Rs. 450", sell: "Rs. 329", qty: "0 Units", status: "outofstock", active: false },
    ],
  },
  {
    id: 3,
    avatar: Ayurvedaimage,
    name: "Tulsi Holy Basil Herbal Tea",
    tag: "Nutrition",
    tagClass: "iv-tag-nutrition",
    brand: "Botanical Cord",
    variantCount: 4,
    variants: [
      { name: "Loose Leaf Tin - 100g", sku: "TEA-TUL-A4G", mrp: "Rs. 450", sell: "Rs. 329", qty: "0 Units", status: "outofstock", active: false },
    ],
  },
];

const STATUS_MAP = {
  instock:    { label: "In Stock",     cls: "iv-chip-instock" },
  lowstock:   { label: "Low Stock",    cls: "iv-chip-lowstock" },
  outofstock: { label: "Out of Stock", cls: "iv-chip-outofstock" },
};



function CriticalAlerts() {
  return (
    <div className="iv-card iv-card-alerts">
      <div className="iv-alerts-header">
        <div className="iv-alert-badge">
          <div className="iv-dot-red" />
          Critical Alerts
        </div>
      </div>

      <div className="iv-alerts-title">12 Items Below Safety Threshold</div>

      {ALERTS.map((a) => (
        <div key={a.id} className="iv-alert-item">
          <div className="iv-alert-icon"><img src ={a.icon} className="inventoryicon"/></div>
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
        <div className="iv-circle-icon"><img className="InventoryTimer" src= {TimerIcon}/></div>
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

function VariantRow({ variant }) {
  const [active, setActive] = useState(variant.active);
  const status = STATUS_MAP[variant.status];

  return (
    <tr>
      <td>{variant.name}</td>
      <td><span className="iv-sku-badge">{variant.sku}</span></td>
      <td><span className="iv-price-mrp">{variant.mrp}</span></td>
      <td><span className="iv-price-sell">{variant.sell}</span></td>
<td>
  <span className={`iv-qty ${variant.status}`}>
    {variant.qty}
  </span>
</td>
      <td>
        <span className={`iv-status-chip ${status.cls}`}>
          <span className="iv-status-dot" />
          {status.label}
        </span>
      </td>
      <td>
        <Toggle checked={active} onChange={() => setActive((v) => !v)} />
      </td>
      <td>
        <div className="iv-actions-cell">
          <button className="iv-act-btn"><span className="greenicon"> <FaEdit/></span></button>
          <button className="iv-act-btn"><span className="redicon"><FiTrash2/></span></button>
        </div>
      </td>
    </tr>
  );
}

function ProductBlock({ product }) {
  return (
    <div className="iv-product-block">
      <div className="iv-product-header">
        <div className="iv-product-avatar"><img src={product.avatar}/></div>
        <div className="iv-product-info">
          <div className="iv-product-name">
            {product.name}
            <span className={`iv-product-tag ${product.tagClass}`}>{product.tag}</span>
          </div>
        <div className="iv-product-meta">
  <span className="iv-meta-label">Brand:</span>
  <span className="iv-meta-value">{product.brand}</span>

  <span className="iv-meta-dot">•</span>

  <span className="iv-meta-label">Variants:</span>
  <span className="iv-meta-value">
    {product.variantCount} available
  </span>
</div>
        </div>
        <button className="iv-btn-view-all">View All</button>
      </div>

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
          {product.variants.map((v) => (
            <VariantRow key={v.sku} variant={v} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pagination() {
  const [current, setCurrent] = useState(1);
  return (
    <div className="iv-pagination-row">
      <div className="iv-pagination-info">
        Showing <strong>1-10</strong> of <strong>1,284</strong> Products
      </div>
      <div className="iv-pagination-btns">
        <button className="iv-page-btn" onClick={() => setCurrent((p) => Math.max(1, p - 1))}>‹</button>
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className={`iv-page-btn${current === n ? " active" : ""}`}
            onClick={() => setCurrent(n)}
          >
            {n}
          </button>
        ))}
        <button className="iv-page-btn" onClick={() => setCurrent((p) => Math.min(3, p + 1))}>›</button>
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
    {/* <img  src={Icon} className="star-bg"/> */}
    <p>
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
    const Navigate = useNavigate();
  return (
    <div className="notification-page">

      
      <div className="iv-header">
        <div className="iv-header-title">
          <h1>Inventory <span className="inventoryspan">Vault</span> </h1>
          <p>
            Manage your botanical stock with precision. Real-time expiry tracking and batch
            integrity for premium Ayurvedic distribution.
          </p>
        </div>
        <button className="iv-btn-add" onClick={()=>Navigate("/AddProduct")}>
          <span className="iv-btn-add-icon">+</span> Add Product
        </button>
      </div>

    
      <div className="iv-top-grid">
        <CriticalAlerts />
        <ExpiryPipeline />
      </div>

  
      <div className="iv-ledger-header">
        <div className="iv-ledger-title">Batch Inventory Ledger</div>
        <div className="orders-filter">
         <button className="filter-btn">
           <img src={filter} alt="filter" />
           Filter
         </button>
       
         <button className="filter-btn">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
             <polyline points="7 10 12 15 17 10"/>
             <line x1="12" y1="15" x2="12" y2="3"/>
           </svg>
           Export
         </button>
       </div>
      </div>
{/* 
      {PRODUCTS.map((p) => (
        <ProductBlock key={p.id} product={p} />
      ))} */}

      <Pagination />

      
      <div className="iv-bottom-grid">
        <BatchOrigin />
        <StockIntelligence />
      </div>

    </div>
  );
}