/**
 * Helpers aligned with Ayurmuni backend + Unicommerce sync rules.
 * - System `sku_code` is generated server-side and used as Unicommerce itemSKU.
 * - Inventory sync uses `quantity` (not `stock`) and runs only for approved variants.
 */

export const UNICOMMERCE_NOTICES = {
  pendingVariant:
    "Stock is saved locally. Unicommerce sync runs after admin approves this variant.",
  approvedStock:
    "Stock updates sync to Unicommerce for approved variants. Use Stock Management for inventory changes.",
  systemSku:
    "System SKU (sku_code) is assigned by the platform and used for Unicommerce fulfillment.",
};

export function getVariantQuantity(variant) {
  if (!variant) return 0;
  const value = variant.quantity ?? variant.stock ?? 0;
  return Number(value) || 0;
}

export function mapVariantFromApi(variant) {
  if (!variant) return variant;
  return {
    ...variant,
    stock: getVariantQuantity(variant),
  };
}

export function mapVariantToApiPayload(variant) {
  if (!variant) return variant;

  const payload = { ...variant };
  const stockValue = payload.stock ?? payload.quantity;

  if (stockValue !== undefined && stockValue !== null && stockValue !== "") {
    payload.quantity = parseInt(stockValue, 10) || 0;
  }

  delete payload.stock;
  delete payload.low_stock_threshold;
  delete payload.galleryImages;
  delete payload.coverImage;

  return payload;
}

export function extractApiErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;

  const unicommerceErrors = data?.errors?.unicommerce;
  if (Array.isArray(unicommerceErrors) && unicommerceErrors.length > 0) {
    return unicommerceErrors.join(", ");
  }

  if (data.message) return data.message;

  if (data.errors && typeof data.errors === "object") {
    const flat = Object.values(data.errors).flat().filter(Boolean);
    if (flat.length) return flat.join(", ");
  }

  return fallback;
}

export function isUnicommerceSyncError(error) {
  return error?.response?.status === 502;
}

export function getSelectedSubcategoryMeta(subcategories, subcategoryId) {
  if (!subcategoryId || !Array.isArray(subcategories)) return null;
  return subcategories.find((item) => item.id === subcategoryId) || null;
}
