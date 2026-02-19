import type { Card, Category, TestResult } from "@/types";

export interface IDataAccess {
  getCategories(): Promise<Category[]>;
  createCategory(name: string): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  getCards(categoryId?: string): Promise<Card[]>;
  getCard(id: number): Promise<Card | null>;
  createCard(
    data: Omit<Card, "id" | "createdAt" | "updatedAt">
  ): Promise<Card>;
  updateCard(
    id: number,
    data: Partial<Omit<Card, "id" | "categoryId" | "createdAt" | "updatedAt">>
  ): Promise<Card>;
  deleteCard(id: number): Promise<void>;

  saveTestResult(
    data: Omit<TestResult, "id" | "timestamp">
  ): Promise<TestResult>;
  getTestResults(categoryId?: string): Promise<TestResult[]>;
  getTestResult(id: string): Promise<TestResult | null>;
}
