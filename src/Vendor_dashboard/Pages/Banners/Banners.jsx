import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ExternalLink, ImagePlus, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { vendorService } from "../../../services/vendorService";
import Ayurvedaimage from "../../../Assests/Ayurvedaimage.png";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { PageEmpty, PageError } from "../../components/shared/PageState";
import StatusBadge from "../../components/shared/StatusBadge";
import Modal from "../../components/shared/Modal";
import Button from "../../components/shared/Button";
import "./Banners.css";

const emptyForm = {
    image_url: "",
    redirect_url: "",
    is_active: true,
};

function BannerImage({ src, alt, className }) {
    const [failed, setFailed] = useState(false);
    const imageSrc = !src || failed ? Ayurvedaimage : src;

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            loading="lazy"
            onError={() => setFailed(true)}
        />
    );
}

function BannerCardSkeleton() {
    return (
        <article className="banner-card">
            <div className="banner-image-wrap ds-skeleton" />
            <div className="banner-card-body">
                <div className="ds-skeleton h-3 w-3/4 rounded mb-2" />
                <div className="ds-skeleton h-3 w-1/2 rounded mb-4" />
                <div className="banner-card-actions">
                    <div className="ds-skeleton h-9 flex-1 rounded-lg" />
                    <div className="ds-skeleton h-9 flex-1 rounded-lg" />
                </div>
            </div>
        </article>
    );
}

