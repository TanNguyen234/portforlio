import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getDb, ensureDbInit } from "@/lib/mongodb";
import { portfolio } from "@/lib/portfolio";

const JWT_SECRET = process.env.JWT_SECRET || "fb32a22a64d644bb98ff01d5c4d433d1-portfolio-jwt-secret-key-tanntd2005";
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function isAuthorized(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("admin_session");
    if (!tokenCookie || !tokenCookie.value) return false;
    await jwtVerify(tokenCookie.value, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    await ensureDbInit();
    const db = await getDb();
    const data = await db.collection("portfolio").findOne({ key: "main" });

    if (!data) {
      // Fallback if not seeded yet
      return NextResponse.json(portfolio);
    }

    // Remove MongoDB internal properties
    const { _id, key, ...cleanData } = data;
    return NextResponse.json(cleanData);
  } catch (error) {
    console.error("GET portfolio error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    await ensureDbInit();
    const db = await getDb();

    // Ensure we do not store MongoDB specific keys from request if present
    const { _id, key, updatedAt, ...portfolioToSave } = body;

    await db.collection("portfolio").updateOne(
      { key: "main" },
      {
        $set: {
          ...portfolioToSave,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST portfolio error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
