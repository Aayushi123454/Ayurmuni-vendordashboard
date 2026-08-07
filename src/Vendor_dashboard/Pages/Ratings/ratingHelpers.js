export const RATING_FILTERS = [
    { key: "", label: "All Stars" },
    { key: "5", label: "5 Stars" },
    { key: "4", label: "4 Stars" },
    { key: "3", label: "3 Stars" },
    { key: "2", label: "2 Stars" },
    { key: "1", label: "1 Star" },
];

export const REPLY_STATUS_FILTERS = [
    { key: "", label: "All Reviews" },
    { key: "pending", label: "Pending Reply" },
    { key: "responded", label: "Responded" },
];

export const SORT_OPTIONS = [
    { key: "newest", label: "Newest First" },
    { key: "oldest", label: "Oldest First" },
    { key: "highest", label: "Highest Rating" },
    { key: "lowest", label: "Lowest Rating" },
];

export const DATE_RANGE_FILTERS = [
    { key: "", label: "All Time" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "Last 3 Months" },
    { key: "year", label: "This Year" },
];

export const REPLY_TEMPLATES = [
    {
        id: "thanks",
        label: "Thank you",
        text: "Thank you so much for your thoughtful review! We're delighted you're enjoying our product and truly appreciate you taking the time to share your experience.",
    },
    {
        id: "apology",
        label: "Apology + resolution",
        text: "We're sorry your experience didn't meet expectations. Your feedback matters to us — please reach out to our support team so we can make this right for you.",
    },
    {
        id: "quality",
        label: "Quality assurance",
        text: "Thank you for choosing us! We take great care in sourcing and quality-checking every product. We're glad it met your standards and hope to serve you again soon.",
    },
];

export const REPORT_REASONS = [
    "Suspected fake review",
    "Abusive or inappropriate content",
    "Not related to this product",
    "Contains personal information",
    "Other",
];

export const EMPTY_RATING_SUMMARY = {
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: {},
    recent_trend: 0,
    response_rate: 0,
    pending_replies: 0,
};

const BAR_COLORS = ["#1d9e75", "#9fe1cb", "#fac775", "#ef9f27", "#e24b4a"];

export function getVendorReply(review) {
    return review?.vendor_reply || "";
}

export function getVendorReplyAt(review) {
    return review?.vendor_reply_at || null;
}

export function normalizeReview(review) {
    if (!review) return null;
    return {
        ...review,
        reviewer_name: review.reviewer_name || review.patient_name || "Customer",
        product_name: review.product_name || review.variant_title || "Product",
        review_text: review.review || review.review_text || "",
        vendor_reply: getVendorReply(review),
        vendor_reply_at: getVendorReplyAt(review),
        image_urls: review.image_urls || [],
        verified: Boolean(review.verified ?? review.is_verified ?? review.verified_purchase),
        product_id: review.product_id || review.product || null,
        variant_id: review.variant_id || null,
    };
}

export function parseReviewsListResponse(response) {
    const payload = response?.data ?? response;
    const list = Array.isArray(payload)
        ? payload
        : payload?.data || payload?.results || [];

    return {
        results: (list || []).map(normalizeReview).filter(Boolean),
        count: Number(response?.count ?? payload?.count ?? list?.length ?? 0),
        average_rating: Number(response?.average_rating ?? payload?.average_rating ?? 0),
        total_reviews: Number(response?.total_reviews ?? payload?.total_reviews ?? 0),
        rating_distribution: response?.rating_distribution || payload?.rating_distribution || {},
        recent_trend: Number(response?.recent_trend ?? payload?.recent_trend ?? 0),
    };
}

export function computeResponseStats(reviews, totalReviews) {
    const replied = reviews.filter((r) => Boolean(getVendorReply(r))).length;
    const pending = reviews.filter((r) => r.status === "active" && !getVendorReply(r)).length;
    const total = totalReviews || reviews.length;
    const responseRate = total > 0 ? Math.round((replied / total) * 100) : 0;
    return { replied, pending, responseRate };
}

