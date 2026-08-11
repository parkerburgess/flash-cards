import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import type { ClueType } from "@/types";
import { getUserId } from "@wanderingparker/server";
import { badRequest, serverError } from "@/lib/api/responses";

export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const categoryIdParam = searchParams.get("categoryId");
    const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
    const cards = await dal.getCards(userId, categoryId);
    return NextResponse.json({ data: cards, error: null });
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const { categoryId, clueType, clue, answer } = body;

    if (!categoryId || !clueType || !clue || !answer) {
      return badRequest("categoryId, clueType, clue, and answer are required");
    }
    const parsedCategoryId = Number(categoryId);
    if (isNaN(parsedCategoryId)) {
      return badRequest("categoryId must be a number");
    }

    const card = await dal.createCard(userId, {
      categoryId: parsedCategoryId,
      clueType: clueType as ClueType,
      clue,
      answer
    });
    return NextResponse.json({ data: card, error: null }, { status: 201 });
  } catch (err) {
    return serverError(err);
  }
}
