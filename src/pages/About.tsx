/*
 * About Page — Combines the About Us section with the Contact Us form.
 * Reduces navigation crowding by merging two related pages into one.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
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
    description: "We take time to explain things clearly, without rushing or using confusing jargon.",
  },
  {
    icon: Users,
    title: "Non-judgmental",
    description: "Everyone learns at their own pace. There are no silly questions here.",
  },
  {
    icon: Lock,
    title: "Private",
    description: "Your data stays yours. We never store or share your personal information.",
  },
  {
    icon: Gift,
    title: "Free",
    description: "Our services are always free. We're a nonprofit dedicated to your safety.",
  },
  {
    icon: Shield,
    title: "Trustworthy",
    description: "We provide accurate, up-to-date information you can rely on.",
  },
  {
    icon: Star,
    title: "Community-driven",
    description: "Built by and for the community, with input from seniors and caregivers.",
  },
  {
    icon: Globe,
    title: "Accessible",
    description: "Designed to be easy to use for everyone, regardless of technical experience.",
  },
  {
    icon: Shield,
    title: "Mission-focused",
    description: "Every feature we build serves one goal: keeping seniors safe online.",
  },
];

export default function About() {
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
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setResponseMsg(data.message);
    },
    onError: (error) => {
      setResponseMsg(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24">

        {/* ─── Hero ─── */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">Nonprofit Organization</span>
              </div>
              <h1 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight text-foreground leading-[1.1] mb-6">
                About{" "}
                <span className="text-gradient-green">Digital Guardians</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                We're a nonprofit organization dedicated to helping seniors feel confident and safe
                online. We believe everyone deserves to enjoy technology without fear.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Mission Statement ─── */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection>
                <SectionLabel number="01" label="Our Mission" />
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-6 text-foreground">
                  Empowering Seniors in the Digital Age
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base mb-4">
                  Scams targeting seniors are growing more sophisticated every year. Fraudsters use
                  fake emails, phone calls, and websites to steal money and personal information from
                  people who may not know what to look for.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base mb-4">
                  Digital Guardians was founded to close that gap. We provide free, accessible tools
                  and education that help seniors identify threats, protect their accounts, and stay
                  connected with confidence.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Our AI-powered scam analyzer, step-by-step learning guides, and community support
                  are all designed with one goal in mind: keeping you safe online.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { stat: "100%", label: "Free Forever", sub: "No hidden costs" },
                    { stat: "24/7", label: "AI Available", sub: "Always ready to help" },
                    { stat: "4+", label: "Learning Guides", sub: "Plain language tutorials" },
                    { stat: "0", label: "Data Stored", sub: "Your privacy protected" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-6 rounded-2xl border border-border/50 bg-card glow-card text-center"
                    >
                      <p className="font-display font-extrabold text-3xl text-primary mb-1">
                        {item.stat}
                      </p>
                      <p className="font-display font-semibold text-sm text-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ─── Our Values ─── */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="container relative z-10">
            <AnimatedSection className="text-center mb-14">
              <SectionLabel number="02" label="Our Values" />
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-foreground">
                What We Stand For
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <AnimatedSection key={value.title + i} delay={i * 0.06}>
                  <div className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-300 h-full glow-card">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/15">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-base mb-2 text-foreground">
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
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Have a question, need help, or want to report a scam? Fill out the form below and
                we'll get back to you as soon as possible.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left: Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                <div className="p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    We'll respond within 24–48 hours.
                  </p>
                  <a href="mailto:support@digitalguardians.org" className="text-sm text-primary hover:underline">
                    support@digitalguardians.org
                  </a>
                </div>

                <div className="p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground mb-2">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Monday to Friday, 9 AM – 5 PM EST.
                  </p>
                  <p className="text-sm text-primary">Coming soon</p>
                </div>

                <div className="p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    We host regular in-person cybersecurity training sessions for seniors in our local community.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
                  <h3 className="font-display font-bold text-base text-foreground mb-2">Need Immediate Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you think you've been scammed, use our AI Assistant for instant guidance.
                  </p>
                  <Link href="/#analyzer">
                    <Button size="sm" className="gap-2 rounded-lg">
                      <ShieldAlert className="w-4 h-4" />
                      Try AI Assistant
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2"
              >
                {submitted ? (
                  <div className="p-12 rounded-2xl border border-primary/30 bg-primary/5 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-display font-bold text-2xl text-foreground mb-4">
                      Message Sent!
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                      {responseMsg}
                    </p>
                    <Button onClick={handleReset} variant="outline" className="gap-2 rounded-xl">
                      <Send className="w-4 h-4" />
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = category === cat.value;
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setCategory(cat.value)}
                              className={`p-3 rounded-xl border text-center transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                              }`}
                            >
                              <Icon className="w-5 h-5 mx-auto mb-1.5" />
                              <span className="text-xs font-medium block">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-semibold text-foreground mb-2">
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g., John Smith"
                          required
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-semibold text-foreground mb-2">
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g., john@example.com"
                          required
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-semibold text-foreground mb-2">
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-semibold text-foreground mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="contact-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        placeholder="Tell us how we can help you. Include as much detail as possible."
                        required
                        minLength={10}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {message.length}/5000 characters
                      </p>
                    </div>

                    {/* Error message */}
                    {responseMsg && !submitted && (
                      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">
                        {responseMsg}
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="gap-2 rounded-xl h-12 px-8 glow-green"
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
                          <Send className="w-4 h-4 animate-pulse" />
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
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