export function computeSentiment(reviews, ratingDistribution = {}) {
    const dist = Object.keys(ratingDistribution).length
        ? ratingDistribution
        : reviews.reduce((acc, r) => {
              const key = String(r.rating || 0);
              acc[key] = (acc[key] || 0) + 1;
              return acc;
          }, {});

    const total = Object.values(dist).reduce((sum, n) => sum + Number(n), 0) || reviews.length || 1;
    const positive = (Number(dist["5"]) || 0) + (Number(dist["4"]) || 0);
    const neutral = Number(dist["3"]) || 0;
    const negative = (Number(dist["2"]) || 0) + (Number(dist["1"]) || 0);

    const pct = (n) => Math.round((n / total) * 100);

    return {
        positive: pct(positive),
        neutral: pct(neutral),
        negative: pct(negative),
    };
}

export function getDistributionBars(ratingDistribution = {}, totalReviews = 0) {
    const total = totalReviews || Object.values(ratingDistribution).reduce((s, n) => s + Number(n), 0) || 1;

    return [5, 4, 3, 2, 1].map((star, index) => {
        const count = Number(ratingDistribution[String(star)] ?? ratingDistribution[star] ?? 0);
        return {
            label: `${star} Star`,
            count,
            pct: total > 0 ? Math.round((count / total) * 100) : 0,
            color: BAR_COLORS[index],
        };
    });
}

export function formatReviewDate(value) {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function formatRelativeDate(value) {
    if (!value) return "";
    const diff = Math.floor((Date.now() - new Date(value)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatReviewDate(value);
}

export function getInitials(name) {
    if (!name) return "U";
    const parts = String(name).trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
}

export function hasSentimentData(reviews, ratingDistribution = {}) {
    if (reviews.length === 0) return false;
    const dist = Object.keys(ratingDistribution).length
        ? ratingDistribution
        : reviews.reduce((acc, r) => {
              const key = String(r.rating || 0);
              acc[key] = (acc[key] || 0) + 1;
              return acc;
          }, {});
    return Object.values(dist).some((n) => Number(n) > 0);
}

export function getProductBreakdown(reviews) {
    const map = new Map();
    reviews.forEach((review) => {
        const key = review.variant_id || review.product_id || review.product_name;
        if (!key) return;
        const entry = map.get(key) || {
            id: key,
            name: review.product_name || "Product",
            count: 0,
            totalRating: 0,
        };
        entry.count += 1;
        entry.totalRating += Number(review.rating) || 0;
        map.set(key, entry);
    });
    return [...map.values()]
        .map((p) => ({ ...p, avg: p.count ? p.totalRating / p.count : 0 }))
        .sort((a, b) => b.count - a.count);
}

function getDateRangeStart(rangeKey) {
    if (!rangeKey) return null;
    const now = new Date();
    const start = new Date(now);
    if (rangeKey === "week") start.setDate(now.getDate() - 7);
    else if (rangeKey === "month") start.setMonth(now.getMonth() - 1);
    else if (rangeKey === "quarter") start.setMonth(now.getMonth() - 3);
    else if (rangeKey === "year") start.setFullYear(now.getFullYear() - 1);
    return start;
}

export function filterReviewsLocally(reviews, { ratingFilter, replyFilter, search, productFilter, dateRange, sortBy }) {
    let filtered = reviews.filter((review) => {
        if (ratingFilter && Number(review.rating) !== Number(ratingFilter)) return false;
        if (replyFilter === "pending" && getVendorReply(review)) return false;
        if (replyFilter === "responded" && !getVendorReply(review)) return false;
        if (productFilter) {
            const pid = review.variant_id || review.product_id || review.product_name;
            if (String(pid) !== String(productFilter)) return false;
        }
        if (dateRange) {
            const start = getDateRangeStart(dateRange);
            if (start && review.created_at && new Date(review.created_at) < start) return false;
        }
        if (search) {
            const q = search.toLowerCase();
            const haystack = [review.reviewer_name, review.product_name, review.review_text]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            if (!haystack.includes(q)) return false;
        }
        return true;
    });

    if (sortBy === "oldest") {
        filtered = [...filtered].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "highest") {
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "lowest") {
        filtered = [...filtered].sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else {
        filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return filtered;
}
