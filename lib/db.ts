import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

  if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  let filePath = dbUrl.replace(/^file:/, "").replace(/^\.\//, "");

  // On Vercel / AWS Lambda serverless functions, the root working directory (/var/task) is read-only.
  // We copy dev.db to /tmp (the only writable directory in serverless runtime) so SQLite write queries succeed.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join("/tmp", "dev.db");
    if (!fs.existsSync(tmpDbPath)) {
      const candidateSources = [
        path.join(process.cwd(), "dev.db"),
        path.join(process.cwd(), "prisma", "dev.db"),
      ];
      for (const src of candidateSources) {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, tmpDbPath);
            console.log(`Successfully prepared serverless writable database copy at ${tmpDbPath}`);
            break;
          } catch (err) {
            console.error("Failed to copy database to /tmp:", err);
          }
        }
      }
    }
    filePath = tmpDbPath;
  }

  const adapter = new PrismaBetterSqlite3({ url: filePath });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
