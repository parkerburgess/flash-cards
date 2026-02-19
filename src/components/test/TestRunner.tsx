"use client";

import { useState } from "react";
import type { Card, CardResult, CardResultStatus, TestMode, TestResult } from "@/types";
import TestCardClue from "./TestCardClue";
import TestCardAnswer from "./TestCardAnswer";
import TestResults from "./TestResults";
import { shuffle } from "@/lib/utils/shuffle";
import { calcCountModeScore, calcSurvivalScore } from "@/lib/utils/scoring";

type Phase = "clue" | "answer";

interface Props {
  cards: Card[];
  categoryId: string;
  mode: TestMode;
  count: number | null; // null = all
  incorrectsAllowed: number;
  onReset: () => void;
}

export default function TestRunner({
  cards,
  categoryId,
  mode,
  count,
  incorrectsAllowed,
  onReset,
}: Props) {
  const totalCards = count ?? cards.length;
  const [sessionCards] = useState<Card[]>(() =>
    shuffle(cards).slice(0, totalCards)
  );
  const [cardIndex, setCardIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("clue");
  const [lastSubmission, setLastSubmission] = useState("");
  const [lastStatus, setLastStatus] = useState<CardResultStatus>("skipped");
  const [results, setResults] = useState<CardResult[]>([]);
  const [savedResult, setSavedResult] = useState<TestResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const currentCard = sessionCards[cardIndex];

  const isTerminated = (() => {
    if (mode !== "survival") return false;
    const nonCorrect = results.filter((r) => r.status !== "correct").length;
    return nonCorrect >= incorrectsAllowed;
  })();

  const isFinished = savedResult !== null || isTerminated || cardIndex >= sessionCards.length;

  const gradeAnswer = (submission: string): CardResultStatus => {
    if (!submission.trim()) return "skipped";
    const correct = currentCard.answer.trim().toLowerCase();
    const given = submission.trim().toLowerCase();
    return given === correct ? "correct" : "incorrect";
  };

  const handleSubmit = (submission: string) => {
    const status = gradeAnswer(submission);
    setLastSubmission(submission);
    setLastStatus(status);
    setPhase("answer");
    setResults((r) => [...r, { cardId: currentCard.id, submission, status }]);
  };

  const handleSkip = () => {
    setLastSubmission("");
    setLastStatus("skipped");
    setPhase("answer");
    setResults((r) => [...r, { cardId: currentCard.id, submission: "", status: "skipped" }]);
  };

  const handleNext = async () => {
    const newCardIndex = cardIndex + 1;
    const newResults = results; // already updated in handleSubmit/handleSkip
    const newNonCorrect = newResults.filter((r) => r.status !== "correct").length;

    const survivalDone = mode === "survival" && newNonCorrect >= incorrectsAllowed;
    const countDone = mode === "count" && newCardIndex >= sessionCards.length;

    if (survivalDone || countDone) {
      // Save result
      setSaving(true);
      const score =
        mode === "count"
          ? calcCountModeScore(newResults)
          : calcSurvivalScore(newResults);
      try {
        const res = await fetch("/api/test-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId, mode, score, cardResults: newResults }),
        });
        const json = await res.json();
        if (json.error) { setSaveError(json.error); }
        else { setSavedResult(json.data); }
      } catch (e) {
        setSaveError("Failed to save result");
      } finally {
        setSaving(false);
      }
    } else {
      setCardIndex(newCardIndex);
      setPhase("clue");
    }
  };

  // Finished
  if (isFinished) {
    if (saving) return <p className="text-center text-gray-500 py-8">Saving result…</p>;
    if (saveError) return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{saveError}</p>
        <button onClick={onReset} className="border px-4 py-2 rounded hover:bg-gray-100">
          Back to Setup
        </button>
      </div>
    );
    if (savedResult) return <TestResults result={savedResult} onRetake={onReset} />;
    return null;
  }

  const nonCorrect = results.filter((r) => r.status !== "correct").length;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
        <span>Card {cardIndex + 1} of {sessionCards.length}</span>
        {mode === "survival" && (
          <span className="text-red-500 font-medium">
            {incorrectsAllowed - nonCorrect} strikes left
          </span>
        )}
        {mode === "count" && (
          <span className="text-green-600 font-medium">
            {results.filter((r) => r.status === "correct").length} ✓
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${(cardIndex / sessionCards.length) * 100}%` }}
        />
      </div>

      {phase === "clue" ? (
        <TestCardClue card={currentCard} onSubmit={handleSubmit} onSkip={handleSkip} />
      ) : (
        <TestCardAnswer
          card={currentCard}
          submission={lastSubmission}
          status={lastStatus}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
