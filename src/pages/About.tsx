/*
 * About Page — Combines the About Us section with the Contact Us form.
 * Reduces navigation crowding by merging two related pages into one.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Heart,
  Users,
  Lock,
  Gift,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  ShieldAlert,
  HelpCircle,
  ThumbsUp,
  MoreHorizontal,
  CheckCircle,
  Shield,
  Star,
  Globe,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

import { IS_STATIC_PREVIEW } from "@/lib/runtime";
const categories = [
  { value: "general", label: "General Inquiry", icon: MessageSquare },
  { value: "scam-report", label: "Report a Scam", icon: ShieldAlert },
  { value: "tech-help", label: "Tech Help", icon: HelpCircle },
  { value: "feedback", label: "Feedback", icon: ThumbsUp },
  { value: "other", label: "Other", icon: MoreHorizontal },
] as const;

type Category = (typeof categories)[number]["value"];

const values = [
  {
    icon: Heart,
    title: "Patient",
    description:
      "We take time to explain things clearly, without rushing or using confusing jargon.",
  },
  {
    icon: Users,
    title: "Non-judgmental",
    description:
      "Everyone learns at their own pace. There are no silly questions here.",
  },
  {
    icon: Lock,
    title: "Private",
    description:
      "We help you keep sensitive information private. Contact details are processed to respond to your request; AI requests may be processed by OpenRouter and its provider.",
  },
  {
    icon: Gift,
    title: "Free",
    description:
      "Our services are always free. We're a nonprofit dedicated to your safety.",
  },
  {
    icon: Shield,
    title: "Trustworthy",
    description:
      "We explain practical safety habits and encourage independent verification.",
  },
  {
    icon: Star,
    title: "Community-driven",
    description:
      "Built by and for the community, with input from seniors and caregivers.",
  },
  {
    icon: Globe,
    title: "Accessible",
    description:
      "Designed to be easy to use for everyone, regardless of technical experience.",
  },
  {
    icon: Shield,
    title: "Mission-focused",
    description:
      "Every feature we build serves one goal: keeping seniors safe online.",
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Us & Contact"
        description="Digital Guardians is a nonprofit organization dedicated to helping seniors stay safe online. Contact us for cybersecurity help, scam reporting, or general inquiries."
        keywords="digital guardians about, cybersecurity nonprofit, seniors online safety organization, contact digital guardians, report scam Canada"
        canonicalPath="/about"
      />
      <AboutContent />
    </>
  );
}

function AboutContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [submitted, setSubmitted] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  // Scroll to contact section if hash is present
  useEffect(() => {
    if (window.location.hash === "#contact") {
      setTimeout(() => {
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: data => {
      setSubmitted(data.success === true);
      setResponseMsg(data.message);
    },
    onError: error => {
      setResponseMsg(
        error.message || "Something went wrong. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_STATIC_PREVIEW) return;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim())
      return;
    setResponseMsg("");
    submitMutation.mutate({ name, email, subject, message, category });
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setCategory("general");
    setSubmitted(false);
    setResponseMsg("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* ─── Hero ─── */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">
                  Nonprofit Organization
                </span>
              </div>
              <h1 className="font-display font-medium text-4xl md:text-6xl  text-foreground leading-[1.1] mb-6">
                About <span className="text-foreground">Digital Guardians</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                We're a nonprofit organization dedicated to helping seniors feel
                confident and safe online. We believe everyone deserves to enjoy
                technology without fear.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Mission Statement ─── */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection>
                <SectionLabel number="01" label="Our Mission" />
                <h2 className="font-display font-medium text-3xl md:text-4xl  mb-6 text-foreground">
                  Empowering Seniors in the Digital Age
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base mb-4">
                  Scams targeting seniors are growing more sophisticated every
                  year. Fraudsters use fake emails, phone calls, and websites to
                  steal money and personal information from people who may not
                  know what to look for.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base mb-4">
                  Digital Guardians was founded to close that gap. We provide
                  free, accessible tools and education that help seniors
                  identify threats, protect their accounts, and stay connected
                  with confidence.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Our AI-powered scam analyzer, step-by-step learning guides,
                  and community support are all designed with one goal in mind:
                  keeping you safe online.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      stat: "Free",
                      label: "Guidance & training",
                      sub: "No charge to use",
                    },
                    {
                      stat: "At your pace",
                      label: "Everyday support",
                      sub: "Guides you can revisit",
                    },
                    {
                      stat: "4",
                      label: "Learning guides",
                      sub: "Plain-language tutorials",
                    },
                    {
                      stat: "You choose",
                      label: "What to share",
                      sub: "Remove private details first",
                    },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="p-6 rounded-2xl border border-border/50 bg-card  text-center"
                    >
                      <p className="font-display font-medium text-3xl text-primary mb-1">
                        {item.stat}
                      </p>
                      <p className="font-display font-semibold text-sm text-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.sub}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ─── Our Values ─── */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="container relative z-10">
            <AnimatedSection className="mb-12">
              <SectionLabel number="02" label="Our Values" />
              <h2 className="font-display font-medium text-3xl md:text-4xl  text-foreground">
                What We Stand For
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <AnimatedSection key={value.title + i} delay={i * 0.06}>
                  <div className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-colors duration-200 h-full ">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/15">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-medium text-base mb-2 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Contact Section ─── */}
        <section id="contact" className="py-16 md:py-24 bg-card/30">
          <div className="container">
            <AnimatedSection className="mb-14">
              <SectionLabel number="03" label="Get in Touch" />
              <h2 className="font-display font-medium text-3xl md:text-4xl  text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Have a question, need help, or want to report a scam? Fill out
                the form below and we'll get back to you as soon as possible.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left: Contact Info */}
              <div className="space-y-5">
                <div className="p-6 rounded-2xl border border-border/60 bg-card/50 ">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-medium text-base text-foreground mb-2">
                    Email Us
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send a question or ask about community training.
                  </p>
                  <a
                    href="mailto:info@digitalguards.ca"
                    className="text-sm text-primary hover:underline"
                  >
                    info@digitalguards.ca
                  </a>
                </div>

                <div className="p-6 rounded-2xl border border-border/60 bg-card/50 ">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-medium text-base text-foreground mb-2">
                    Call Us
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Monday to Friday, 9 AM – 5 PM EST.
                  </p>
                  <a
                    href="tel:+17057725140"
                    className="text-sm text-primary hover:underline"
                  >
                    +1 (705) 772-5140
                  </a>
                </div>

                <div className="p-6 rounded-2xl border border-border/60 bg-card/50 ">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-medium text-base text-foreground mb-2">
                    Community
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We host regular in-person cybersecurity training sessions
                    for seniors in our local community.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
                  <h3 className="font-display font-medium text-base text-foreground mb-2">
                    Need Immediate Help?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If money or account details are involved, stop contact and
                    call your bank using a trusted number. The helper is general
                    guidance, not emergency assistance.
                  </p>
                  <Link href="/#analyzer">
                    <Button size="sm" className="gap-2 rounded-lg">
                      <ShieldAlert className="w-4 h-4" />
                      Try AI Assistant
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:col-span-2">
                {submitted ? (
                  <div className="p-12 rounded-2xl border border-primary/30 bg-primary/5 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-display font-medium text-2xl text-foreground mb-4">
                      Message received
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                      {responseMsg}
                    </p>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="gap-2 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                      Send Another Message
                    </Button>
                  </div>
                ) : IS_STATIC_PREVIEW ? (
                  <div className="notice" role="note">
                    <h2>Contact us directly</h2>
                    <p>This static design preview cannot send forms. Email <a className="text-link" href="mailto:info@digitalguards.ca">info@digitalguards.ca</a> or call <a className="text-link" href="tel:+17057725140">+1 (705) 772-5140</a>.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {categories.map(cat => {
                          const Icon = cat.icon;
                          const isSelected = category === cat.value;
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setCategory(cat.value)}
                              aria-pressed={isSelected}
                              className={`p-3 rounded-xl border text-center transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                              }`}
                            >
                              <Icon className="w-5 h-5 mx-auto mb-1.5" />
                              <span className="text-xs font-medium block">
                                {cat.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-semibold text-foreground mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g., John Smith"
                          required
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-semibold text-foreground mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="e.g., john@example.com"
                          required
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-semibold text-foreground mb-2"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-semibold text-foreground mb-2"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="contact-message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={6}
                        placeholder="Tell us how we can help. Do not include passwords, verification codes or banking details."
                        required
                        minLength={10}
                        maxLength={5000}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {message.length}/5000 characters · Do not include
                        passwords or financial details
                      </p>
                    </div>

                    {/* Error message */}
                    {responseMsg && !submitted && (
                      <div role="alert" className="notice notice-error">
                        {responseMsg}
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="gap-2 rounded-xl h-12 px-8 "
                      disabled={
                        submitMutation.isPending ||
                        !name.trim() ||
                        !email.trim() ||
                        !subject.trim() ||
                        message.trim().length < 10
                      }
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Send className="w-4 h-4 " />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
