import { useEffect, useRef } from "react";

const PHRASE = "DISCIPLINE OVER MOTIVATION — RELENTLESS CONSISTENCY — AESTHETIC ENGINEERING — ";

export default function KineticTicker() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const singleItemRef = useRef(null);
  const animFrameId = useRef(null);

  // Position and velocity state kept in refs for 60/120fps performance
  const posRef = useRef(0);
  const velocityRef = useRef(0);
  const singleWidthRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(performance.now());

  useEffect(() => {
    // Measure single unit width
    const measureWidth = () => {
      if (singleItemRef.current) {
        singleWidthRef.current = singleItemRef.current.offsetWidth;
      }
    };

    measureWidth();
    window.addEventListener("resize", measureWidth);

    // Track scroll velocity
    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = performance.now();

    const handleScroll = () => {
      const currentY = window.scrollY;
      const currentTime = performance.now();
      const deltaY = currentY - lastScrollYRef.current;
      const deltaTime = Math.max(currentTime - lastScrollTimeRef.current, 10);

      // Instantaneous scroll speed (pixels per ~16ms frame)
      const instantVelocity = (Math.abs(deltaY) / deltaTime) * 16;

      // Add to velocity boost with a smooth ceiling
      velocityRef.current = Math.min(velocityRef.current + instantVelocity * 0.45, 30);

      lastScrollYRef.current = currentY;
      lastScrollTimeRef.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Base cruising speed (pixels per frame moving left-to-right)
    const baseSpeed = 1.2;

    const animate = () => {
      // Smooth friction decay on velocity boost
      velocityRef.current *= 0.92;
      if (velocityRef.current < 0.01) {
        velocityRef.current = 0;
      }

      const currentSpeed = baseSpeed + velocityRef.current;
      posRef.current += currentSpeed;

      const singleWidth = singleWidthRef.current;
      if (singleWidth > 0) {
        // When we travel past one full phrase length, wrap around seamlessly
        if (posRef.current >= singleWidth) {
          posRef.current %= singleWidth;
        }

        if (trackRef.current) {
          // Left-to-right motion: shifting from -singleWidth towards 0
          const translateX = posRef.current - singleWidth;
          trackRef.current.style.transform = `translate3d(${translateX}px, 0, 0)`;
        }
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", measureWidth);
      window.removeEventListener("scroll", handleScroll);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="kinetic-ticker-wrapper"
      aria-label="Discipline over motivation marquee banner"
    >
      <div ref={trackRef} className="kinetic-ticker-track">
        {/* First copy measured for wrap width */}
        <span ref={singleItemRef} className="kinetic-ticker-item">
          <span className="ticker-outline-text">DISCIPLINE OVER MOTIVATION</span>
          <span className="ticker-separator">—</span>
          <span className="ticker-outline-text">RELENTLESS CONSISTENCY</span>
          <span className="ticker-separator">—</span>
          <span className="ticker-outline-text">AESTHETIC ENGINEERING</span>
          <span className="ticker-separator">—</span>
        </span>

        {/* Duplicate copies for continuous seamless infinite ribbon */}
        {[1, 2, 3, 4].map((copyIndex) => (
          <span key={copyIndex} className="kinetic-ticker-item" aria-hidden="true">
            <span className="ticker-outline-text">DISCIPLINE OVER MOTIVATION</span>
            <span className="ticker-separator">—</span>
            <span className="ticker-outline-text">RELENTLESS CONSISTENCY</span>
            <span className="ticker-separator">—</span>
            <span className="ticker-outline-text">AESTHETIC ENGINEERING</span>
            <span className="ticker-separator">—</span>
          </span>
        ))}
      </div>

      <style>{`
        .kinetic-ticker-wrapper {
          width: 100%;
          overflow: hidden;
          background-color: var(--white);
          border-top: 2px solid var(--black);
          border-bottom: 2px solid var(--black);
          padding: 1.5rem 0;
          position: relative;
          z-index: 10;
          user-select: none;
          box-sizing: border-box;
          display: flex;
          align-items: center;
        }

        .kinetic-ticker-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
        }

        .kinetic-ticker-item {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: clamp(2.25rem, 5.5vw, 4.5rem);
          line-height: 1.1;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .ticker-outline-text {
          color: var(--white);
          -webkit-text-stroke: 1.5px var(--black);
          paint-order: stroke fill;
          transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1), -webkit-text-stroke 0.3s ease;
          padding: 0 0.5rem;
        }

        @media (min-width: 1024px) {
          .ticker-outline-text {
            -webkit-text-stroke: 2px var(--black);
          }
        }

        .ticker-separator {
          color: var(--black);
          margin: 0 1.25rem;
          font-weight: 900;
          font-size: clamp(1.75rem, 4.5vw, 3.5rem);
          opacity: 0.9;
        }

        /* Subtle interactive hover effect: hollow letters fill in */
        .kinetic-ticker-wrapper:hover .ticker-outline-text {
          color: rgba(0, 0, 0, 0.08);
        }

        .kinetic-ticker-item:hover .ticker-outline-text {
          color: var(--black);
          text-shadow: none;
        }
      `}</style>
    </div>
  );
}
