export default function Hero() {
  return (
    <section className="hero-wrapper">
      <div className="hero-grid">
        
        {/* Left: Typography */}
        <div className="hero-content">
          <div>
            <h1 className="heading-outline hero-first-name">Awais</h1>
            <h1 className="heading-black hero-last-name">Chohan</h1>
            <div className="hero-subtitle">
              <i>"THE KEY TO <span style={{ color: '#E50914' }}>SUCCESS</span> IS TO FOCUS ON GOALS, NOT <span style={{ color: '#E50914' }}>OBSTACLES</span>"</i>
            </div>
          </div>
        </div>

        {/* Right: Cutout Portrait */}
        <div className="hero-image-container">
          <img 
            src="/images/awais-chohan.png" 
            alt="Awais Chohan Portrait" 
            className="hero-image"
            width="800"
            height="1000"
          />
        </div>
        
      </div>
    </section>
  );
}
