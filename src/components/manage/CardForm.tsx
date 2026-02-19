"use client";

import { useState, useEffect } from "react";
import type { Card, Category, ClueType } from "@/types";
import ClueInput from "./ClueInput";

interface Props {
  categories: Category[];
  defaultCategoryId: string;
  editCard?: Card | null;
  onSaved: () => void;
  onCancel?: () => void;
}

export default function CardForm({
  categories,
  defaultCategoryId,
  editCard,
  onSaved,
  onCancel,
}: Props) {
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [clueType, setClueType] = useState<ClueType>("text");
  const [clue, setClue] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [clueError, setClueError] = useState("");

  const isEdit = Boolean(editCard);

  useEffect(() => {
    if (editCard) {
      // When editing, populate form with existing data
      setClueType(editCard.clueType);
      setClue(editCard.clue);
      setAnswer(editCard.answer);
      setCategoryId(editCard.categoryId);
    } else {
      // Reset for create mode
      setClueType("text");
      setClue("");
      setAnswer("");
      setCategoryId(defaultCategoryId);
    }
    setError("");
    setClueError("");
  }, [editCard, defaultCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clue.trim() && clueType === "text") { setError("Clue is required"); return; }
    if (clueType === "image" && !clue) { setError("Please upload an image"); return; }
    if (!answer.trim()) { setError("Answer is required"); return; }
    if (clueError) { setError(clueError); return; }

    setSaving(true);
    setError("");

    if (isEdit && editCard) {
      // PUT — no categoryId allowed
      const res = await fetch(`/api/cards/${editCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      setSaving(false);
      if (json.error) { setError(json.error); return; }
    } else {
      // POST
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      setSaving(false);
      if (json.error) { setError(json.error); return; }
      // Reset for next create
      setClue("");
      setAnswer("");
    }

    onSaved();
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-gray-900 mb-3">
        {isEdit ? "Edit Card" : "New Card"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Category (read-only when editing) */}
        {isEdit ? (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category (cannot change)</label>
            <p className="text-sm font-medium text-gray-700 px-2 py-1 bg-gray-100 rounded">
              {categories.find((c) => c.id === categoryId)?.name ?? categoryId}
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Clue */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Clue</label>
          <ClueInput
            clueType={clueType}
            clue={clue}
            onTypeChange={setClueType}
            onClueChange={setClue}
            onError={setClueError}
          />
        </div>

        {/* Answer */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Answer</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer…"
            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Update" : "Create"}
          </button>
          {isEdit && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border px-4 py-1.5 rounded text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
