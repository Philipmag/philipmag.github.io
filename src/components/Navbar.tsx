import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { AccessibilityToggle } from "./AccessibilityToggle";
import { SITE_ASSETS } from "@/lib/siteAssets";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#learn", label: "Learn" },
  { href: "/calendar", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
];
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);
  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mobileOpen]);
  const navigateHash = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    if (location === "/" && href.includes("#")) {
      event.preventDefault();
      const id = href.split("#")[1];
      history.replaceState(null, "", `/#${id}`);
      document.getElementById(id)?.scrollIntoView();
    }
  };
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand" aria-label="Digital Guardians home">
          <img src={SITE_ASSETS.logo} alt="" width="44" height="48" />
          <span>Digital Guardians</span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={location === link.href ? "page" : undefined}
              onClick={event => navigateHash(event, link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <a
            href="/#analyzer"
            onClick={event => navigateHash(event, "/#analyzer")}
            className="button button-secondary header-helper"
          >
            Try the helper
          </a>
          <AccessibilityToggle />
          <button
            type="button"
            className="icon-button menu-toggle"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="container mobile-nav"
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-link"
              onClick={event => navigateHash(event, link.href)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/#analyzer"
            className="text-link"
            onClick={event => navigateHash(event, "/#analyzer")}
          >
            Try the helper
          </a>
        </nav>
      )}
    </header>
  );
}
