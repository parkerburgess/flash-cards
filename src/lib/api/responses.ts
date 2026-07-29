import { NextResponse } from "next/server";

export function badRequest(message: string) {
  return NextResponse.json({ data: null, error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ data: null, error: message }, { status: 404 });
}

export function serverError(err: unknown) {
  return NextResponse.json(
    { data: null, error: (err as Error).message },
    { status: 500 }
  );
}
