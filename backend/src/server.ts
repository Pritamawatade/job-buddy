import {Server} from "socket.io"
import http from "http"
import app from "./app"
import { env } from "./config/env";
import { connectPostgres } from "./config/postgres";
import { mongodbConnect } from "./config/mongodb";
import { logger } from "./config/logger";

const server  = http.createServer(app);

export const io = new Server(server, {
    cors: { origin: "*"}
});

async function bootstrap(){

    await connectPostgres();
    await mongodbConnect();
    server.listen(env.PORT, ()=>{
        logger.info(`server is running on port ${env.PORT}`);
    });

}

io.on("connection", (socket)=>{
    console.log("user connected", socket.id);
})

bootstrap()