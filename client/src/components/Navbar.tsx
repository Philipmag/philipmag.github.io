import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", isHash: false },
  { href: "/#analyzer", label: "Check for Scams", isHash: true },
  { href: "/#learn", label: "Learn", isHash: true },
  { href: "/#about", label: "About", isHash: true },
  { href: "/resources", label: "Resources", isHash: false },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors border border-primary/20">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            Digital Guardians
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.isHash
              ? location === "/"
              : location === link.href;
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
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* CTA Button */}
          <a
            href="#analyzer"
            onClick={(e) => {
              if (location === "/") {
                e.preventDefault();
                document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="ml-3 px-5 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all glow-green"
          >
            Try Scam Analyzer
          </a>
        </nav>

        {/* Mobile Toggle */}
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
            {navLinks.map((link) =>
              link.isHash ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (location === "/") {
                      e.preventDefault();
                    }
                    handleNavClick(link);
                  }}
                  className="px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location === link.href
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="#analyzer"
              onClick={(e) => {
                if (location === "/") {
                  e.preventDefault();
                  document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
                }
                setMobileOpen(false);
              }}
              className="mx-4 mt-2 px-5 py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground text-center glow-green"
            >
              Try Scam Analyzer
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
