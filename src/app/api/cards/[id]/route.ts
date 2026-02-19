import { NextResponse } from "next/server";
import dal from "@/lib/dal";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ data: null, error: "Invalid id" }, { status: 400 });
    }
    const card = await dal.getCard(id);
    if (!card) {
      return NextResponse.json({ data: null, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: card, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ data: null, error: "Invalid id" }, { status: 400 });
    }
    const body = await request.json();
    // Strip categoryId even if accidentally sent
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryId: _omit, id: _id, createdAt: _ca, updatedAt: _ua, ...updateData } = body;
    const card = await dal.updateCard(id, updateData);
    return NextResponse.json({ data: card, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ data: null, error: "Invalid id" }, { status: 400 });
    }
    await dal.deleteCard(id);
    return NextResponse.json({ data: null, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}
