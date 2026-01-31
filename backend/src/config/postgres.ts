import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logger } from "./logger";
import { env } from "./env";

// Create the adapter with the connection string
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({
    adapter,
    log: ["error", "warn"]
});

export async function connectPostgres(){
    try {
        await prisma.$connect();
        logger.info("postgres connected");
    } catch (error) {
        logger.fatal(error, "postgres connection failed");
        process.exit(1);
    }
}