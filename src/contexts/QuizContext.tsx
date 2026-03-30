/*
 * QuizContext — Tracks interactive quiz scores across a guide page.
 * Provides score tracking, answer recording, and completion state.
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

interface QuizContextType {
  answers: Record<string, QuizAnswer>;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercentage: number;
  isComplete: boolean;
  submitAnswer: (questionId: string, selectedIndex: number, correctIndex: number) => void;
  resetQuiz: () => void;
  registerQuestion: (questionId: string) => void;
  registeredQuestions: Set<string>;
}

const QuizContext = createContext<QuizContextType | null>(null);

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within a QuizProvider");
  return ctx;
}

export function QuizProvider({
  children,
  totalExpected,
}: {
  children: ReactNode;
  totalExpected: number;
}) {
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [registeredQuestions, setRegisteredQuestions] = useState<Set<string>>(new Set());

  const registerQuestion = useCallback((questionId: string) => {
    setRegisteredQuestions((prev) => {
      if (prev.has(questionId)) return prev;
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
  }, []);

  const submitAnswer = useCallback(
    (questionId: string, selectedIndex: number, correctIndex: number) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          questionId,
          selectedIndex,
          correctIndex,
          isCorrect: selectedIndex === correctIndex,
        },
      }));
    },
    []
  );

  const resetQuiz = useCallback(() => {
    setAnswers({});
  }, []);

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const totalQuestions = totalExpected;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isComplete = answeredCount >= totalQuestions;

  return (
    <QuizContext.Provider
      value={{
        answers,
        totalQuestions,
        answeredCount,
        correctCount,
        scorePercentage,
        isComplete,
        submitAnswer,
        resetQuiz,
        registerQuestion,
        registeredQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
