import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Upload,
    Download,
    FileSpreadsheet,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Info,
    Trash2,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    ImageIcon,
    Leaf,
    Pencil,
    Users,
    User,
} from "lucide-react";
import { doctorService } from "../../../services/doctorService";

const TEMPLATE_URL = "/templates/diet_plans_bulk_upload_template.xlsx";
const TEMPLATE_FILENAME = "diet_plans_bulk_upload_template.xlsx";
const ACCEPTED_TYPES = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
];
const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"];
const MAX_FILE_SIZE_MB = 10;

const SHEET_GUIDE = [
    {
        name: "General",
        columns: "plan_id, name, prakriti, season, health_disease, is_paid, price, is_common",
        tip: "One row per diet plan. Use unique plan_id values (e.g. DP001). Separate multiple diseases with |.",
    },
    {
        name: "Schedule",
        columns: "plan_id, day, meal_time, food_name, quantity, notes, preparation_steps, meal_calories, meal_protein, meal_carbs, meal_fat",
        tip: "Link meals to a plan_id from General. meal_time: morning, breakfast, midday, lunch, dinner.",
    },
    {
        name: "Gallery",
        columns: "plan_id, image_scope, day, meal_time, image_url, caption, is_cover",
        tip: "image_scope: DIET_PLAN or MEAL. For MEAL rows, include day and meal_time. Use public image URLs.",
    },
    {
        name: "References",
        columns: "disease_name, season, prakriti, meal_time, image_scope",
        tip: "Allowed values for diseases, seasons, prakriti, meal times, and image scopes. Do not upload custom values outside this list.",
    },
];

const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const normalizeErrors = (data) => {
    if (!data) return [];

    const collected = [];

    const pushItem = (item, fallbackIndex) => {
        if (item == null) return;
        if (typeof item === "string") {
            collected.push({ row: null, sheet: null, field: null, message: item });
            return;
        }
        if (typeof item === "object") {
            collected.push({
                row: item.row ?? item.row_number ?? item.line ?? fallbackIndex ?? null,
                sheet: item.sheet ?? item.sheet_name ?? item.tab ?? null,
                field: item.field ?? item.column ?? item.key ?? null,
                plan_id: item.plan_id ?? item.planId ?? null,
                message:
                    item.message ||
                    item.error ||
                    item.detail ||
                    (Array.isArray(item.errors) ? item.errors.join(", ") : null) ||
                    JSON.stringify(item),
            });
        }
    };

    if (Array.isArray(data.errors)) {
        data.errors.forEach((e, i) => pushItem(e, i + 1));
    } else if (data.errors && typeof data.errors === "object") {
        Object.entries(data.errors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) =>
                    pushItem(
                        typeof v === "string"
                            ? { field: key, message: v }
                            : { ...v, field: v.field || key },
                        null
                    )
                );
            } else {
                pushItem(
                    typeof value === "string"
                        ? { field: key, message: value }
                        : { ...value, field: value?.field || key },
                    null
                );
            }
        });
    }

    if (Array.isArray(data.failed_rows)) {
        data.failed_rows.forEach((e, i) => pushItem(e, i + 1));
    }
    if (Array.isArray(data.validation_errors)) {
        data.validation_errors.forEach((e, i) => pushItem(e, i + 1));
    }
    if (typeof data.detail === "string" && collected.length === 0) {
        collected.push({ row: null, sheet: null, field: null, message: data.detail });
    }
    if (typeof data.message === "string" && collected.length === 0 && !data.created && !data.success) {
        collected.push({ row: null, sheet: null, field: null, message: data.message });
    }

    return collected;
};

const getCover = (gallery) => {
    if (!gallery || gallery.length === 0) return null;
    return gallery.find((img) => img.is_cover) || gallery[0];
};

