import { useEffect } from "react";
import { useSocket } from "./hooks/useSocket";
import { http } from "./api/http";
import { VoiceAgent } from "./components/VoiceAgent";

function App() {
  const { connected } = useSocket();

  useEffect(() => {
    // Check API health
    http.get("/health")
      .then((res) => {
        console.log("API OK:", res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 selection:bg-white/20">
      <div className="max-w-4xl w-full flex flex-col items-center gap-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            PREP<span className="text-white">IQ</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl font-medium">
            Master your mind with AI-driven philosophical guidance.
          </p>
        </header>

        <main className="w-full flex justify-center">
          <VoiceAgent />
        </main>

        <footer className="fixed bottom-8 flex items-center gap-4 text-xs font-mono tracking-widest uppercase text-neutral-500 bg-neutral-900/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
            WS: {connected ? "SYNCED" : "OFFLINE"}
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <div>READY TO LISTEN</div>
        </footer>
      </div>
    </div>
  );
}

export default App;
