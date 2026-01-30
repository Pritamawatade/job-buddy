import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export async function mongodbConnect(){
    try {
        await mongoose.connect(env.MONGO_URL)
        logger.info("MongoDB connected")
    } catch (error) {
        logger.fatal(error, "MongoDB connection failed")
        process.exit(1);
    }
}