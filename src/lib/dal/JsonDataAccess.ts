import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type {
  Card,
  CardsFile,
  CategoriesFile,
  Category,
  TestResult,
  TestResultsFile,
} from "@/types";
import type { IDataAccess } from "./IDataAccess";

const DATA_DIR = path.join(process.cwd(), "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const CARDS_FILE = path.join(DATA_DIR, "cards.json");
const TEST_RESULTS_FILE = path.join(DATA_DIR, "test-results.json");

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export class JsonDataAccess implements IDataAccess {
  // ── Categories ──────────────────────────────────────────────────────────
  async getCategories(): Promise<Category[]> {
    const file = await readJson<CategoriesFile>(CATEGORIES_FILE, {
      categories: [],
    });
    return file.categories;
  }

  async createCategory(name: string): Promise<Category> {
    const file = await readJson<CategoriesFile>(CATEGORIES_FILE, {
      categories: [],
    });
    const category: Category = { id: randomUUID(), name };
    file.categories.push(category);
    await writeJson(CATEGORIES_FILE, file);
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const file = await readJson<CategoriesFile>(CATEGORIES_FILE, {
      categories: [],
    });
    file.categories = file.categories.filter((c) => c.id !== id);
    await writeJson(CATEGORIES_FILE, file);
  }

  // ── Cards ────────────────────────────────────────────────────────────────
  async getCards(categoryId?: string): Promise<Card[]> {
    const file = await readJson<CardsFile>(CARDS_FILE, {
      nextId: 1,
      cards: [],
    });
    if (categoryId) {
      return file.cards.filter((c) => c.categoryId === categoryId);
    }
    return file.cards;
  }

  async getCard(id: number): Promise<Card | null> {
    const file = await readJson<CardsFile>(CARDS_FILE, {
      nextId: 1,
      cards: [],
    });
    return file.cards.find((c) => c.id === id) ?? null;
  }

  async createCard(
    data: Omit<Card, "id" | "createdAt" | "updatedAt">
  ): Promise<Card> {
    const file = await readJson<CardsFile>(CARDS_FILE, {
      nextId: 1,
      cards: [],
    });
    const now = new Date().toISOString();
    const card: Card = {
      ...data,
      id: file.nextId,
      createdAt: now,
      updatedAt: now,
    };
    file.nextId += 1;
    file.cards.push(card);
    await writeJson(CARDS_FILE, file);
    return card;
  }

  async updateCard(
    id: number,
    data: Partial<Omit<Card, "id" | "categoryId" | "createdAt" | "updatedAt">>
  ): Promise<Card> {
    const file = await readJson<CardsFile>(CARDS_FILE, {
      nextId: 1,
      cards: [],
    });
    const idx = file.cards.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Card ${id} not found`);
    const updated: Card = {
      ...file.cards[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    file.cards[idx] = updated;
    await writeJson(CARDS_FILE, file);
    return updated;
  }

  async deleteCard(id: number): Promise<void> {
    const file = await readJson<CardsFile>(CARDS_FILE, {
      nextId: 1,
      cards: [],
    });
    file.cards = file.cards.filter((c) => c.id !== id);
    await writeJson(CARDS_FILE, file);
  }

  // ── Test Results ─────────────────────────────────────────────────────────
  async saveTestResult(
    data: Omit<TestResult, "id" | "timestamp">
  ): Promise<TestResult> {
    const file = await readJson<TestResultsFile>(TEST_RESULTS_FILE, {
      results: [],
    });
    const result: TestResult = {
      ...data,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
    };
    file.results.push(result);
    await writeJson(TEST_RESULTS_FILE, file);
    return result;
  }

  async getTestResults(categoryId?: string): Promise<TestResult[]> {
    const file = await readJson<TestResultsFile>(TEST_RESULTS_FILE, {
      results: [],
    });
    if (categoryId) {
      return file.results.filter((r) => r.categoryId === categoryId);
    }
    return file.results;
  }

  async getTestResult(id: string): Promise<TestResult | null> {
    const file = await readJson<TestResultsFile>(TEST_RESULTS_FILE, {
      results: [],
    });
    return file.results.find((r) => r.id === id) ?? null;
  }
}
