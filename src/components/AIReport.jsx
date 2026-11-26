'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  ChevronDown,
  Sparkles,
  Dumbbell,
  Briefcase,
  BookOpen,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SECTIONS = [
  {
    key: 'dominasi',
    icon: BrainCircuit,
    title: 'Analisis Dominasi & Arsitektur Kognitif',
    subtitle: 'Otak kiri vs kanan berdasarkan profil pilar',
    tone: 'from-indigo-500/15 text-indigo-600 dark:text-indigo-300',
  },
  {
    key: 'kekuatan',
    icon: Sparkles,
    title: 'Kekuatan Utama & Pola Pemecahan Masalah',
    subtitle: 'Dari ketepatan jawaban per kategori',
    tone: 'from-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  },
  {
    key: 'kelemahan',
    icon: Dumbbell,
    title: 'Area Kelemahan & Saran Latihan Otak',
    subtitle: 'Berdasarkan soal yang terlewat & salah',
    tone: 'from-rose-500/15 text-rose-600 dark:text-rose-300',
  },
  {
    key: 'karir',
    icon: Briefcase,
    title: 'Rekomendasi Karir & Bidang Industri',
    subtitle: 'Selaras dengan dominasi kognitif & latar belakang',
    tone: 'from-amber-500/15 text-amber-700 dark:text-amber-300',
  },
  {
    key: 'belajar',
    icon: BookOpen,
    title: 'Gaya Belajar Optimal & Tokoh Setara',
    subtitle: 'Strategi belajar + padanan tokoh dunia',
    tone: 'from-violet-500/15 text-violet-600 dark:text-violet-300',
  },
];

/**
 * Deep AI analysis — accordion of 5 structured sections.
 * `report` may be loading (null) or contain source: 'ai' | 'local'.
 */
export default function AIReport({ report, loading }) {
  const [open, setOpen] = useState('dominasi');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-[1.75rem] p-5 sm:p-7"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <BrainCircuit size={18} className="text-indigo-500" />
            Laporan Analisis AI Mendalam
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Evaluasi psikometrik dari Gemini atas telemetri performa Anda
          </p>
        </div>
        {!loading && report && (
          <span
            className={cn(
              'glass-pill',
              report.source === 'ai'
                ? '!border-emerald-500/40 !text-emerald-600 dark:!text-emerald-300'
                : '!border-amber-500/40 !text-amber-700 dark:!text-amber-300'
            )}
          >
            <ShieldCheck size={12} />
            {report.source === 'ai' ? 'Analisis Gemini' : 'Analisis Heuristik Lokal'}
          </span>
        )}
      </div>

      {/* ---------- loading skeleton ---------- */}
      {loading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Loader2 size={15} className="animate-spin text-indigo-500" />
            Gemini sedang menganalisis pola kognitif Anda…
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      )}

      {/* ---------- accordion ---------- */}
      {!loading && report && (
        <div className="space-y-2.5">
          {SECTIONS.map((s) => {
            const isOpen = open === s.key;
            const text = report[s.key];
            return (
              <div
                key={s.key}
                className={cn(
                  'overflow-hidden rounded-2xl border transition-colors duration-200',
                  isOpen
                    ? 'border-indigo-400/50 bg-white/60 dark:bg-slate-900/50'
                    : 'border-white/15 bg-white/35 dark:border-white/8 dark:bg-slate-900/30'
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : s.key)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br to-transparent',
                      s.tone
                    )}
                  >
                    <s.icon size={17} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-slate-800 dark:text-white">
                      {s.title}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      {s.subtitle}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-slate-400"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="whitespace-pre-line px-4 pb-4 pl-16 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {text || 'Bagian ini sedang tidak tersedia.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
