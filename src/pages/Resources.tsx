import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Search,
  Download,
  ExternalLink,
  FileText,
  Shield,
  BookOpen,
  AlertTriangle,
  Lock,
  Eye,
  Presentation,
  Filter,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const PPTX_URL_1 = "/media/DigitalGuardians_Cybersecurity_2026_3cfab393.pptx";
const PPTX_URL_2 =
  "/media/DigitalSecurity_Seniors_2026_Redesigned_436bfe4d.pptx";
const PPTX_URL_3 = "/media/Staying_Connected_Seniors_Guide_54b053a8.pptx";
const PPTX_URL_4 =
  "/media/AIforSeniors_ChatGPT_Guide_2026_Redesigned_c1ecae50.pptx";

type ResourceCategory =
  | "all"
  | "training"
  | "guides"
  | "scam-awareness"
  | "tools";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: "download" | "link";
  url: string;
  icon: typeof FileText;
  badge?: string;
  fileType?: string;
}

const resources: Resource[] = [
  {
    id: "cybersecurity-training",
    title: "Cybersecurity Awareness Training for Seniors",
    description:
      "Updated June 2026 — our most comprehensive training presentation. 39 slides covering why seniors are disproportionately targeted, Canada's $704M+ fraud losses, the top 5 scams (financial impersonation, CRA fraud, fake tech support, romance scams, grandparent scams), phishing, vishing, ransomware, and the rise of AI-powered voice cloning and deepfake fraud. Includes a full cybersecurity action plan and reporting resources.",
    category: "training",
    type: "download",
    url: PPTX_URL_1,
    icon: Presentation,
    badge: "Featured",
    fileType: "PPTX",
  },
  {
    id: "digital-security-seniors",
    title: "Digital Security for Seniors",
    description:
      "Updated June 2026 — a focused 19-slide guide on three essential skills: safe device disposal (how to wipe your phone or computer before donating), strong passwords using the easy 3-random-words method, and Multi-Factor Authentication (MFA). Includes current 2025–2026 statistics, step-by-step setup instructions, and a personal action plan checklist.",
    category: "training",
    type: "download",
    url: PPTX_URL_2,
    icon: Presentation,
    badge: "Updated",
    fileType: "PPTX",
  },
  {
    id: "staying-connected-seniors",
    title: "Staying Connected: Video Meetings for Seniors",
    description:
      "An 85-slide step-by-step visual guide to joining and hosting online meetings using Zoom, Google Meet, and Microsoft Teams. Every action is illustrated with annotated screenshots and red-circle markers showing exactly where to click. Covers joining as an attendee, hosting a meeting, sharing your screen, recording, live captions, and troubleshooting — written in plain language at a comfortable pace.",
    category: "training",
    type: "download",
    url: PPTX_URL_3,
    icon: Presentation,
    badge: "Updated",
    fileType: "PPTX",
  },
  {
    id: "ai-for-seniors",
    title: "AI for Seniors: Your Friendly ChatGPT Guide",
    description:
      "New June 2026 — a beginner-friendly 16-slide introduction to artificial intelligence and ChatGPT. Covers what AI can and cannot do, how to create a free account, navigating the ChatGPT screen, writing good prompts, and practical daily uses (writing emails, health questions, recipes, travel planning). Includes an essential safety section on what never to share with AI, how to spot AI voice scams, and how to verify AI-generated information.",
    category: "training",
    type: "download",
    url: PPTX_URL_4,
    icon: BookOpen,
    badge: "New",
    fileType: "PPTX",
  },
  {
    id: "phishing-guide",
    title: "How to Spot Phishing Emails",
    description:
      "Learn to identify phishing emails by recognizing urgent language, suspicious links, and unexpected requests for personal information or credentials.",
    category: "scam-awareness",
    type: "link",
    url: "/guides/email-basics",
    icon: AlertTriangle,
  },
  {
    id: "password-guide",
    title: "Creating Strong Passwords",
    description:
      "Step-by-step guide to creating unique, complex passwords for each account and using password managers to keep them organized and secure.",
    category: "guides",
    type: "link",
    url: "/guides/passwords",
    icon: Lock,
  },
  {
    id: "scam-types",
    title: "Top 5 Scams Targeting Seniors",
    description:
      "Detailed breakdown of the grandparent scam, financial service scam, fake tech support, government impersonation, and romance scams — with real examples and warning signs.",
    category: "scam-awareness",
    type: "link",
    url: "/guides/spotting-scams",
    icon: Shield,
  },
  {
    id: "safe-browsing",
    title: "Safe Browsing Habits",
    description:
      "Learn how to browse the web safely, recognize trustworthy websites, and avoid malicious downloads that could compromise your device.",
    category: "guides",
    type: "link",
    url: "/guides/safe-browsing",
    icon: BookOpen,
  },
  {
    id: "two-factor-auth",
    title: "Setting Up Two-Factor Authentication",
    description:
      "Add an extra layer of security to your sensitive accounts with two-factor authentication. This guide walks you through the setup process step by step.",
    category: "tools",
    type: "link",
    url: "/guides/passwords#two-factor-auth",
    icon: Lock,
  },
  {
    id: "software-updates",
    title: "Keeping Your Software Updated",
    description:
      "Why regular software updates matter and how to ensure your devices always have the latest security patches to protect against known vulnerabilities.",
    category: "tools",
    type: "link",
    url: "/guides/safe-browsing#downloads-updates",
    icon: FileText,
  },
  {
    id: "ransomware-prevention",
    title: "Understanding & Preventing Ransomware",
    description:
      "Learn what ransomware is, how it encrypts your files, and the practical steps you can take to prevent falling victim to ransomware attacks.",
    category: "scam-awareness",
    type: "link",
    url: "/guides/spotting-scams",
    icon: AlertTriangle,
  },
  {
    id: "vishing-awareness",
    title: "Vishing: Phone Scam Awareness",
    description:
      "Understand how scammers use phone calls (vishing) to trick you into revealing sensitive information, and learn how to protect yourself from voice-based scams.",
    category: "scam-awareness",
    type: "link",
    url: "/guides/spotting-scams",
    icon: Shield,
  },
];

