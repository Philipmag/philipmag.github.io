import { Link } from "wouter";
import { SITE_ASSETS } from "@/lib/siteAssets";
const links = [
  { label: "Check a message", href: "/#analyzer" },
  { label: "Learning guides", href: "/#learn" },
  { label: "Workshops & training", href: "/calendar" },
  { label: "Resource library", href: "/resources" },
  { label: "About & contact", href: "/about" },
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand">
              <img src={SITE_ASSETS.logo} width="44" height="48" alt="" />
              <span>Digital Guardians</span>
            </Link>
            <p>
              A neighbourly place for older adults to build confidence online,
              check suspicious messages, and learn everyday technology.
            </p>
            <p>Free guidance · Peterborough, Ontario</p>
          </div>
          <nav aria-label="Footer navigation">
            <h2>Explore</h2>
            <ul>
              {links.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>Ask for support</h2>
            <a href="mailto:info@digitalguards.ca">info@digitalguards.ca</a>
            <br />
            <a href="tel:+17057725140">+1 (705) 772-5140</a>
            <p>
              Think you have been scammed? Stop contact and call your bank using
              a trusted number.
            </p>
            <a
              href="https://antifraudcentre-centreantifraude.ca/index-eng.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Canadian Anti-Fraud Centre
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Digital Guardians · Practical support,
          at your pace
        </div>
      </div>
    </footer>
  );
}
