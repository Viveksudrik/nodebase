import { PrismaClient } from "@/generated/prisma";

// Default to the standard (binary/library) engine; avoid the "client" engine
// that requires an adapter/accelerateUrl. This helps if an env var like
// PRISMA_CLIENT_ENGINE_TYPE was set to "client" by accident.
// Force the engine type to "library" to ensure we don't accidentally use "client"
// which requires a driver adapter.
process.env.PRISMA_CLIENT_ENGINE_TYPE = "library";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined;
};

export const db =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = db;
}
