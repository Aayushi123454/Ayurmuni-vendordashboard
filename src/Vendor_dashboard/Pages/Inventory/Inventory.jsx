import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./Inventory.css";
import Ayurvedaimage from "../../../Assests/Ayurvedaimage.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { vendorService } from "../../../services/vendorService";
import UnicommerceNotice from "../../components/shared/UnicommerceNotice";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import Button from "../../components/shared/Button";
import { PageEmpty, PageError, PaginationBar } from "../../components/shared/PageState";
import { ProductListSkeleton } from "../../components/shared/Skeleton";
import StatusBadge from "../../components/shared/StatusBadge";
import SearchToolbar from "../../components/shared/SearchToolbar";
import usePersistedState from "../../hooks/usePersistedState";
import {
  getVariantCoverImageUrl,
  getVariantQuantity,
  mapVariantFromApi,
  UNICOMMERCE_NOTICES,
} from "../../../utils/unicommerceHelpers";
import "../../components/shared/vendor-shared.css";

const LOW_STOCK_THRESHOLD = 10;

const getVariantStatus = (stock) => {
  if (stock == null || stock <= 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "instock";
};

const getTagClass = (product) => {
  const name = (product.name || "").toLowerCase();
  if (name.includes("ashwagandha") || name.includes("herb")) return "iv-tag-ayurveda";
  if (name.includes("tea") || name.includes("beverage")) return "iv-tag-beverage";
  if (product.is_nutrition) return "iv-tag-nutrition";
  return "iv-tag-ayurveda";
};

const getTagLabel = (product) => {
  const name = (product.name || "").toLowerCase();
  if (name.includes("ashwagandha") || name.includes("herb")) return "Ayurveda Herbs";
  if (name.includes("tea") || name.includes("beverage")) return "Beverage";
  if (product.is_nutrition) return "Nutrition";
  return "Ayurveda Herbs";
};

function VariantRow({ variant }) {
  const qty = getVariantQuantity(variant);
  const stockStatus = getVariantStatus(qty);
  const avatarUrl = getVariantCoverImageUrl(variant) || Ayurvedaimage;

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-lg border bg-white shadow-sm">
            <img
              src={avatarUrl}
              alt={variant.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = Ayurvedaimage;
              }}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">{variant.title}</h4>
            <StatusBadge status={variant.approval_status} className="mt-1" />
          </div>
        </div>
      </td>
<<<<<<< HEAD
      <td><span className="iv-sku-badge">{variant.variant_code}</span></td>
      <td><span className="iv-price-mrp">Rs.{parseFloat(variant.mrp).toLocaleString()}</span></td>
      <td><span className="iv-price-sell">Rs.{parseFloat(variant.selling_price).toLocaleString()}</span></td>
=======
>>>>>>> 8f191bbe844823d0bd23134c03498929df78b772
      <td>
        <div className="flex flex-col gap-1">
          <code className="rounded-md bg-gray-100 px-2 py-1 text-sm">{variant.vendor_sku_code || "—"}</code>
          {variant.sku_code && (
            <code className="text-sm text-gray-500" title="Unicommerce system SKU">
              {variant.sku_code}
            </code>
          )}
        </div>
      </td>
      <td>₹{Number(variant.mrp || 0).toLocaleString()}</td>
      <td className="font-semibold text-[#0D614E]">₹{Number(variant.selling_price || 0).toLocaleString()}</td>
      <td>{qty} units</td>
      <td><StatusBadge status={stockStatus} /></td>
      <td><StatusBadge status={variant.status || "draft"} /></td>
    </tr>
  );
}

function ProductBlock({ product, expanded, onToggle, onDelete }) {
  const firstVariantWithImage =
    (product.variants || []).find((v) => getVariantCoverImageUrl(v)) || product.variants?.[0];
  const avatarUrl = getVariantCoverImageUrl(firstVariantWithImage) || Ayurvedaimage;
  const isExpanded = expanded === product.id;

  return (
    <div className="iv-product-block ds-card ds-card-interactive ds-animate-in">
      <div className="iv-product-header">
        <div className="iv-product-avatar shadow-md">
          <img
            src={avatarUrl}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = Ayurvedaimage;
            }}
          />
        </div>
        <div className="iv-product-info">
          <div className="iv-product-name">
            {product.name}
            {/* <span className={`iv-product-tag ${getTagClass(product)}`}>{getTagLabel(product)}</span> */}
          </div>
          <div className="iv-product-meta">
            <span className="iv-meta-label">Brand:</span>
            <span className="iv-meta-value">{product.brand_name || "—"}</span>
            <span className="iv-meta-dot">•</span>
            <span className="iv-meta-label">Variants:</span>
            <span className="iv-meta-value">{product.variants?.length || 0}</span>
            {product.product_subcategory_name && (
              <>
                <span className="iv-meta-dot">•</span>
                <span className="iv-meta-value">{product.product_subcategory_name}</span>
              </>
            )}
          </div>
        </div>
<<<<<<< HEAD
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
=======
        <button type="button" className="iv-btn-view-all ds-focus active:scale-[0.98] transition-transform duration-200" onClick={() => onToggle(product.id)}>
          {isExpanded ? "Hide Variants" : "View Variants"}
