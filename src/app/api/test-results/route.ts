import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import type { CardResult, TestMode } from "@/types";
import { getUserId } from "@parkerburgess/wandering-parker-server";
import { badRequest, serverError } from "@/lib/api/responses";

export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const categoryIdParam = searchParams.get("categoryId");
    const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
    const results = await dal.getTestResults(userId, categoryId);
    return NextResponse.json({ data: results, error: null });
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const { categoryId, mode, score, cardResults } = body;
    if (!categoryId || !mode || score === undefined || !Array.isArray(cardResults)) {
      return badRequest("categoryId, mode, score, and cardResults are required");
    }
    const parsedCategoryId = Number(categoryId);
    if (isNaN(parsedCategoryId)) {
      return badRequest("categoryId must be a number");
    }
    const result = await dal.saveTestResult(userId, {
      categoryId: parsedCategoryId,
      mode: mode as TestMode,
      score: Number(score),
      cardResults: cardResults as CardResult[],
    });
    return NextResponse.json({ data: result, error: null }, { status: 201 });
  } catch (err) {
    return serverError(err);
  }
}
