import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
interface ArticleLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tableOfContents: { id: string; label: string }[];
  children: ReactNode;
}
export default function ArticleLayout({
  title,
  subtitle,
  readTime,
  difficulty,
  tableOfContents,
  children,
}: ArticleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <header className="page-heading">
          <div className="container">
            <Link
              href="/#learn"
              className="text-link inline-flex gap-2 items-center"
            >
              <ArrowLeft size={18} />
              Back to learning guides
            </Link>
            <p className="eyebrow mt-8">
              {difficulty} · {readTime}
            </p>
            <h1>{title}</h1>
            <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
          </div>
        </header>
        <section className="section">
          <div className="container reading-layout">
            <div className="article-content">{children}</div>
            <aside>
              <div className="lg:sticky lg:top-28">
                <nav aria-label="In this guide" className="panel">
                  <h2 className="text-lg mb-4">In this guide</h2>
                  <ol className="numbered-list">
                    {tableOfContents.map((item, i) => (
                      <li key={item.id}>
                        <span className="step-number">{i + 1}</span>
                        <a className="text-link text-sm" href={`#${item.id}`}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <div className="panel mt-6">
                  <h2 className="text-lg mb-3">Need a little help?</h2>
                  <p className="text-muted-foreground mb-4">
                    The helper can suggest next steps for a suspicious message
                    or everyday technology question.
                  </p>
                  <Link href="/#analyzer" className="text-link">
                    Try the helper
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
export function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-28">
      <h2 className="text-2xl mb-6 border-t border-border pt-6">{title}</h2>
      {children}
    </section>
  );
}
export function ArticleParagraph({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground mb-5">{children}</p>;
}
export function ArticleTip({
  title,
  children,
  variant = "tip",
}: {
  title: string;
  children: ReactNode;
  variant?: "tip" | "warning" | "important";
}) {
  return (
    <div className={`notice ${variant === "warning" ? "notice-warning" : ""}`}>
      <h3 className="mb-3 text-lg">{title}</h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
export function ArticleCard({
  title,
  children,
  icon: Icon,
}: {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="panel mb-5">
      <h3 className="mb-3 flex gap-2 items-center">
        {Icon && <Icon size={18} strokeWidth={1.5} />} {title}
      </h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
export function ArticleStepList({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  return (
    <ol className="numbered-list mb-6">
      {steps.map((step, i) => (
        <li key={step.title}>
          <span className="step-number">{i + 1}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export function ArticleQuiz({
  question,
  options,
  correctIndex,
  explanation,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}) {
  return (
    <div className="panel mb-6">
      <h3 className="mb-4">Quick check: {question}</h3>
      <ol className="list-[upper-alpha] pl-6">
        {options.map((option, i) => (
          <li key={option} className="mb-3">
            {option}
            {i === correctIndex && (
              <span className="text-primary"> — Correct answer</span>
            )}
          </li>
        ))}
      </ol>
      <p className="text-muted-foreground mt-5">Why? {explanation}</p>
    </div>
  );
}
