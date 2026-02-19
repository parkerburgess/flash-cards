"use client";

import { useState, useRef, useEffect } from "react";
import type { Card } from "@/types";

interface Props {
  card: Card;
  onSubmit: (value: string) => void;
  onSkip: () => void;
}

export default function TestCardClue({ card, onSubmit, onSkip }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    inputRef.current?.focus();
  }, [card.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <div className="space-y-4">
      {/* Clue display */}
      <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 min-h-[140px] flex items-center justify-center text-center">
        {card.clueType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.clue} alt="clue" className="max-h-40 object-contain rounded" />
        ) : (
          <p className="text-xl font-semibold text-gray-800">{card.clue}</p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your answer…"
          className="w-full border-2 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setValue("")}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}
