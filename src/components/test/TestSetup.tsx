"use client";

import { useState } from "react";
import type { Category, TestMode } from "@/types";

interface Props {
  categories: Category[];
  cardCounts: Record<string, number>; // categoryId -> count
  onStart: (categoryId: string, mode: TestMode, count: number | null, incorrectsAllowed: number) => void;
}

export default function TestSetup({ categories, cardCounts, onStart }: Props) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [mode, setMode] = useState<TestMode>("count");
  const [useAll, setUseAll] = useState(true);
  const [count, setCount] = useState(10);
  const [incorrectsAllowed, setIncorrectsAllowed] = useState(3);

  const maxCards = cardCounts[categoryId] ?? 0;

  const handleStart = () => {
    if (!categoryId) return;
    onStart(categoryId, mode, useAll ? null : count, incorrectsAllowed);
  };

  return (
    <div className="max-w-sm space-y-5">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({cardCounts[c.id] ?? 0} cards)
            </option>
          ))}
        </select>
      </div>

      {/* Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
        <div className="flex gap-4">
          {(["count", "survival"] as TestMode[]).map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="mode"
                value={m}
                checked={mode === m}
                onChange={() => setMode(m)}
              />
              <span className="capitalize">{m}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {mode === "count"
            ? "Answer all cards. Score = % correct."
            : "Survive as long as possible. End when incorrect limit reached."}
        </p>
      </div>

      {/* Count mode: number of cards */}
      {mode === "count" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cards</label>
          <label className="flex items-center gap-2 text-sm cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={useAll}
              onChange={(e) => setUseAll(e.target.checked)}
            />
            All ({maxCards} cards)
          </label>
          {!useAll && (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={maxCards}
                value={Math.min(count, maxCards)}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm font-medium">{Math.min(count, maxCards)}</span>
            </div>
          )}
        </div>
      )}

      {/* Survival mode: incorrects allowed */}
      {mode === "survival" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incorrects allowed before end
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={10}
              value={incorrectsAllowed}
              onChange={(e) => setIncorrectsAllowed(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm font-medium">{incorrectsAllowed}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={!categoryId || maxCards === 0}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
      >
        Start Test
      </button>
    </div>
  );
}
