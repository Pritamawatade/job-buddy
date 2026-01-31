import {Server} from "socket.io";
import http from "http";
import app from "./app";
import { env } from "./config/env";
import { connectPostgres } from "./config/postgres";
import { mongodbConnect } from "./config/mongodb";
import { logger } from "./config/logger";

const server  = http.createServer(app);

export const io = new Server(server, {
    path: "/ws",
    cors: { origin: "*", credentials: true}
}
);

async function bootstrap(){

    await connectPostgres();
    await mongodbConnect();
    server.listen(env.PORT, ()=>{
        logger.info(`server is running on port ${env.PORT}`);
    });

}

io.on("connection", (socket)=>{
    logger.info({ socketId: socket.id }, "WS client connected");



  socket.on("disconnect", (reason) => {
    logger.warn({ socketId: socket.id, reason }, "WS disconnected");
  });
});

bootstrap();