"use client";

import { useEffect, useRef } from "react";
import CardForm from "@/components/manage/CardForm";
import type { Card, Category } from "@/types";

interface Props {
  card: Card;
  categories: Category[];
  onSaved: () => void;
  onClose: () => void;
}

export default function CardEditPopup({ card, categories, onSaved, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-gray-900">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <CardForm
            categories={categories}
            defaultCategoryId={card.categoryId}
            editCard={card}
            onSaved={onSaved}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
