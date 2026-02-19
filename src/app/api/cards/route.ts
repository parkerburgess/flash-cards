import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import type { ClueType } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const cards = await dal.getCards(categoryId);
    return NextResponse.json({ data: cards, error: null });
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
    const { categoryId, clueType, clue, answer } = body;

    if (!categoryId || !clueType || !clue || !answer) {
      return NextResponse.json(
        { data: null, error: "categoryId, clueType, clue, and answer are required" },
        { status: 400 }
      );
    }

    const card = await dal.createCard({
      categoryId,
      clueType: clueType as ClueType,
      clue,
      answer
    });
    return NextResponse.json({ data: card, error: null }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}
