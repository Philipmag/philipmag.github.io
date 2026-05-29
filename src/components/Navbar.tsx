import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { AccessibilityToggle } from "./AccessibilityToggle";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/DigitalGuardianslogo5_479e26ca.png";

const navLinks = [
  { href: "/", label: "Home", isHash: false, sectionId: null },
  { href: "/#learn", label: "Learn", isHash: true, sectionId: "learn" },
  { href: "/about", label: "About", isHash: false, sectionId: null },
  { href: "/resources", label: "Resources", isHash: false, sectionId: null },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is currently in view using IntersectionObserver
  useEffect(() => {
    if (location !== "/") {
      setActiveSection(null);
      return;
    }

    const sectionIds = ["learn", "analyzer", "about"];
    const observers: IntersectionObserver[] = [];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(handleIntersect, {
          rootMargin: "-30% 0px -60% 0px",
          threshold: 0,
        });
        observer.observe(el);
        observers.push(observer);
      }
    });

    // Reset to null (Home) when at the top
    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection(null);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  const isLinkActive = useCallback(
    (link: (typeof navLinks)[0]) => {
      // For non-home pages, match by path
      if (!link.isHash && link.href !== "/") {
        return location === link.href;
      }
      // For Home link: active when on "/" and no section is in view
      if (link.href === "/" && !link.isHash) {
        return location === "/" && activeSection === null;
      }
      // For hash links: active when their section is in view
      if (link.isHash && link.sectionId) {
        return location === "/" && activeSection === link.sectionId;
      }
      return false;
    },
    [location, activeSection]
  );

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setMobileOpen(false);
    if (link.isHash && location === "/") {
      const id = link.href.replace("/#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo with neon animation */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="logo-neon-wrapper w-10 h-10 shrink-0">
            <img
              src={LOGO_URL}
              alt="Digital Guardians"
              className="logo-neon-img w-10 h-10 object-contain"
            />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            Digital Guardians
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return link.isHash ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (location === "/") {
                    e.preventDefault();
                    handleNavClick(link);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative ${
                  active
                    ? "text-primary font-semibold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-full shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 hover:shadow-sm"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative ${
                  active
                    ? "text-primary font-semibold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-full shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 hover:shadow-sm"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* CTA Button - Try AI Assistant */}
          <a
            href="/#analyzer"
            onClick={(e) => {
              if (location === "/") {
                e.preventDefault();
                document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="ml-3 px-5 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all glow-green"
          >
            Try AI Assistant
          </a>
        </nav>

        {/* Accessibility Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <AccessibilityToggle />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-foreground"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return link.isHash ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (location === "/") {
                      e.preventDefault();
                    }
                    handleNavClick(link);
                  }}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="/#analyzer"
              onClick={(e) => {
                if (location === "/") {
                  e.preventDefault();
                  document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
                }
                setMobileOpen(false);
              }}
              className="mx-4 mt-2 px-5 py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground text-center glow-green"
            >
              Try AI Assistant
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
