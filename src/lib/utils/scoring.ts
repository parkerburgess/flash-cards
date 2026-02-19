import type { CardResult } from "@/types";

export function calcCountModeScore(results: CardResult[]): number {
  if (results.length === 0) return 0;
  return (
    Math.round(
      (results.filter((r) => r.status === "correct").length / results.length) *
        1000
    ) / 10
  );
}

export function calcSurvivalScore(results: CardResult[]): number {
  return results.filter((r) => r.status === "correct").length;
}
