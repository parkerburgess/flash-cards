"use client";

import { useState } from "react";
import CardClueSide from "./CardClueSide";
import CardAnswerSide from "./CardAnswerSide";
import type { Card } from "@/types";

interface Props {
  card: Card;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  onSkip?: () => void;
  showControls?: boolean;
}
 
export default function FlashCard({ card, onCorrect, onIncorrect, onSkip, showControls = false }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full">
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "220px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white border-2 border-indigo-200 rounded-xl shadow-md flex items-center justify-center p-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardClueSide card={card} />
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 bg-indigo-50 border-2 border-indigo-400 rounded-xl shadow-md flex items-center justify-center p-6"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <CardAnswerSide card={card} />
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-2">Click card to flip</p>

      {showControls && flipped && (
        <div className="flex gap-3 justify-center mt-4">
          {onCorrect && (
            <button
              onClick={onCorrect}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Correct
            </button>
          )}
          {onIncorrect && (
            <button
              onClick={onIncorrect}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
            >
              Incorrect
            </button>
          )}
          {onSkip && (
            <button
              onClick={onSkip}
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 text-sm font-medium"
            >
              Skip
            </button>
          )}
        </div>
      )}
    </div>
  );
}