const normalizeUploadedPlans = (data) => {
    if (!data) return [];

    const rows = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.created_plans)
            ? data.created_plans
            : [];

    return rows
        .map((item) => {
            if (!item) return null;
            const plan = item.diet_plan || item.plan || item;
            if (!plan || typeof plan !== "object") return null;
            return {
                excel_plan_id: item.plan_id || plan.plan_id || null,
                id: plan.id || null,
                name: plan.name || "Untitled plan",
                prakriti: plan.prakriti || "—",
                season: plan.season || "—",
                health_diseases: plan.health_diseases || [],
                is_paid: !!plan.is_paid,
                price: plan.price,
                is_common: !!plan.is_common,
                is_active: plan.is_active ?? true,
                total_days: plan.total_days ?? null,
                meals_per_day: plan.meals_per_day ?? null,
                diet_plan_gallery: plan.diet_plan_gallery || [],
                status: item.status || (plan.is_active === false ? "Inactive" : "Created"),
            };
        })
        .filter(Boolean);
};

const extractSummary = (data, uploadedPlans = []) => {
    if (!data || typeof data !== "object") {
        return { created: null, updated: null, failed: null, total: null, skipped: null };
    }

    const createdFromList = uploadedPlans.length > 0 ? uploadedPlans.length : null;
    const created =
        data.created ??
        data.created_count ??
        data.success_count ??
        createdFromList;

    return {
        created,
        updated: data.updated ?? data.updated_count ?? null,
        failed: data.failed ?? data.failed_count ?? data.error_count ?? null,
        total: data.total ?? data.total_count ?? created,
        skipped: data.skipped ?? data.skipped_count ?? null,
    };
};

