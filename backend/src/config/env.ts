import { z } from "zod";
import "dotenv/config";
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.string().transform(Number),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  MONGO_URL: z.string(),
});

export const env = envSchema.parse(process.env)