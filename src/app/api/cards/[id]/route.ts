import { NextResponse } from "next/server";
import dal from "@/lib/dal";
import { getUserId } from "@wanderingparker/server";
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
    const card = await dal.getCard(userId, id);
    if (!card) {
      return notFound();
    }
    return NextResponse.json({ data: card, error: null });
  } catch (err) {
    return serverError(err);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
      return badRequest("Invalid id");
    }
    const body = await request.json();
    // Strip categoryId even if accidentally sent
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryId: _omit, id: _id, createdAt: _ca, updatedAt: _ua, ...updateData } = body;
    const card = await dal.updateCard(userId, id, updateData);
    return NextResponse.json({ data: card, error: null });
  } catch (err) {
    return serverError(err);
  }
}

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
    await dal.deleteCard(userId, id);
    return NextResponse.json({ data: null, error: null });
  } catch (err) {
    return serverError(err);
  }
}
