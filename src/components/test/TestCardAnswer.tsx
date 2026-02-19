"use client";

import type { Card, CardResultStatus } from "@/types";

interface Props {
  card: Card;
  submission: string;
  status: CardResultStatus;
  onNext: () => void;
}

const borderColors: Record<CardResultStatus, string> = {
  correct: "border-green-500",
  incorrect: "border-red-500",
  skipped: "border-yellow-400",
};

const bgColors: Record<CardResultStatus, string> = {
  correct: "bg-green-50",
  incorrect: "bg-red-50",
  skipped: "bg-yellow-50",
};

const labels: Record<CardResultStatus, string> = {
  correct: "Correct!",
  incorrect: "Incorrect",
  skipped: "Skipped",
};

const labelColors: Record<CardResultStatus, string> = {
  correct: "text-green-700",
  incorrect: "text-red-600",
  skipped: "text-yellow-600",
};

export default function TestCardAnswer({ card, submission, status, onNext }: Props) {
  return (
    <div className="space-y-4">
      <div className={`border-2 ${borderColors[status]} ${bgColors[status]} rounded-xl p-6 min-h-[140px] flex flex-col items-center justify-center text-center`}>
        <p className={`text-xs uppercase tracking-widest font-bold mb-2 ${labelColors[status]}`}>
          {labels[status]}
        </p>
        {submission && status !== "skipped" && (
          <p className="text-sm text-gray-500 mb-2">Your answer: <em>{submission}</em></p>
        )}
        <p className="text-lg font-bold text-gray-800">
          Correct answer: <span className="text-indigo-700">{card.answer}</span>
        </p>
      </div>
      <button
        onClick={onNext}
        autoFocus
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
      >
        Next Card →
      </button>
    </div>
  );
}
