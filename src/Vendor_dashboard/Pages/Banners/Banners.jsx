import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { vendorService } from "../../../services/vendorService";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { PageEmpty, PageError, PageLoader } from "../../components/shared/PageState";
import StatusBadge from "../../components/shared/StatusBadge";
import Modal from "../../components/shared/Modal";
import Button from "../../components/shared/Button";

const emptyForm = {
    image_url: "",
    redirect_url: "",
    is_active: true,
};

export default function Banners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchBanners = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await vendorService.getBanners();
            setBanners(response.data?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Failed to load banners");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

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
            fetchBanners();
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
            fetchBanners();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete banner");
        }
    };

    return (
        <DashboardPageShell
            title="Product"
            accent="Banners"
            subtitle="Manage promotional banners shown on your product storefront."
            breadcrumbs={[{ label: "Dashboard" }, { label: "Banners" }]}
            actions={<Button onClick={openCreate}>+ Add Banner</Button>}
        >
            {loading ? (
                <PageLoader message="Loading banners..." />
            ) : error ? (
                <PageError message={error} onRetry={fetchBanners} />
            ) : banners.length === 0 ? (
                <PageEmpty
                    title="No banners yet"
                    description="Create your first banner to promote products on the storefront."
                    action={<Button onClick={openCreate}>+ Add Banner</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative aspect-[2/1] bg-gray-100">
                                <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={banner.is_active ? "active" : "inactive"} />
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {banner.redirect_url ? (
                                    <a href={banner.redirect_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#0D614E] hover:underline break-all">
                                        <ExternalLink size={14} /> {banner.redirect_url}
                                    </a>
                                ) : (
                                    <span className="text-xs text-gray-400">No redirect URL</span>
                                )}
                                {banner.created_at && (
                                    <p className="text-xs text-gray-400">Created {new Date(banner.created_at).toLocaleDateString()}</p>
                                )}
                                <div className="flex gap-2 pt-1">
                                    <Button variant="secondary" className="flex-1 !text-sm" onClick={() => openEdit(banner)}>
                                        <Pencil size={14} /> Edit
                                    </Button>
                                    <Button variant="danger" className="flex-1 !text-sm" onClick={() => handleDelete(banner)}>
                                        <Trash2 size={14} /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingBanner ? "Edit Banner" : "Create Banner"}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" form="banner-form" disabled={saving}>{saving ? "Saving..." : "Save Banner"}</Button>
                    </>
                }
            >
                <form id="banner-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image *</label>
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
                                <ImagePlus size={16} />
                                {uploading ? "Uploading..." : "Upload Image"}
                                <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
                            </label>
                            {form.image_url && (
                                <img src={form.image_url} alt="Preview" className="h-16 rounded-lg border border-gray-200 object-cover" />
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="redirect_url" className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
                        <input
                            id="redirect_url"
                            type="url"
                            placeholder="https://..."
                            value={form.redirect_url}
                            onChange={(e) => setForm({ ...form, redirect_url: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                            className="rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]"
                        />
                        Active banner
                    </label>
                </form>
            </Modal>
        </DashboardPageShell>
    );
}
