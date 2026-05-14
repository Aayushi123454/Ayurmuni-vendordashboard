import { useState } from "react";
import "./ReputationDashboard.css";

const REVIEWS = [
  {
    id: 1,
    name: "Arjun Mehta",
    initials: "AM",
    avatarBg: "#e6f1fb",
    avatarColor: "#185fa5",
    verified: true,
    date: "Reviewed on October 12, 2025",
    rating: 5,
    product: "Organic Ashwagandha Root Powder",
    text: "The quality of this Ashwagandha is far superior to anything I've tried before. The fine texture and earthy aroma indicate its freshness. I've noticed a significant improvement in my sleep quality after just one week.",
    status: "pending",
    existingResponse: null,
  },
  {
    id: 2,
    name: "Elena Rossi",
    initials: "ER",
    avatarBg: "#fbeaf0",
    avatarColor: "#993556",
    verified: true,
    date: "Reviewed on October 8, 2025",
    rating: 5,
    product: "Kumkumadi Facial Oil",
    text: "Absolutely love the glow it has given! It's slightly heavier than I expected, but it absorbs well if applied on damp skin. The saffron color is authentic and very calming.",
    status: "responded",
    existingResponse:
      "Hello Elena! We're so glad you're enjoying the glow. Applying to damp skin enhances the Kumkumadi oil further for optimal absorption. Thank you for sharing your experience!",
  },
  {
    id: 3,
    name: "Siddharth K.",
    initials: "SK",
    avatarBg: "#e1f5ee",
    avatarColor: "#0f6e56",
    verified: true,
    date: "Reviewed on October 19, 2025",
    rating: 4,
    product: "Shilajit Tablets 300mg",
    text: "The shipping took nearly two weeks to arrive in Berlin. The product itself is fine, but the delay was frustrating given the price of international shipping.",
    status: "flagged",
    existingResponse: null,
  },
];

const BARS = [
  { label: "5 star", pct: 80, color: "#1d9e75" },
  { label: "4 star", pct: 13, color: "#9fe1cb" },
  { label: "3 star", pct: 4,  color: "#fac775" },
  { label: "2 star", pct: 2,  color: "#ef9f27" },
  { label: "1 star", pct: 1,  color: "#e24b4a" },
];

const SEGMENTS = [
  { label: "Positive", pct: 62, color: "#1d9e75", dash: 165, offset: 30 },
  { label: "Neutral",  pct: 25, color: "#ef9f27", dash: 70,  offset: -135 },
  { label: "Negative", pct: 10, color: "#e24b4a", dash: 42,  offset: -205 },
];

