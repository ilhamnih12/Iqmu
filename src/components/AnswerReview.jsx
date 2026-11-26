'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ListChecks,
} from 'lucide-react';
import { DIFFICULTY_LABEL } from '@/lib/scoring';
import { cn } from '@/lib/utils';

const LETTERS = ['A', 'B', 'C', 'D'];

function isSvg(s) {
  return typeof s === 'string' && s.trim().startsWith('<svg');
}

function OptionLine({ label, text, state }) {
  if (isSvg(text)) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border px-3 py-2',
          state === 'correct' && 'border-emerald-500/60 bg-emerald-500/10',
          state === 'wrong' && 'border-rose-500/60 bg-rose-500/10',
          !state && 'border-white/15 bg-white/30 dark:border-white/8 dark:bg-slate-900/30'
        )}
      >
        <span className="text-xs font-bold text-slate-500">{label}</span>
        <span
          className="puzzle-svg !mx-0 !max-w-[160px]"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        {state === 'correct' && <CheckCircle2 size={16} className="ml-auto text-emerald-500" />}
        {state === 'wrong' && <XCircle size={16} className="ml-auto text-rose-500" />}
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-3 py-2 text-sm',
        state === 'correct' && 'border-emerald-500/60 bg-emerald-500/10 font-semibold text-emerald-800 dark:text-emerald-200',
        state === 'wrong' && 'border-rose-500/60 bg-rose-500/10 font-semibold text-rose-800 dark:text-rose-200',
        !state && 'border-white/15 bg-white/30 text-slate-600 dark:border-white/8 dark:bg-slate-900/30 dark:text-slate-400'
      )}
    >
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
      <span className="flex-1">{text}</span>
      {state === 'correct' && <CheckCircle2 size={16} className="text-emerald-500" />}
      {state === 'wrong' && <XCircle size={16} className="text-rose-500" />}
    </div>
  );
}

/**
 * Interactive answer review — accordion per question with
 * user answer vs correct answer + detailed explanation.
 */
export default function AnswerReview({ detail }) {
  const [open, setOpen] = useState(null);

  const correctCount = detail.filter((d) => d.isCorrect).length;
  const wrongCount = detail.filter((d) => !d.isCorrect && d.userAnswer !== null).length;
  const skipCount = detail.filter((d) => d.userAnswer === null || d.userAnswer === undefined).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-[1.75rem] p-5 sm:p-7"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <ListChecks size={18} className="text-violet-500" />
            Review Jawaban Lengkap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bandingkan jawaban Anda dengan kunci & penjelasan logis
          </p>
        </div>
        <div className="flex gap-1.5">
          <span className="badge border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 size={11} /> {correctCount} benar
          </span>
          <span className="badge border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300">
            <XCircle size={11} /> {wrongCount} salah
          </span>
          <span className="badge border-slate-400/40 bg-slate-400/15 text-slate-600 dark:text-slate-300">
            <MinusCircle size={11} /> {skipCount} kosong
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {detail.map((d, i) => {
          const isOpen = open === i;
          const skipped = d.userAnswer === null || d.userAnswer === undefined;
          return (
            <div
              key={d.question.id}
              className={cn(
                'overflow-hidden rounded-2xl border transition-colors',
                d.isCorrect
                  ? 'border-emerald-400/40'
                  : skipped
                    ? 'border-slate-400/40'
                    : 'border-rose-400/40'
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-3 bg-white/40 px-4 py-3 text-left dark:bg-slate-900/40"
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white',
                    d.isCorrect
                      ? 'bg-emerald-500'
                      : skipped
                        ? 'bg-slate-400'
                        : 'bg-rose-500'
                  )}
                >
                  {i + 1}
                </span>
                <span className="line-clamp-1 flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {d.question.question}
                </span>
                <span className="hidden gap-1.5 sm:flex">
                  <span className="badge border-white/20 bg-white/50 text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
                    {d.question.category}
                  </span>
                  <span className="badge border-white/20 bg-white/50 text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
                    L{d.question.difficulty}
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="text-slate-400"
                >
                  <ChevronDown size={17} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/55 dark:bg-slate-900/50"
                  >
                    <div className="space-y-2.5 px-4 py-4">
                      {/* question with svg */}
                      <div className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                        {d.question.question}
                      </div>
                      {d.question.svgPattern && (
                        <div
                          className="puzzle-svg !max-w-sm rounded-xl border border-white/15 bg-white/50 p-3 dark:border-white/8 dark:bg-slate-900/40"
                          dangerouslySetInnerHTML={{ __html: d.question.svgPattern }}
                        />
                      )}

                      {/* options */}
                      <div className="grid gap-1.5">
                        {d.question.options.map((opt, oi) => {
                          let state;
                          if (oi === d.question.correctAnswer) state = 'correct';
                          else if (oi === d.userAnswer) state = 'wrong';
                          return (
                            <OptionLine
                              key={oi}
                              label={LETTERS[oi]}
                              text={opt}
                              state={state}
                            />
                          );
                        })}
                      </div>

                      {/* verdict */}
                      <div
                        className={cn(
                          'flex items-start gap-2 rounded-xl px-3 py-2 text-xs font-medium',
                          d.isCorrect
                            ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                            : skipped
                              ? 'bg-slate-500/12 text-slate-600 dark:text-slate-300'
                              : 'bg-rose-500/12 text-rose-700 dark:text-rose-300'
                        )}
                      >
                        {d.isCorrect ? (
                          <>
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                            Benar · bobot {d.weight}× · kategori {d.question.category} ·{' '}
                            {DIFFICULTY_LABEL[d.question.difficulty]}
                          </>
                        ) : skipped ? (
                          <>
                            <MinusCircle size={14} className="mt-0.5 shrink-0" />
                            Tidak dijawab — bobot {d.weight}× tidak diperoleh
                          </>
                        ) : (
                          <>
                            <XCircle size={14} className="mt-0.5 shrink-0" />
                            Salah — jawaban Anda:{' '}
                            {d.question.options[d.userAnswer]}
                          </>
                        )}
                      </div>

                      {/* explanation */}
                      <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/8 px-3.5 py-2.5">
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                          Penjelasan Logis
                        </p>
                        <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                          {d.question.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
