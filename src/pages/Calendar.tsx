import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { IS_STATIC_PREVIEW } from "@/lib/runtime";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Sun,
  Sunset,
  AlertCircle,
  X,
  Loader2,
  CalendarDays,
  Phone,
  Mail,
  Monitor,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type EventRow = {
  id: number;
  title: string;
  description: string | null;
  eventDate: number | null;
  eventEndDate: number | null;
  location: string | null;
  eventType: "online" | "in-person" | "hybrid";
  capacity: number | null;
  dateConfirmed: boolean;
  sessionSlot: "morning" | "afternoon" | "full-day" | "evening";
  isActive: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Toronto",
  });
}

function SlotBadge({ slot }: { slot: string }) {
  const config: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    morning: {
      label: "Morning Session",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: <Sun className="w-3.5 h-3.5" />,
    },
    afternoon: {
      label: "Afternoon Session",
      color: "bg-secondary text-primary border-border",
      icon: <Sunset className="w-3.5 h-3.5" />,
    },
    "full-day": {
      label: "Full Day",
      color: "bg-primary/10 text-primary border-primary/20",
      icon: <Calendar className="w-3.5 h-3.5" />,
    },
    evening: {
      label: "Evening Session",
      color: "bg-secondary text-primary border-border",
      icon: <Calendar className="w-3.5 h-3.5" />,
    },
  };
  const c = config[slot] ?? config["full-day"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${c.color}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  if (type === "online")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-primary border border-border">
        <Monitor className="w-3 h-3" /> Online
      </span>
    );
  if (type === "hybrid")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-primary border border-border">
        Hybrid
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
      <MapPin className="w-3 h-3" /> In-Person
    </span>
  );
}

