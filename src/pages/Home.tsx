import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ExternalLink,
  Copy,
  Share2,
  Lock,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import TrainingSlideshow from "@/components/TrainingSlideshow";
import ScamAlertsFeed from "@/components/ScamAlertsFeed";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { SITE_ASSETS } from "@/lib/siteAssets";
import { IS_STATIC_PREVIEW } from "@/lib/runtime";

type AnalysisResult = {
  source: "ai" | "safety-check";
  privacyProtected: boolean;
  riskLevel: "safe" | "suspicious" | "dangerous";
  confidence: number;
  summary: string;
  redFlags: string[];
  advice: string;
  scamType: string;
};
type TechHelpResult = {
  source: "ai" | "quick-guide";
  privacyProtected: boolean;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  overview: string;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    tip: string | null;
  }[];
  troubleshooting: { problem: string; solution: string }[];
  safetyNote: string;
};
const riskTitles = {
  safe: "No obvious scam signs found",
  suspicious: "Take a closer look",
  dangerous: "Likely a scam — do not engage",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Online safety help for older adults in Peterborough"
        description="Practical, free online safety guidance for older adults in Peterborough, Ontario. Check suspicious messages, learn at your pace, and find community training."
        canonicalPath="/"
      />
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <AnalyzerSection />
        <ScamAlertsSection />
        <HowItWorksSection />
        <LearningSection />
        <TrainingsSection />
        <AboutSection />
        <EmergencySection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">
              Online safety help in Peterborough, Ontario
            </p>
            <h1 className="hero-title">
              Feel safer online,
              <br />
              one clear step
              <br />
              at a time
            </h1>
            <p className="hero-summary">
              Practical, judgment-free support for older adults. Learn to spot
              scams, protect your accounts, and feel more confident with
              everyday technology.
            </p>
            <div className="hero-actions">
              <a href="#analyzer" className="button">
                Check a message <ArrowRight size={18} />
              </a>
              <Link href="/calendar" className="button button-secondary">
                Find a workshop
              </Link>
            </div>
          </div>
          <figure className="scene">
            <img
              src={SITE_ASSETS.hero}
              alt="An older adult and a friendly guide looking at a tablet together at a café table"
              width="1200"
              height="800"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <figcaption>
              Friendly guidance, at your pace · Illustrative AI-generated scene,
              not a documented participant
            </figcaption>
          </figure>
        </div>
        <div className="hero-note">
          <span>Free guidance</span>
          <span>No account needed</span>
          <span>Room for every question</span>
        </div>
      </div>
    </section>
  );
}

