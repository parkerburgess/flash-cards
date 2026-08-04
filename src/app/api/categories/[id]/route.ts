import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import { getUserId } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api/responses";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
      return badRequest("Invalid id");
    }
    await dal.deleteCategory(userId, id);
    return NextResponse.json({ data: null, error: null });
  } catch (err) {
    return serverError(err);
  }
}
