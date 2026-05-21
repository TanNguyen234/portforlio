import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getDb, ensureDbInit } from "@/lib/mongodb";
import { Binary } from "mongodb";
import fs from "fs";
import path from "path";

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

export async function POST(request: Request) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await ensureDbInit();
    const db = await getDb();

    // 1. Update in MongoDB
    await db.collection("assets").updateOne(
      { name: "cv" },
      {
        $set: {
          data: new Binary(buffer),
          contentType: file.type || "application/pdf",
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // 2. Try writing locally as fallback
    const targetLocalPaths = [
      path.join(process.cwd(), "Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"),
      path.join(process.cwd(), "public", "Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"),
      "d:/Projects/myportforlio/Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf",
      "d:/Projects/myportforlio/public/Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"
    ];

    for (const localPath of targetLocalPaths) {
      try {
        const dir = path.dirname(localPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(localPath, buffer);
      } catch (err) {
        console.warn(`Could not write fallback copy to ${localPath}:`, err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST cv error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
