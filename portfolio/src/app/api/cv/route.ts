import { NextResponse } from "next/server";
import { getDb, ensureDbInit } from "@/lib/mongodb";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    await ensureDbInit();
    const db = await getDb();
    const asset = await db.collection("assets").findOne({ name: "cv" });

    let pdfBuffer: Buffer | null = null;
    let contentType = "application/pdf";

    if (asset && asset.data) {
      // Handle MongoDB Binary type
      if (asset.data.buffer) {
        pdfBuffer = Buffer.from(asset.data.buffer);
      } else if (asset.data.value) {
        pdfBuffer = Buffer.from(asset.data.value());
      } else {
        pdfBuffer = Buffer.from(asset.data);
      }
      if (asset.contentType) {
        contentType = asset.contentType;
      }
    } else {
      // Fallback: Read local file
      const possibleCvPaths = [
        path.join(/*turbopackIgnore: true*/ process.cwd(), "Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"),
        path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"),
        "d:/Projects/myportforlio/Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"
      ];
      for (const cvPath of possibleCvPaths) {
        try {
          if (fs.existsSync(cvPath)) {
            pdfBuffer = fs.readFileSync(cvPath);
            break;
          }
        } catch {
          // ignore
        }
      }
    }

    if (!pdfBuffer) {
      return NextResponse.json({ error: "CV PDF not found" }, { status: 404 });
    }

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline; filename=\"Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf\"",
        "Cache-Control": "no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("GET cv error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
