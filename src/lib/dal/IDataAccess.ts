import type { Card, Category, TestResult } from "@/types";

export interface IDataAccess {
  getCategories(userId: string): Promise<Category[]>;
  createCategory(userId: string, name: string): Promise<Category>;
  deleteCategory(userId: string, id: number): Promise<void>;

  getCards(userId: string, categoryId?: number): Promise<Card[]>;
  getCard(userId: string, id: number): Promise<Card | null>;
  createCard(
    userId: string,
    data: Omit<Card, "id" | "createdAt" | "updatedAt">
  ): Promise<Card>;
  updateCard(
    userId: string,
    id: number,
    data: Partial<Omit<Card, "id" | "categoryId" | "createdAt" | "updatedAt">>
  ): Promise<Card>;
  deleteCard(userId: string, id: number): Promise<void>;

  saveTestResult(
    userId: string,
    data: Omit<TestResult, "id" | "timestamp">
  ): Promise<TestResult>;
  getTestResults(userId: string, categoryId?: number): Promise<TestResult[]>;
  getTestResult(userId: string, id: number): Promise<TestResult | null>;
}
