import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const WANDERING_PARKER_URL = process.env.WANDERING_PARKER_URL ?? "http://localhost:3000";

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.AUTH_SERVICE_URL ?? "http://localhost:3001"}/api/auth/jwks`)
);

export async function proxy(request: NextRequest) {
  if (process.env.DISABLE_AUTH === "true" && process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  const returnUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const loginUrl = new URL("/login", WANDERING_PARKER_URL);
  loginUrl.searchParams.set("return_url", returnUrl);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, JWKS);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
