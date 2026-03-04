// src/components/SplashScreen.tsx
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHiding(true);
      setTimeout(onDone, 600);
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-600"
      style={{
        opacity: hiding ? 0 : 1,
        pointerEvents: hiding ? "none" : "auto",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 40%, #0d1a3a 100%)",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400% center; }
          100% { background-position: 400% center; }
        }
        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(99,102,241,0.3); }
          50%       { text-shadow: 0 0 40px rgba(139,92,246,0.9), 0 0 80px rgba(99,102,241,0.5), 0 0 120px rgba(167,139,250,0.3); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .splash-title {
          font-size: clamp(2.5rem, 10vw, 4.5rem);
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: linear-gradient(
            90deg,
            #6366f1 0%,
            #a78bfa 20%,
            #f0abfc 40%,
            #ffffff 50%,
            #f0abfc 60%,
            #a78bfa 80%,
            #6366f1 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite, glow-pulse 2.5s ease-in-out infinite, fadeUp 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .splash-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          animation: glow-pulse 2.5s ease-in-out infinite;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <h1 className="splash-title">GymQuest</h1>
        {/* три точки-индикатор */}
        <div style={{ display: "flex", gap: "10px" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="splash-dot"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
