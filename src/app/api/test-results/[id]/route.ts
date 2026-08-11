import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import { getUserId } from "@parkerburgess/wandering-parker-server";
import { badRequest, notFound, serverError } from "@/lib/api/responses";

export async function GET(
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
    const result = await dal.getTestResult(userId, id);
    if (!result) {
      return notFound();
    }
    return NextResponse.json({ data: result, error: null });
  } catch (err) {
    return serverError(err);
  }
}
