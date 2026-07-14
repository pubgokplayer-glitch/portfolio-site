const STATS = [
  { value: "14,208", label: "All-Time Views" },
  { value: "4.9/5", label: "Aesthetic Rating" },
  { value: "Top 1%", label: "Profile" },
];

const COMMENTS = [
  {
    text: "The shoulder-to-waist ratio is actually insane. Pure classical physique vibes.",
    author: "Sarah M.",
    avatar: "/images/avatar-sarah.png",
  },
  {
    text: "Legitimately majestic. You can tell the discipline is unmatched.",
    author: "Chloe T.",
    avatar: "/images/avatar-chloe.png",
  },
  {
    text: "Drop the back workout routine right now. Absolute unit.",
    author: "Jessica R.",
    avatar: "/images/avatar-jessica.png",
  },
  {
    text: "This is what peak aesthetics looks like. Insane definition.",
    author: "Emma W.",
    avatar: "/images/avatar-emma.png",
  },
];

export default function SocialProof() {
  return (
    <section
      id="social-proof"
      className="section-gq"
      style={{
        backgroundColor: "var(--white)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="container-gq">
        {/* ── Section Header ── */}
        <div className="section-header reveal">
          <span className="label-bold">Community</span>
          <h2
            className="heading-black"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              marginTop: "1rem",
              letterSpacing: "-0.03em",
            }}
          >
            Social Proof
          </h2>
          <div
            style={{
              width: "48px",
              height: "3px",
              backgroundColor: "var(--black)",
              marginTop: "1.5rem",
            }}
          />
        </div>

        {/* ── Stats Bar ── */}
        <div
          className="reveal reveal-delay-1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
            marginBottom: "4rem",
            borderTop: "1px solid var(--gray-medium)",
            borderBottom: "1px solid var(--gray-medium)",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="sp-stat-cell"
              style={{
                padding: "2.5rem 1.5rem",
                textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid var(--gray-medium)" : "none",
                transition: "background-color 0.3s ease",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  color: "var(--black)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--gray-dark)",
                  marginTop: "0.75rem",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Comments Grid ── */}
        <div className="sp-comments-grid reveal reveal-delay-2">
          {COMMENTS.map((comment, i) => (
            <div key={i} className="sp-comment-card">
              {/* Quote mark */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.5rem",
                  fontFamily: "var(--font-heading)",
                  fontSize: "5rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: "rgba(0,0,0,0.04)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                &ldquo;
              </span>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: "var(--charcoal)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                &ldquo;{comment.text}&rdquo;
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid var(--gray-medium)",
                }}
              >
                {/* Avatar photo */}
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="sp-avatar"
                />

                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--gray-dark)",
                  }}
                >
                  {comment.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sp-stat-cell:hover {
          background-color: var(--gray-light) !important;
        }

        .sp-comments-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .sp-comments-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .sp-comment-card {
          position: relative;
          background-color: var(--gray-light);
          border: 1px solid transparent;
          border-radius: 14px;
          padding: 2rem 2.25rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }
        .sp-comment-card:hover {
          background-color: var(--white);
          border-color: var(--gray-medium);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
        }

        .sp-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--gray-medium);
          flex-shrink: 0;
          transition: border-color 0.3s ease;
        }
        .sp-comment-card:hover .sp-avatar {
          border-color: var(--gray-dark);
        }
      `}</style>
    </section>
  );
}
