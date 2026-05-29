import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Shield,
  TrendingUp,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ScamAlert {
  id: string;
  title: string;
  date: string;
  severity: "high" | "medium" | "info";
  description: string;
  source: string;
  url: string;
}

const scamAlerts: ScamAlert[] = [
  {
    id: "1",
    title: "CAFC Impersonation Scam",
    date: "May 2026",
    severity: "high",
    description:
      "Fraudsters are impersonating Canadian Anti-Fraud Centre representatives, claiming to investigate fraud or help recover money. They request personal and financial information. Remember: CAFC never contacts you to request money.",
    source: "Canadian Anti-Fraud Centre",
    url: "https://antifraudcentre-centreantifraude.ca/index-eng.htm",
  },
  {
    id: "2",
    title: "FIFA World Cup Themed Frauds",
    date: "March 30, 2026",
    severity: "high",
    description:
      "Scammers are using FIFA World Cup themes to lure victims with fake ticket sales, prize draws, and streaming links. Do not click on unsolicited links or pay for tickets from unofficial sources.",
    source: "Canadian Anti-Fraud Centre",
    url: "https://antifraudcentre-centreantifraude.ca/index-eng.htm",
  },
  {
    id: "3",
    title: "Digital Fraud Surge Warning",
    date: "March 2, 2026",
    severity: "medium",
    description:
      "Authorities warn of a significant surge in digital fraud across Canada. Organized scam networks are increasingly targeting seniors through phone calls, emails, and social media.",
    source: "INTERPOL / CAFC",
    url: "https://antifraudcentre-centreantifraude.ca/index-eng.htm",
  },
  {
    id: "4",
    title: "Seniors Targeted in Quebec",
    date: "March 2, 2026",
    severity: "medium",
    description:
      "Two teens arrested for allegedly targeting and scamming seniors in Montreal and Sherbrooke. The scam involved impersonating police officers to convince victims to hand over valuables.",
    source: "Canadian Anti-Fraud Centre",
    url: "https://antifraudcentre-centreantifraude.ca/index-eng.htm",
  },
  {
    id: "5",
    title: "Organized Scams Across Ontario",
    date: "March 4, 2026",
    severity: "info",
    description:
      "Fraud Prevention Month highlights the growing threat of organized scam operations across Ontario. Seniors are advised to verify all unsolicited contact and never share banking details over the phone.",
    source: "Ontario Provincial Police / CAFC",
    url: "https://antifraudcentre-centreantifraude.ca/index-eng.htm",
  },
];

const stats = [
  { icon: TrendingUp, value: "7,985", label: "Reports in 2026", sub: "As of March 31" },
  { icon: Users, value: "5,316", label: "Victims in 2026", sub: "As of March 31" },
  { icon: DollarSign, value: "$188M", label: "Lost to Fraud", sub: "In 2026 so far" },
];

export default function ScamAlertsFeed() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedAlerts = showAll ? scamAlerts : scamAlerts.slice(0, 3);

  const severityStyles = {
    high: "border-red-500/30 bg-red-500/5",
    medium: "border-amber-500/30 bg-amber-500/5",
    info: "border-blue-500/30 bg-blue-500/5",
  };

  const severityBadge = {
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/15 shrink-0">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-foreground leading-tight">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl border p-4 cursor-pointer transition-all duration-150 hover:shadow-md ${severityStyles[alert.severity]}`}
              onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      alert.severity === "high"
                        ? "text-red-400"
                        : alert.severity === "medium"
                        ? "text-amber-400"
                        : "text-blue-400"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-display font-semibold text-sm text-foreground">
                        {alert.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${severityBadge[alert.severity]}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.date} • {alert.source}
                    </p>
                  </div>
                </div>
                {expanded === alert.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>

              <AnimatePresence>
                {expanded === alert.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3 pl-7">
                      {alert.description}
                    </p>
                    <div className="mt-3 pl-7">
                      <a
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        Read more at CAFC
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show more / less */}
      {scamAlerts.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mx-auto"
        >
          {showAll ? "Show fewer alerts" : `View all ${scamAlerts.length} alerts`}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAll ? "rotate-90" : ""}`} />
        </button>
      )}

      {/* Source attribution */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Source: Canadian Anti-Fraud Centre (CAFC)
          </span>
        </div>
        <a
          href="https://antifraudcentre-centreantifraude.ca/index-eng.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Visit CAFC
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
