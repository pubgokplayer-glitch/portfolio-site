import { useRef, useState, useEffect } from "react";

/**
 * 3D Tilt & Glare Card component (Vanilla-tilt physics)
 * Gives elements a physical 3D tilt towards the cursor with a glossy light glare reflection.
 */
export default function TiltCard({
  children,
  className = "",
  style = {},
  innerStyle = {},
  maxTilt = 12, // max tilt rotation in degrees
  perspective = 1000, // perspective distance in px
  scale = 1.02, // slight scale lift on hover
  glare = true,
  glareOpacity = 0.35,
  borderRadius = "14px",
  ...props
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    // Skip on touch/pointer-coarse devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Respect reduced motion accessibility
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Normalized coordinates from -0.5 to +0.5
    const normX = x / width - 0.5;
    const normY = y / height - 0.5;

    // Physical tilt: tilting TOWARDS the mouse
    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    // Glare position in percentages
    const glareX = (x / width) * 100;
    const glareY = (y / height) * 100;

    setTilt({
      rotateX,
      rotateY,
      glareX,
      glareY,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card-wrapper ${className}`}
      style={{
        perspective: `${perspective}px`,
        ...style,
      }}
      {...props}
    >
      <div
        className="tilt-card-body"
        style={{
          transform: tilt.isHovered
            ? `rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: tilt.isHovered
            ? "transform 0.1s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease"
            : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease",
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius,
          overflow: "hidden",
          willChange: "transform",
          ...innerStyle,
        }}
      >
        {children}

        {/* Glossy Magazine Light Glare Reflection */}
        {glare && (
          <div
            aria-hidden="true"
            className="tilt-card-glare"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              pointerEvents: "none",
              zIndex: 20,
              opacity: tilt.isHovered ? 1 : 0,
              background: `radial-gradient(circle 380px at ${tilt.glareX.toFixed(1)}% ${tilt.glareY.toFixed(1)}%, rgba(255, 255, 255, ${glareOpacity}) 0%, rgba(255, 255, 255, ${glareOpacity * 0.3}) 45%, rgba(255, 255, 255, 0) 80%)`,
              transition: "opacity 0.35s ease",
            }}
          />
        )}
      </div>
    </div>
  );
}
