import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Journey from "./components/Journey";
import MemoryVault from "./components/MemoryVault";
import SocialHub from "./components/SocialHub";
import Footer from "./components/Footer";
import AestheticAlbum from "./components/AestheticAlbum";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <MemoryVault />
        <AestheticAlbum />
        <SocialHub />
      </main>
      <Footer />
    </>
  );
}
