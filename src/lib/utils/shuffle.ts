import type { Card } from "@/types";

/** Fisher-Yates shuffle — returns a new array */
export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Applied ONCE at session start. For text cards with flipEnabled,
 * randomly swap clue and answer.
 */
export function applyFlipEnabled(cards: Card[]): Card[] {
  return cards.map((card) => {
    if (card.clueType === "text" && card.flipEnabled && Math.random() < 0.5) {
      return { ...card, clue: card.answer, answer: card.clue };
    }
    return card;
  });
}
