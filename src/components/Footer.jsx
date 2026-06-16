export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-gq">
      <div className="container-gq">
        <div className="footer-top">
          <div className="footer-logo">AWAIS</div>
          <div className="footer-logo" style={{
            color: "var(--black)", 
            textShadow: "-1px -1px 0 var(--white), 1px -1px 0 var(--white), -1px 1px 0 var(--white), 1px 1px 0 var(--white)"
          }}>CHOHAN</div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[var(--gray-dark)] pt-8 mt-12">
          <p className="label-bold" style={{color: "var(--white)"}}>
            <a 
              href="/secret-vault-auth.html" 
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'default' }}
            >&copy;</a> {currentYear} ALL RIGHTS RESERVED.
          </p>
          <p className="label-bold mt-4 md:mt-0" style={{color: "var(--gray-dark)"}}>
            FITNESS & DISCIPLINE
          </p>
        </div>
      </div>
    </footer>
  );
}
