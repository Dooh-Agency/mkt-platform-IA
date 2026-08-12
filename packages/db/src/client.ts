import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __doohPrisma: PrismaClient | undefined;
}

/**
 * Singleton del cliente Prisma. En dev, se reutiliza en globalThis para
 * evitar agotar conexiones con el hot-reload de Next.js.
 */
export const prisma = globalThis.__doohPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__doohPrisma = prisma;
}

export * from "@prisma/client";
