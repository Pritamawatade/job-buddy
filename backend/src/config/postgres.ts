import { PrismaClient } from "../../generated/prisma/client";
import { logger } from "./logger";
import { env } from "./env";

// Set DATABASE_URL before creating PrismaClient
process.env.DATABASE_URL = env.DATABASE_URL;

export const prisma = new PrismaClient({
    log: ['error', 'warn']
} as any);

export async function connectPostgres(){
    try {
        await prisma.$connect();
        logger.info("postgres connected")
    } catch (error) {
        logger.fatal(error, "postgres connection failed")
        process.exit(1)
    }
}