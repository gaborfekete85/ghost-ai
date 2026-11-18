import { readFileSync } from "node:fs";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  if (url.startsWith("prisma+postgres://")) {
    // The extension only adds `cacheStrategy`; keep one stable client type for callers.
    return new PrismaClient({ accelerateUrl: url }).$extends(
      withAccelerate(),
    ) as unknown as PrismaClient;
  }

  // `pg` ignores the `?schema=` URL param, so pass it to the adapter explicitly.
  const parsed = new URL(url);
  const schema = parsed.searchParams.get("schema") ?? undefined;

  // `pg` sends no SSL by default, but hosted Postgres (e.g. RDS) rejects
  // unencrypted connections. Always encrypt and verify the certificate,
  // except for local databases. RDS uses Amazon's own CA, so pin its public bundle.
  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  parsed.searchParams.delete("schema");

  return new PrismaClient({
    adapter: new PrismaPg(
      { connectionString: parsed.toString(), ssl: sslConfig(parsed.hostname, isLocal) },
      { schema },
    ),
  });
}

function sslConfig(hostname: string, isLocal: boolean) {
  if (isLocal) return undefined;
  if (hostname.endsWith(".rds.amazonaws.com")) {
    return {
      rejectUnauthorized: true,
      ca: readFileSync(path.join(process.cwd(), "certs/rds-global-bundle.pem"), "utf8"),
    };
  }
  return true; // verify against the system CA store
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
