'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  Timer,
  XCircle,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { DIFFICULTY_LABEL } from '@/lib/scoring';
import { cn, formatTime } from '@/lib/utils';

const CATEGORY_TONE = {
  Numerik: 'border-sky-500/40 bg-sky-500/15 text-sky-700 dark:text-sky-300',
  Verbal: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  Spasial: 'border-violet-500/40 bg-violet-500/15 text-violet-700 dark:text-violet-300',
  Logika: 'border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300',
};

const DIFF_TONE = {
  1: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  2: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  3: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
};

/**
 * ============================================================
 *  DISTRACTION-FREE GLASS TEST ARENA
 *  Progress · navigator pills · live countdown · flag ·
 *  prev/next · framer-motion transitions · auto-submit
 * ============================================================
 */
export default function TestArena({ questions, config, onFinish }) {
  const { play } = useSoundEffects();
  const total = questions.length;
  const totalSeconds = (config?.mode?.minutes || 15) * 60;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(total).fill(null));
  const [flags, setFlags] = useState(() => Array(total).fill(false));
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [direction, setDirection] = useState(1);
  const [confirmExit, setConfirmExit] = useState(false);

  const finishedRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const secondsRef = useRef(secondsLeft);
  secondsRef.current = secondsLeft;

  const finish = useCallback(
    (auto = false) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const timeUsedMs = Math.min(totalSeconds * 1000, Date.now() - startTimeRef.current);
      play('complete');
      onFinish({ answers: answersRef.current, timeUsedMs, auto });
    },
    [onFinish, play, totalSeconds]
  );

  // ---------- countdown ----------
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ---------- auto-submit at 0 ----------
  useEffect(() => {
    if (secondsLeft === 0) finish(true);
  }, [secondsLeft, finish]);

  // ---------- heartbeat tick when < 30s ----------
  useEffect(() => {
    if (secondsLeft > 0 && secondsLeft <= 30) play('tick');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  // ---------- keyboard nav ----------
  useEffect(() => {
    const onKey = (e) => {
      if (finishedRef.current) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (['1', '2', '3', '4'].includes(e.key)) selectOption(Number(e.key) - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  const q = questions[index];
  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;
  const critical = secondsLeft <= 30;

  const selectOption = (optIdx) => {
    if (!q) return;
    play('tap');
    setAnswers((prev) => {
      const nextA = [...prev];
      nextA[index] = optIdx;
      return nextA;
    });
  };

  const toggleFlag = () => {
    play('tap');
    setFlags((prev) => {
      const nextF = [...prev];
      nextF[index] = !nextF[index];
      return nextF;
    });
  };

  const go = (target) => {
    if (target < 0 || target >= total || target === index) return;
    setDirection(target > index ? 1 : -1);
    setIndex(target);
    play('tap');
  };
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  const isLast = index === total - 1;
  const selected = answers[index];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-10 pt-24 sm:pt-28">
      {/* ================= FLOATING TOP BAR ================= */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass sticky top-20 z-40 rounded-2xl px-4 py-3"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Timer */}
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-bold tabular-nums',
              critical
                ? 'animate-pulse-soft border-rose-500/60 bg-rose-500/15 text-rose-600 dark:text-rose-300'
                : 'border-white/25 bg-white/50 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200'
            )}
            title="Waktu tersisa"
          >
            <Timer size={14} />
            {formatTime(secondsLeft)}
          </div>

          {/* Progress */}
          <div className="min-w-[140px] flex-1">
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span>
                Soal {index + 1} / {total}
              </span>
              <span>{answeredCount} terjawab</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          {/* Flag */}
          <button
            type="button"
            onClick={toggleFlag}
            className={cn(
              'btn-icon !h-9 !w-9',
              flags[index] && 'border-amber-500/60 bg-amber-500/20 text-amber-600 dark:text-amber-300'
            )}
            title="Tandai soal"
          >
            <Flag size={15} fill={flags[index] ? 'currentColor' : 'none'} />
          </button>

          {/* Exit */}
          <button
            type="button"
            onClick={() => setConfirmExit(true)}
            className="btn-icon !h-9 !w-9"
            title="Keluar"
          >
            <XCircle size={15} />
          </button>
        </div>

        {/* Navigator pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {questions.map((_, i) => {
            const state =
              i === index ? 'current' : answers[i] !== null ? 'answered' : 'unanswered';
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Soal ${i + 1}`}
                className={cn(
                  'relative flex h-7 min-w-7 items-center justify-center rounded-lg border px-1.5 text-[11px] font-bold transition-all duration-150',
                  state === 'current' &&
                    'border-indigo-500 bg-indigo-500 text-white shadow-glow scale-110',
                  state === 'answered' &&
                    'border-emerald-500/40 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
                  state === 'unanswered' &&
                    'border-white/25 bg-white/40 text-slate-500 hover:border-indigo-300 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-400'
                )}
              >
                {i + 1}
                {flags[i] && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ================= QUESTION CARD ================= */}
      <div className="relative mt-6 flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          {q && (
            <motion.article
              key={q.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 56, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: direction * -56, filter: 'blur(6px)' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-[1.75rem] p-5 sm:p-8"
            >
              {/* badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('badge', CATEGORY_TONE[q.category] || CATEGORY_TONE.Logika)}>
                  {q.category}
                </span>
                <span className={cn('badge', DIFF_TONE[q.difficulty] || DIFF_TONE[2])}>
                  {DIFFICULTY_LABEL[q.difficulty] || 'Sedang'} · Level {q.difficulty}
                </span>
                <span className="glass-pill !text-[10px]">
                  <Sparkles size={11} className="text-violet-500" />
                  {q.id.startsWith('ai-') ? 'AI-Generated' : 'Bank Psikometrik'}
                </span>
                {flags[index] && (
                  <span className="badge border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <Flag size={10} fill="currentColor" /> Ditandai
                  </span>
                )}
              </div>

              {/* question */}
              <h2 className="mt-4 text-base font-semibold leading-relaxed text-slate-900 dark:text-white sm:text-lg">
                {q.question}
              </h2>

              {/* svg pattern */}
              {q.svgPattern && (
                <div className="puzzle-svg mt-5 rounded-2xl border border-white/15 bg-white/40 p-4 dark:border-white/10 dark:bg-slate-900/40"
                  dangerouslySetInnerHTML={{ __html: q.svgPattern }}
                />
              )}

              {/* options */}
              <div className="mt-6 grid gap-2.5">
                {q.options.map((opt, oi) => {
                  const isSvg = typeof opt === 'string' && opt.trim().startsWith('<svg');
                  const isSelected = selected === oi;
                  return (
                    <button
                      key={oi}
                      type="button"
                      data-state={isSelected ? 'selected' : undefined}
                      onClick={() => selectOption(oi)}
                      className="option-card group flex items-center gap-3"
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors',
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : 'border-slate-300/70 bg-white/60 text-slate-500 group-hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400'
                        )}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {isSvg ? (
                        <span
                          className="puzzle-svg !mx-0 !max-w-[220px] flex-1"
                          dangerouslySetInnerHTML={{ __html: opt }}
                        />
                      ) : (
                        <span className="flex-1">{opt}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className="btn-ghost"
        >
          <ChevronLeft size={16} /> Sebelumnya
        </button>

        {!isLast ? (
          <button type="button" onClick={next} className="btn-primary">
            Berikutnya <ChevronRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={() => finish(false)} className="btn-primary">
            <Send size={16} /> Kumpulkan Sekarang
          </button>
        )}
      </div>

      {answeredCount < total && !isLast && (
        <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-500">
          {total - answeredCount} soal belum terjawab — boleh tetap dikumpulkan.
        </p>
      )}

      {/* ================= EXIT CONFIRM ================= */}
      <AnimatePresence>
        {confirmExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={() => setConfirmExit(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-sm rounded-3xl p-6 text-center"
            >
              <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Keluar dari tes?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Progres dan waktu Anda tidak akan disimpan.
              </p>
              <div className="mt-5 flex gap-2">
                <button type="button" onClick={() => setConfirmExit(false)} className="btn-ghost flex-1">
                  Lanjut Tes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (finishedRef.current) return;
                    finishedRef.current = true;
                    window.location.reload();
                  }}
                  className="flex-1 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                >
                  Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit-all hint when time is tight */}
      <AnimatePresence>
        {answeredCount === total && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2"
          >
            <button type="button" onClick={() => finish(false)} className="btn-primary shadow-2xl">
              <CheckCircle2 size={16} /> Semua terjawab — Kumpulkan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