>>>>>>> 8f191bbe844823d0bd23134c03498929df78b772
        </button>
        <div className="flex items-center gap-2">
          <Link
            to={`/vendor/products/${product.id}`}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50"
          >
            View
          </Link>
          <Link
            to={`/vendor/edit-product/${product.id}`}
            className="rounded-lg border border-green-200 p-2 !text-green-600 transition hover:bg-green-50"
            aria-label="Edit product"
          >
            <FaEdit size={16} />
          </Link>
          {/* <button
            type="button"
            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
            onClick={() => onDelete(product)}
            aria-label="Delete product"
          >
            <FiTrash2 size={16} />
          </button> */}
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {isExpanded && (
        <div className="vendor-table-wrap mt-3 border-0 shadow-none ds-animate-in overflow-x-auto ds-scroll">
          <table className="vendor-table iv-variants-table">
            <thead>
              <tr>
                <th>Variant</th>
                <th>SKU (Vendor / System)</th>
                <th>MRP</th>
                <th>Selling Price</th>
                <th>Quantity</th>
                <th>Stock</th>
                <th>Lifecycle</th>
              </tr>
            </thead>
            <tbody>
              {(product.variants || []).map((variant) => (
                <VariantRow key={variant.id} variant={variant} />
              ))}
            </tbody>
          </table>
        </div>
      )}
>>>>>>> 8f191bbe844823d0bd23134c03498929df78b772
    </div>
  );
}

export default function InventoryVault() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState(location.state?.search || "");
  const [search, setSearch] = useState(location.state?.search || "");
  const [pageSize, setPageSize] = usePersistedState("vendor:inventory:pageSize", 10);

  const fetchProducts = useCallback(async (page = currentPage) => {
    try {
      setLoading(true);
      setError("");
      const response = await vendorService.getProducts({ page, page_size: pageSize });

      if (response.data.success) {
        const results = (response.data.data.results || []).map((product) => ({
          ...product,
          variants: (product.variants || []).map(mapVariantFromApi),
        }));
        setProducts(results);
        setTotalCount(response.data.data.count || 0);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => {
      const inName = product.name?.toLowerCase().includes(term);
      const inBrand = product.brand_name?.toLowerCase().includes(term);
      const inVariant = (product.variants || []).some(
        (v) =>
          v.title?.toLowerCase().includes(term) ||
          v.vendor_sku_code?.toLowerCase().includes(term) ||
          v.sku_code?.toLowerCase().includes(term)
      );
      return inName || inBrand || inVariant;
    });
  }, [products, search]);

  const lowStockCount = useMemo(() => {
    return products.reduce((count, product) => {
      const low = (product.variants || []).filter(
        (v) => getVariantQuantity(v) <= LOW_STOCK_THRESHOLD
      ).length;
      return count + low;
    }, 0);
  }, [products]);

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}" and all its variants?`)) return;
    try {
      await vendorService.deleteProduct(product.id);
      toast.success("Product deleted");
      fetchProducts(currentPage);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <DashboardPageShell
      title="Product"
      accent="Catalog"
      subtitle="Manage your product catalog, variants, and approval status. Stock quantities are updated via Stock Management."
      breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }]}
      actions={
        <>
          {lowStockCount > 0 && (
            <Button variant="pill">{lowStockCount} low stock variant{lowStockCount > 1 ? "s" : ""}</Button>
          )}
          <Button onClick={() => navigate("/vendor/new-product")}>+ Add Product</Button>
        </>
      }
    >

      <UnicommerceNotice>
        {UNICOMMERCE_NOTICES.pendingVariant} Use Stock Management to update quantities for approved variants — changes sync to Unicommerce.
      </UnicommerceNotice>

      <SearchToolbar
        className="!mb-4"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(searchInput.trim());
        }}
        onClear={searchInput ? () => { setSearch(""); setSearchInput(""); } : undefined}
        placeholder="Search products, brands, SKUs..."
      />

      {loading ? (
        <ProductListSkeleton count={pageSize > 5 ? 5 : pageSize} />
      ) : error ? (
        <PageError message={error} onRetry={() => fetchProducts(currentPage)} />
      ) : filteredProducts.length === 0 ? (
        <PageEmpty
          title={search ? "No matching products" : "No products yet"}
          description={
            search
              ? "Try a different search term or clear the filter."
              : "Start building your catalog by adding your first product."
          }
          action={
            !search && (
              <Button onClick={() => navigate("/vendor/new-product")}>+ Add Product</Button>
            )
          }
        />
      ) : (
        <>
          <div className="ds-stagger space-y-4">
          {filteredProducts.map((product) => (
            <ProductBlock
              key={product.id}
              product={product}
              expanded={expanded}
              onToggle={(id) => setExpanded((prev) => (prev === id ? "" : id))}
              onDelete={handleDeleteProduct}
            />
          ))}
          </div>
          {!search && (
            <PaginationBar
              page={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              storageKey="vendor:inventory"
              itemLabel="products"
            />
          )}
        </>
      )}
    </DashboardPageShell>
  );
}
