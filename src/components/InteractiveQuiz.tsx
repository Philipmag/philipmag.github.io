/*
 * InteractiveQuiz — Clickable quiz component with scoring for Learning Center guides.
 * Replaces the static ArticleQuiz with real interactivity.
 */

import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Star,
  Target,
} from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

interface InteractiveQuizProps {
  questionId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function InteractiveQuiz({
  questionId,
  question,
  options,
  correctIndex,
  explanation,
}: InteractiveQuizProps) {
  const { answers, submitAnswer, registerQuestion } = useQuiz();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const existingAnswer = answers[questionId];

  useEffect(() => {
    registerQuestion(questionId);
  }, [questionId, registerQuestion]);

  useEffect(() => {
    if (existingAnswer) {
      setSelectedIndex(existingAnswer.selectedIndex);
      setRevealed(true);
    } else {
      setSelectedIndex(null);
      setRevealed(false);
    }
  }, [existingAnswer]);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null || revealed) return;
    submitAnswer(questionId, selectedIndex, correctIndex);
    setRevealed(true);
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <div className="p-6 rounded-xl border border-border bg-primary/5 mb-6">
      <p className="font-display font-medium text-sm text-foreground mb-4">
        <span className="text-primary mr-1.5">Q.</span> {question}
      </p>

      <div className="space-y-2 mb-4">
        {options.map((opt, i) => {
          let borderClass = "border-border/30 bg-card/50";
          let textClass = "text-muted-foreground";
          let cursorClass =
            "cursor-pointer hover:border-primary/30 hover:bg-primary/5";

          if (revealed) {
            cursorClass = "cursor-default";
            if (i === correctIndex) {
              borderClass = "border-primary/40 bg-primary/10";
              textClass = "text-foreground";
            } else if (i === selectedIndex && i !== correctIndex) {
              borderClass = "border-red-500/40 bg-red-500/10";
              textClass = "text-foreground";
            } else {
              borderClass = "border-border/20 bg-card/30";
              textClass = "text-muted-foreground/60";
            }
          } else if (selectedIndex === i) {
            borderClass = "border-primary/40 bg-primary/10";
            textClass = "text-foreground";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              aria-pressed={selectedIndex === i}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-colors duration-200 ${borderClass} ${textClass} ${cursorClass}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`font-mono text-xs mr-2 ${selectedIndex === i && !revealed ? "text-primary" : "text-primary/60"}`}
                  >
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </div>
                {revealed && i === correctIndex && (
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 ml-2" />
                )}
                {revealed && i === selectedIndex && i !== correctIndex && (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!revealed && (
        <Button
          onClick={handleSubmit}
          disabled={selectedIndex === null}
          size="sm"
          className="gap-2 rounded-lg"
        >
          <Target className="w-3.5 h-3.5" />
          Submit Answer
        </Button>
      )}

      <>
        {revealed && (
          <div
            role="status"
            className={`mt-4 p-4 rounded-lg border ${
              isCorrect
                ? "border-primary/30 bg-primary/5"
                : "border-amber-500/30 bg-amber-500/5"
            }`}
          >
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              )}
              <div>
                <p
                  className={`text-sm font-semibold mb-1 ${isCorrect ? "text-primary" : "text-amber-400"}`}
                >
                  {isCorrect ? "Correct" : "Not quite — let’s review it"}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

/* ─── Quiz Scoreboard — Shows at the end of the quiz section ─── */

export function QuizScoreboard() {
  const {
    answeredCount,
    correctCount,
    totalQuestions,
    scorePercentage,
    isComplete,
    resetQuiz,
  } = useQuiz();

  const getMessage = () => {
    if (!isComplete) return null;
    if (scorePercentage === 100)
      return {
        text: "You answered every practice question correctly. Keep using these habits.",
        icon: Trophy,
        color: "text-primary",
      };
    if (scorePercentage >= 75)
      return {
        text: "Good work. You have a strong understanding of this topic.",
        icon: Star,
        color: "text-primary",
      };
    if (scorePercentage >= 50)
      return {
        text: "Good effort. Review the sections above to strengthen your knowledge.",
        icon: Star,
        color: "text-amber-400",
      };
    return {
      text: "Keep practising. Re-read the guide and try again — practice makes perfect.",
      icon: Target,
      color: "text-amber-400",
    };
  };

  const message = getMessage();

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card  mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-medium text-base text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Your Score
        </h3>
        {isComplete && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetQuiz}
            className="gap-1.5 text-xs rounded-lg"
          >
            <RotateCcw className="w-3 h-3" />
            Try Again
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            {answeredCount} of {totalQuestions} answered
          </span>
          <span className="font-mono font-medium text-primary">
            {correctCount}/{totalQuestions} correct
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-border/30 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Score display */}
      {isComplete && (
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-center">
              <p className="font-mono font-medium text-3xl text-primary">
                {scorePercentage}%
              </p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          {message && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
              <message.icon
                className={`w-4 h-4 ${message.color} mt-0.5 shrink-0`}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {message.text}
              </p>
            </div>
          )}
        </div>
      )}

      {!isComplete && (
        <p className="text-xs text-muted-foreground">
          Answer all questions above to see your final score.
        </p>
      )}
    </div>
  );
}
