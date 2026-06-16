import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AestheticAlbum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);

      // Trigger reveal animation for newly loaded items if intersection observer was missed
      setTimeout(() => {
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
        document.querySelectorAll("#album .reveal").forEach((el) => observer.observe(el));
      }, 100);
    }
    
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section id="album" className="section-gq" style={{ backgroundColor: "var(--black)", color: "var(--white)" }}>
        <div className="container-gq text-center">
          <p className="label-bold" style={{ color: "var(--gray-dark)" }}>Syncing Vault...</p>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="album" className="section-gq" style={{ backgroundColor: "var(--black)", color: "var(--white)" }}>
      <div className="container-gq">
        
        <div className="section-header reveal">
          <span className="label-bold" style={{ color: "var(--gray-dark)" }}>Vault</span>
          <h2 className="heading-outline text-5xl md:text-7xl mt-4 tracking-widest" style={{ color: "transparent", WebkitTextStroke: "1px var(--text-muted)" }}>Progress</h2>
        </div>

        <div className="masonry-container reveal reveal-delay-1">
          {posts.map((post) => (
            <div key={post.id} className="masonry-item" style={{ backgroundColor: "var(--charcoal)" }}>
              <img src={post.image_url} alt={post.caption || "Progress"} loading="lazy" />
              <div className="masonry-caption">
                <p className="body-text" style={{ color: "var(--white)", fontWeight: 500, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
