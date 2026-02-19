"use client";

import type { Card, TestResult } from "@/types";

interface MissedEntry {
  card: Card;
  missCount: number;
}

interface Props {
  results: TestResult[];
  cards: Card[];
}

export default function MissedCardsList({ results, cards }: Props) {
  // Aggregate miss counts
  const missMap: Record<number, number> = {};
  for (const result of results) {
    for (const cr of result.cardResults) {
      if (cr.status !== "correct") {
        missMap[cr.cardId] = (missMap[cr.cardId] ?? 0) + 1;
      }
    }
  }

  const top5: MissedEntry[] = Object.entries(missMap)
    .map(([cardId, missCount]) => ({
      card: cards.find((c) => c.id === Number(cardId))!,
      missCount,
    }))
    .filter((e) => e.card)
    .sort((a, b) => b.missCount - a.missCount)
    .slice(0, 5);

  if (top5.length === 0) {
    return <p className="text-gray-400 italic text-sm">No missed cards yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {top5.map(({ card, missCount }) => (
        <li key={card.id} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {card.clueType === "image" ? "[Image card]" : card.clue}
            </p>
            <p className="text-xs text-gray-500">Answer: {card.answer}</p>
          </div>
          <span className="text-sm font-bold text-red-600 ml-4 flex-shrink-0">
            {missCount}× missed
          </span>
        </li>
      ))}
    </ul>
  );
}
