import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  MoreHorizontal,
} from "lucide-react";
import Drawer from "../components/shared/Drawer";
import "./MobileBottomNav.css";

const PRIMARY_TABS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  { name: "Products", icon: Package, path: "/vendor/products" },
  { name: "Orders", icon: ShoppingCart, path: "/vendor/orders" },
  { name: "Finance", icon: Wallet, path: "/vendor/finance" },
];

const MORE_ITEMS = [
  { name: "Stock", path: "/vendor/stock" },
  { name: "Analytics", path: "/vendor/analytics" },
  { name: "Categories", path: "/vendor/categories" },
  { name: "Brands", path: "/vendor/brands" },
  { name: "Banners", path: "/vendor/banners" },
  { name: "Coupons", path: "/vendor/coupons" },
  { name: "Ratings", path: "/vendor/ratings" },
  { name: "Reports", path: "/vendor/reports" },
  { name: "Settings", path: "/vendor/settings" },
  { name: "Help", path: "/vendor/help-support" },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = React.useState(false);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <nav className="vendor-mobile-nav" aria-label="Mobile navigation">
        {PRIMARY_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              type="button"
              className={`vendor-mobile-nav__item ${active ? "vendor-mobile-nav__item--active" : ""}`}
              onClick={() => navigate(tab.path)}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={20} />
              <span>{tab.name}</span>
            </button>
          );
        })}
        <button
          type="button"
          className={`vendor-mobile-nav__item ${moreOpen ? "vendor-mobile-nav__item--active" : ""}`}
          onClick={() => setMoreOpen(true)}
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>

      <Drawer open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <div className="vendor-mobile-nav__drawer-list">
          {MORE_ITEMS.map((item) => (
            <button
              key={item.path}
              type="button"
              className="vendor-mobile-nav__drawer-item"
              onClick={() => {
                navigate(item.path);
                setMoreOpen(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </Drawer>
    </>
  );
}
