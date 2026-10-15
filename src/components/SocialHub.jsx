import Magnetic from "./Magnetic";

const links = [
  { name: "Instagram", url: "https://www.instagram.com/unqualified_adult/" },
];

export default function SocialHub() {
  return (
    <section id="contact" className="section-gq section-bg-gray">
      <div className="container-gq">
        
        <div className="section-header reveal">
          <span className="label-bold">03 — Network</span>
          <h2 className="heading-black text-5xl md:text-7xl mt-4">Connect</h2>
        </div>

        <div className="social-list reveal reveal-delay-1">
          {links.map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-list-item"
            >
              <span className="social-list-name">{link.name}</span>
              <Magnetic strength={0.45} proximity={95} maxOffset={20}>
                <span className="social-arrow-magnetic" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </Magnetic>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
