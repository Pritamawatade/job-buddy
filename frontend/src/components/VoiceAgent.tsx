import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';
import { http } from '../api/http';
import { Button } from './ui/button';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';


const NAVAL_INSTRUCTIONS = `
You are Naval Ravikant, the philosopher-investor. 
Your tone is calm, confident, and slightly detached, but deeply insightful.
You speak in short, punchy, and profound sentences. 
You focus on wealth, happiness, leverage, specific knowledge, and mental models.
You avoid filler words and social pleasantries. 
If someone asks for advice, give them a perspective that challenges their assumptions.
Use concepts like 'compounding', 'leverage', 'permissionless', and 'productizing yourself'.
Your goal is to help the user understand the reality of the world as it is, not as they wish it to be.
`;

export const VoiceAgent: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const sessionRef = useRef<RealtimeSession | null>(null);

  const startSession = useCallback(async () => {
    try {
      setStatus('connecting');

      const response = await http.get<{ value: string }>('/api/v1/interview/generate-connection-token');
      const ephemeralKey = response.data.value;

      const agent = new RealtimeAgent({
        name: 'Naval Ravikant',
        instructions: NAVAL_INSTRUCTIONS,
      });

      const session = new RealtimeSession(agent);
      sessionRef.current = session;

      // Handle session events
      session.on('audio_start', () => setIsSpeaking(true));
      session.on('audio_stopped', () => setIsSpeaking(false));
      session.on('error', (error) => {
        console.error('Session error:', error);
        setStatus('error');
      });

      await session.connect({
        apiKey: ephemeralKey,
      });

      setStatus('connected');
      console.log('Connected to Naval Agent');

      // Listen for disconnection on the transport layer
      session.transport.on('connection_change', (connectionStatus) => {
        if (connectionStatus === 'disconnected') {
          setStatus('idle');
          setIsSpeaking(false);
          sessionRef.current = null;
        }
      });


    } catch (error) {
      console.error('Failed to start session:', error);
      setStatus('error');
    }
  }, []);

  const stopSession = useCallback(async () => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
        console.log("Connection close ***")
      } catch (e) {
        console.error("Error disconnecting:", e);
      }

      setStatus('idle');
      sessionRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
      }
    };
  }, []);
  return (
    <div className="flex flex-col items-center gap-8 p-10 rounded-[2.5rem] bg-neutral-900/50 backdrop-blur-xl border border-white/5 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-md transition-all duration-500">
      <div className="relative group">
        <div className={`absolute -inset-1 rounded-full opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 blur-xl ${status === 'connected' ? 'bg-blue-500' : 'bg-white'
          }`}></div>
        <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 ${status === 'connected' ? (isSpeaking ? 'bg-blue-500/20 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-blue-500/10 scale-100') :
            status === 'connecting' ? 'bg-neutral-800 animate-pulse' :
              'bg-neutral-800'
          }`}>
          {status === 'connected' ? (
            isSpeaking ? <Volume2 className="w-16 h-16 text-blue-400 animate-bounce" /> : <Mic className="w-16 h-16 text-blue-400" />
          ) : status === 'connecting' ? (
            <Loader2 className="w-16 h-16 text-neutral-600 animate-spin" />
          ) : (
            <MicOff className="w-16 h-16 text-neutral-700" />
          )}

          {status === 'connected' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-neutral-900 shadow-lg shadow-green-500/50"></div>
          )}
        </div>
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Naval AI</h2>
        <div className="h-6 flex items-center justify-center">
          <p className="text-neutral-400 text-sm font-medium tracking-wide">
            {status === 'idle' && "THE ALMANACK IS OPEN"}
            {status === 'connecting' && "SUMMONING THE SAGE..."}
            {status === 'connected' && (isSpeaking ? "NAVAL IS SHARING WISDOM" : "NAVAL IS LISTENING")}
            {status === 'error' && "THE VIBE IS OFF. TRY AGAIN."}
          </p>
        </div>
      </div>

      <div className="w-full pt-4">
        {status === 'idle' || status === 'error' ? (
          <Button
            onClick={startSession}
            className="w-full bg-white text-black hover:bg-neutral-200 h-14 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-white/5"
          >
            START DIALOGUE
          </Button>
        ) : (
          <Button
            onClick={stopSession}
            variant="destructive"
            className="w-full h-14 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-red-500/10"
          >
            END SESSION
          </Button>
        )}
      </div>
    </div>
  );
};
