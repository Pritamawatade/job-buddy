import { useEffect } from "react";
import { useSocket } from "./hooks/useSocket";
import { http } from "./api/http";

function App() {
  const { socket, connected } = useSocket();

  useEffect(() => {
    // Check API health
    http.get("/health")
      .then((res) => {
        console.log("API OK:", res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });

    // Setup WebSocket event listeners
    const handlePong = (data: number) => {
      console.log("Pong data received", data);
    };

    if (connected && socket) {
      console.log("Setting up pong listener");
      socket.on("pong", handlePong);
      
      // Send initial ping
      socket.emit("ping", { time: Date.now() });
    }

    // Cleanup function
    return () => {
      if (socket) {
        console.log("Cleaning up pong listener");
        socket.off("pong", handlePong);
      }
    };
  }, [connected, socket]);

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Interview Platform</h1>

      <p>
        API Status: <b>Connected</b>
      </p>

      <p>
        WS Status:{" "}
        <b style={{ color: connected ? "green" : "red" }}>
          {connected ? "Connected" : "Disconnected"}
        </b>
      </p>

      <button
        onClick={() => {
          socket.emit("ping", { time: Date.now() });
        }}
      >
        Send WS Ping
      </button>
    </div>
  );
}

export default App;
