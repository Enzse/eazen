import { PrismaClient } from '$lib/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { DATABASE_URL } from '$env/static/private';

// Prevents the Prisma client from creating multiple connections in dev mode (HMR).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
	globalForPrisma.prisma ??
		new PrismaClient({
			adapter: new PrismaBetterSqlite3({ url: DATABASE_URL })
		});

if (!globalForPrisma.prisma) {
	globalForPrisma.prisma = prisma;
}

