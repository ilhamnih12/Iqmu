'use client';

/**
 * useSoundEffects — re-exported from UIContext for ergonomic imports.
 * Provides { play, muted, toggleMute } backed by the native Web Audio API.
 *
 * Sounds:
 *  - play('tap')      soft glass-tap on buttons/options
 *  - play('tick')     heartbeat when timer < 30s
 *  - play('complete') warm ambient chord on completion
 */
export { useSoundEffects, UIProvider, useUI } from './UIContext';
