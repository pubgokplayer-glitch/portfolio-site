import { useState, useEffect } from "react";

/**
 * Subtle Film Grain / Paper Noise Overlay
 * Adds an authentic, tactile 3% animated film grain texture over the entire website,
 * transforming plain digital backgrounds into rich matte art-book print.
 */
export default function FilmGrain() {
  const [patternUrl, setPatternUrl] = useState("");

  useEffect(() => {
    try {
      // Generate authentic tactile grain pattern via lightweight canvas
      const canvas = document.createElement("canvas");
      canvas.width = 220;
      canvas.height = 220;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const imgData = ctx.createImageData(220, 220);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Fine-grain monochromatic noise
          const value = Math.floor(Math.random() * 255);
          data[i] = value;     // R
          data[i + 1] = value; // G
          data[i + 2] = value; // B
          data[i + 3] = 255;   // A
        }

        ctx.putImageData(imgData, 0, 0);
        setPatternUrl(canvas.toDataURL("image/png"));
        return;
      }
    } catch {
      // Fallback to SVG data URI if canvas unavailable
    }

    const svgFallback = `<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
    setPatternUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svgFallback)}`);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="film-grain-container"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 999,
        overflow: "hidden",
      }}
    >
      <div
        className="film-grain-texture"
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          backgroundImage: patternUrl ? `url(${patternUrl})` : "none",
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.035, // 3.5% subtle matte paper / film texture
          mixBlendMode: "multiply",
          willChange: "transform",
        }}
      />

      <style>{`
        @keyframes filmGrainAnimation {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(3%, 1%); }
          30% { transform: translate(-1%, 4%); }
          40% { transform: translate(4%, -2%); }
          50% { transform: translate(-3%, 2%); }
          60% { transform: translate(2%, 3%); }
          70% { transform: translate(-4%, -1%); }
          80% { transform: translate(1%, -4%); }
          90% { transform: translate(-2%, 2%); }
        }

        .film-grain-texture {
          animation: filmGrainAnimation 0.5s steps(8) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .film-grain-texture {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
