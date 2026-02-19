"use client";

import type { CardResult } from "@/types";

interface Props {
  results: CardResult[];
  total: number;
  onRestart: () => void;
}

export default function MockTestResults({ results, total, onRestart }: Props) {
  const correct = results.filter((r) => r.status === "correct").length;
  const incorrect = results.filter((r) => r.status === "incorrect").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="max-w-md mx-auto text-center py-8">
      <div className="text-5xl font-bold mb-2 text-indigo-700">{pct}%</div>
      <p className="text-gray-500 mb-6">Practice score (not saved)</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-700">{correct}</p>
          <p className="text-xs text-green-600 mt-1">Correct</p>
        </div>
        <div className="bg-red-100 rounded-lg p-4">
          <p className="text-2xl font-bold text-red-600">{incorrect}</p>
          <p className="text-xs text-red-500 mt-1">Incorrect</p>
        </div>
        <div className="bg-yellow-100 rounded-lg p-4">
          <p className="text-2xl font-bold text-yellow-600">{skipped}</p>
          <p className="text-xs text-yellow-500 mt-1">Skipped</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 font-medium"
      >
        Try Again
      </button>
    </div>
  );
}
