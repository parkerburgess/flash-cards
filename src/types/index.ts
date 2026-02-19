export interface Category {
  id: string;
  name: string;
}

export type ClueType = "text" | "image";

export interface Card {
  id: number;
  categoryId: string;
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
  id: string;
  categoryId: string;
  mode: TestMode;
  score: number; // count mode = % (0–100); survival = correct count
  cardResults: CardResult[];
  timestamp: string;
}

// JSON file shapes
export interface CategoriesFile {
  categories: Category[];
}

export interface CardsFile {
  nextId: number;
  cards: Card[];
}

export interface TestResultsFile {
  results: TestResult[];
}
