# Vendor Dashboard — API Mapping

Base URL: `REACT_APP_API_BASE` · Auth: Bearer token · Response envelope: `{ success, data, message? }`

Status legend: **Integrated** · **Partial** · **Backend API Required**

---

## Authentication

### Send OTP
- **Endpoint:** `POST /user/send-otp/`
- **Request:** `{ phone_number, login?: true }`
- **Response:** `{ user_roles: ["vendor"|"doctor"] }`
- **UI:** `/login`
- **Status:** Integrated

### Vendor Login
- **Endpoint:** `POST /user/vnd/login/`
- **Request:** `{ phone_number, otp, role: "vendor" }`
- **Response:** `{ access, refresh, profile, is_verified }`
- **Loading:** OTP spinner · **Error:** toast · **Navigation:** onboarding → dashboard
- **Status:** Integrated

### Register
- **Endpoint:** `POST /user/vnd/register/`
- **Status:** Integrated

### Refresh Token
- **Endpoint:** `POST /auth/refresh`
- **Request:** `{ refreshToken }`
- **Status:** Integrated (interceptor)

### Forgot Password
- **Endpoint:** `POST /auth/forgot-password`
- **Request:** `{ email }`
- **UI:** `/login/forgot-password`
- **Status:** Integrated

### Reset Password
- **Endpoint:** `POST /auth/reset-password`
- **UI:** `/login/reset-password/:token`
- **Status:** Integrated

### Change Password
- **Endpoint:** `POST /auth/change-password/`
- **UI:** `/vendor/settings` (Security tab)
- **Status:** Integrated

### Upload File
- **Endpoint:** `POST /user/upload/` (multipart: `image`, `dir`)
- **Dirs:** `vendor_document`, `variants_images`, `vendor/banners`
- **Status:** Integrated

---

## Vendor Profile

### Get/Create/Update/Delete Profile
- **Endpoints:** `GET|POST|PUT|DELETE /vendors/profile/`
- **UI:** `/vendor/profile`, `/vendor/onboarding`
- **Validation:** required business fields, document URLs
- **Permissions:** verified vendor for full nav
- **Status:** Integrated

### Bank Details CRUD
- **Endpoints:** `/vendors/bank-details/`
- **Status:** Integrated

---

## Products

### List Products
- **Endpoint:** `GET /vendors/product/?page=&page_size=&search=`
- **UI:** `/vendor/products`
- **Empty:** Add Product CTA · **Pagination:** yes
- **Status:** Integrated

### Single Product
- **Endpoint:** `GET /vendors/product/?id=&variant_id=`
- **UI:** `/vendor/products/:id`, edit pages
- **Status:** Integrated

### Create Product
- **Endpoint:** `POST /vendors/product/add/`
- **UI:** `/vendor/new-product` (stepper)
- **Validation:** name, category, brand, variant pricing, images
- **Status:** Integrated

### Update/Delete Product & Variants
- **Endpoints:** `PATCH|DELETE /vendors/product/?id=&variant_id=`
- **Status:** Integrated

### Field Lookups
- **Endpoint:** `GET /vendors/fields/info/?search=product-category|product-subcategory|brand-name`
- **UI:** Categories, Brands, Add Product
- **Status:** Integrated (read-only)

### Product History / Audit
- **Status:** Backend API Required — UI placeholder on Product Detail

---

## Inventory

### List/Create/Update/Delete
- **Endpoints:** `GET|POST /inventory/`, `PATCH|DELETE /inventory/{id}/`
- **UI:** `/vendor/stock`
- **Sync:** Unicommerce integration shown in UI
- **Status:** Integrated

---

## Banners

### CRUD
- **Endpoints:** `GET|POST /vendors/banner/`, `PATCH|DELETE /vendors/banner/?id=`
- **UI:** `/vendor/banners`
- **Scheduling:** Backend API Required if not in payload
- **Status:** Integrated

---

## Orders

### List Orders
- **Endpoint:** `GET /vendors/orders/?page=&status=&search=&from_date=&to_date=`
- **UI:** `/vendor/orders`
- **Export:** client CSV
- **Status:** Integrated (read)

### Order Detail
- **Endpoint:** `GET /vendors/orders/?id=`
- **UI:** `/vendor/orders/:id`
- **Status:** Integrated (read)

### Order Summary
- **Endpoint:** `GET /vendors/orders/summary/`
- **UI:** Orders KPI section
- **Status:** Integrated

### Update Order Status / Fulfillment
- **Status:** Backend API Required — mock UI with `orderService.updateStatus`

### Invoices / Shipping Labels
- **Status:** Backend API Required

---

## Finance

### Metrics
- **Endpoint:** `GET /vendors/finance/metrics/?details_limit=`
- **UI:** `/vendor/finance`, `/vendor/dashboard`, `/vendor/analytics`
- **Status:** Integrated

### Transactions
- **Endpoint:** `GET /vendors/finance/transactions/`
- **UI:** `/vendor/finance`
- **Status:** Integrated

### Wallet Transactions
- **Endpoint:** `GET /vendors/finance/wallet/transactions/`
- **UI:** `/vendor/finance/wallet`
- **Status:** Integrated

### Settlements / Withdrawals
- **Status:** Backend API Required — mock UI at `/vendor/finance/settlements`, `/vendor/finance/withdrawals`

---

## Reviews

### Vendor Reviews
- **Endpoints:** `GET /review/vendor/`, `POST|PUT|DELETE /review/vendor/?id=`
- **UI:** `/vendor/ratings`
- **Filters:** status, rating, product_id, dates
- **Status:** Integrated

---

## Notifications

### List / Unread Count / Actions
- **Endpoint:** `GET /notifications/`, `POST ?action=read|delete|clear`
- **UI:** `/vendor/notifications`, header bell
- **Status:** Integrated

---

## Customers

### List / Detail
- **Expected:** `GET /vendors/customers/`
- **UI:** `/vendor/customers`, `/vendor/customers/:id`
- **Mock:** `REACT_APP_USE_MOCKS !== "false"` (default mock)
- **Status:** Backend API Required

---

## Coupons

### CRUD
- **Expected:** `/vendors/coupons/`
- **UI:** `/vendor/coupons`
- **Mock:** `couponService` with local store
- **Status:** Backend API Required

---

## Analytics & Reports

### Dedicated Analytics
- **Expected:** `GET /vendors/analytics/`
- **UI:** `/vendor/analytics` (derived from finance + products + orders)
- **Status:** Partial

### Reports Export
- **UI:** `/vendor/reports` — CSV from existing endpoints
- **PDF/Excel server export:** Backend API Required

---

## Settings & Help

### Notification Preferences
- **Status:** Backend API Required — mock in Settings

### Support Tickets
- **Status:** Backend API Required — mock form in Help

---

## Global Handling

| Concern | Implementation |
|---------|----------------|
| Loading | Skeleton, PageLoader, React Query |
| Error | PageError + toast + retry |
| Empty | PageEmpty with CTA |
| Permissions | `usePermissions`, verify gate in ProtectedRoute |
| Session expiry | 401 refresh → redirect `/login` |
| Caching | TanStack Query `staleTime: 60s` |
| Mock toggle | `REACT_APP_USE_MOCKS=false` for live customer/coupon APIs |
