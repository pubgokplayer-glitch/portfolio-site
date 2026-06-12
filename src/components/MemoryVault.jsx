const portfolioImages = [
  { src: "/images/gym-workout.jpg", title: "Iron Therapy" },
  { src: "/images/healthy-meal.jpg", title: "Fuel" },
  { src: "/images/morning-routine.jpg", title: "Routine" },
  { src: "/images/fitness-progress.jpg", title: "Progress" },
  { src: "/images/supplement-stack.jpg", title: "Essentials" },
  { src: "/images/outdoor-run.jpg", title: "Cardio" },
];

export default function MemoryVault() {
  return (
    <section id="portfolio" className="section-gq">
      <div className="container-gq">
        
        <div className="section-header reveal">
          <span className="label-bold">02 — Visual Journal</span>
          <h2 className="heading-black text-5xl md:text-7xl mt-4">Portfolio</h2>
        </div>

        <div className="masonry-container reveal reveal-delay-1">
          {portfolioImages.map((img, idx) => (
            <div key={idx} className="masonry-item">
              <img src={img.src} alt={img.title} loading="lazy" />
              <div className="masonry-caption">
                <h3 className="heading-black text-2xl" style={{color: "var(--white)"}}>{img.title}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