function Stars({ count }) {
  return (
    <div className="rd-stars-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? "rd-s-on" : "rd-s-off"}>★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const [response, setResponse] = useState(review.existingResponse || "");
  const [draft, setDraft] = useState("");
  const [showDraft, setShowDraft] = useState(!review.existingResponse);

  const handleSend = () => {
    if (draft.trim()) {
      setResponse(draft.trim());
      setShowDraft(false);
      setDraft("");
    }
  };

  return (
    <div className="rd-review-card">
      <div className="rd-review-header">
        <div className="rd-reviewer-left">
          <div className="rd-avatar" style={{ background: review.avatarBg, color: review.avatarColor }}>
            {review.initials}
          </div>
          <div className="rd-reviewer-info">
            <div className="rd-reviewer-name-row">
              <span className="rd-reviewer-name">{review.name}</span>
              {review.verified && <span className="rd-verified">✓ Verified</span>}
            </div>
            <span className="rd-review-date">{review.date}</span>
            <Stars count={review.rating} />
          </div>
        </div>
        <span className="rd-product-tag">{review.product}</span>
      </div>

      <p className="rd-review-text">"{review.text}"</p>

      {response && !showDraft && (
        <div className="rd-existing-resp">
          <span className="rd-existing-resp-label">The Botanical Collective responded:</span>
          <p className="rd-existing-resp-text">{response}</p>
          <button className="rd-edit-link" onClick={() => setShowDraft(true)}>Edit Reply</button>
        </div>
      )}

      {showDraft && (
        <div className="rd-draft-area">
          <textarea
            rows={2}
            placeholder="Craft a thoughtful response…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="rd-draft-actions">
            {response && (
              <button className="rd-cancel-btn" onClick={() => setShowDraft(false)}>Cancel</button>
            )}
            <button className="rd-send-btn" onClick={handleSend}>Send Reply</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReputationDashboard() {
  const [rating, setRating] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [responded, setResponded] = useState(false);

  const filtered = REVIEWS.filter((r) => {
    return (
      (rating === "all" || r.rating === parseInt(rating)) &&
      (status === "all" || r.status === status)
    );
  });

  return (
    <div className="rd-dash">
      <div className="rd-container">

        {/* Header */}
        <div className="rd-header">
          <h1 className="rd-title">Reputation <span>Intelligence</span></h1>
          <p className="rd-subtitle">Harnessing customer wisdom to refine your botanical craft.</p>
        </div>

        {/* Stats Bar */}
        <div className="rd-stats-bar">
          <div className="rd-stat-card">
            <span className="rd-stat-label">Avg Rating</span>
            <div className="rd-stat-value">4.8<span className="rd-stat-sub">/5</span></div>
            <div className="rd-stat-stars">★★★★★</div>
          </div>
          <div className="rd-stat-card">
            <span className="rd-stat-label">Total Reviews</span>
            <div className="rd-stat-value">1,284</div>
            <div className="rd-stat-muted">+31 this week</div>
          </div>
          <div className="rd-stat-card">
            <span className="rd-stat-label">Response Rate</span>
            <div className="rd-stat-value">98.2%</div>
            <span className="rd-badge-green">Great</span>
          </div>
          <div className="rd-stat-card">
            <span className="rd-stat-label">Sentiment</span>
            <div className="rd-stat-value">62%</div>
            <span className="rd-badge-green">Positive</span>
          </div>
        </div>

        {/* Overview + Sentiment */}
        <div className="rd-two-col">
          <div className="rd-card">
            <div className="rd-card-title">Reputation Overview</div>
            <div className="rd-rep-top">
              <span className="rd-rep-score">4.8</span>
              <div>
                <div className="rd-rep-stars">★★★★★</div>
                <div className="rd-rep-count">Based on 1,284 reviews</div>
              </div>
            </div>
            {BARS.map((b) => (
              <div className="rd-bar-row" key={b.label}>
                <span className="rd-bar-label">{b.label}</span>
                <div className="rd-bar-track">
                  <div className="rd-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
                <span className="rd-bar-pct">{b.pct}%</span>
              </div>
            ))}
          </div>

          <div className="rd-card">
            <div className="rd-card-title">Sentiment Analysis</div>
            <div className="rd-sentiment-body">
              <svg viewBox="0 0 120 120" width="130" height="130">
                <circle cx="60" cy="60" r="44" fill="none" stroke="#f1efe8" strokeWidth="18" />
                {SEGMENTS.map((s) => (
                  <circle
                    key={s.label}
                    cx="60" cy="60" r="44"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="18"
                    strokeDasharray={`${s.dash} ${277 - s.dash}`}
                    strokeDashoffset={s.offset}
                    transform="rotate(-90 60 60)"
                  />
                ))}
                <text x="60" y="55" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1a1a18">62%</text>
                <text x="60" y="69" textAnchor="middle" fontSize="9" fill="#8a8a85">Positive</text>
              </svg>
              <div className="rd-legend">
                {SEGMENTS.map((s) => (
                  <div className="rd-legend-row" key={s.label}>
                    <span className="rd-legend-dot" style={{ background: s.color }} />
                    <span className="rd-legend-pct" style={{ color: s.color }}>{s.pct}%</span>
                    <span className="rd-legend-lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Attention */}
        <div className="rd-urgent-heading">Urgent Attention</div>
        <div className="rd-urgent-grid">
          <div className="rd-urgent-card">
            <div className="rd-urgent-header">
              <span className="rd-urgent-label">New Review Highlights</span>
              <span className="rd-badge-green">Live Feed</span>
            </div>
            <span className="rd-highlight-product">Ashwagandha Root Oil</span>
            <p className="rd-highlight-snippet">"This ashwagandha is far superior to anything I've tried before. The texture and earthy aroma indicate its freshness…"</p>
            <span className="rd-highlight-product">Organic Ashwagandha</span>
            <p className="rd-highlight-snippet">"Their research and formulation team continues to be truly unprecedented in botanical quality…"</p>
          </div>
          <div className="rd-urgent-card">
            <div className="rd-urgent-header">
              <span className="rd-urgent-label">Pending Replies Summary</span>
              <span className="rd-badge-red">12 Overdue</span>
            </div>
            <div className="rd-pending-body">
              <span className="rd-pending-num">12</span>
              <div>
                <span className="rd-pending-title">Pending replies</span>
                <span className="rd-pending-breakdown">5 New · 4 On Hold · 3 Flagged</span>
              </div>
            </div>
            <button
              className={`rd-respond-btn${responded ? " rd-respond-done" : ""}`}
              onClick={() => setResponded(true)}
            >
              {responded ? "✓ Responses Queued" : "Respond Now"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rd-filters-bar">
          <select className="rd-filter-select" value={rating} onChange={(e) => { setRating(e.target.value); setPage(1); }}>
            <option value="all">By Rating: All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select className="rd-filter-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="all">Status: All Reviews</option>
            <option value="responded">Responded</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        
        {filtered.length === 0 ? (
          <div className="rd-no-results">No reviews match the selected filters.</div>
        ) : (
          filtered.map((r) => <ReviewCard key={r.id} review={r} />)
        )}

       
        <div className="rd-pagination">
          <span className="rd-pagination-info">Showing 1–{filtered.length} of 1,284 feedbacks</span>
          <div className="rd-pagination-pages">
            <button className="rd-page-arrow" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {[1, 2, 3].map((p) => (
              <button key={p} className={`rd-page-btn${p === page ? " rd-page-active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="rd-page-arrow" onClick={() => setPage((p) => Math.min(3, p + 1))} disabled={page === 3}>›</button>
          </div>
        </div>

      </div>
    </div>
  );
}