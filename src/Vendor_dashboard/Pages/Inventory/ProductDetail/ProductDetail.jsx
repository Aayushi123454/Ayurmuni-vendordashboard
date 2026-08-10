import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Package } from "lucide-react";
import toast from "react-hot-toast";
import { vendorService } from "../../../../services/vendorService";
import { getVariantCoverImageUrl } from "../../../../utils/unicommerceHelpers";
import Ayurvedaimage from "../../../../Assests/Ayurvedaimage.png";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "variants", label: "Variants" },
  { id: "inventory", label: "Inventory" },
  { id: "images", label: "Images" },
  { id: "approval", label: "Approval" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productRes, inventoryRes] = await Promise.all([
        vendorService.getSingleProduct(id),
        vendorService.getInventory({ page: 1, page_size: 100 }),
      ]);
      setProduct(productRes.data?.data || null);
      const allInv = inventoryRes.data?.data?.results || [];
      setInventory(allInv.filter((i) => String(i.product_id) === String(id)));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load product");
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#0D614E]/20 border-t-[#0D614E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md mx-auto">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            type="button"
            onClick={() => navigate("/vendor/products")}
            className="px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const variants = product.variants || [];
  const primaryCover =
    getVariantCoverImageUrl(variants.find((v) => getVariantCoverImageUrl(v))) || Ayurvedaimage;
  const allVariantImages = [
    ...new Set(
      variants.flatMap((v) => {
        const cover = getVariantCoverImageUrl(v);
        const gallery = (v.media || []).map((m) => m?.media_url || m?.url).filter(Boolean);
        return [cover, ...gallery].filter(Boolean);
      })
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name || "Product"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {product.brand_name || product.product_subcategory_name || ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/vendor/new-product?duplicate=${id}`)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50"
            >
              Duplicate
            </button>
            <button
              type="button"
              onClick={() => navigate(`/vendor/edit-product/${id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-[#094c3d]"
            >
              <Edit size={16} />
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#0D614E] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Package size={18} /> Basic Info
              </h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Category</dt>
                  <dd>{product.product_subcategory_name || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Brand</dt>
                  <dd>{product.brand_name || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Variants</dt>
                  <dd>{variants.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Manufacturer</dt>
                  <dd>{product.manufacturer || "—"}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-center">
              <img
                src={primaryCover}
                alt=""
                className="max-h-48 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = Ayurvedaimage;
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "variants" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Image</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variants.map((v) => (
                  <tr key={v.id}>
                    <td className="px-5 py-3">
                      <img
                        src={getVariantCoverImageUrl(v) || Ayurvedaimage}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover border"
                        onError={(e) => {
                          e.currentTarget.src = Ayurvedaimage;
                        }}
                      />
                    </td>
                    <td className="px-5 py-3 text-sm">{v.sku || v.vendor_sku_code || "—"}</td>
                    <td className="px-5 py-3 text-sm">{v.title || "—"}</td>
                    <td className="px-5 py-3 text-sm">₹{v.selling_price || v.price || "—"}</td>
                    <td className="px-5 py-3 text-sm capitalize">{v.approval_status || "pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Variant</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3 text-sm">{item.variant_sku || item.product_name || "—"}</td>
                    <td className="px-5 py-3 text-sm">{item.quantity ?? "—"}</td>
                    <td className="px-5 py-3 text-sm">{item.sync_status || "synced"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "images" && (
          <div className="flex flex-wrap gap-4">
            {allVariantImages.map((url, i) => (
              <img
                key={`${url}-${i}`}
                src={url}
                alt=""
                className="w-32 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.currentTarget.src = Ayurvedaimage;
                }}
              />
            ))}
            {allVariantImages.length === 0 && (
              <p className="text-gray-500 text-sm">No variant cover images uploaded</p>
            )}
          </div>
        )}

        {activeTab === "approval" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
            {variants.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 text-sm border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={getVariantCoverImageUrl(v) || Ayurvedaimage}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = Ayurvedaimage;
                    }}
                  />
                  <span className="truncate">{v.sku || v.title || "Variant"}</span>
                </div>
                <span className="capitalize text-gray-600">{v.approval_status || "pending"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
