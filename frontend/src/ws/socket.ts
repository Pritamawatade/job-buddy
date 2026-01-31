import {io, Socket} from "socket.io-client";
import {env} from "../config/env";

export let socket: Socket

export function connectSocket(){
    socket = io(env.WS_URL,{
        path: "/ws",
        transports: ["websocket"],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        timeout: 20000
    });

    return socket;
}