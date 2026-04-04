// src/components/AnimatedFrame.tsx
// Animated avatar frame ring component (shared)

import React from 'react';

interface FrameCfg {
  ring: string;
  ring2?: string;
  glow: string;
  spinMs: number;
  spinMs2?: number;
  breathe?: boolean;
  flicker?: boolean;
}

export const FRAME_CFGS: Record<string, FrameCfg> = {
  frame_bronze: {
    ring: 'conic-gradient(from 0deg,transparent 0%,#78350f 8%,#b45309 28%,#d97706 48%,#fbbf24 55%,#d97706 65%,#78350f 73%,transparent 78%)',
    glow: '0 0 10px 2px rgba(180,83,9,0.55)',
    spinMs: 8000,
  },
  frame_silver: {
    ring: 'conic-gradient(from 0deg,transparent 0%,#6b7280 8%,#9ca3af 25%,#d1d5db 42%,#f3f4f6 55%,#d1d5db 70%,#9ca3af 80%,transparent 85%)',
    glow: '0 0 12px 3px rgba(156,163,175,0.55)',
    spinMs: 5000,
  },
  frame_gold: {
    ring: 'conic-gradient(from 0deg,transparent 0%,#78350f 5%,#b45309 15%,#d97706 28%,#fbbf24 45%,#fde68a 54%,#fbbf24 65%,#d97706 80%,#b45309 90%,transparent 95%)',
    glow: '0 0 16px 4px rgba(251,191,36,0.65)',
    spinMs: 4000,
  },
  frame_fire: {
    ring: 'conic-gradient(from 0deg,transparent 0%,#7f1d1d 5%,#dc2626 18%,#f97316 35%,#fbbf24 52%,#ef4444 67%,#dc2626 76%,transparent 82%)',
    ring2: 'conic-gradient(from 180deg,transparent 0%,#991b1b 10%,#f97316 38%,#fde047 50%,transparent 57%)',
    glow: '0 0 18px 5px rgba(249,115,22,0.75),0 0 34px 9px rgba(239,68,68,0.3)',
    spinMs: 3000,
    spinMs2: 4200,
    flicker: true,
  },
  frame_ice: {
    ring: 'conic-gradient(from 0deg,transparent 0%,#164e63 8%,#0891b2 20%,#22d3ee 42%,#a5f3fc 55%,#22d3ee 68%,#0891b2 80%,transparent 86%)',
    ring2: 'conic-gradient(from 90deg,transparent 0%,rgba(207,250,254,0.55) 8%,transparent 14%,rgba(165,243,252,0.35) 26%,transparent 33%)',
    glow: '0 0 18px 5px rgba(34,211,238,0.65),0 0 32px 9px rgba(6,182,212,0.3)',
    spinMs: 3500,
    spinMs2: 2200,
  },
  frame_lightning: {
    ring: 'conic-gradient(from 0deg,transparent 0%,#713f12 5%,#ca8a04 14%,#fef08a 38%,#fefce8 50%,#fef08a 62%,#ca8a04 72%,transparent 78%)',
    ring2: 'conic-gradient(from 180deg,transparent 0%,rgba(254,249,195,0.65) 7%,rgba(255,255,255,0.95) 13%,transparent 20%)',
    glow: '0 0 22px 6px rgba(250,204,21,0.9),0 0 42px 11px rgba(234,179,8,0.45),0 0 64px 18px rgba(250,204,21,0.2)',
    spinMs: 1500,
    spinMs2: 1800,
    flicker: true,
  },
  frame_dragon: {
    ring: 'conic-gradient(from 0deg,#7c3aed,#9d174d,#dc2626,#c2410c,#d97706,#eab308,#d97706,#dc2626,#9d174d,#7c3aed)',
    glow: '0 0 24px 7px rgba(124,58,237,0.75),0 0 46px 13px rgba(220,38,38,0.5),0 0 68px 18px rgba(217,119,6,0.3)',
    spinMs: 2000,
    breathe: true,
  },
  frame_galaxy: {
    ring: 'conic-gradient(from 0deg,#312e81,#7c3aed,#db2777,#0284c7,#0d9488,#7c3aed,#312e81)',
    ring2: 'conic-gradient(from 0deg,transparent 0%,rgba(255,255,255,0.35) 7%,transparent 15%,rgba(244,114,182,0.3) 30%,transparent 42%,rgba(167,139,250,0.3) 58%,transparent 68%)',
    glow: '0 0 26px 8px rgba(167,139,250,0.85),0 0 50px 15px rgba(244,114,182,0.6),0 0 72px 20px rgba(2,132,199,0.4)',
    spinMs: 1500,
    spinMs2: 2600,
    breathe: true,
    flicker: true,
  },
};

interface AnimatedFrameProps {
  frameId: string;
  size?: number;
  /** Tailwind classes appended to the inner cutout div (for bg color) */
  innerClassName?: string;
  children?: React.ReactNode;
}

export function AnimatedFrame({ frameId, size = 52, innerClassName = '', children }: AnimatedFrameProps) {
  const cfg = FRAME_CFGS[frameId];
  if (!cfg) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: '#1f2937', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={innerClassName}>
        {children}
      </div>
    );
  }

  const thickness = Math.max(3, Math.round(size * 3.5 / 52));

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, animation: cfg.breathe ? 'frame-breathe 2.5s ease-in-out infinite' : undefined }}>
      {/* Glow halo (blurred copy behind) */}
      <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: cfg.ring, filter: 'blur(9px)', opacity: 0.5, animation: `frame-spin ${cfg.spinMs}ms linear infinite` }} />
      {/* Main ring */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: cfg.ring, animation: `frame-spin ${cfg.spinMs}ms linear infinite`, boxShadow: cfg.glow }} />
      {/* Second ring layer */}
      {cfg.ring2 && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: cfg.ring2, animation: `frame-spin-rev ${cfg.spinMs2 ?? Math.round(cfg.spinMs * 1.4)}ms linear infinite`, opacity: 0.7 }} />
      )}
      {/* Flicker overlay */}
      {cfg.flicker && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.14) 0%,transparent 62%)', animation: 'frame-flicker 0.28s steps(2) infinite' }} />
      )}
      {/* Inner cutout — hides ring colours at centre, hosts avatar content */}
      <div
        className={innerClassName}
        style={{ position: 'absolute', inset: thickness, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {children}
      </div>
    </div>
  );
}
