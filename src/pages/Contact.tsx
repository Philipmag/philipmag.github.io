/*
 * Contact Us Page — Allows visitors to submit questions, report scams, or request help.
 * Uses tRPC to submit form data and notifies the site owner.
 */

import { useState } from "react";
import { Link } from "wouter";
import {
  Send,
  Mail,
  MessageSquare,
  ShieldAlert,
  HelpCircle,
  ThumbsUp,
  MoreHorizontal,
  CheckCircle,
  ArrowLeft,
  Phone,
  MapPin,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

import { IS_STATIC_PREVIEW } from "@/lib/runtime";
const CONTACT_EMAIL = "info@digitalguards.ca";

const categories = [
  {
    value: "general",
    label: "General Inquiry",
    icon: MessageSquare,
    description: "Ask us anything",
  },
  {
    value: "scam-report",
    label: "Report a Scam",
    icon: ShieldAlert,
    description: "Report suspicious activity",
  },
  {
    value: "tech-help",
    label: "Tech Help",
    icon: HelpCircle,
    description: "Get technology assistance",
  },
  {
    value: "feedback",
    label: "Feedback",
    icon: ThumbsUp,
    description: "Share your thoughts",
  },
  {
    value: "other",
    label: "Other",
    icon: MoreHorizontal,
    description: "Something else",
  },
] as const;

type Category = (typeof categories)[number]["value"];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [submitted, setSubmitted] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

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
        {/* Hero */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="container relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">
                  Get in Touch
                </span>
              </div>
              <h1 className="font-display font-medium text-3xl md:text-5xl  text-foreground mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Have a question, need help, or want to report a scam? We're here
                to help. Fill out the form below and we'll get back to you as
                soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-24 md:pb-32">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left: Contact Info Cards */}
              <div className="space-y-6">
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
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {CONTACT_EMAIL}
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
                    Available Monday to Friday, 9 AM - 5 PM EST.
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

                {/* Quick Help */}
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
                    <p>This GitHub Pages design preview cannot send forms. Email <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or call <a className="text-link" href="tel:+17057725140">+1 (705) 772-5140</a>.</p>
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
                          htmlFor="name"
                          className="block text-sm font-semibold text-foreground mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          id="name"
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
                          htmlFor="email"
                          className="block text-sm font-semibold text-foreground mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
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
                        htmlFor="subject"
                        className="block text-sm font-semibold text-foreground mb-2"
                      >
                        Subject
                      </label>
                      <input
                        id="subject"
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
                        htmlFor="message"
                        className="block text-sm font-semibold text-foreground mb-2"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
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
