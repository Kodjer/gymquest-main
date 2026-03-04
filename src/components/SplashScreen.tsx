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
      // Ждём завершения анимации fade-out и только потом убираем
      setTimeout(onDone, 500);
    }, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-500"
      style={{ opacity: hiding ? 0 : 1, pointerEvents: hiding ? "none" : "auto" }}
    >
      <h1 className="text-4xl font-bold text-white tracking-widest uppercase">GymQuest</h1>
    </div>
  );
}