// ─── Sign-Up Modal ────────────────────────────────────────────────────────────
function SignUpModal({
  event,
  onClose,
}: {
  event: EventRow;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const signUp = trpc.calendar.signUpForEvent.useMutation({
    onSuccess: data => setSubmitted(data.success === true),
    onError: err => setSignupError(err.message),
  });

  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = dialogRef.current?.querySelector<HTMLElement>(
      "button, input, textarea"
    );
    first?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input, textarea, a[href]"
        ) || []
      );
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("keydown", keyboard);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  const sessionTime = event.eventDate
    ? `${formatTime(event.eventDate)}${event.eventEndDate ? ` – ${formatTime(event.eventEndDate)}` : ""}`
    : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSignupError(null);
    signUp.mutate({
      eventId: event.id,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 " onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Register for a workshop"
        className="relative w-full max-w-md bg-card border border-border rounded-2xl  p-6 z-10 max-h-[90vh] overflow-y-auto"
      >
        <button
          aria-label="Close registration"
          onClick={onClose}
          className="absolute top-3 right-3 icon-button"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-4">
            {/* Success icon */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4 ring-4 ring-primary/20">
                <CheckCircle className="w-9 h-9 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-1">
                Registration received
              </h3>
              <p className="text-muted-foreground text-sm">
                Thank you,{" "}
                <strong className="text-foreground">{form.name}</strong>
              </p>
            </div>

            {/* Session summary */}
            <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {event.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString("en-CA", {
                          dateStyle: "full",
                          timeZone: "America/Toronto",
                        })
                      : "Date to be confirmed"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <p className="text-muted-foreground text-sm">{sessionTime}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <p className="text-muted-foreground text-sm">
                  {event.location}
                </p>
              </div>
            </div>

            {/* What to bring */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 mb-4">
              <p className="text-amber-400 text-xs font-semibold   mb-2">
                What to bring
              </p>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• Your laptop, tablet, or smartphone</li>
                <li>• Any questions you've been wanting to ask</li>
                <li>• A notepad (optional — we'll have handouts)</li>
              </ul>
            </div>

            {/* Contact hint */}
            <p className="text-muted-foreground text-xs text-center mb-4">
              Questions? Email us at{" "}
              <a
                href="mailto:info@digitalguards.ca"
                className="text-primary hover:underline"
              >
                info@digitalguards.ca
              </a>
            </p>

            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <SlotBadge slot={event.sessionSlot} />
              <h3 className="text-lg font-medium text-foreground mt-3 mb-1">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString("en-CA", {
                        dateStyle: "full",
                        timeZone: "America/Toronto",
                      })
                    : "Date to be confirmed"}{" "}
                  · {sessionTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{event.location}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="calendar-name-1"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Full Name *
                </label>
                <Input
                  id="calendar-name-1"
                  minLength={2}
                  maxLength={255}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label
                  htmlFor="calendar-email-1"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Email Address *
                </label>
                <Input
                  id="calendar-email-1"
                  type="email"
                  value={form.email}
                  onChange={e =>
                    setForm(f => ({ ...f, email: e.target.value }))
                  }
                  placeholder="your@email.com"
                  required
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label
                  htmlFor="calendar-phone-1"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Phone Number (optional)
                </label>
                <Input
                  id="calendar-phone-1"
                  maxLength={30}
                  type="tel"
                  value={form.phone}
                  onChange={e =>
                    setForm(f => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="705-555-0100"
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label
                  htmlFor="calendar-notes-1"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Questions or special needs (optional)
                </label>
                <Textarea
                  id="calendar-notes-1"
                  maxLength={1000}
                  value={form.notes}
                  onChange={e =>
                    setForm(f => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Anything we should know to help you better?"
                  rows={3}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11"
                disabled={
                  signUp.isPending || !form.name.trim() || !form.email.trim()
                }
              >
                {signUp.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  "Reserve My Spot — It's Free"
                )}
              </Button>
              {signupError && (
                <p role="alert" className="notice notice-error">
                  {signupError}
                </p>
              )}
              <p className="text-xs text-muted-foreground text-center">
                Free of charge · No login required
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Confirmed Event Card ─────────────────────────────────────────────────────
function ConfirmedEventCard({ event }: { event: EventRow }) {
  const [showModal, setShowModal] = useState(false);
  const { data: signupData } = trpc.calendar.getSignupCount.useQuery({
    eventId: event.id,
  });
  const spotsLeft =
    event.capacity && signupData ? event.capacity - signupData.count : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const startTime = event.eventDate ? formatTime(event.eventDate) : "";
  const endTime = event.eventEndDate ? formatTime(event.eventEndDate) : "";

  return (
    <>
      <div className="relative rounded-2xl border border-primary/30 bg-primary/5 p-6 hover:border-primary/50 hover:bg-primary/8 transition-colors duration-300">
        <div className="flex items-start justify-between gap-3 mb-4">
          <SlotBadge slot={event.sessionSlot} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        </div>

        <h3 className="text-lg font-medium text-foreground mb-2 leading-snug">
          {event.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5">
          {event.description}
        </p>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <span>
              {event.eventDate
                ? new Date(event.eventDate).toLocaleDateString("en-CA", {
                    dateStyle: "full",
                    timeZone: "America/Toronto",
                  })
                : "Date to be confirmed"}
              <br />
              {startTime}
              {endTime ? ` – ${endTime}` : ""} (Eastern Time)
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <TypeBadge type={event.eventType} />
          </div>
          {event.capacity && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <span>
                {isFull ? (
                  <span className="text-red-400">
                    Session full — contact us about a waitlist
                  </span>
                ) : spotsLeft !== null ? (
                  <span
                    className={
                      spotsLeft <= 5 ? "text-amber-400 font-semibold" : ""
                    }
                  >
                    {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
                  </span>
                ) : (
                  <span>Limited to {event.capacity} participants</span>
                )}
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={() => setShowModal(true)}
          disabled={isFull}
          className="w-full"
          variant={isFull ? "outline" : "default"}
        >
          {isFull ? "Session Full" : "Register for Free →"}
        </Button>
      </div>

      {showModal && (
        <SignUpModal event={event} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

// ─── TBD Event Card ───────────────────────────────────────────────────────────
function TBDEventCard({ event }: { event: EventRow }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6  transition-opacity duration-300">
      <div className="flex items-start justify-between gap-3 mb-4">
        <SlotBadge slot={event.sessionSlot} />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-card px-2.5 py-1 rounded-full border border-border">
          <AlertCircle className="w-3 h-3" /> Date TBD
        </span>
      </div>

      <h3 className="text-base font-medium text-muted-foreground mb-2 leading-snug">
        {event.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {event.description}
      </p>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{event.location}</span>
        </div>
        {event.capacity && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Up to {event.capacity} participants</span>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Date not yet confirmed — check back soon or request a personal session
        below.
      </p>
    </div>
  );
}

// ─── Training Request Form ────────────────────────────────────────────────────
function TrainingRequestForm() {
  const [trainingError, setTrainingError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topics: [] as string[],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const topicOptions = [
    "Recognizing Scams",
    "Password Safety",
    "Safe Browsing",
    "Email Security",
    "Social Media Privacy",
    "Online Banking",
    "Video Calls (Zoom/FaceTime)",
    "Smartphone Basics",
  ];

  const requestTraining = trpc.calendar.requestTraining.useMutation({
    onSuccess: data => setSubmitted(data.success === true),
    onError: err => setTrainingError(err.message),
  });

  const toggleTopic = (topic: string) => {
    setForm(f => ({
      ...f,
      topics: f.topics.includes(topic)
        ? f.topics.filter(t => t !== topic)
        : [...f.topics, topic],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setTrainingError(null);
    requestTraining.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      topics: form.topics.length > 0 ? form.topics.join(", ") : undefined,
      message: form.message.trim() || undefined,
    });
  };

  return (
    <section id="request-training" className="pb-24">
      <div className="container">
        <AnimatedSection className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-medium text-2xl md:text-3xl text-foreground mb-3">
              Request a Personal Training Session
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Fill out the form below and we'll contact you to schedule a free
              one-on-one session at a time that works for you.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 rounded-2xl border border-primary/20 bg-primary/5">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">
                Request received
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Thank you,{" "}
                <strong className="text-foreground">{form.name}</strong>. We'll
                reach out to you at{" "}
                <strong className="text-foreground">{form.email}</strong> to
                discuss scheduling your session.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="calendar-name-2"
                    className="block text-sm font-medium text-muted-foreground mb-1.5"
                  >
                    Full Name *
                  </label>
                  <Input
                    id="calendar-name-2"
                    minLength={2}
                    maxLength={255}
                    value={form.name}
                    onChange={e =>
                      setForm(f => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your full name"
                    required
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label
                    htmlFor="calendar-email-2"
                    className="block text-sm font-medium text-muted-foreground mb-1.5"
                  >
                    Email Address *
                  </label>
                  <Input
                    id="calendar-email-2"
                    type="email"
                    value={form.email}
                    onChange={e =>
                      setForm(f => ({ ...f, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    required
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="calendar-phone-2"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Phone Number (optional)
                </label>
                <Input
                  id="calendar-phone-2"
                  maxLength={30}
                  type="tel"
                  value={form.phone}
                  onChange={e =>
                    setForm(f => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="705-555-0100"
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Topics you'd like help with (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {topicOptions.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      aria-pressed={form.topics.includes(topic)}
                      className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                        form.topics.includes(topic)
                          ? "bg-primary/20 border-primary/40 text-primary"
                          : "bg-card border-border text-muted-foreground hover:border-border hover:text-muted-foreground"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="calendar-message-1"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Additional message (optional)
                </label>
                <Textarea
                  id="calendar-message-1"
                  maxLength={2000}
                  value={form.message}
                  onChange={e =>
                    setForm(f => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Tell us anything else that would help us prepare for your session..."
                  rows={4}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={
                  requestTraining.isPending ||
                  !form.name.trim() ||
                  !form.email.trim()
                }
              >
                {requestTraining.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Request My Free Session"
                )}
              </Button>

              {trainingError && (
                <p role="alert" className="notice notice-error">
                  {trainingError}
                </p>
              )}
              <p className="text-xs text-muted-foreground text-center">
                Free of charge · Peterborough, Ontario
              </p>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Main Calendar Page ───────────────────────────────────────────────────────
export default function CalendarPage() {
  const {
    data: allEvents,
    isLoading,
    isError,
  } = trpc.calendar.listUpcoming.useQuery(undefined, { enabled: !IS_STATIC_PREVIEW });

  const confirmedEvents = allEvents?.filter(e => e.dateConfirmed) ?? [];
  const tbdEvents = allEvents?.filter(e => !e.dateConfirmed) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Events & Training Sessions"
        description="Join Digital Guardians for free in-person digital safety training sessions in Peterborough, Ontario. Browse available workshops or request a personal session."
        keywords="digital safety training Peterborough, seniors cybersecurity workshop Ontario, free computer training seniors"
        canonicalPath="/calendar"
      />
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* ─── Hero ─── */}
        <section className="py-20 md:py-28">
          <div className="container">
            <AnimatedSection className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 mb-6">
                <CalendarDays className="w-3.5 h-3.5" />
                Events &amp; Training Sessions
              </div>
              <h1 className="font-display font-medium text-4xl md:text-5xl  text-foreground leading-tight mb-4">
                Learn Together,{" "}
                <span className="text-primary">Stay Safe Together</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-6">
                Join us for free in-person training sessions in Peterborough,
                Ontario. Our friendly instructors will guide you through staying
                safe online — no experience needed.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" /> Free of
                  charge
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" /> Open to all
                  seniors
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" /> Peterborough,
                  Ontario
                </span>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── Confirmed Sessions (June 22) ─── */}
        <section className="pb-16">
          <div className="container">
            <AnimatedSection className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary " />
                <span className="text-primary text-sm font-semibold  ">
                  Upcoming — Confirmed
                </span>
              </div>
              <h2 className="font-display font-medium text-2xl md:text-3xl text-foreground">
                Confirmed workshops
              </h2>
              <p className="text-muted-foreground mt-1">
                Choose a session that works for you. Dates are shown with each
                workshop.
              </p>
            </AnimatedSection>

            {IS_STATIC_PREVIEW ? (
              <div className="notice" role="note">
                This is a static design preview, not a live availability calendar. For current workshops, email <a className="text-link" href="mailto:info@digitalguards.ca">info@digitalguards.ca</a> or call <a className="text-link" href="tel:+17057725140">+1 (705) 772-5140</a>. No registration has been submitted.
              </div>
            ) : isError ? (
              <div role="alert" className="notice notice-error">
                We could not load the workshop calendar. Please try again later
                or contact info@digitalguards.ca. No availability has been
                confirmed.
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-6  h-72"
                  />
                ))}
              </div>
            ) : confirmedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {confirmedEvents.map(event => (
                  <AnimatedSection key={event.id}>
                    <ConfirmedEventCard event={event as EventRow} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
                No confirmed sessions yet — check back soon.
              </div>
            )}
          </div>
        </section>

        {/* ─── TBD Events ─── */}
        {tbdEvents.length > 0 && (
          <section className="pb-16">
            <div className="container">
              <AnimatedSection className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-card" />
                  <span className="text-muted-foreground text-sm font-semibold  ">
                    Coming Soon — Dates Not Yet Confirmed
                  </span>
                </div>
                <h2 className="font-display font-medium text-xl md:text-2xl text-muted-foreground">
                  More Sessions Planned
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  These sessions are in planning. Dates will be announced soon —
                  check back or contact us to be notified.
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tbdEvents.map((event, i) => (
                  <AnimatedSection key={event.id} delay={i * 0.08}>
                    <TBDEventCard event={event as EventRow} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Divider ─── */}
        <div className="container">
          <div className="border-t border-border mb-16" />
        </div>

        {/* ─── Contact CTA ─── */}
        <section className="pb-16">
          <div className="container">
            <AnimatedSection>
              <div className="rounded-2xl border border-border bg-card p-8 md:p-12 max-w-3xl mx-auto text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-display font-medium text-2xl md:text-3xl text-foreground mb-3">
                  Can't Make It to a Group Session?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
                  We offer free personal one-on-one training sessions tailored
                  to your needs and pace. Reach out directly or fill out the
                  request form below.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="mailto:info@digitalguards.ca">
                    <Button
                      variant="outline"
                      className="gap-2 bg-card border-border text-foreground hover:bg-card"
                    >
                      <Mail className="w-4 h-4" />
                      info@digitalguards.ca
                    </Button>
                  </a>
                  <a href="tel:+17057725140">
                    <Button
                      variant="outline"
                      className="gap-2 bg-card border-border text-foreground hover:bg-card"
                    >
                      <Phone className="w-4 h-4" />
                      705-772-5140
                    </Button>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── Training Request Form ─── */}
        {!IS_STATIC_PREVIEW && <TrainingRequestForm />}
      </main>

      <Footer />
    </div>
  );
}
