import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import { badRequest, notFound, serverError } from "@/lib/api/responses";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return badRequest("Invalid id");
    }
    const result = await dal.getTestResult(id);
    if (!result) {
      return notFound();
    }
    return NextResponse.json({ data: result, error: null });
  } catch (err) {
    return serverError(err);
  }
}
