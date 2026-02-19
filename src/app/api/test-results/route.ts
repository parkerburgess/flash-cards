import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import type { CardResult, TestMode } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const results = await dal.getTestResults(categoryId);
    return NextResponse.json({ data: results, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, mode, score, cardResults } = body;
    if (!categoryId || !mode || score === undefined || !Array.isArray(cardResults)) {
      return NextResponse.json(
        { data: null, error: "categoryId, mode, score, and cardResults are required" },
        { status: 400 }
      );
    }
    const result = await dal.saveTestResult({
      categoryId,
      mode: mode as TestMode,
      score: Number(score),
      cardResults: cardResults as CardResult[],
    });
    return NextResponse.json({ data: result, error: null }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}