export default function Banners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchBanners = useCallback(async () => {
        setError("");
        const response = await vendorService.getBanners();
        setBanners(response.data?.data || []);
    }, []);

    const loadBanners = useCallback(async () => {
        try {
            setLoading(true);
            await fetchBanners();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to load banners");
            setBanners([]);
        } finally {
            setLoading(false);
        }
    }, [fetchBanners]);

    useEffect(() => {
        loadBanners();
    }, [loadBanners]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchBanners();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to refresh banners");
        } finally {
            setRefreshing(false);
        }
    };

    const openCreate = () => {
        setEditingBanner(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (banner) => {
        setEditingBanner(banner);
        setForm({
            image_url: banner.image_url || "",
            redirect_url: banner.redirect_url || "",
            is_active: banner.is_active ?? true,
        });
        setModalOpen(true);
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const response = await vendorService.uploadfiles(file, "vendor/banners");
            const url = response.data?.data?.url || response.data?.url;
            if (!url) throw new Error("Upload failed");
            setForm((prev) => ({ ...prev, image_url: url }));
            toast.success("Image uploaded");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to upload image");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.image_url) {
            toast.error("Banner image is required");
            return;
        }
        const payload = {
            image_url: form.image_url,
            redirect_url: form.redirect_url || null,
            is_active: form.is_active,
        };
        try {
            setSaving(true);
            if (editingBanner) {
                await vendorService.updateBanner(editingBanner.id, payload);
                toast.success("Banner updated");
            } else {
                await vendorService.createBanner(payload);
                toast.success("Banner created");
            }
            setModalOpen(false);
            await fetchBanners();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save banner");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (banner) => {
        if (!window.confirm("Delete this banner?")) return;
        try {
            await vendorService.deleteBanner(banner.id);
            toast.success("Banner deleted");
            await fetchBanners();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete banner");
        }
    };

    return (
        <div className="banners-page">
            <DashboardPageShell
                compact
                hidePageHeader
                contentClassName="vendor-page-content banners-page-content"
                actions={
                    <>
                        <Button
                            variant="secondary"
                            onClick={handleRefresh}
                            loading={refreshing}
                            disabled={loading}
                            className="!text-sm"
                        >
                            {!refreshing && <RefreshCw size={16} />}
                            Refresh
                        </Button>
                        <Button onClick={openCreate} className="!text-sm">
                            <Plus size={16} />
                            Add Banner
                        </Button>
                    </>
                }
            >
                {loading ? (
                    <div className="banners-grid">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <BannerCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <PageError message={error} onRetry={loadBanners} />
                ) : banners.length === 0 ? (
                    <PageEmpty
                        title="No banners yet"
                        description="Create your first banner to promote products on your storefront."
                        action={
                            <Button onClick={openCreate}>
                                <Plus size={16} />
                                Add Banner
                            </Button>
                        }
                    />
                ) : (
                    <div className="banners-grid">
                        {banners.map((banner) => (
                            <article key={banner.id} className="banner-card">
                                <div className="banner-image-wrap">
                                    <BannerImage
                                        src={banner.image_url}
                                        alt={banner.redirect_url ? "Storefront banner" : "Banner"}
                                        className="banner-image"
                                    />
                                    <div className="banner-status-badge">
                                        <StatusBadge status={banner.is_active ? "active" : "inactive"} />
                                    </div>
                                </div>
                                <div className="banner-card-body">
                                    {banner.redirect_url ? (
                                        <a
                                            href={banner.redirect_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="banner-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={14} aria-hidden />
                                            <span>{banner.redirect_url}</span>
                                        </a>
                                    ) : (
                                        <span className="banner-link muted">No redirect URL</span>
                                    )}
                                    {banner.created_at && (
                                        <p className="banner-meta">
                                            Created {new Date(banner.created_at).toLocaleDateString("en-IN")}
                                        </p>
                                    )}
                                    <div className="banner-card-actions">
                                        <button type="button" onClick={() => openEdit(banner)}>
                                            <Pencil size={14} aria-hidden />
                                            Edit
                                        </button>
                                        <button type="button" className="danger" onClick={() => handleDelete(banner)}>
                                            <Trash2 size={14} aria-hidden />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={editingBanner ? "Edit Banner" : "Create Banner"}
                    subtitle="Upload a wide banner image for your storefront carousel."
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" form="banner-form" loading={saving} disabled={uploading}>
                                {editingBanner ? "Save changes" : "Create banner"}
                            </Button>
                        </>
                    }
                >
                    <form id="banner-form" onSubmit={handleSubmit} className="banner-form">
                        <div className="banner-form-field">
                            <label className="banner-form-label" htmlFor="banner-upload">
                                Banner image <span className="banner-form-required">*</span>
                            </label>
                            <div className="banner-upload-zone">
                                <label htmlFor="banner-upload" className="banner-upload-btn">
                                    <ImagePlus size={18} aria-hidden />
                                    {uploading ? "Uploading…" : form.image_url ? "Replace image" : "Upload image"}
                                    <input
                                        id="banner-upload"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleUpload}
                                        disabled={uploading || saving}
                                    />
                                </label>
                                <p className="banner-upload-hint">Recommended: 1200×600 or wider · JPG, PNG, WebP</p>
                            </div>
                            {form.image_url ? (
                                <div className="banner-form-preview">
                                    <BannerImage
                                        src={form.image_url}
                                        alt="Banner preview"
                                        className="banner-form-preview__img"
                                    />
                                </div>
                            ) : (
                                <div className="banner-form-preview banner-form-preview--empty">
                                    <ImagePlus size={28} className="banner-form-preview__placeholder-icon" aria-hidden />
                                    <span>Preview will appear here</span>
                                </div>
                            )}
                        </div>

                        <div className="banner-form-field">
                            <label className="banner-form-label" htmlFor="redirect_url">
                                Redirect URL
                            </label>
                            <input
                                id="redirect_url"
                                type="url"
                                placeholder="https://example.com/your-product"
                                value={form.redirect_url}
                                onChange={(e) => setForm({ ...form, redirect_url: e.target.value })}
                                className="banner-form-input"
                            />
                            <p className="banner-form-hint">Optional link when customers tap the banner.</p>
                        </div>

                        <label className="banner-form-toggle">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                            />
                            <span className="banner-form-toggle__box" aria-hidden />
                            <span className="banner-form-toggle__label">Active banner</span>
                        </label>
                    </form>
                </Modal>
            </DashboardPageShell>
        </div>
    );
}
