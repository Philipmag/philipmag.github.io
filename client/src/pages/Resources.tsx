/*
 * Design: Yeldra-inspired — Deep blue/black with neon accents, anime illustrations
 * Page: Resources — Searchable, filterable resource cards with download links
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import { Button } from "@/components/ui/button";

const RESOURCES_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/resources-anime_a3a0c68c.png";
const PPTX_URL_1 = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/DigitalGuardiansCybersecurityTraining_4c8b571f.pptx";
const PPTX_URL_2 = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/Digital_Security_for_Seniors__f2a062b8.pptx";

type ResourceCategory = "all" | "training" | "guides" | "scam-awareness" | "tools";

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
    title: "Seniors Cybersecurity Training",
    description:
      "Comprehensive 24-slide presentation covering phishing, vishing, ransomware, common scams targeting seniors, and best practices for staying safe online. Includes real statistics and prevention techniques.",
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
      "A comprehensive guide covering internet safety fundamentals, password management, recognizing online scams, safe social media practices, and protecting personal information online. Designed specifically for seniors.",
    category: "training",
    type: "download",
    url: PPTX_URL_2,
    icon: Presentation,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("all");

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[50vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src={RESOURCES_IMG}
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
            <div className="absolute inset-0 bg-grid opacity-20" />
          </div>

          <div className="container relative z-10 py-32 md:py-40">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                  <Sparkles className="w-3 h-3" />
                  {resources.length} Resources Available
                </span>
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 text-foreground">
                Cybersecurity{" "}
                <span className="text-gradient-green">Resources</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Explore our curated collection of guides, training materials, and
                tools to help you stay safe online.
              </p>
            </motion.div>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                />
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground mr-1" />
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat.value
                        ? "bg-primary text-primary-foreground glow-green"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const Icon = resource.icon;

  return (
    <div className="group relative flex flex-col h-full p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-300 glow-card">
      {/* Badge */}
      {resource.badge && (
        <span
          className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            resource.badge === "New"
              ? "text-[oklch(0.6_0.2_290)] bg-[oklch(0.6_0.2_290)]/10 border-[oklch(0.6_0.2_290)]/20"
              : "text-primary bg-primary/10 border-primary/20"
          }`}
        >
          {resource.badge}
        </span>
      )}

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors border border-primary/15">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      {/* Content */}
      <h3 className="font-display font-bold text-base mb-2 text-foreground leading-snug">
        {resource.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
        {resource.description}
      </p>

      {/* Action */}
      <div className="flex items-center gap-3">
        {resource.type === "download" ? (
          <a href={resource.url} download>
            <Button size="sm" className="gap-2 rounded-lg font-semibold glow-green">
              <Download className="w-3.5 h-3.5" />
              Download {resource.fileType || "File"}
            </Button>
          </a>
        ) : (
          <Link href={resource.url}>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 rounded-lg font-semibold border-border/60 hover:bg-white/5 hover:border-primary/30"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Read Guide
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