function AnalyzerSection() {
  const [mode, setMode] = useState<"scam" | "help">("scam");
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [scamResult, setScamResult] = useState<AnalysisResult | null>(null);
  const [helpResult, setHelpResult] = useState<TechHelpResult | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const analyzeMutation = trpc.scamAnalyzer.analyze.useMutation({
    onSuccess: data => setScamResult(data as AnalysisResult),
  });
  const techHelpMutation = trpc.scamAnalyzer.techHelp.useMutation({
    onSuccess: data => setHelpResult(data as TechHelpResult),
  });
  const pending = analyzeMutation.isPending || techHelpMutation.isPending;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setShareStatus("");
    if (IS_STATIC_PREVIEW) return;
    if (mode === "scam" && message.trim()) {
      setScamResult(null);
      analyzeMutation.mutate({ message: message.trim() });
    } else if (mode === "help" && question.trim()) {
      setHelpResult(null);
      techHelpMutation.mutate({ question: question.trim() });
    }
  };
  const switchMode = (next: "scam" | "help") => {
    if (pending) return;
    setMode(next);
    setScamResult(null);
    setHelpResult(null);
    analyzeMutation.reset();
    techHelpMutation.reset();
    setShareStatus("");
  };
  const shareText = scamResult
    ? `Digital Guardians message check\n${riskTitles[scamResult.riskLevel]}\n${scamResult.summary}\n\nNext steps: ${scamResult.advice}\n\n${scamResult.source === "ai" ? "AI-generated guidance" : "Local precautionary guidance — not a message assessment"}. No guarantee that a message is genuine. Verify independently.`
    : "";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("Results copied");
    } catch {
      setShareStatus(
        "Could not copy. You can select the results and copy them manually."
      );
    }
  };
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Digital Guardians message check",
          text: shareText,
        });
        setShareStatus("Share window opened");
      } else {
        window.location.href = `mailto:?subject=Digital Guardians message check&body=${encodeURIComponent(shareText)}`;
      }
    } catch {
      setShareStatus("Sharing was cancelled or unavailable");
    }
  };
  const error =
    mode === "scam" ? analyzeMutation.isError : techHelpMutation.isError;
  return (
    <section id="analyzer" className="section section-tint">
      <div className="container">
        <div className="section-heading">
          <SectionLabel label="A little help with your next step" />
          <h2>
            Unsure about a message?
            <br />
            Let’s take a closer look
          </h2>
          <p>
            Paste a suspicious message, or ask an everyday technology question.
            The helper explains possible warning signs and practical next steps
            in plain language.
          </p>
        </div>
        <div id="helper-privacy" className="privacy-notice">
          <p>
            <strong>Before you paste:</strong> remove names, addresses,
            passwords, banking details, government IDs and verification codes.
            Do not include information you would not want a third party to
            process.
          </p>
          <p>
            Your text is sent to our server and may be processed by{" "}
            <strong>OpenRouter and its AI provider</strong>. Automatic redaction
            can miss sensitive details. AI guidance can be wrong and cannot
            guarantee a message is safe or genuine. Verify money or account
            requests independently using a trusted number.
          </p>
        </div>
        {IS_STATIC_PREVIEW && (
          <div className="notice" role="note">
            <strong>Design preview — live AI is not available on GitHub Pages</strong>
            <p>This static preview includes the learning guides and downloads. To try OpenRouter-powered checks, run the standalone Node app using the <a className="text-link" href="https://github.com/Philipmag/philipmag.github.io#quick-start">GitHub setup instructions</a>. Do not paste private details here.</p>
          </div>
        )}
        <div className="panel helper-shell">
          <div
            className="helper-tabs"
            role="group"
            aria-label="Choose a helper"
          >
            <button
              type="button"
              aria-pressed={mode === "scam"}
              onClick={() => switchMode("scam")}
              disabled={pending}
            >
              Check a message
            </button>
            <button
              type="button"
              aria-pressed={mode === "help"}
              onClick={() => switchMode("help")}
              disabled={pending}
            >
              Ask for tech help
            </button>
          </div>
          <div className="helper-grid">
            <form
              className="helper-form"
              onSubmit={submit}
              aria-describedby="helper-privacy"
            >
              <h3>
                {mode === "scam"
                  ? "Does this look suspicious?"
                  : "What would you like to do?"}
              </h3>
              <p className="text-muted-foreground">
                {mode === "scam"
                  ? "Copy the message here after removing private details. You do not need to open any link in it."
                  : "Ask one question at a time. You can choose an example below to get started."}
              </p>
              {mode === "help" && (
                <div className="quick-questions">
                  {[
                    "How do I mute myself in Zoom?",
                    "How do I search on Google?",
                    "How do I send a photo by email?",
                    "How do I make text bigger?",
                  ].map(item => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setQuestion(item)}
                      disabled={pending}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
              <label
                htmlFor={mode === "scam" ? "scam-message" : "help-question"}
                className="field-label"
              >
                {mode === "scam"
                  ? "Message to check"
                  : "Your technology question"}
              </label>
              <textarea
                id={mode === "scam" ? "scam-message" : "help-question"}
                rows={6}
                value={mode === "scam" ? message : question}
                onChange={event =>
                  mode === "scam"
                    ? setMessage(event.target.value)
                    : setQuestion(event.target.value)
                }
                maxLength={mode === "scam" ? 10000 : 5000}
                required
                disabled={pending || IS_STATIC_PREVIEW}
                placeholder={
                  mode === "scam"
                    ? "Example: Your account will be closed today. Click this link to verify it…"
                    : "For example: How do I join a Zoom meeting from an email invitation?"
                }
              />
              <button
                type="submit"
                className="button"
                disabled={
                  IS_STATIC_PREVIEW || pending || !(mode === "scam" ? message : question).trim()
                }
              >
                {pending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Preparing guidance…
                  </>
                ) : mode === "scam" ? (
                  "Check this message"
                ) : (
                  "Create my guide"
                )}
              </button>
              <p className="text-sm text-muted-foreground mt-4 flex items-start gap-2">
                <Lock size={18} className="shrink-0 mt-1" />
                Never paste a password, banking number or one-time code
              </p>
            </form>
            <div
              className="helper-result"
              aria-live="polite"
              aria-busy={pending}
            >
              {pending && (
                <div role="status">
                  <h3>
                    {mode === "scam"
                      ? "Checking your message"
                      : "Preparing your step-by-step guide"}
                  </h3>
                  <p>
                    This may take a few seconds. Please keep this page open.
                  </p>
                </div>
              )}
              {!pending && error && (
                <div role="alert" className="notice notice-error">
                  <h3>We could not complete that request</h3>
                  <p>
                    Please try again, or use the learning guides below. Until a
                    message is verified independently, avoid its links and phone
                    numbers.
                  </p>
                </div>
              )}
              {!pending && mode === "scam" && scamResult && (
                <>
                  <p className="result-source">
                    {scamResult.source === "ai"
                      ? "AI-generated guidance via OpenRouter"
                      : "Local safety checklist · Live AI unavailable"}
                  </p>
                  {scamResult.source === "safety-check" && (
                    <p className="notice notice-warning">
                      These are precautionary steps, not an assessment of your
                      message.
                    </p>
                  )}
                  {scamResult.privacyProtected && (
                    <p className="notice">
                      Some details that looked like credentials or account
                      numbers were redacted before the AI request. Redaction is
                      not a guarantee of privacy.
                    </p>
                  )}
                  <h3>
                    {scamResult.source === "ai"
                      ? riskTitles[scamResult.riskLevel]
                      : "Pause and verify independently"}
                  </h3>
                  <p>{scamResult.summary}</p>
                  {scamResult.source === "ai" && (
                    <p className="text-sm text-muted-foreground">
                      Model-reported confidence: {scamResult.confidence}% — not
                      a measured guarantee of accuracy
                    </p>
                  )}
                  {scamResult.scamType !== "none" &&
                    scamResult.scamType !== "unknown" && (
                      <p>
                        Possible type: {scamResult.scamType.replace(/-/g, " ")}
                      </p>
                    )}
                  {scamResult.redFlags.length > 0 && (
                    <>
                      <h4>What stood out</h4>
                      <ul className="list-disc pl-5 mb-5">
                        {scamResult.redFlags.map(flag => (
                          <li key={flag}>{flag}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="notice">
                    <h4 className="mb-2">What to do next</h4>
                    <p>{scamResult.advice}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No check can confirm that a message is genuine. Contact the
                    organisation independently before sending money or
                    information.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={copy}
                    >
                      <Copy size={18} />
                      Copy results
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={share}
                    >
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                  <p role="status" className="text-sm mt-3">
                    {shareStatus}
                  </p>
                </>
              )}
              {!pending && mode === "help" && helpResult && (
                <>
                  <p className="result-source">
                    {helpResult.source === "ai"
                      ? "AI-generated guide via OpenRouter"
                      : "Local quick guide · Live AI unavailable"}
                  </p>
                  {helpResult.source === "quick-guide" && (
                    <p className="notice">
                      This is a local starting guide, not a personalised AI
                      answer. Some steps may differ on your device.
                    </p>
                  )}
                  {helpResult.privacyProtected && (
                    <p className="notice">
                      Some private details were redacted before processing.
                      Automatic redaction can miss sensitive information.
                    </p>
                  )}
                  <h3>{helpResult.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {helpResult.difficulty} · {helpResult.estimatedTime}
                  </p>
                  <p>{helpResult.overview}</p>
                  <ol className="numbered-list">
                    {helpResult.steps.map(step => (
                      <li key={step.stepNumber}>
                        <span className="step-number">{step.stepNumber}</span>
                        <div>
                          <h4>{step.title}</h4>
                          <p>{step.instruction}</p>
                          {step.tip && (
                            <p className="text-sm">Helpful tip: {step.tip}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                  {helpResult.troubleshooting.length > 0 && (
                    <>
                      <h4 className="mt-6 mb-4">If something goes wrong</h4>
                      {helpResult.troubleshooting.map(item => (
                        <div className="notice" key={item.problem}>
                          <h4>{item.problem}</h4>
                          <p>{item.solution}</p>
                        </div>
                      ))}
                    </>
                  )}
                  <div className="notice">
                    <h4>Safety reminder</h4>
                    <p>{helpResult.safetyNote}</p>
                  </div>
                </>
              )}
              {!pending &&
                !error &&
                !(mode === "scam" ? scamResult : helpResult) && (
                  <>
                    <SectionLabel label="One step at a time" />
                    <h3>
                      {mode === "scam"
                        ? "A second set of eyes, without the pressure"
                        : "Clear steps for everyday tasks"}
                    </h3>
                    <p className="text-muted-foreground">
                      {mode === "scam"
                        ? "We look for urgency, unusual requests, payment pressure and impersonation. Your results will appear here."
                        : "Ask about email, video calls, photos, browsing or phone settings. Your guide will appear here."}
                    </p>
                    <ol className="numbered-list">
                      {(mode === "scam"
                        ? [
                            [
                              "Remove private details",
                              "Keep sensitive information out of your message",
                            ],
                            [
                              "Review the guidance",
                              "Look at the warning signs and suggested next steps",
                            ],
                            [
                              "Pause and verify",
                              "Use a phone number or website you already trust",
                            ],
                          ]
                        : [
                            [
                              "Ask one question",
                              "Include your device or app, but no private details",
                            ],
                            [
                              "Follow one step",
                              "Take your time and stop if something looks different",
                            ],
                            [
                              "Ask for support",
                              "A workshop or trusted person can help you practise",
                            ],
                          ]
                      ).map(([title, detail], i) => (
                        <li key={title}>
                          <span className="step-number">{i + 1}</span>
                          <div>
                            <h4>{title}</h4>
                            <p>{detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScamAlertsSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <SectionLabel label="Scam awareness" />
          <h2>Fraud warnings to keep in mind</h2>
          <p>
            Read about common scam approaches affecting Canadians. This is a
            reference collection, not a live alert feed. Check the Canadian
            Anti-Fraud Centre for current warnings.
          </p>
        </div>
        <ScamAlertsFeed />
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <SectionLabel label="How the helper works" />
          <h2>From uncertainty to a practical next step</h2>
        </div>
        <ol className="numbered-list steps-grid">
          {[
            [
              "You add the message",
              "Copy the message after removing private details. Do not open its links.",
            ],
            [
              "The helper reviews it",
              "AI looks for common warning signs. If it is unavailable, you will see a clearly labelled local checklist.",
            ],
            [
              "You get plain-language advice",
              "Read the suggestions, then verify independently before taking action.",
            ],
          ].map(([title, description], i) => (
            <li key={title}>
              <span className="step-number">{i + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function LearningSection() {
  return (
    <section id="learn" className="section section-tint">
      <div className="container learning-grid">
        <figure className="scene">
          <img
            src={SITE_ASSETS.learning}
            alt="Older adults sharing a digital learning session around a library table"
            width="1200"
            height="800"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            Learning together · Illustrative AI-generated scene, not documented
            participants
          </figcaption>
        </figure>
        <div>
          <div className="section-heading">
            <SectionLabel label="Learning centre" />
            <h2>Learn at your own pace</h2>
            <p>
              Start with the topic that matters to you. Our plain-language
              guides break each task into manageable steps.
            </p>
          </div>
          {[
            ["Email basics", "8 min read", "email-basics"],
            ["Passwords", "10 min read", "passwords"],
            ["Spotting scams", "12 min read", "spotting-scams"],
            ["Safe browsing", "11 min read", "safe-browsing"],
          ].map(([title, time, slug], i) => (
            <Link key={slug} href={`/guides/${slug}`} className="guide-link">
              <span className="step-number">{i + 1}</span>
              <span className="flex-1">
                {title}
                <small>{time}</small>
              </span>
              <ArrowRight size={18} />
            </Link>
          ))}
          <Link
            href="/resources"
            className="text-link inline-flex items-center gap-2 mt-6"
          >
            Browse all resources <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrainingsSection() {
  return (
    <section className="section">
      <div className="container learning-grid">
        <TrainingSlideshow />
        <div>
          <div className="section-heading">
            <SectionLabel label="Community training" />
            <h2>
              Practise together,
              <br />
              with time for questions
            </h2>
            <p>
              Our in-person cybersecurity workshops help older adults recognise
              scam emails and navigate the internet more safely.
            </p>
          </div>
          <ol className="numbered-list">
            {[
              [
                "Hands-on workshops",
                "Small group sessions with personal attention",
              ],
              [
                "Real-world scenarios",
                "Practise spotting scam warning signs with examples",
              ],
              [
                "A supportive environment",
                "No question is too simple — everyone is welcome",
              ],
            ].map(([title, detail], i) => (
              <li key={title}>
                <span className="step-number">{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/resources"
            className="text-link inline-flex items-center gap-2 mt-6"
          >
            View training materials <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-heading">
          <SectionLabel label="About Digital Guardians" />
          <h2>Technology is easier when you don’t have to learn alone</h2>
          <p>
            We believe everyone deserves to enjoy technology without fear. Our
            support leaves room to ask questions, build safer habits and stay
            connected.
          </p>
        </div>
        <div className="values-grid">
          {[
            ["Patient", "We take time to explain things clearly."],
            ["Non-judgmental", "Everyone learns at their own pace."],
            [
              "Privacy-aware",
              "We help you avoid sharing sensitive information.",
            ],
            ["Free", "Our guidance and training are free to use."],
          ].map(([title, description]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <Link
          href="/about"
          className="text-link inline-flex gap-2 items-center mt-8"
        >
          Meet Digital Guardians <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function EmergencySection() {
  return (
    <section id="emergency" className="section section-tint">
      <div className="container learning-grid">
        <div>
          <div className="section-heading">
            <SectionLabel label="If you think you’ve been scammed" />
            <h2>Pause. You’re not alone.</h2>
            <p>
              Scams happen to careful people too. Take these practical steps
              before continuing contact.
            </p>
          </div>
          <ol className="numbered-list">
            {[
              [
                "Take a breath",
                "You do not need to respond to pressure right away.",
              ],
              [
                "Stop all contact",
                "Do not reply, click links or send more money.",
              ],
              ["Call your bank", "Use the number on the back of your card."],
              [
                "Change affected passwords",
                "Use the official app or a website you already trust.",
              ],
              [
                "Report what happened",
                "Reporting helps protect other people too.",
              ],
            ].map(([title, detail], i) => (
              <li key={title}>
                <span className="step-number">{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="panel">
          <h3 className="mb-6">Where to report</h3>
          <a
            className="guide-link"
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex-1">
              Federal Trade Commission (USA)<small>reportfraud.ftc.gov</small>
            </span>
            <ExternalLink size={18} />
          </a>
          <a
            className="guide-link"
            href="https://antifraudcentre-centreantifraude.ca/index-eng.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex-1">
              Canadian Anti-Fraud Centre
              <small>Canada’s fraud reporting information</small>
            </span>
            <ExternalLink size={18} />
          </a>
          <div className="guide-link">
            <span>
              Local police
              <small>
                Contact your local non-emergency line. If someone is in
                immediate danger, call 911.
              </small>
            </span>
          </div>
          <Link href="/about#contact" className="text-link inline-block mt-6">
            Ask Digital Guardians for support
          </Link>
        </div>
      </div>
    </section>
  );
}
