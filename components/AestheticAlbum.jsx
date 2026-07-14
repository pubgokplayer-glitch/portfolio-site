import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";

/* ── SVG Icons ── */
const HeartIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const CommentIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const BookmarkIcon = ({ filled }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

/* Deck rotations for the stacked look */
const DECK_ROTATIONS = [-7, 5, -10, 6, -4, 9, -8, 3, -6, 11, -5, 7];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

export default function AestheticAlbum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const offsetsRef = useRef([]);
  const rafId = useRef(null);
  const lastProgress = useRef(-1);
  const commentCountsRef = useRef({});

  const getCommentCount = useCallback((postId) => {
    if (!commentCountsRef.current[postId]) {
      commentCountsRef.current[postId] = Math.floor(Math.random() * 12) + 3;
    }
    return commentCountsRef.current[postId];
  }, []);

  /* ── Fetch posts ── */
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("progress_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching progress posts:", error);
      } else {
        setPosts(data || []);
        const counts = {};
        (data || []).forEach((p) => {
          counts[p.id] = Math.floor(Math.random() * 180) + 40;
        });
        setLikeCounts(counts);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  /**
   * Measure each card's natural position (with no transforms applied)
   * and compute the translate needed to bring it to the deck center.
   * Deck center = center of the first card in the grid.
   */
  const computeOffsets = useCallback(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    // 1) Strip all transforms so we measure natural grid positions
    cards.forEach((card) => {
      card.style.transform = "none";
      card.style.opacity = "1";
    });

    // 2) Force layout recalculation
    // eslint-disable-next-line no-unused-expressions
    cards[0].offsetHeight;

    // 3) Use the center of the FIRST card as the deck pile location
    const firstRect = cards[0].getBoundingClientRect();
    const pileCenterX = firstRect.left + firstRect.width / 2;
    const pileCenterY = firstRect.top + firstRect.height / 2;

    // 4) Calculate how far each card needs to translate to reach the pile
    offsetsRef.current = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return {
        dx: pileCenterX - cx,
        dy: pileCenterY - cy,
      };
    });

    // 5) Reset lastProgress so next scroll tick re-applies transforms
    lastProgress.current = -1;
  }, []);

  /* ── Scroll-driven card animation ── */
  useEffect(() => {
    if (loading || posts.length === 0) return;

    const initTimer = setTimeout(() => {
      computeOffsets();

      // Re-trigger reveal observer for the section header
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("visible");
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );
      document.querySelectorAll("#album .reveal").forEach((el) => revealObserver.observe(el));

      // Kick off first scroll calculation
      handleScroll();
    }, 250);

    function applyProgress(progress) {
      const cards = cardsRef.current;
      const grid = gridRef.current;
      const offsets = offsetsRef.current;
      if (!grid || offsets.length === 0) return;

      // Smoothstep easing
      const t = progress * progress * (3 - 2 * progress);

      cards.forEach((card, i) => {
        if (!card) return;
        const o = offsets[i] || { dx: 0, dy: 0 };
        const rot = DECK_ROTATIONS[i % DECK_ROTATIONS.length];

        // t=0 → card at pile center with rotation (stacked deck)
        // t=1 → card at natural grid position (spread out)
        const tx = lerp(o.dx, 0, t);
        const ty = lerp(o.dy, 0, t);
        const rotate = lerp(rot, 0, t);
        const scale = lerp(0.82, 1, t);
        const opacity = lerp(0.45, 1, t);

        card.style.transform = `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = t < 0.5 ? String(posts.length - i) : "1";
      });

      grid.classList.toggle("dealt", progress > 0.92);
    }

    function handleScroll() {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const rect = grid.getBoundingClientRect();
        const vh = window.innerHeight;

        // Animation zone:
        //   progress = 0  when grid top is at vh (just entering bottom of screen)
        //   progress = 1  when grid top is at vh * 0.2 (20% from top, well in view)
        const start = vh;
        const end = vh * 0.2;
        const raw = (start - rect.top) / (start - end);
        const progress = clamp(raw, 0, 1);

        // Skip if progress hasn't changed meaningfully
        if (Math.abs(progress - lastProgress.current) < 0.002) return;
        lastProgress.current = progress;

        applyProgress(progress);
      });
    }

    function handleResize() {
      computeOffsets();
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [loading, posts, computeOffsets]);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: prev[postId] + (likedPosts[postId] ? -1 : 1),
    }));
  };

  const toggleSave = (postId) => {
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (loading) {
    return (
      <section id="album" className="section-gq section-bg-gray">
        <div className="container-gq text-center">
          <p className="label-bold" style={{ color: "var(--gray-dark)" }}>Syncing Vault...</p>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section id="album" className="section-gq section-bg-gray">
      <div className="container-gq">

        {/* Header — z-index 10 so the deck never covers it */}
        <div className="section-header reveal" style={{ position: "relative", zIndex: 10 }}>
          <span className="label-bold">Vault</span>
          <h2
            className="heading-black"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              marginTop: "1rem",
              letterSpacing: "-0.03em",
            }}
          >
            Progress
          </h2>
          <div style={{ width: 48, height: 3, backgroundColor: "var(--black)", marginTop: "1.5rem" }} />
        </div>

        {/* Card Grid */}
        <div className="album-grid" ref={gridRef}>
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="album-card"
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <div className="album-card-img">
                <img src={post.image_url} alt={post.caption || "Progress"} loading="lazy" />
                <div className="album-actions">
                  <button
                    className={`album-action-btn ${likedPosts[post.id] ? "liked" : ""}`}
                    onClick={() => toggleLike(post.id)}
                    aria-label="Like"
                  >
                    <HeartIcon filled={likedPosts[post.id]} />
                  </button>
                  <button className="album-action-btn" aria-label="Comment">
                    <CommentIcon />
                  </button>
                  <button className="album-action-btn" aria-label="Share">
                    <ShareIcon />
                  </button>
                  <button
                    className={`album-action-btn ${savedPosts[post.id] ? "saved" : ""}`}
                    onClick={() => toggleSave(post.id)}
                    aria-label="Save"
                  >
                    <BookmarkIcon filled={savedPosts[post.id]} />
                  </button>
                </div>
              </div>
              {post.caption && (
                <div className="album-card-footer">
                  <p>{post.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .album-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          position: relative;
        }
        @media (min-width: 640px) {
          .album-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .album-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        }

        .album-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background-color: var(--white);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06);
          will-change: transform, opacity;
        }
        .album-grid.dealt .album-card {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .album-grid.dealt .album-card:hover {
          transform: translateY(-4px) rotate(0deg) scale(1) !important;
          box-shadow: 0 12px 36px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
        }

        .album-card-img {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
        }
        .album-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease;
          filter: grayscale(30%);
        }
        .album-grid.dealt .album-card:hover .album-card-img img {
          transform: scale(1.04);
          filter: grayscale(0%);
        }

        .album-actions {
          position: absolute;
          bottom: 1rem;
          right: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
          z-index: 5;
        }
        .album-grid.dealt .album-card:hover .album-actions {
          opacity: 1;
          transform: translateX(0);
        }

        .album-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          color: #fff;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }
        .album-action-btn:hover {
          background: rgba(0,0,0,0.65);
          transform: scale(1.12);
        }
        .album-action-btn:active { transform: scale(0.95); }
        .album-action-btn.liked {
          background: rgba(239,68,68,0.2);
          border-color: rgba(239,68,68,0.3);
        }
        .album-action-btn.liked:hover { background: rgba(239,68,68,0.35); }
        .album-action-btn.saved {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.25);
        }

        .album-card-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--gray-medium);
        }
        .album-card-footer p {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--charcoal);
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
}
