export interface Category {
  id: number;
  name: string;
}

export type ClueType = "text" | "image";

export interface Card {
  id: number;
  categoryId: number;
  clueType: ClueType;
  clue: string; // text OR base64 data-URL
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export type TestMode = "count" | "survival";
export type CardResultStatus = "correct" | "incorrect" | "skipped";

export interface CardResult {
  cardId: number;
  submission: string;
  status: CardResultStatus;
}

export interface TestResult {
  id: number;
  categoryId: number;
  mode: TestMode;
  score: number; // count mode = % (0–100); survival = correct count
  cardResults: CardResult[];
  timestamp: string;
}
