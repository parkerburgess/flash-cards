"use client";

import { useState, useEffect, useCallback } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import TestSetup from "@/components/test/TestSetup";
import TestRunner from "@/components/test/TestRunner";
import type { Card, Category, TestMode } from "@/types";

interface TestSession {
  categoryId: string;
  mode: TestMode;
  count: number | null;
  incorrectsAllowed: number;
  cards: Card[];
}

export default function TestPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [session, setSession] = useState<TestSession | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const catRes = await fetch("/api/categories");
    const catJson = await catRes.json();
    if (catJson.error) { setLoading(false); return; }
    const cats: Category[] = catJson.data;
    setCategories(cats);

    // Fetch card counts for each category
    const counts: Record<string, number> = {};
    await Promise.all(
      cats.map(async (c) => {
        const res = await fetch(`/api/cards?categoryId=${c.id}`);
        const json = await res.json();
        counts[c.id] = json.data?.length ?? 0;
      })
    );
    setCardCounts(counts);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStart = async (
    categoryId: string,
    mode: TestMode,
    count: number | null,
    incorrectsAllowed: number
  ) => {
    const res = await fetch(`/api/cards?categoryId=${categoryId}`);
    const json = await res.json();
    if (json.error) return;
    setSession({ categoryId, mode, count, incorrectsAllowed, cards: json.data });
  };

  if (loading) {
    return <PageWrapper title="Test"><p className="text-gray-500">Loading…</p></PageWrapper>;
  }

  if (categories.length === 0) {
    return (
      <PageWrapper title="Test">
        <p className="text-gray-400 italic">
          No categories yet. Go to <a href="/manage" className="text-indigo-600 underline">Manage</a> to create one.
        </p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Test">
      {session ? (
        <TestRunner
          cards={session.cards}
          categoryId={session.categoryId}
          mode={session.mode}
          count={session.count}
          incorrectsAllowed={session.incorrectsAllowed}
          onReset={() => setSession(null)}
        />
      ) : (
        <TestSetup
          categories={categories}
          cardCounts={cardCounts}
          onStart={handleStart}
        />
      )}
    </PageWrapper>
  );
}
