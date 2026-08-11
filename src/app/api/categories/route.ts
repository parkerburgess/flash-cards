import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import { getUserId } from "@wanderingparker/server";
import { badRequest, serverError } from "@/lib/api/responses";

export async function GET() {
  try {
    const userId = await getUserId();
    const categories = await dal.getCategories(userId);
    return NextResponse.json({ data: categories, error: null });
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    if (!name) {
      return badRequest("name is required");
    }
    const category = await dal.createCategory(userId, name);
    return NextResponse.json({ data: category, error: null }, { status: 201 });
  } catch (err) {
    return serverError(err);
  }
}
