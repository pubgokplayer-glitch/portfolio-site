import { useRef, useState, useEffect } from "react";

/**
 * Magnetic component that gently pulls children towards the cursor
 * when the mouse approaches within proximity radius.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  proximity = 85,
  maxOffset = 16,
  className = "",
  style = {},
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip on touch-only devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Respect reduced motion accessibility preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      if (distance < proximity) {
        setIsNear(true);
        // Cosine easing creates a natural magnetic field (starts softly at edge, strongest near center)
        const fieldStrength = Math.cos((distance / proximity) * (Math.PI / 2));
        const pullX = distX * strength * fieldStrength;
        const pullY = distY * strength * fieldStrength;

        // Clamp to prevent over-stretching
        const clampedX = Math.max(-maxOffset, Math.min(maxOffset, pullX));
        const clampedY = Math.max(-maxOffset, Math.min(maxOffset, pullY));

        setOffset({ x: clampedX, y: clampedY });
      } else if (isNear) {
        setIsNear(false);
        setOffset({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setIsNear(false);
      setOffset({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [proximity, strength, maxOffset, isNear]);

  return (
    <span
      ref={ref}
      className={`magnetic-item ${className}`}
      style={{
        display: "inline-block",
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: isNear
          ? "transform 0.15s cubic-bezier(0.2, 0, 0, 1)"
          : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
