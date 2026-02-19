import { NextResponse } from "next/server";
import dal from "@/lib/dal";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dal.deleteCategory(params.id);
    return NextResponse.json({ data: null, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}
