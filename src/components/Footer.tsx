import { Link } from "wouter";
import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";

const LOGO_URL =
  "/manus-storage/digital-guardians-logo-restored-web_49a53968.webp";

const quickLinks = [
  { label: "Check a message", href: "/#analyzer" },
  { label: "Learn at your pace", href: "/#learn" },
  { label: "Workshops & training", href: "/calendar" },
  { label: "Resource library", href: "/resources" },
  { label: "About Digital Guardians", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="clay-footer relative isolate overflow-hidden border-t border-[rgb(146,194,255)]/16 bg-[rgb(5,16,60)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_4%,rgba(68,143,255,0.28),transparent_25%),radial-gradient(circle_at_91%_28%,rgba(78,104,255,0.25),transparent_28%),linear-gradient(180deg,rgb(8,28,92),rgb(5,16,60))]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 -z-10 h-64 w-64 rounded-full border border-primary/10" />
      <div className="pointer-events-none absolute right-[14%] top-12 -z-10 h-28 w-28 rounded-full border border-[rgb(145,202,255)]/20" />
      <div aria-hidden="true" className="footer-aurora footer-aurora-one" />
      <div aria-hidden="true" className="footer-aurora footer-aurora-two" />

      <div className="container py-12 md:py-16">
        <div className="clay-surface rounded-[2rem] border p-5 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.8fr_0.9fr] lg:gap-12">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(5,16,60)]">
                <span className="logo-clay-wrapper h-11 w-11 shrink-0">
                  <img
                    src={LOGO_URL}
                    alt="Digital Guardians"
                    className="logo-clay-img h-11 w-11 object-contain"
                  />
                </span>
                <span className="font-display text-xl font-extrabold tracking-tight text-white">
                  Digital Guardians
                </span>
              </Link>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
                A calm, local place for seniors to build confidence online, check
                suspicious messages, and get patient support with everyday technology.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                  <Shield className="h-3.5 w-3.5" />
                  Nonprofit
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-200">
                  <Heart className="h-3.5 w-3.5 text-[rgb(174,209,255)]" />
                  Always free
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-200">
                  <MapPin className="h-3.5 w-3.5 text-[rgb(161,197,255)]" />
                  Peterborough, ON
                </span>
              </div>

              <div className="mt-8 max-w-md rounded-2xl border border-primary/20 clay-inset bg-[linear-gradient(135deg,rgba(65,130,246,0.25),rgba(255,255,255,0.035))] p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 rounded-xl border border-primary/20 bg-primary/10 p-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-white">Need a human next step?</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">Contact us for a workshop, one-on-one guidance, or a question you would rather ask in person.</p>
                    <Link href="/calendar" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:text-[rgb(193,220,255)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      Explore local support <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <nav aria-label="Footer navigation">
              <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">Explore</p>
              <ul className="mt-5 space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:translate-x-0.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">Support & report</p>
              <div className="mt-5 space-y-3">
                <a
                  href="mailto:info@digitalguards.ca"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-3 transition hover:border-primary/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="rounded-lg bg-white/[0.08] p-2 text-primary"><Mail className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wide text-slate-400">Email us</span><span className="block truncate text-sm font-semibold text-white">info@digitalguards.ca</span></span>
                </a>
                <a
                  href="tel:+17057725140"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-3 transition hover:border-primary/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="rounded-lg bg-white/[0.08] p-2 text-primary"><Phone className="h-4 w-4" /></span>
                  <span><span className="block text-xs font-bold uppercase tracking-wide text-slate-400">Call us</span><span className="block text-sm font-semibold text-white">+1 (705) 772-5140</span></span>
                </a>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm font-bold text-white">Think you have been scammed?</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">Pause contact, call your bank using a trusted number, then report it.</p>
                <a
                  href="https://www.antifraudcentre.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:text-[rgb(193,220,255)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Canadian Anti-Fraud Centre <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Digital Guardians. Built with care for seniors.</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Privacy-led guidance</span>
              <Link href="/calendar" className="inline-flex items-center gap-1.5 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><CalendarDays className="h-3.5 w-3.5 text-[rgb(161,197,255)]" /> Community workshops</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
