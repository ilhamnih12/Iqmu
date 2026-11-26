'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { cn } from '@/lib/utils';

/**
 * Floating glass navbar — brand, dark/light toggle, mute toggle.
 */
export default function Navbar({ phase }) {
  const { muted, toggleMute, play } = useSoundEffects();
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try {
      localStorage.setItem('iqmetry-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
    play('tap');
  };

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="glass flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-5">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow">
            <Brain size={19} strokeWidth={2.2} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-white">
              IQMetry
            </p>
            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400 sm:block">
              Cognitive Assessment
            </p>
          </div>
        </div>

        {/* Phase indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="glass-pill hidden md:inline-flex"
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                phase === 'test' ? 'animate-pulse-soft bg-rose-500' : 'bg-emerald-500'
              )}
            />
            {phase === 'landing' && 'Survey Pra-Test'}
            {phase === 'test' && 'Sedang Berlangsung'}
            {phase === 'results' && 'Hasil & Analisis'}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toggleMute();
              if (muted) play('tap');
            }}
            className="btn-icon"
            aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'}
            title={muted ? 'Suara mati' : 'Suara aktif'}
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="btn-icon"
            aria-label={dark ? 'Mode terang' : 'Mode gelap'}
            title={dark ? 'Mode terang' : 'Mode gelap'}
          >
            {mounted && dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
