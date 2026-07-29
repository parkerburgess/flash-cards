import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import { badRequest, serverError } from "@/lib/api/responses";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return badRequest("Invalid id");
    }
    await dal.deleteCategory(id);
    return NextResponse.json({ data: null, error: null });
  } catch (err) {
    return serverError(err);
  }
}
