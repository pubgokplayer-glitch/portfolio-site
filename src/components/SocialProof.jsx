import { useState, useEffect, useRef } from "react";
import TiltCard from "./TiltCard";

const STATS = [
  {
    id: "views",
    label: "All-Time Views",
    target: 14208,
    initial: "0",
    final: "14,208",
    format: (val) => Math.floor(val).toLocaleString(),
  },
  {
    id: "rating",
    label: "Aesthetic Rating",
    target: 4.9,
    initial: "0.0/5",
    final: "4.9/5",
    format: (val) => `${val.toFixed(1)}/5`,
  },
  {
    id: "rank",
    label: "Profile",
    target: 1,
    initial: "Top 0%",
    final: "Top 1%",
    format: (val, progress) => {
      if (progress >= 1) return "Top 1%";
      if (progress === 0) return "Top 0%";
      const activeDigit = progress > 0.85 ? 1 : ((Math.floor(progress * 28) % 9) + 1);
      return `Top ${activeDigit}%`;
    },
  },
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
  const [animatedValues, setAnimatedValues] = useState({
    views: "0",
    rating: "0.0/5",
    rank: "Top 0%",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const statsRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const runCounterAnimation = () => {
    setIsAnimating(true);
    hasAnimatedRef.current = true;

    const duration = 1800; // ms duration for rapid and smooth count up
    const startTime = performance.now();

    // Ease-out quartic for smooth deceleration
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const frame = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      setAnimatedValues({
        views: STATS[0].format(eased * STATS[0].target),
        rating: STATS[1].format(eased * STATS[1].target),
        rank: STATS[2].format(eased * STATS[2].target, progress),
      });

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setIsAnimating(false);
        setAnimatedValues({
          views: "14,208",
          rating: "4.9/5",
          rank: "Top 1%",
        });
      }
    };

    requestAnimationFrame(frame);
  };

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    // Accessibility check: instant final values for users preferring reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setAnimatedValues({
        views: "14,208",
        rating: "4.9/5",
        rank: "Top 1%",
      });
      hasAnimatedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          observer.disconnect();
          runCounterAnimation();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

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
          ref={statsRef}
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
              onClick={() => !isAnimating && runCounterAnimation()}
              title="Click to replay counter animation"
              style={{
                padding: "2.5rem 1.5rem",
                textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid var(--gray-medium)" : "none",
                transition: "background-color 0.3s ease",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <p
                className="sp-stat-number"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  color: "var(--black)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                  fontFeatureSettings: '"tnum"',
                }}
              >
                {animatedValues[stat.id]}
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
            <TiltCard
              key={i}
              className="sp-comment-tilt"
              borderRadius="14px"
              maxTilt={10}
              scale={1.02}
              glareOpacity={0.25}
            >
              <div className="sp-comment-card">
                {/* Quote mark with 3D parallax depth */}
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
                    transform: "translateZ(30px)",
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
                    transform: "translateZ(20px)",
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
                    transform: "translateZ(15px)",
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
            </TiltCard>
          ))}
        </div>
      </div>

      <style>{`
        .sp-stat-cell {
          transition: background-color 0.3s ease;
          position: relative;
        }
        .sp-stat-cell:hover {
          background-color: var(--gray-light) !important;
        }
        .sp-stat-number {
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sp-stat-cell:hover .sp-stat-number {
          transform: translateY(-2px);
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

        .sp-comment-tilt {
          height: 100%;
        }

        .sp-comment-card {
          position: relative;
          background-color: var(--gray-light);
          border: 1px solid transparent;
          border-radius: 14px;
          padding: 2rem 2.25rem;
          transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
          cursor: default;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transform-style: preserve-3d;
        }
        .sp-comment-card:hover {
          background-color: var(--white);
          border-color: var(--gray-medium);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
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
