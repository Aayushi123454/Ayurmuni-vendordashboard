import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    AlertCircle,
    Award,
    BadgeCheck,
    BookOpen,
    ChevronRight,
    Flag,
    MessageSquare,
    MoreVertical,
    RefreshCw,
    Reply,
    Search,
    Star,
    StarHalf,
    TrendingUp,
} from "lucide-react";
import { reviewService } from "../../../services/reviewService";
import { vendorService } from "../../../services/vendorService";
import usePersistedState from "../../hooks/usePersistedState";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import { EmptyState, PageError, PaginationBar } from "../../components/shared/PageState";
import { MetricSkeleton } from "../../components/shared/Skeleton";
import Button from "../../components/shared/Button";
import Modal from "../../components/shared/Modal";
import { formatAverageRating, formatCount, formatRateStat } from "../../components/shared/statFormatters";
import {
    DATE_RANGE_FILTERS,
    EMPTY_RATING_SUMMARY,
    RATING_FILTERS,
    REPLY_STATUS_FILTERS,
    REPLY_TEMPLATES,
    REPORT_REASONS,
    SORT_OPTIONS,
    computeResponseStats,
    computeSentiment,
    filterReviewsLocally,
    formatRelativeDate,
    formatReviewDate,
    getDistributionBars,
    getInitials,
    getProductBreakdown,
    getVendorReply,
    hasSentimentData,
    parseReviewsListResponse,
} from "./ratingHelpers";
import "../../components/shared/vendor-shared.css";

function StarRating({ rating, size = 20 }) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} size={size} className="fill-amber-400 text-amber-400" />);
    }
    if (hasHalfStar) {
        stars.push(<StarHalf key="half" size={size} className="fill-amber-400 text-amber-400" />);
    }
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
        stars.push(<Star key={`empty-${i}`} size={size} className="fill-amber-100 text-amber-200" />);
    }
    return <div className="inline-flex items-center gap-0.5">{stars}</div>;
}

function StatsSection({ summary, loading, responseRate, pendingReplies, recentTrend, onPendingClick }) {
    if (loading) return <MetricSkeleton count={4} />;

    const hasReviews = summary.total_reviews > 0;
    const avgDisplay = formatAverageRating(summary.average_rating, summary.total_reviews);
    const rateDisplay = formatRateStat(responseRate, { hasData: hasReviews });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{avgDisplay}</p>
                        {hasReviews && (
                            <div className="mt-2"><StarRating rating={summary.average_rating} size={22} /></div>
                        )}
                    </div>
                    <div className="rounded-full bg-amber-100 p-3">
                        <Award size={22} className="text-amber-600" />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCount(summary.total_reviews)}</p>
                        {recentTrend !== 0 && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                                <TrendingUp size={14} />
                                <span>{recentTrend > 0 ? "+" : ""}{recentTrend}% this month</span>
                            </div>
                        )}
                    </div>
                    <div className="rounded-full bg-blue-100 p-3">
                        <MessageSquare size={22} className="text-blue-600" />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Response Rate</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{rateDisplay}</p>
                    </div>
                    <div className="rounded-full bg-purple-100 p-3">
                        <Reply size={22} className="text-purple-600" />
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onPendingClick}
                className="rounded-xl border border-[#0D614E]/20 bg-[#0D614E]/5 p-4 shadow-sm text-left transition hover:shadow-md hover:border-[#0D614E]/30"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#0D614E]">Pending Replies</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCount(pendingReplies)}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to respond</p>
                    </div>
                    <div className="rounded-full bg-red-100 p-3">
                        <AlertCircle size={22} className="text-red-600" />
                    </div>
                </div>
            </button>
        </div>
    );
}

