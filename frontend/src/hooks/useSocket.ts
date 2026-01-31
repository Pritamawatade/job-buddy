import { useState, useEffect } from "react";
import { connectSocket, socket } from "../ws/socket";

export function useSocket() {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const s = connectSocket();

        s.connect();

        s.on("connect", () => {
            console.log("Ws connected", s.id);
            console.log("Socket instance : ", s);
            setConnected(true)
        })

     

        s.on("disconnect", (reason) => {
            console.log("Ws disconnected : ", reason);
            setConnected(false);
        });

        return () => {
            s.off("connect");
            s.off("disconnect");
            s.disconnect();
        };
    }, [])

    return { socket, connected };
}

