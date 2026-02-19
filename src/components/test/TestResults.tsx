"use client";

import type { CardResult, TestMode, TestResult } from "@/types";
import Link from "next/link";

interface Props {
  result: TestResult;
  onRetake: () => void;
}

export default function TestResults({ result, onRetake }: Props) {
  const correct = result.cardResults.filter((r) => r.status === "correct").length;
  const incorrect = result.cardResults.filter((r) => r.status === "incorrect").length;
  const skipped = result.cardResults.filter((r) => r.status === "skipped").length;

  return (
    <div className="max-w-md mx-auto text-center py-8">
      <div className="text-5xl font-bold mb-2 text-indigo-700">
        {result.mode === "count" ? `${result.score}%` : result.score}
      </div>
      <p className="text-gray-500 mb-1">
        {result.mode === "count" ? "Score (saved)" : "Correct cards before end (saved)"}
      </p>
      <p className="text-xs text-gray-400 mb-6">
        Mode: {result.mode} · {new Date(result.timestamp).toLocaleString()}
      </p>

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

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetake}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
        >
          Retake
        </button>
        <Link
          href="/report"
          className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 font-medium"
        >
          View Report
        </Link>
      </div>
    </div>
  );
}
