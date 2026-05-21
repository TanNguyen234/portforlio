import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fb32a22a64d644bb98ff01d5c4d433d1-portfolio-jwt-secret-key-tanntd2005";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("admin_session");

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ authenticated: false, error: "No session active" });
    }

    try {
      const { payload } = await jwtVerify(tokenCookie.value, secretKey);
      return NextResponse.json({
        authenticated: true,
        username: payload.username
      });
    } catch (err) {
      return NextResponse.json({ authenticated: false, error: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Auth me check error:", error);
    return NextResponse.json({ authenticated: false, error: "Internal server error" }, { status: 500 });
  }
}
