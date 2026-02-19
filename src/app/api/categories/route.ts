import { NextResponse } from "next/server";
import dal from "@/lib/dal";

export async function GET() {
  try {
    const categories = await dal.getCategories();
    return NextResponse.json({ data: categories, error: null });
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
    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json(
        { data: null, error: "name is required" },
        { status: 400 }
      );
    }
    const category = await dal.createCategory(name);
    return NextResponse.json({ data: category, error: null }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}
