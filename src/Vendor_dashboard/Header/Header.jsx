import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Bell,
    ChevronRight,
    LogOut,
    Search,
    Settings,
    User,
} from "lucide-react";
import { notificationService } from "../../services/notificationService";

const VENDOR_TITLES = {
    "/vendor/dashboard": "Dashboard",
    "/vendor/products": "Products",
    "/vendor/stock": "Stock Management",
    // "/vendor/banners": "Banners",
    // "/vendor/catalog": "Catalog Reference",
    "/vendor/new-product": "Add Product",
    "/vendor/orders": "Orders",
    "/vendor/finance": "Finance",
    "/vendor/ratings": "Ratings",
    "/vendor/notifications": "Notifications",
    "/vendor/help-support": "Help & Support",
    "/vendor/profile": "Profile",
    "/vendor/onboarding": "Onboarding",
};

function resolveVendorTitle(pathname) {
    if (pathname.startsWith("/vendor/edit-product")) return "Edit Product";
    if (pathname.startsWith("/vendor/orders/")) return "Order Detail";
    return VENDOR_TITLES[pathname] || "Vendor Portal";
}

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openProfile, setOpenProfile] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const profileRef = useRef(null);
    const role = sessionStorage.getItem("role") || "vendor";
    const isVendor = role === "vendor";
    const [user, setUser] = useState({
        phone_number: "",
        email: "",
        first_name: "",
        last_name: "",
        avatar: "",
        business_name: "",
    });

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem("profile") || "null") || {});
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setOpenProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await notificationService.get({ view: "unread_count" });
            setUnreadCount(response.data?.data?.unread_count || 0);
        } catch (error) {
            console.error("Notification fetch error:", error);
        }
    };

    const LogOut = () => {
        sessionStorage.clear();
        setTimeout(() => window.location.replace("/login"), 300);
    };

    const displayName =
        `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
        user?.business_name ||
        "User";
    const namePrefix = role === "doctor" ? "Dr. " : "";
    const pageTitle = useMemo(
        () => (isVendor ? resolveVendorTitle(location.pathname) : "Dashboard"),
        [isVendor, location.pathname]
    );

    const handleSearch = (e) => {
        e.preventDefault();
        if (!isVendor || !searchQuery.trim()) return;
        navigate("/vendor/products", { state: { search: searchQuery.trim() } });
        setSearchQuery("");
    };

    if (!isVendor) {
        return (
            <header className="header header--legacy fixed top-0 right-0 z-30">
                <div className="welcome-box">
                    <div className="welcome-text">
                        <p className="welcome-title">
                            Hello <span className="capitalize">{displayName}</span>
                        </p>
                    </div>
                </div>
                <div className="header-right">
                    <button type="button" className="icon-wrapper" onClick={() => navigate(`/${role}/notifications`)} aria-label="Notifications">
                        <Bell size={18} />
                        {unreadCount > 0 && <span className="badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                    </button>
                    <div className="profile" ref={profileRef} onClick={() => setOpenProfile(!openProfile)}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt="" className="avatar" />
                        ) : (
                            <div className="avatar-placeholder">{user?.first_name?.charAt(0) || "U"}</div>
                        )}
                        <div className="profile-info">
                            <p className="name capitalize">{namePrefix}{displayName}</p>
                            <span className="role">{role.toUpperCase()}</span>
                        </div>
                        {openProfile && (
                            <div className="profile-dropdown">
                                <div onClick={() => navigate(`/${role}/profile`)}>Profile</div>
                                <div className="logout" onClick={LogOut}>Logout</div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="vendor-header fixed top-0 right-0 z-30">
            <div className="vendor-header__inner">
                <div className="vendor-header__left">
                    <nav className="vendor-header__breadcrumb" aria-label="Breadcrumb">
                        <button type="button" onClick={() => navigate("/vendor/dashboard")} className="vendor-header__crumb">
                            AyurMuni
                        </button>
                        <ChevronRight size={14} className="text-gray-300" aria-hidden />
                        <span className="vendor-header__crumb vendor-header__crumb--current">{pageTitle}</span>
                    </nav>
                </div>

                {/* <form className="vendor-header__search" onSubmit={handleSearch} role="search">
                    <Search size={16} className="vendor-header__search-icon" aria-hidden />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products, SKUs..."
                        className="vendor-header__search-input ds-focus"
                        aria-label="Search products"
                    />
                </form> */}

                <div className="vendor-header__actions">
                    <button
                        type="button"
                        className="vendor-header__icon-btn ds-focus"
                        onClick={() => navigate("/vendor/notifications")}
                        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="vendor-header__badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
                        )}
                    </button>

                    <div className="vendor-header__profile" ref={profileRef}>
                        <button
                            type="button"
                            className="vendor-header__profile-btn ds-focus"
                            onClick={() => setOpenProfile(!openProfile)}
                            aria-expanded={openProfile}
                            aria-haspopup="menu"
                        >
                            {user?.avatar ? (
                                <img src={user.avatar} alt="" className="vendor-header__avatar" />
                            ) : (
                                <div className="vendor-header__avatar vendor-header__avatar--placeholder">
                                    {user?.first_name?.charAt(0) || "V"}
                                </div>
                            )}
                            <span className="hidden lg:block vendor-header__profile-name capitalize">{displayName}</span>
                        </button>

                        {openProfile && (
                            <div className="vendor-header__dropdown" role="menu">
                                <div className="vendor-header__dropdown-header">
                                    <p className="font-semibold text-gray-900 capitalize">{displayName}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <button type="button" role="menuitem" onClick={() => { navigate("/vendor/profile"); setOpenProfile(false); }}>
                                    <User size={16} /> Profile
                                </button>
                                <button type="button" role="menuitem" onClick={() => { navigate("/vendor/profile?tab=settings"); setOpenProfile(false); }}>
                                    <Settings size={16} /> Settings
                                </button>
                                <button type="button" role="menuitem" className="vendor-header__logout" onClick={LogOut}>
                                    <LogOut size={16} /> Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
