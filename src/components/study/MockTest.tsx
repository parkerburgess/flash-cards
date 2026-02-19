"use client";

import { useState, useMemo } from "react";
import type { Card, CardResult } from "@/types";
import FlashCard from "@/components/cards/FlashCard";
import MockTestResults from "./MockTestResults";
import CardCountPicker from "./CardCountPicker";
import { shuffle } from "@/lib/utils/shuffle";

interface Props {
  cards: Card[];
}

export default function MockTest({ cards }: Props) {
  const [count, setCount] = useState(Math.min(10, cards.length));
  const [sessionCards, setSessionCards] = useState<Card[] | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [results, setResults] = useState<CardResult[]>([]);

  const started = sessionCards !== null;
  const finished = started && cardIndex >= (sessionCards?.length ?? 0);

  const startSession = () => {
    const picked = shuffle(cards).slice(0, count);
    setSessionCards(picked);
    setCardIndex(0);
    setResults([]);
  };

  const handleResult = (status: CardResult["status"]) => {
    if (!sessionCards) return;
    const card = sessionCards[cardIndex];
    setResults((r) => [...r, { cardId: card.id, submission: "", status }]);
    setCardIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setSessionCards(null);
    setCardIndex(0);
    setResults([]);
  };

  // Setup screen
  if (!started) {
    return (
      <div className="space-y-4">
        <CardCountPicker max={cards.length} value={count} onChange={setCount} />
        <button
          onClick={startSession}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
        >
          Start Mock Test
        </button>
      </div>
    );
  }

  // Results screen
  if (finished) {
    return (
      <MockTestResults
        results={results}
        total={sessionCards?.length ?? 0}
        onRestart={handleRestart}
      />
    );
  }

  const current = sessionCards![cardIndex];
  const correct = results.filter((r) => r.status === "correct").length;
  const incorrect = results.filter((r) => r.status === "incorrect").length;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
        <span>Card {cardIndex + 1} of {sessionCards!.length}</span>
        <span className="text-green-600 font-medium">{correct} ✓</span>
        <span className="text-red-500 font-medium">{incorrect} ✗</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${(cardIndex / sessionCards!.length) * 100}%` }}
        />
      </div>

      <FlashCard
        key={current.id}
        card={current}
        showControls
        onCorrect={() => handleResult("correct")}
        onIncorrect={() => handleResult("incorrect")}
        onSkip={() => handleResult("skipped")}
      />
    </div>
  );
}