const categories: { value: ResourceCategory; label: string }[] = [
  { value: "all", label: "All Resources" },
  { value: "training", label: "Training" },
  { value: "guides", label: "Guides" },
  { value: "scam-awareness", label: "Scam Awareness" },
  { value: "tools", label: "Tools & Tips" },
];

export default function Resources() {
  return (
    <>
      <SEO
        title="Cybersecurity Resources for Seniors"
        description="Free downloadable training materials, guides, and tools to help seniors stay safe online. Includes presentations, PDF guides, and scam awareness resources."
        keywords="cybersecurity resources seniors, online safety training, scam awareness materials, digital literacy guides, free security tools"
        canonicalPath="/resources"
      />
      <ResourcesContent />
    </>
  );
}

function ResourcesContent() {
  const [searchQuery, setSearchQuery] = useState(
    () => new URLSearchParams(window.location.search).get("q") || ""
  );
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("all");

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesCategory =
        activeCategory === "all" || r.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="page-heading">
          <div className="container">
            <SectionLabel label="The resource library" />
            <h1>Practical guides to keep close by</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our collection of learning guides, training materials and
              tools. Read online or download a presentation to revisit later.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              {resources.length} resources · Free to use
            </p>
          </div>
        </section>
        {/* Search & Filter */}
        <section className="py-8 md:py-12 border-y border-border/30">
          <div className="container">
            <AnimatedSection>
              {/* Search bar */}
              <div className="relative max-w-xl mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Search resources"
                  placeholder="Search resources"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                />
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    aria-pressed={activeCategory === cat.value}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === cat.value
                        ? "bg-primary text-primary-foreground "
                        : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Resource Cards */}
        <section className="py-16 md:py-24">
          <div className="container">
            {filteredResources.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No resources found matching your search.
                </p>
              </div>
            ) : (
              <div className="resource-list">
                {filteredResources.map((resource, i) => (
                  <AnimatedSection key={resource.id} delay={i * 0.05}>
                    <ResourceCard resource={resource} />
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-card">
      <p className="text-sm">
        {resource.type === "download"
          ? "Training presentation · PPTX"
          : "Learning guide"}
      </p>
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>
      {resource.type === "download" ? (
        <a href={resource.url} download className="button button-secondary">
          <Download size={18} />
          Download {resource.fileType || "file"}
        </a>
      ) : (
        <Link href={resource.url} className="button button-secondary">
          Read guide <ArrowRight size={18} />
        </Link>
      )}
    </article>
  );
}
