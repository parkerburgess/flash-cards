"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import StudyModeSelector, { type StudyMode } from "@/components/study/StudyModeSelector";
import DataReview from "@/components/study/DataReview";
import MockTest from "@/components/study/MockTest";
import type { Card, Category } from "@/types";

function StudyPageInner() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [cards, setCards] = useState<Card[]>([]);
  const [mode, setMode] = useState<StudyMode>("review");
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    if (json.error) return;
    setCategories(json.data);
    if (!selectedCategoryId && json.data.length > 0) {
      setSelectedCategoryId(json.data[0].id);
    }
  }, [selectedCategoryId]);

  const fetchCards = useCallback(async () => {
    if (!selectedCategoryId) return;
    setLoading(true);
    const res = await fetch(`/api/cards?categoryId=${selectedCategoryId}`);
    const json = await res.json();
    setLoading(false);
    if (!json.error) setCards(json.data);
  }, [selectedCategoryId]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchCards(); }, [fetchCards]);

  return (
    <PageWrapper title="Study">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedCategoryId ? (
        <p className="text-gray-400 italic">Select a category to study.</p>
      ) : loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : cards.length === 0 ? (
        <p className="text-gray-400 italic">No cards in this category.</p>
      ) : (
        <>
          <StudyModeSelector mode={mode} onChange={setMode} />
          {mode === "review" ? (
            <DataReview cards={cards} categories={categories} onRefresh={fetchCards} />
          ) : (
            <MockTest cards={cards} />
          )}
        </>
      )}
    </PageWrapper>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<PageWrapper title="Study"><p>Loading…</p></PageWrapper>}>
      <StudyPageInner />
    </Suspense>
  );
}
