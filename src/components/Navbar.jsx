import { useState, useEffect } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className="nav-gq">
        <div className="container-gq flex items-center justify-between">
          <a href="#" className="nav-logo">
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden relative w-8 h-8 flex items-center justify-center z-[100]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block absolute h-[2px] bg-[var(--black)] transition-all duration-300"
              style={{
                width: "24px",
                transform: menuOpen ? "rotate(45deg)" : "translateY(-6px)",
              }}
            />
            <span
              className="block absolute h-[2px] bg-[var(--black)] transition-all duration-300"
              style={{
                width: "24px",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block absolute h-[2px] bg-[var(--black)] transition-all duration-300"
              style={{
                width: "24px",
                transform: menuOpen ? "rotate(-45deg)" : "translateY(6px)",
              }}
            />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu-gq ${menuOpen ? "open" : ""}`}>
        {links.map(link => (
          <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
