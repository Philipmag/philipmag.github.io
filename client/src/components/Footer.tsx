import { Link } from "wouter";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-foreground">
                Digital Guardians
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              A nonprofit organization dedicated to helping seniors feel confident
              and safe online. Made with care for seniors everywhere.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <Shield className="w-3 h-3" />
                Nonprofit
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border/50">
                Always Free
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Check for Scams", href: "/#analyzer" },
                { label: "Learn & Practice", href: "/#learn" },
                { label: "Resources", href: "/resources" },
                { label: "About Us", href: "/#about" },
              ].map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/#") ? (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Report */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">
              Report a Scam
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://reportfraud.ftc.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FTC (USA)
                </a>
              </li>
              <li>
                <a
                  href="https://www.antifraudcentre.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Canadian Anti-Fraud Centre
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Local Police Non-Emergency Line
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Digital Guardians. A nonprofit organization.
          </p>
          <p className="text-xs text-muted-foreground">
            digitalguardians.ca
          </p>
        </div>
      </div>
    </footer>
  );
}
