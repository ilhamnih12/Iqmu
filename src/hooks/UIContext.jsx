'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ============================================================
 *  UI CONTEXT — shared sound/mute state across the app
 * ============================================================
 */

const UIContext = createContext({
  muted: false,
  toggleMute: () => {},
  play: () => {},
});

export function UIProvider({ children }) {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('iqmetry-muted');
      if (stored === '1') {
        setMuted(true);
        mutedRef.current = true;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      try {
        localStorage.setItem('iqmetry-muted', next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const play = useCallback((name) => {
    if (mutedRef.current) return;
    try {
      soundEngine(name);
    } catch {
      /* audio unavailable — silent fail */
    }
  }, []);

  const value = useMemo(() => ({ muted, toggleMute, play }), [muted, toggleMute, play]);
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  return useContext(UIContext);
}

/* ============================================================
 *  WEB AUDIO ENGINE — synthesized SFX, zero MP3 files
 * ============================================================
 */

let audioCtx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

/** Soft glass tap — short filtered noise burst + sine blip. */
function playTap(ctx) {
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.14);

  // subtle airy layer
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(1760, now);
  gain2.gain.setValueAtTime(0.0001, now);
  gain2.gain.exponentialRampToValueAtTime(0.05, now + 0.004);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.1);
}

/** Heartbeat / tick for critical timer (< 30s). */
function playTick(ctx) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(68, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.32, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.18);

  // second thump (lub-dub)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(58, now + 0.11);
  gain2.gain.setValueAtTime(0.0001, now + 0.11);
  gain2.gain.exponentialRampToValueAtTime(0.2, now + 0.125);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now + 0.11);
  osc2.stop(now + 0.3);
}

/** Warm ambient chord on test completion. */
function playComplete(ctx) {
  const now = ctx.currentTime;
  const chord = [261.63, 329.63, 392.0, 523.25]; // C4 E4 G4 C5
  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = i === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    const start = now + i * 0.08;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.14, start + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.4);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 2.6);
  });

  // gentle shimmer
  const shimmer = ctx.createOscillator();
  const sg = ctx.createGain();
  shimmer.type = 'sine';
  shimmer.frequency.setValueAtTime(1046.5, now + 0.35);
  sg.gain.setValueAtTime(0.0001, now + 0.35);
  sg.gain.exponentialRampToValueAtTime(0.06, now + 0.7);
  sg.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
  shimmer.connect(sg).connect(ctx.destination);
  shimmer.start(now + 0.35);
  shimmer.stop(now + 2.4);
}

function soundEngine(name) {
  const ctx = getCtx();
  if (!ctx) return;
  switch (name) {
    case 'tap':
      playTap(ctx);
      break;
    case 'tick':
      playTick(ctx);
      break;
    case 'complete':
      playComplete(ctx);
      break;
    default:
      playTap(ctx);
  }
}

/**
 * useSoundEffects hook — components can call play('tap'|'tick'|'complete').
 * Respects the global mute state from UIContext.
 */
export function useSoundEffects() {
  const { play, muted, toggleMute } = useUI();
  return { play, muted, toggleMute };
}