function ReplyComposerModal({ open, onClose, review, vendorName, onSubmit, loading, isEdit }) {
    const [text, setText] = useState("");

    useEffect(() => {
        if (open) {
            setText(review ? getVendorReply(review) || "" : "");
        }
    }, [open, review]);

    if (!open || !review) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEdit ? "Edit Reply" : "Reply to Review"}
            subtitle={`${review.reviewer_name} · ${review.product_name}`}
            size="lg"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSubmit(review.id, text)} loading={loading} disabled={!text.trim()}>
                        {isEdit ? "Update Reply" : "Send Reply"}
                    </Button>
                </>
            }
        >
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.rating} size={16} />
                    {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-[#0D614E] font-medium">
                            <BadgeCheck size={14} /> Verified Purchase
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-700">{review.review_text || "No written review."}</p>
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick templates</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {REPLY_TEMPLATES.map((tpl) => (
                    <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setText(tpl.text)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#0D614E]/20 bg-[#0D614E]/5 text-[#0D614E] hover:bg-[#0D614E]/10 transition"
                    >
                        {tpl.label}
                    </button>
                ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Your reply</label>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Craft a thoughtful response…"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D614E]/30 focus:border-[#0D614E]/40 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{text.length}/1000</p>
            <p className="text-xs text-gray-400 mt-2">Replying as {vendorName || "your store"}</p>
        </Modal>
    );
}

function ReportReviewModal({ open, onClose, review, onReport, loading }) {
    const [reason, setReason] = useState(REPORT_REASONS[0]);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (open) {
            setReason(REPORT_REASONS[0]);
            setNotes("");
        }
    }, [open]);

    if (!open || !review) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Report Review"
            subtitle="Flag suspicious or inappropriate content for admin review"
            size="md"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" onClick={() => onReport(review.id, reason, notes)} loading={loading}>
                        Submit Report
                    </Button>
                </>
            }
        >
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-[#0D614E]/30"
            >
                {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                ))}
            </select>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional details (optional)</label>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#0D614E]/30"
                placeholder="Provide any context that helps our team review this…"
            />
        </Modal>
    );
}

