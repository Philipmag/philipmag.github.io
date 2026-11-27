import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
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

export default function ScamAlertsFeed() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6">
        Reference examples from the existing collection · March–May 2026 · Not
        live updates
      </p>
      {(showAll ? scamAlerts : scamAlerts.slice(0, 3)).map(alert => (
        <article key={alert.id} className="alert-row">
          <button
            type="button"
            aria-expanded={expanded === alert.id}
            aria-controls={`alert-${alert.id}`}
            onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}
          >
            <span>
              {alert.title}
              <small>
                {alert.date} · {alert.source}
              </small>
            </span>
            <ChevronDown size={18} aria-hidden="true" />
          </button>
          {expanded === alert.id && (
            <div id={`alert-${alert.id}`} className="alert-detail">
              <p className="text-muted-foreground mb-4">{alert.description}</p>
              <a
                href={alert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link inline-flex items-center gap-2"
              >
                Check current CAFC information <ExternalLink size={18} />
              </a>
            </div>
          )}
        </article>
      ))}
      <button
        type="button"
        className="button button-secondary mt-6"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll
          ? "Show fewer examples"
          : `View all ${scamAlerts.length} examples`}
      </button>
      <p className="text-sm text-muted-foreground mt-6">
        For the latest official warnings, visit the{" "}
        <a
          href="https://antifraudcentre-centreantifraude.ca/index-eng.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Canadian Anti-Fraud Centre
        </a>
        . Dates and descriptions above are archived reference content, not
        independently verified current reporting.
      </p>
    </div>
  );
}
