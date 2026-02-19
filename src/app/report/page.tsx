"use client";

import { useState, useEffect, useCallback } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import ReportGrouped from "@/components/report/ReportGrouped";
import MissedCardsList from "@/components/report/MissedCardsList";
import type { Card, Category, TestResult } from "@/types";

export default function ReportPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [catRes, resultRes, cardRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/test-results"),
      fetch("/api/cards"),
    ]);
    const [catJson, resultJson, cardJson] = await Promise.all([
      catRes.json(),
      resultRes.json(),
      cardRes.json(),
    ]);
    if (!catJson.error) setCategories(catJson.data);
    if (!resultJson.error) setResults(resultJson.data);
    if (!cardJson.error) setCards(cardJson.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <PageWrapper title="Report"><p className="text-gray-500">Loading…</p></PageWrapper>;
  }

  return (
    <PageWrapper title="Report">
      {results.length === 0 ? (
        <p className="text-gray-400 italic mb-6">
          No test results yet. Take a test to see your results here.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Results by Category</h2>
            <ReportGrouped results={results} categories={categories} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Most Missed</h2>
            <MissedCardsList results={results} cards={cards} />
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