const Badge = ({ children, tone = "gray" }) => {
    const tones = {
        gray: "bg-gray-100 text-gray-600",
        green: "bg-green-50 text-green-700",
        amber: "bg-amber-50 text-amber-700",
        blue: "bg-blue-50 text-blue-700",
        red: "bg-red-50 text-red-600",
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${tones[tone]}`}>
            {children}
        </span>
    );
};

const BulkUploadDietPlans = () => {
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [clientError, setClientError] = useState("");
    const [result, setResult] = useState(null);
    const [showGuide, setShowGuide] = useState(true);

    const resetResult = () => setResult(null);

    const validateFile = (selected) => {
        if (!selected) return "Please select an Excel file.";

        const name = selected.name?.toLowerCase() || "";
        const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
        const hasValidType = !selected.type || ACCEPTED_TYPES.includes(selected.type);

        if (!hasValidExt && !hasValidType) {
            return "Only .xlsx or .xls Excel files are allowed.";
        }
        if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`;
        }
        return "";
    };

    const assignFile = useCallback((selected) => {
        setResult(null);
        const error = validateFile(selected);
        if (error) {
            setClientError(error);
            setFile(null);
            toast.error(error);
            return;
        }
        setClientError("");
        setFile(selected);
    }, []);

    const onFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) assignFile(selected);
        e.target.value = "";
    };

    const onDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);
            const selected = e.dataTransfer.files?.[0];
            if (selected) assignFile(selected);
        },
        [assignFile]
    );

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const clearFile = () => {
        setFile(null);
        setClientError("");
        resetResult();
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = TEMPLATE_URL;
        link.download = TEMPLATE_FILENAME;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Template download started");
    };

    const handleUpload = async () => {
        if (!file) {
            const msg = "Please select an Excel file first.";
            setClientError(msg);
            toast.error(msg);
            return;
        }

        const validation = validateFile(file);
        if (validation) {
            setClientError(validation);
            toast.error(validation);
            return;
        }

        setUploading(true);
        setClientError("");
        resetResult();

        try {
            const response = await doctorService.bulkupload(file);
            const payload = response?.data ?? response;
            const uploadedPlans = normalizeUploadedPlans(payload);
            const errors = normalizeErrors(payload);
            const summary = extractSummary(payload, uploadedPlans);
            const httpOk = response?.status >= 200 && response?.status < 300;

            const success =
                httpOk &&
                payload?.success !== false &&
                (payload?.success === true || uploadedPlans.length > 0);

            setResult({
                success,
                message:
                    payload?.message ||
                    payload?.detail ||
                    (success
                        ? "Diet plans uploaded successfully."
                        : "Upload completed with issues. Review the errors below."),
                summary,
                errors,
                uploadedPlans,
                raw: payload,
            });

            if (success) {
                toast.success(payload?.message || "Bulk upload completed successfully");
            } else {
                toast.error(payload?.message || payload?.detail || "Bulk upload failed");
            }
        } catch (err) {
            const data = err?.data || err?.originalError?.response?.data || null;
            const uploadedPlans = normalizeUploadedPlans(data);
            const errors = normalizeErrors(data);
            const summary = extractSummary(data, uploadedPlans);
            const message =
                err?.message ||
                data?.message ||
                data?.detail ||
                "Failed to upload diet plans. Please check your file and try again.";

            setResult({
                success: false,
                message,
                summary,
                errors: errors.length
                    ? errors
                    : [{ row: null, sheet: null, field: null, message }],
                uploadedPlans,
                raw: data,
            });
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto p-4 min-h-screen">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <Link
                        to="/doctor/diets"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0D614E] mb-2"
                    >
                        <ArrowLeft size={14} /> Back to Diet Plans
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Diet Plans</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Upload multiple diet plans at once using the Excel template format.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#0D614E] border border-[#0D614E]/30 bg-[#0D614E]/5 rounded-lg hover:bg-[#0D614E]/10 transition-colors"
                    >
                        <Download size={15} /> Download Template
                    </button>
                    <Link
                        to="/doctor/add-diet"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#0D614E] rounded-lg hover:bg-[#0A4D3D] transition-colors"
                    >
                        Add Single Plan
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                {/* Left: upload */}
                <div className="xl:col-span-3 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-[#0D614E]/10 flex items-center justify-center shrink-0">
                                <FileSpreadsheet size={20} className="text-[#0D614E]" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Upload Excel File</h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Use the official template (.xlsx). Max {MAX_FILE_SIZE_MB} MB.
                                </p>
                            </div>
                        </div>

                        <div
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onClick={() => !uploading && inputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                                dragging
                                    ? "border-[#0D614E] bg-[#0D614E]/5"
                                    : clientError
                                      ? "border-red-300 bg-red-50/40"
                                      : "border-gray-200 hover:border-[#0D614E]/60 hover:bg-gray-50/80"
                            } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                className="hidden"
                                onChange={onFileChange}
                                disabled={uploading}
                            />
                            <Upload
                                size={36}
                                className={`mx-auto mb-3 ${dragging ? "text-[#0D614E]" : "text-gray-400"}`}
                            />
                            <p className="text-sm font-medium text-gray-800">
                                Drag & drop your Excel file here
                            </p>
                            <p className="text-xs text-gray-400 mt-1">or click to browse from your computer</p>
                            <p className="text-[11px] text-gray-400 mt-3">Accepted: .xlsx, .xls</p>
                        </div>

                        {clientError && (
                            <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{clientError}</span>
                            </div>
                        )}

                        {file && (
                            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                        <FileSpreadsheet size={18} className="text-[#0D614E]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFile();
                                    }}
                                    disabled={uploading}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                    title="Remove file"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        )}

                        <div className="mt-5 flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-[#0D614E] rounded-lg hover:bg-[#0A4D3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" /> Uploading…
                                    </>
                                ) : (
                                    <>
                                        <Upload size={15} /> Upload Diet Plans
                                    </>
                                )}
                            </button>
                            {(file || result) && (
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    disabled={uploading}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <RefreshCw size={14} /> Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Result panel */}
                    {result && (
                        <div
                            className={`bg-white border rounded-xl shadow-sm overflow-hidden ${
                                result.success ? "border-green-100" : "border-red-100"
                            }`}
                        >
                            <div
                                className={`px-5 py-4 flex items-start gap-3 ${
                                    result.success ? "bg-green-50/70" : "bg-red-50/70"
                                }`}
                            >
                                {result.success ? (
                                    <CheckCircle2 size={22} className="text-green-600 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertTriangle size={22} className="text-red-500 shrink-0 mt-0.5" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3
                                                className={`text-base font-semibold ${
                                                    result.success ? "text-green-800" : "text-red-700"
                                                }`}
                                            >
                                                {result.success ? "Upload completed" : "Upload failed"}
                                            </h3>
                                            <p
                                                className={`text-sm mt-0.5 ${
                                                    result.success ? "text-green-700" : "text-red-600"
                                                }`}
                                            >
                                                {result.message}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={resetResult}
                                            className="p-1 rounded-md hover:bg-white/70 text-gray-400"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {(result.summary.created != null ||
                                        result.summary.updated != null ||
                                        result.summary.failed != null ||
                                        result.summary.total != null ||
                                        result.summary.skipped != null ||
                                        result.uploadedPlans?.length > 0) && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {(result.summary.total != null || result.uploadedPlans?.length > 0) && (
                                                <StatChip
                                                    label="Total"
                                                    value={result.summary.total ?? result.uploadedPlans.length}
                                                />
                                            )}
                                            {(result.summary.created != null || result.uploadedPlans?.length > 0) && (
                                                <StatChip
                                                    label="Created"
                                                    value={result.summary.created ?? result.uploadedPlans.length}
                                                    tone="green"
                                                />
                                            )}
                                            {result.summary.updated != null && (
                                                <StatChip label="Updated" value={result.summary.updated} tone="blue" />
                                            )}
                                            {result.summary.skipped != null && (
                                                <StatChip label="Skipped" value={result.summary.skipped} tone="amber" />
                                            )}
                                            {result.summary.failed != null && (
                                                <StatChip label="Failed" value={result.summary.failed} tone="red" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {result.uploadedPlans?.length > 0 && (
                                <div className="p-5 border-t border-gray-100">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            Uploaded diet plans ({result.uploadedPlans.length})
                                        </h4>
                                        <Link
                                            to="/doctor/diets"
                                            className="text-sm font-medium text-[#0D614E] hover:underline"
                                        >
                                            View all diet plans
                                        </Link>
                                    </div>
                                    <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 bg-gray-50">
                                                    <th className="px-3 py-2.5">Plan</th>
                                                    <th className="px-3 py-2.5">Excel ID</th>
                                                    <th className="px-3 py-2.5">Condition</th>
                                                    <th className="px-3 py-2.5">Prakriti / Season</th>
                                                    <th className="px-3 py-2.5">Type</th>
                                                    <th className="px-3 py-2.5">Status</th>
                                                    <th className="px-3 py-2.5 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.uploadedPlans.map((plan) => {
                                                    const cover = getCover(plan.diet_plan_gallery);
                                                    return (
                                                        <tr
                                                            key={plan.id || plan.excel_plan_id || plan.name}
                                                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                                                        >
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                                                        {cover?.image_url ? (
                                                                            <img
                                                                                src={cover.image_url}
                                                                                alt={plan.name}
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    e.target.style.display = "none";
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <ImageIcon size={14} className="text-gray-300" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="font-medium text-gray-900 truncate max-w-[220px]">
                                                                            {plan.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                            {plan.total_days != null
                                                                                ? `${plan.total_days} day${plan.total_days === 1 ? "" : "s"}`
                                                                                : "—"}
                                                                            {plan.meals_per_day != null
                                                                                ? ` · ${plan.meals_per_day} meals/day`
                                                                                : ""}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3 text-gray-600 font-mono text-xs">
                                                                {plan.excel_plan_id || "—"}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {plan.health_diseases?.length ? (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {plan.health_diseases.map((d) => (
                                                                            <Badge key={d.id || d.name} tone="blue">
                                                                                {d.name}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-300">—</span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                                    <Leaf size={12} className="text-[#0D614E]" />
                                                                    {plan.prakriti}
                                                                </div>
                                                                <div className="text-xs text-gray-400 mt-0.5 capitalize">
                                                                    {String(plan.season).replace(/_/g, " ")}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="flex flex-col gap-1">
                                                                    {plan.is_paid ? (
                                                                        <Badge tone="amber">
                                                                            ₹{Number(plan.price || 0).toFixed(0)}
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge tone="green">Free</Badge>
                                                                    )}
                                                                    {plan.is_common ? (
                                                                        <Badge tone="blue">
                                                                            <Users size={11} /> Common
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge>
                                                                            <User size={11} /> Personal
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <Badge tone={plan.is_active ? "green" : "gray"}>
                                                                    <CheckCircle2 size={11} />
                                                                    {plan.status || (plan.is_active ? "Created" : "Inactive")}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-3 py-3 text-right">
                                                                {plan.id ? (
                                                                    <Link
                                                                        to={`/doctor/edit-diet/${plan.id}`}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#0D614E] hover:bg-[#0D614E]/5 rounded-md"
                                                                        title="Edit plan"
                                                                    >
                                                                        <Pencil size={13} /> Edit
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-gray-300">—</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {result.errors?.length > 0 && (
                                <div className="p-5 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            Issues ({result.errors.length})
                                        </h4>
                                    </div>
                                    <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 bg-gray-50">
                                                    <th className="px-3 py-2.5">Sheet</th>
                                                    <th className="px-3 py-2.5">Row</th>
                                                    <th className="px-3 py-2.5">Plan ID</th>
                                                    <th className="px-3 py-2.5">Field</th>
                                                    <th className="px-3 py-2.5">Message</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.errors.map((err, idx) => (
                                                    <tr
                                                        key={`${err.sheet}-${err.row}-${idx}`}
                                                        className="border-b border-gray-50 last:border-0"
                                                    >
                                                        <td className="px-3 py-2.5 text-gray-600">
                                                            {err.sheet || "—"}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-gray-600">
                                                            {err.row ?? "—"}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-gray-600">
                                                            {err.plan_id || "—"}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-gray-600">
                                                            {err.field || "—"}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-red-600">{err.message}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {result.success && (
                                <div className="px-5 py-4 border-t border-green-100 flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm text-gray-500">
                                        {result.uploadedPlans?.length
                                            ? "These diet plans were uploaded successfully."
                                            : "Your diet plans are ready to review."}
                                    </p>
                                    <Link
                                        to="/doctor/diets"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-[#0D614E] rounded-lg hover:bg-[#0A4D3D]"
                                    >
                                        Go to Diet Plans
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: guide */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                <Info size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">How it works</h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Follow these steps for a successful upload.
                                </p>
                            </div>
                        </div>
                        <ol className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#0D614E] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                                    1
                                </span>
                                <span>
                                    Download the template and keep the sheet names:{" "}
                                    <strong>General</strong>, <strong>Schedule</strong>,{" "}
                                    <strong>Gallery</strong>, <strong>References</strong>.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#0D614E] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                                    2
                                </span>
                                <span>
                                    Fill plan rows in General, then add meals and images using the same{" "}
                                    <strong>plan_id</strong>.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#0D614E] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                                    3
                                </span>
                                <span>
                                    Use only values listed in the <strong>References</strong> sheet for diseases,
                                    seasons, prakriti, and meal times.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#0D614E] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                                    4
                                </span>
                                <span>Save as .xlsx, upload here, and fix any row errors shown after upload.</span>
                            </li>
                        </ol>

                        <button
                            type="button"
                            onClick={handleDownloadTemplate}
                            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0D614E] border border-[#0D614E]/25 rounded-lg hover:bg-[#0D614E]/5 transition-colors"
                        >
                            <Download size={15} /> Download Excel Template
                        </button>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowGuide((v) => !v)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/80"
                        >
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Sheet format guide</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Required columns for each sheet</p>
                            </div>
                            {showGuide ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                        </button>
                        {showGuide && (
                            <div className="px-5 pb-5 space-y-3">
                                {SHEET_GUIDE.map((sheet) => (
                                    <div
                                        key={sheet.name}
                                        className="rounded-lg border border-gray-100 bg-gray-50/70 p-3.5"
                                    >
                                        <p className="text-sm font-semibold text-gray-900">{sheet.name}</p>
                                        <p className="text-[11px] text-gray-500 mt-1 font-mono leading-relaxed break-all">
                                            {sheet.columns}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-2">{sheet.tip}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatChip = ({ label, value, tone = "gray" }) => {
    const tones = {
        gray: "bg-white text-gray-700 border-gray-200",
        green: "bg-white text-green-700 border-green-200",
        blue: "bg-white text-blue-700 border-blue-200",
        amber: "bg-white text-amber-700 border-amber-200",
        red: "bg-white text-red-600 border-red-200",
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${tones[tone]}`}
        >
            <span className="text-gray-400 font-normal">{label}</span>
            {value}
        </span>
    );
};

export default BulkUploadDietPlans;
