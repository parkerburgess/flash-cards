import { NextResponse } from "next/server";
import dal from "@/lib/dal";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await dal.getTestResult(params.id);
    if (!result) {
      return NextResponse.json({ data: null, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: result, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}