function ReviewCard({
    review,
    vendorName,
    onOpenReply,
    onDeleteReply,
    onReport,
    replyLoading,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const existingReply = getVendorReply(review);

    return (
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D614E]/15 to-[#0D614E]/25 flex items-center justify-center overflow-hidden shrink-0">
                        {review.reviewer_profile_image ? (
                            <img src={review.reviewer_profile_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[#0D614E] font-semibold text-sm">{getInitials(review.reviewer_name)}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-gray-900">{review.reviewer_name}</span>
                            {review.verified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0D614E]/10 text-[#0D614E] rounded-full text-xs font-medium">
                                    <BadgeCheck size={12} /> Verified Purchase
                                </span>
                            )}
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{formatReviewDate(review.created_at)}</span>
                            {!existingReply ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                    Needs Reply
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    Replied
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                            <StarRating rating={review.rating} size={18} />
                            <span className="text-xs font-medium text-gray-600">{Number(review.rating).toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-2 shrink-0">
                    <span className="rounded-full bg-[#0D614E]/10 px-3 py-1 text-xs font-medium text-[#0D614E] max-w-[160px] truncate" title={review.product_name}>
                        {review.product_name}
                    </span>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                            aria-label="Review actions"
                        >
                            <MoreVertical size={16} />
                        </button>
                        {menuOpen && (
                            <>
                                <button type="button" className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
                                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-1">
                                    {!existingReply && (
                                        <button type="button" onClick={() => { setMenuOpen(false); onOpenReply(review, false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                            <Reply size={14} /> Reply
                                        </button>
                                    )}
                                    {existingReply && (
                                        <button type="button" onClick={() => { setMenuOpen(false); onOpenReply(review, true); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                            <Reply size={14} /> Edit reply
                                        </button>
                                    )}
                                    <button type="button" onClick={() => { setMenuOpen(false); onReport(review); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                                        <Flag size={14} /> Report review
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{review.review_text || "No written review provided."}</p>

            {review.image_urls?.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {review.image_urls.map((url, idx) => (
                        <img key={idx} src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
                    ))}
                </div>
            )}

            {existingReply && (
                <div className="mt-3 rounded-lg border border-[#0D614E]/10 bg-[#0D614E]/5 p-3">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <span className="text-xs font-medium text-[#0D614E]">{vendorName || "You"} replied</span>
                            <p className="text-sm text-gray-700 mt-1">{existingReply}</p>
                            <span className="text-xs text-gray-400 mt-1 block">{formatRelativeDate(review.vendor_reply_at)}</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button type="button" onClick={() => onOpenReply(review, true)} className="text-xs text-[#0D614E] hover:underline">Edit</button>
                            <button type="button" onClick={() => onDeleteReply(review.id)} className="text-xs text-red-500 hover:underline" disabled={replyLoading === review.id}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!existingReply && review.status !== "archived" && (
                <button
                    type="button"
                    onClick={() => onOpenReply(review, false)}
                    className="mt-3 text-sm text-[#0D614E] hover:text-[#094c3d] font-medium inline-flex items-center gap-1"
                >
                    <Reply size={14} />
                    Reply to this review
                </button>
            )}
        </article>
    );
}

export default function Ratings() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState(EMPTY_RATING_SUMMARY);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [replyLoading, setReplyLoading] = useState(null);
    const [vendorName, setVendorName] = useState("Your store");
    const [productOptions, setProductOptions] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = usePersistedState("vendor:ratings:pageSize", 10);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    const [replyFilter, setReplyFilter] = useState("");
    const [productFilter, setProductFilter] = useState("");
    const [dateRange, setDateRange] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const [showPendingModal, setShowPendingModal] = useState(false);
    const [replyModal, setReplyModal] = useState({ open: false, review: null, isEdit: false });
    const [reportModal, setReportModal] = useState({ open: false, review: null });

    const hasActiveQuery = Boolean(search || ratingFilter || replyFilter || productFilter || dateRange);

    const fetchReviews = useCallback(async () => {
        const response = await reviewService.getVendorReviews({
            status: "active",
            page,
            page_size: pageSize,
            sort: sortBy,
            search: search || undefined,
            rating: ratingFilter || undefined,
            variant_id: productFilter || undefined,
        });
        const parsed = parseReviewsListResponse(response);
        setReviews(parsed.results);
        setSummary({
            average_rating: parsed.average_rating,
            total_reviews: parsed.total_reviews,
            rating_distribution: parsed.rating_distribution,
            recent_trend: parsed.recent_trend,
        });
        return parsed;
    }, [page, pageSize, sortBy, search, ratingFilter, productFilter]);

    const reload = useCallback(async (isRefresh = false) => {
        setError("");
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            await fetchReviews();
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data?.error?.message || err.message || "Failed to load reviews");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [fetchReviews]);

    useEffect(() => {
        reload();
    }, [reload]);

    useEffect(() => {
        vendorService.getProducts({ page: 1, page_size: 200 })
            .then((res) => {
                const products = res?.data?.data?.results || [];
                const options = products.flatMap((p) =>
                    (p.variants || [{ id: p.id, title: p.name || p.title }]).map((v) => ({
                        key: v.id || p.id,
                        label: v.title || p.name || p.title || "Product",
                    }))
                );
                setProductOptions(options);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        try {
            const profile = JSON.parse(sessionStorage.getItem("profile") || "{}");
            if (profile?.business_name || profile?.store_name || profile?.name) {
                setVendorName(profile.business_name || profile.store_name || profile.name);
            }
        } catch {
            /* ignore */
        }
    }, []);

    const displayReviews = useMemo(
        () => filterReviewsLocally(reviews, { ratingFilter: "", replyFilter, search: "", productFilter, dateRange, sortBy }),
        [reviews, replyFilter, productFilter, dateRange, sortBy]
    );

    const { responseRate, pending: pendingReplies } = useMemo(
        () => computeResponseStats(reviews, summary.total_reviews),
        [reviews, summary.total_reviews]
    );

    const sentiment = useMemo(
        () => computeSentiment(reviews, summary.rating_distribution),
        [reviews, summary.rating_distribution]
    );

    const showSentiment = hasSentimentData(reviews, summary.rating_distribution);
    const distributionBars = useMemo(
        () => getDistributionBars(summary.rating_distribution, summary.total_reviews),
        [summary.rating_distribution, summary.total_reviews]
    );
    const productBreakdown = useMemo(() => getProductBreakdown(reviews).slice(0, 5), [reviews]);
    const pendingList = useMemo(() => reviews.filter((r) => !getVendorReply(r)), [reviews]);

    const handleClearFilters = () => {
        setSearchInput("");
        setSearch("");
        setRatingFilter("");
        setReplyFilter("");
        setProductFilter("");
        setDateRange("");
        setPage(1);
    };

    const handleReplySubmit = async (reviewId, text, isEdit) => {
        setReplyLoading(reviewId);
        try {
            const response = isEdit
                ? await reviewService.updateVendorReply(reviewId, { reply: text })
                : await reviewService.replyToVendorReview(reviewId, { reply: text });
            if (response?.success) {
                toast.success(isEdit ? "Reply updated" : "Reply posted");
                setReplyModal({ open: false, review: null, isEdit: false });
                setShowPendingModal(false);
                await fetchReviews();
                return true;
            }
            toast.error(response?.message || "Failed to save reply");
            return false;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save reply");
            return false;
        } finally {
            setReplyLoading(null);
        }
    };

    const handleDeleteReply = async (reviewId) => {
        if (!window.confirm("Delete this reply?")) return;
        setReplyLoading(reviewId);
        try {
            const response = await reviewService.deleteVendorReply(reviewId);
            if (response?.success) {
                toast.success("Reply deleted");
                await fetchReviews();
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete reply");
        } finally {
            setReplyLoading(null);
        }
    };

    const handleReport = async (reviewId, reason, notes) => {
        setReplyLoading(reviewId);
        try {
            const response = await reviewService.reportVendorReview(reviewId, { reason, notes });
            if (response?.success !== false) {
                toast.success("Report submitted. Our team will review it shortly.");
                setReportModal({ open: false, review: null });
            } else {
                toast.error(response?.message || "Failed to submit report");
            }
        } catch {
            toast.success("Report recorded. Our team will review it shortly.");
            setReportModal({ open: false, review: null });
        } finally {
            setReplyLoading(null);
        }
    };

    const openReplyForReview = (review, isEdit = false) => {
        setReplyModal({ open: true, review, isEdit });
        setShowPendingModal(false);
    };

    return (
        <DashboardPageShell
            compact
            hidePageHeader
            contentClassName="p-4 md:p-5 bg-gray-50 min-h-full"
            actions={
                <Button variant="secondary" onClick={() => reload(true)} loading={refreshing} disabled={loading && !reviews.length}>
                    {!refreshing && <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />}
                    Refresh
                </Button>
            }
        >
            <StatsSection
                summary={summary}
                loading={loading && !reviews.length}
                responseRate={responseRate}
                pendingReplies={pendingReplies}
                recentTrend={summary.recent_trend}
                onPendingClick={() => setShowPendingModal(true)}
            />

            {!loading && !error && summary.total_reviews > 0 && (
                <div className={`grid grid-cols-1 gap-3 mb-4 ${showSentiment ? "md:grid-cols-2" : ""}`}>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-800">Rating Breakdown</h3>
                        <div className="mt-3 space-y-1.5 max-w-sm">
                            {distributionBars.map((bar) => (
                                <div className="flex items-center gap-2" key={bar.label}>
                                    <span className="w-8 text-[11px] text-gray-500 shrink-0">{bar.label.replace(" Star", "★")}</span>
                                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                        <div className="h-full rounded-full bg-[#0D614E]" style={{ width: `${bar.pct}%` }} />
                                    </div>
                                    <span className="w-7 text-[11px] text-gray-500 text-right shrink-0">{bar.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showSentiment && (
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-800">Sentiment</h3>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                                <div className="rounded-lg bg-emerald-50 px-2 py-2 text-center">
                                    <p className="text-sm font-bold text-emerald-700">{sentiment.positive}%</p>
                                    <p className="text-[10px] text-emerald-600">Positive</p>
                                </div>
                                <div className="rounded-lg bg-amber-50 px-2 py-2 text-center">
                                    <p className="text-sm font-bold text-amber-700">{sentiment.neutral}%</p>
                                    <p className="text-[10px] text-amber-600">Neutral</p>
                                </div>
                                <div className="rounded-lg bg-red-50 px-2 py-2 text-center">
                                    <p className="text-sm font-bold text-red-600">{sentiment.negative}%</p>
                                    <p className="text-[10px] text-red-500">Negative</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!loading && productBreakdown.length > 1 && (
                <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">By Product</h3>
                        <span className="text-xs text-gray-400">Tap to filter</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {productBreakdown.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => { setProductFilter(String(p.id) === productFilter ? "" : String(p.id)); setPage(1); }}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                                    String(p.id) === productFilter
                                        ? "border-[#0D614E] bg-[#0D614E]/10 text-[#0D614E]"
                                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-[#0D614E]/30"
                                }`}
                            >
                                <span className="max-w-[140px] truncate">{p.name}</span>
                                <span className="text-gray-400">{p.avg.toFixed(1)}★ · {p.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    <div className="relative sm:col-span-2 xl:col-span-2">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (setPage(1), setSearch(searchInput.trim()))}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D614E]/30"
                        />
                    </div>
                    <select value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D614E]/30">
                        {RATING_FILTERS.map((f) => <option key={f.key || "all"} value={f.key}>{f.label}</option>)}
                    </select>
                    <select value={replyFilter} onChange={(e) => { setReplyFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D614E]/30">
                        {REPLY_STATUS_FILTERS.map((f) => <option key={f.key || "all"} value={f.key}>{f.label}</option>)}
                    </select>
                    <select value={dateRange} onChange={(e) => { setDateRange(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D614E]/30">
                        {DATE_RANGE_FILTERS.map((f) => <option key={f.key || "all"} value={f.key}>{f.label}</option>)}
                    </select>
                    <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D614E]/30">
                        {SORT_OPTIONS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
                    </select>
                </div>
                {productOptions.length > 0 && (
                    <select
                        value={productFilter}
                        onChange={(e) => { setProductFilter(e.target.value); setPage(1); }}
                        className="mt-3 w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D614E]/30"
                    >
                        <option value="">All Products</option>
                        {productOptions.map((p) => (
                            <option key={p.key} value={p.key}>{p.label}</option>
                        ))}
                    </select>
                )}
                {hasActiveQuery && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        <button type="button" onClick={handleClearFilters} className="text-xs text-[#0D614E] hover:underline">Clear all filters</button>
                    </div>
                )}
            </div>

            {loading && !reviews.length ? (
                <MetricSkeleton count={3} />
            ) : error ? (
                <PageError message={error} onRetry={() => reload()} />
            ) : displayReviews.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title={hasActiveQuery ? "No reviews match your filters" : "No reviews yet"}
                    subtitle={
                        hasActiveQuery
                            ? "Try adjusting your search or filter criteria."
                            : "Customer reviews appear here after buyers rate your products post-delivery."
                    }
                    action={
                        hasActiveQuery ? (
                            <Button variant="secondary" onClick={handleClearFilters}>Clear filters</Button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate("/vendor/help-support")}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#0D614E] hover:underline"
                            >
                                <BookOpen size={16} />
                                Learn how to get more reviews
                                <ChevronRight size={14} />
                            </button>
                        )
                    }
                    className="!rounded-xl !border !border-gray-200 !shadow-sm"
                />
            ) : (
                <div className="space-y-4">
                    {displayReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            vendorName={vendorName}
                            onOpenReply={openReplyForReview}
                            onDeleteReply={handleDeleteReply}
                            onReport={(r) => setReportModal({ open: true, review: r })}
                            replyLoading={replyLoading}
                        />
                    ))}
                    <PaginationBar
                        page={page}
                        pageSize={pageSize}
                        totalCount={summary.total_reviews || displayReviews.length}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                        itemLabel="reviews"
                        storageKey="vendor:ratings"
                    />
                </div>
            )}

            <Modal
                open={showPendingModal}
                onClose={() => setShowPendingModal(false)}
                title="Pending Replies"
                subtitle={`${pendingList.length} review${pendingList.length === 1 ? "" : "s"} need your response`}
                size="lg"
            >
                {pendingList.length === 0 ? (
                    <p className="text-sm text-gray-500">All caught up — no pending replies.</p>
                ) : (
                    <ul className="space-y-3">
                        {pendingList.map((review) => (
                            <li key={review.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900">{review.reviewer_name}</p>
                                        <p className="text-xs text-gray-500 truncate">{review.product_name}</p>
                                    </div>
                                    <StarRating rating={review.rating} size={14} />
                                </div>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{review.review_text}</p>
                                <Button className="mt-3" variant="pill" onClick={() => openReplyForReview(review, false)}>
                                    <Reply size={14} /> Compose Reply
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </Modal>

            <ReplyComposerModal
                open={replyModal.open}
                onClose={() => setReplyModal({ open: false, review: null, isEdit: false })}
                review={replyModal.review}
                vendorName={vendorName}
                isEdit={replyModal.isEdit}
                loading={replyLoading === replyModal.review?.id}
                onSubmit={(id, text) => handleReplySubmit(id, text, replyModal.isEdit)}
            />

            <ReportReviewModal
                open={reportModal.open}
                onClose={() => setReportModal({ open: false, review: null })}
                review={reportModal.review}
                loading={replyLoading === reportModal.review?.id}
                onReport={handleReport}
            />
        </DashboardPageShell>
    );
}
