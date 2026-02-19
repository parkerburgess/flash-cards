"use client";

import type { Category, TestResult } from "@/types";
import StudyLinkButton from "./StudyLinkButton";

interface Props {
  results: TestResult[];
  categories: Category[];
}

interface GroupedEntry {
  category: Category;
  countResults: TestResult[];
  survivalResults: TestResult[];
}

export default function ReportGrouped({ results, categories }: Props) {
  const grouped: GroupedEntry[] = categories.map((cat) => ({
    category: cat,
    countResults: results.filter((r) => r.categoryId === cat.id && r.mode === "count"),
    survivalResults: results.filter((r) => r.categoryId === cat.id && r.mode === "survival"),
  })).filter((g) => g.countResults.length > 0 || g.survivalResults.length > 0);

  if (grouped.length === 0) {
    return <p className="text-gray-400 italic">No test results yet.</p>;
  }

  return (
    <div className="space-y-6">
      {grouped.map(({ category, countResults, survivalResults }) => {
        const bestCount = countResults.length
          ? Math.max(...countResults.map((r) => r.score))
          : null;
        const bestSurvival = survivalResults.length
          ? Math.max(...survivalResults.map((r) => r.score))
          : null;
        const avgCount = countResults.length
          ? Math.round(countResults.reduce((s, r) => s + r.score, 0) / countResults.length * 10) / 10
          : null;

        return (
          <div key={category.id} className="bg-white border rounded-lg shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
              <StudyLinkButton categoryId={category.id} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Count mode stats */}
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Count Mode</p>
                {countResults.length === 0 ? (
                  <p className="text-sm text-gray-400">No tests yet</p>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-indigo-700">{bestCount}%</p>
                    <p className="text-xs text-gray-500">Best score</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {avgCount}% over {countResults.length} test{countResults.length !== 1 ? "s" : ""}
                    </p>
                  </>
                )}
              </div>

              {/* Survival mode stats */}
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Survival Mode</p>
                {survivalResults.length === 0 ? (
                  <p className="text-sm text-gray-400">No tests yet</p>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-orange-700">{bestSurvival}</p>
                    <p className="text-xs text-gray-500">Best streak</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {survivalResults.length} test{survivalResults.length !== 1 ? "s" : ""}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Recent tests */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Recent tests</p>
              <ul className="space-y-1">
                {[...countResults, ...survivalResults]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 5)
                  .map((r) => (
                    <li key={r.id} className="flex items-center justify-between text-xs text-gray-600">
                      <span className="capitalize">{r.mode}</span>
                      <span>{new Date(r.timestamp).toLocaleDateString()}</span>
                      <span className="font-medium">
                        {r.mode === "count" ? `${r.score}%` : `${r.score} correct`}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
