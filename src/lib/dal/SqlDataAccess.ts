import { getPool } from "@parkerburgess/wandering-parker-server";
import type { Card, CardResult, Category, ClueType, TestResult } from "@/types";
import type { IDataAccess } from "./IDataAccess";

type CategoryRow = { CategoryId: number; Name: string };
type CardRow = {
  CardId: number;
  CategoryId: number;
  ClueType: string;
  Clue: string;
  Answer: string;
  CreatedAt: Date;
  UpdatedAt: Date;
};
type TestResultRow = {
  TestResultId: number;
  CategoryId: number;
  Mode: string;
  Score: number;
  CreatedAt: Date;
};
type TestResultCardRow = {
  TestResultId: number;
  CardId: number;
  Submission: string;
  Status: string;
};

function toCard(row: CardRow): Card {
  return {
    id: row.CardId,
    categoryId: row.CategoryId,
    clueType: row.ClueType as ClueType,
    clue: row.Clue,
    answer: row.Answer,
    createdAt: row.CreatedAt.toISOString(),
    updatedAt: row.UpdatedAt.toISOString(),
  };
}

export class SqlDataAccess implements IDataAccess {
  // ── Categories ──────────────────────────────────────────────────────────
  async getCategories(userId: string): Promise<Category[]> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("userId", userId)
      .query<CategoryRow>(`
        SELECT CategoryId, Name FROM flashcards.Category
        WHERE UserId = @userId
        ORDER BY Name
      `);
    return result.recordset.map((row) => ({ id: row.CategoryId, name: row.Name }));
  }

  async createCategory(userId: string, name: string): Promise<Category> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("userId", userId)
      .input("name", name)
      .query<CategoryRow>(`
        INSERT INTO flashcards.Category (UserId, Name)
        OUTPUT INSERTED.CategoryId, INSERTED.Name
        VALUES (@userId, @name)
      `);
    const row = result.recordset[0];
    return { id: row.CategoryId, name: row.Name };
  }

  async deleteCategory(userId: string, id: number): Promise<void> {
    const pool = await getPool();
    // Explicit dependency-ordered delete — all FKs are NO ACTION (see
    // sql/schema.sql: SQL Server rejects multiple cascade paths converging
    // on TestResultCard), so children must be removed before the parent.
    // Every step is scoped to UserId so an id belonging to another user
    // deletes nothing at any stage.
    await pool.request().input("id", id).input("userId", userId).query(`
      DELETE trc
      FROM flashcards.TestResultCard trc
      JOIN flashcards.TestResult tr ON tr.TestResultId = trc.TestResultId
      WHERE tr.CategoryId = @id AND tr.UserId = @userId;

      DELETE FROM flashcards.TestResult WHERE CategoryId = @id AND UserId = @userId;

      DELETE trc
      FROM flashcards.TestResultCard trc
      JOIN flashcards.Card c ON c.CardId = trc.CardId
      WHERE c.CategoryId = @id AND c.UserId = @userId;

      DELETE FROM flashcards.Card WHERE CategoryId = @id AND UserId = @userId;

      DELETE FROM flashcards.Category WHERE CategoryId = @id AND UserId = @userId;
    `);
  }

  // ── Cards ────────────────────────────────────────────────────────────────
  async getCards(userId: string, categoryId?: number): Promise<Card[]> {
    const pool = await getPool();
    const request = pool.request().input("userId", userId);
    if (categoryId !== undefined) request.input("categoryId", categoryId);
    const result = await request.query<CardRow>(`
      SELECT CardId, CategoryId, ClueType, Clue, Answer, CreatedAt, UpdatedAt
      FROM flashcards.Card
      WHERE UserId = @userId
      ${categoryId !== undefined ? "AND CategoryId = @categoryId" : ""}
      ORDER BY CreatedAt
    `);
    return result.recordset.map(toCard);
  }

  async getCard(userId: string, id: number): Promise<Card | null> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", id)
      .input("userId", userId)
      .query<CardRow>(`
        SELECT CardId, CategoryId, ClueType, Clue, Answer, CreatedAt, UpdatedAt
        FROM flashcards.Card WHERE CardId = @id AND UserId = @userId
      `);
    return result.recordset[0] ? toCard(result.recordset[0]) : null;
  }

  async createCard(
    userId: string,
    data: Omit<Card, "id" | "createdAt" | "updatedAt">
  ): Promise<Card> {
    const pool = await getPool();
    await this.assertOwnsCategory(userId, data.categoryId);
    const result = await pool
      .request()
      .input("userId", userId)
      .input("categoryId", data.categoryId)
      .input("clueType", data.clueType)
      .input("clue", data.clue)
      .input("answer", data.answer)
      .query<CardRow>(`
        INSERT INTO flashcards.Card (UserId, CategoryId, ClueType, Clue, Answer)
        OUTPUT INSERTED.CardId, INSERTED.CategoryId, INSERTED.ClueType,
               INSERTED.Clue, INSERTED.Answer, INSERTED.CreatedAt, INSERTED.UpdatedAt
        VALUES (@userId, @categoryId, @clueType, @clue, @answer)
      `);
    return toCard(result.recordset[0]);
  }

  async updateCard(
    userId: string,
    id: number,
    data: Partial<Omit<Card, "id" | "categoryId" | "createdAt" | "updatedAt">>
  ): Promise<Card> {
    const pool = await getPool();
    const request = pool.request().input("id", id).input("userId", userId);
    const setClauses: string[] = [];
    if (data.clueType !== undefined) {
      request.input("clueType", data.clueType);
      setClauses.push("ClueType = @clueType");
    }
    if (data.clue !== undefined) {
      request.input("clue", data.clue);
      setClauses.push("Clue = @clue");
    }
    if (data.answer !== undefined) {
      request.input("answer", data.answer);
      setClauses.push("Answer = @answer");
    }
    setClauses.push("UpdatedAt = SYSUTCDATETIME()");

    const result = await request.query<CardRow>(`
      UPDATE flashcards.Card SET ${setClauses.join(", ")}
      OUTPUT INSERTED.CardId, INSERTED.CategoryId, INSERTED.ClueType,
             INSERTED.Clue, INSERTED.Answer, INSERTED.CreatedAt, INSERTED.UpdatedAt
      WHERE CardId = @id AND UserId = @userId
    `);
    if (!result.recordset[0]) throw new Error(`Card ${id} not found`);
    return toCard(result.recordset[0]);
  }

  async deleteCard(userId: string, id: number): Promise<void> {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .input("userId", userId)
      .query(`DELETE FROM flashcards.Card WHERE CardId = @id AND UserId = @userId`);
  }

  // ── Test Results ─────────────────────────────────────────────────────────
  async saveTestResult(
    userId: string,
    data: Omit<TestResult, "id" | "timestamp">
  ): Promise<TestResult> {
    const pool = await getPool();
    await this.assertOwnsCategory(userId, data.categoryId);
    await this.assertOwnsCards(userId, data.cardResults.map((cr) => cr.cardId));

    const headerResult = await pool
      .request()
      .input("userId", userId)
      .input("categoryId", data.categoryId)
      .input("mode", data.mode)
      .input("score", data.score)
      .query<TestResultRow>(`
        INSERT INTO flashcards.TestResult (UserId, CategoryId, Mode, Score)
        OUTPUT INSERTED.TestResultId, INSERTED.CategoryId, INSERTED.Mode,
               INSERTED.Score, INSERTED.CreatedAt
        VALUES (@userId, @categoryId, @mode, @score)
      `);
    const header = headerResult.recordset[0];

    for (const cr of data.cardResults) {
      await pool
        .request()
        .input("testResultId", header.TestResultId)
        .input("cardId", cr.cardId)
        .input("submission", cr.submission)
        .input("status", cr.status)
        .query(`
          INSERT INTO flashcards.TestResultCard (TestResultId, CardId, Submission, Status)
          VALUES (@testResultId, @cardId, @submission, @status)
        `);
    }

    return {
      id: header.TestResultId,
      categoryId: header.CategoryId,
      mode: header.Mode as TestResult["mode"],
      score: header.Score,
      cardResults: data.cardResults,
      timestamp: header.CreatedAt.toISOString(),
    };
  }

  async getTestResults(userId: string, categoryId?: number): Promise<TestResult[]> {
    const pool = await getPool();
    const request = pool.request().input("userId", userId);
    if (categoryId !== undefined) request.input("categoryId", categoryId);
    const headerResult = await request.query<TestResultRow>(`
      SELECT TestResultId, CategoryId, Mode, Score, CreatedAt
      FROM flashcards.TestResult
      WHERE UserId = @userId
      ${categoryId !== undefined ? "AND CategoryId = @categoryId" : ""}
      ORDER BY CreatedAt DESC
    `);
    return this.attachCardResults(headerResult.recordset);
  }

  async getTestResult(userId: string, id: number): Promise<TestResult | null> {
    const pool = await getPool();
    const headerResult = await pool
      .request()
      .input("id", id)
      .input("userId", userId)
      .query<TestResultRow>(`
        SELECT TestResultId, CategoryId, Mode, Score, CreatedAt
        FROM flashcards.TestResult WHERE TestResultId = @id AND UserId = @userId
      `);
    if (!headerResult.recordset[0]) return null;
    const [result] = await this.attachCardResults(headerResult.recordset);
    return result;
  }

  // Category and Card ownership must be re-checked server-side on every
  // write — the client-submitted categoryId/cardId values are otherwise
  // just numbers an authenticated user could point at someone else's rows.
  private async assertOwnsCategory(userId: string, categoryId: number): Promise<void> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("categoryId", categoryId)
      .input("userId", userId)
      .query(`
        SELECT CategoryId FROM flashcards.Category
        WHERE CategoryId = @categoryId AND UserId = @userId
      `);
    if (result.recordset.length === 0) {
      throw new Error(`Category ${categoryId} not found`);
    }
  }

  private async assertOwnsCards(userId: string, cardIds: number[]): Promise<void> {
    const uniqueIds = Array.from(new Set(cardIds));
    if (uniqueIds.length === 0) return;

    const pool = await getPool();
    const request = pool.request().input("userId", userId);
    const idParams = uniqueIds.map((cardId, idx) => {
      const paramName = `cardId${idx}`;
      request.input(paramName, cardId);
      return `@${paramName}`;
    });
    const result = await request.query<{ CardId: number }>(`
      SELECT CardId FROM flashcards.Card
      WHERE UserId = @userId AND CardId IN (${idParams.join(",")})
    `);
    if (result.recordset.length !== uniqueIds.length) {
      throw new Error("One or more cards not found");
    }
  }

  private async attachCardResults(
    headers: TestResultRow[]
  ): Promise<TestResult[]> {
    if (headers.length === 0) return [];
    const pool = await getPool();
    const request = pool.request();
    const idParams = headers.map((h, idx) => {
      const paramName = `id${idx}`;
      request.input(paramName, h.TestResultId);
      return `@${paramName}`;
    });
    const cardResultRows = await request.query<TestResultCardRow>(`
      SELECT TestResultId, CardId, Submission, Status
      FROM flashcards.TestResultCard
      WHERE TestResultId IN (${idParams.join(",")})
    `);

    const byTestResultId = new Map<number, CardResult[]>();
    for (const row of cardResultRows.recordset) {
      const list = byTestResultId.get(row.TestResultId) ?? [];
      list.push({
        cardId: row.CardId,
        submission: row.Submission,
        status: row.Status as CardResult["status"],
      });
      byTestResultId.set(row.TestResultId, list);
    }

    return headers.map((h) => ({
      id: h.TestResultId,
      categoryId: h.CategoryId,
      mode: h.Mode as TestResult["mode"],
      score: h.Score,
      cardResults: byTestResultId.get(h.TestResultId) ?? [],
      timestamp: h.CreatedAt.toISOString(),
    }));
  }
}
