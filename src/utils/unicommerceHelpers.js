/**
 * Helpers aligned with Ayurmuni backend + Unicommerce sync rules.
 * - System `sku_code` is generated server-side and used as Unicommerce itemSKU.
 * - Inventory sync uses `quantity` (not `stock`) and runs only for approved variants.
 */

export const UNICOMMERCE_NOTICES = {
  pendingVariant:
    "Quantity cannot be updated until admin approves this variant. Use Stock Management after approval.",
  approvedStock:
    "Stock updates sync to Unicommerce for approved variants. Use Stock Management for inventory changes.",
  systemSku:
    "System SKU (sku_code) is assigned by the platform and used for Unicommerce fulfillment.",
};

export function isVariantApproved(variant) {
  return variant?.approval_status === "approved";
}

export function canUpdateVariantQuantity(variant) {
  return isVariantApproved(variant);
}

/** User-facing reason when stock update is blocked (matches platform workflow). */
export function getStockUpdateBlockReason(variant) {
  if (canUpdateVariantQuantity(variant)) return null;
  const status = variant?.approval_status || "pending";
  if (status === "rejected") {
    return "This variant was rejected. Stock cannot be updated until an admin re-approves it.";
  }
  if (status === "pending") {
    return UNICOMMERCE_NOTICES.pendingVariant;
  }
  return `Stock updates are only available for approved variants (current status: ${status}).`;
}

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

  if (canUpdateVariantQuantity(variant) && stockValue !== undefined && stockValue !== null && stockValue !== "") {
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

/** Detect backend validation/errors tied to variant approval for stock updates. */
export function isApprovalRelatedStockError(error) {
  const data = error?.response?.data;
  const message = extractApiErrorMessage(error, "").toLowerCase();
  const quantityErrors = data?.errors?.quantity;
  const quantityText = Array.isArray(quantityErrors)
    ? quantityErrors.join(" ").toLowerCase()
    : String(quantityErrors || "").toLowerCase();
  const combined = `${message} ${quantityText}`;

  return (
    combined.includes("approv") ||
    combined.includes("pending") ||
    combined.includes("not approved") ||
    combined.includes("quantity cannot") ||
    combined.includes("awaiting admin")
  );
}

export const STOCK_APPROVAL_BLOCKED = {
  title: "Quantity Update Unavailable",
  description:
    "This product is still awaiting admin approval. Inventory can be updated only after approval. Once approved, you'll be able to manage stock from this page and changes will automatically sync with Unicommerce.",
};

export function getSelectedSubcategoryMeta(subcategories, subcategoryId) {
  if (!subcategoryId || !Array.isArray(subcategories)) return null;
  return subcategories.find((item) => item.id === subcategoryId) || null;
}
