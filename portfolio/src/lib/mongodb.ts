import { MongoClient, Binary } from "mongodb";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { portfolio } from "./portfolio";

const uri = process.env.MONGO_URL;
if (!uri) {
  throw new Error("Please add MONGO_URL to your .env file");
}

let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}

let isInitialized = false;

export async function ensureDbInit() {
  if (isInitialized) return;

  try {
    const db = await getDb();

    // 1. Seed Admin User
    const adminUsername = "tanntd2005";
    const adminPasswordPlain = "yahwidnxb1";
    
    // Check if any admin exists
    const adminExists = await db.collection("users").findOne({ username: adminUsername });
    if (!adminExists) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(adminPasswordPlain, salt);
      await db.collection("users").updateOne(
        { username: adminUsername },
        { $setOnInsert: { username: adminUsername, passwordHash, createdAt: new Date() } },
        { upsert: true }
      );
    }

    // 2. Seed Default Portfolio JSON
    const portfolioExists = await db.collection("portfolio").findOne({ key: "main" });
    if (!portfolioExists) {
      await db.collection("portfolio").updateOne(
        { key: "main" },
        { $setOnInsert: { key: "main", ...portfolio, updatedAt: new Date() } },
        { upsert: true }
      );
    }

    // 3. Seed Default CV PDF as Binary data
    const cvExists = await db.collection("assets").findOne({ name: "cv" });
    if (!cvExists) {
      // Try to read local CV pdf
      // Since workspace paths can be absolute, let's look in parent dirs or root
      const possibleCvPaths = [
        path.join(/*turbopackIgnore: true*/ process.cwd(), "Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"),
        path.join(/*turbopackIgnore: true*/ process.cwd(), "..", "Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"),
        "d:/Projects/myportforlio/Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf",
        "D:/Projects/myportforlio/Nguyen_Thanh_Duy_Tan_AI_Engineer_Fresher_CV.pdf"
      ];

      let cvBuffer: Buffer | null = null;
      for (const cvPath of possibleCvPaths) {
        try {
          if (fs.existsSync(cvPath)) {
            cvBuffer = fs.readFileSync(cvPath);
            break;
          }
        } catch (e) {
          // ignore path reading error
        }
      }

      if (cvBuffer) {
        await db.collection("assets").updateOne(
          { name: "cv" },
          {
            $setOnInsert: {
              name: "cv",
              data: new Binary(cvBuffer),
              contentType: "application/pdf",
              updatedAt: new Date()
            }
          },
          { upsert: true }
        );
      }
    }

    isInitialized = true;
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

export default clientPromise;
