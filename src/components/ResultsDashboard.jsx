'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Clock,
  RotateCcw,
  ChevronUp,
  Sparkles,
  Crosshair,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import IQGauge from './IQGauge';
import CategoryBreakdown from './CategoryBreakdown';
import AIReport from './AIReport';
import AnswerReview from './AnswerReview';
import Certificate from './Certificate';
import ShareButtons from './ShareButtons';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { buildTelemetry } from '@/lib/scoring';
import { formatDuration, cn } from '@/lib/utils';

/**
 * ============================================================
 *  INTERACTIVE RESULTS DASHBOARD
 * 1. Animated IQ gauge + percentile + classification
 *  2. 4-pillar radar / bar breakdown
 *  3. Deep AI analysis (Gemini → heuristic fallback)
 *  4. Interactive answer review
 *  5. Certificate (PNG/PDF) + social sharing
 * ============================================================
 */
export default function ResultsDashboard({ survey, results, questions, onRestart }) {
  const { play } = useSoundEffects();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const firedRef = useRef(false);

  // ---------- celebration confetti + chord ----------
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const fire = () => {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.62 },
          colors: ['#6366f1', '#8b5cf6', '#a855f7', '#f59e0b', '#22d3ee'],
          disableForReducedMotion: true,
        });
        setTimeout(() => {
          confetti({
            particleCount: 55,
            angle: 60,
            spread: 60,
            origin: { x: 0 },
            colors: ['#6366f1', '#f59e0b', '#10b981'],
            disableForReducedMotion: true,
          });
          confetti({
            particleCount: 55,
            angle: 120,
            spread: 60,
            origin: { x: 1 },
            colors: ['#8b5cf6', '#ec4899', '#22d3ee'],
            disableForReducedMotion: true,
          });
        }, 350);
      } catch {
        /* ignore */
      }
    };
    fire();
    // sound handled by TestArena finish; extra soft tap here
    play('tap');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- AI report fetch ----------
  useEffect(() => {
    let alive = true;
    const telemetry = buildTelemetry({ survey, results, questions });

    (async () => {
      try {
        const res = await fetch('/api/analyze-iq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(telemetry),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive && data?.report) setReport(data.report);
      } catch (err) {
        console.warn('[ResultsDashboard] analyze-iq failed:', err);
        if (alive) {
          // Client-side heuristic fallback mirrors /api/analyze-iq shape
          setReport(await clientFallbackReport(telemetry));
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accuracyPct = Math.round(results.accuracy * 100);
  const stats = [
    {
      icon: Target,
      label: 'Ketepatan',
      value: `${accuracyPct}%`,
      sub: `${results.correct}/${results.total} benar`,
      tone: 'text-emerald-600 dark:text-emerald-300 from-emerald-500/15',
    },
    {
      icon: Clock,
      label: 'Waktu Terpakai',
      value: formatDuration(results.timeUsedMs),
      sub: `dari ${formatDuration(results.totalAllowedMs)}`,
      tone: 'text-sky-600 dark:text-sky-300 from-sky-500/15',
    },
    {
      icon: Crosshair,
      label: 'Bobot Terkumpul',
      value: `${results.earnedWeight}/${results.maxWeight}`,
      sub: results.randomClicking ? 'Deteksi klik acak aktif' : 'Efisiensi waktu dinilai',
      tone: 'text-violet-600 dark:text-violet-300 from-violet-500/15',
    },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-28 sm:pt-32">
      {/* ---------- HERO SCORE ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-[2rem] p-6 text-center sm:p-9"
      >
        <span className="glass-pill mx-auto">
          <Sparkles size={13} className="text-amber-500" />
          Hasil Asesmen · {survey?.mode?.label}
        </span>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {survey?.name}, inilah profil kognitif Anda
        </h1>

        <div className="mt-6 flex justify-center">
          <IQGauge
            iq={results.iq}
            percentile={results.percentile}
            classification={results.classification}
          />
        </div>

        {/* stat cards */}
        <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn(
                'rounded-2xl border border-white/20 bg-gradient-to-br to-transparent px-4 py-3.5 dark:border-white/10',
                s.tone
              )}
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider opacity-80">
                <s.icon size={13} /> {s.label}
              </div>
              <p className="mt-1 font-mono text-lg font-extrabold text-slate-800 dark:text-white">
                {s.value}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => { play('tap'); onRestart(); }} className="btn-primary">
            <RotateCcw size={16} /> Ulangi Tes
          </button>
          <button type="button" onClick={() => { play('tap'); document.getElementById('laporan')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-ghost">
            <Trophy size={16} /> Lihat Laporan Lengkap
          </button>
        </div>
      </motion.div>

      {/* ---------- CATEGORY BREAKDOWN ---------- */}
      <div className="mt-6">
        <CategoryBreakdown categories={results.categories} />
      </div>

      {/* ---------- AI REPORT ---------- */}
      <div id="laporan" className="mt-6 scroll-mt-28">
        <AIReport report={report} loading={loading} />
      </div>

      {/* ---------- ANSWER REVIEW ---------- */}
      <div className="mt-6">
        <AnswerReview detail={results.detail} />
      </div>

      {/* ---------- CERTIFICATE ---------- */}
      <div className="mt-6">
        <Certificate survey={survey} results={results} />
      </div>

      {/* ---------- SHARE ---------- */}
      <div className="mt-6">
        <ShareButtons survey={survey} results={results} />
      </div>

      {/* back to top */}
      <div className="mt-10 flex justify-center">
        <button type="button" onClick={scrollToTop} className="btn-ghost">
          <ChevronUp size={16} /> Kembali ke Atas
        </button>
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-500 dark:text-slate-500">
        Metodologi: bobot kesulitan (1×/1,5×/2,2×) × normalisasi usia ± bonus efisiensi waktu →
        distribusi normal μ=100, σ=15 (rentang 70–160). Edukatif, bukan diagnosis klinis.
      </p>
    </div>
  );
}

/** Last-resort client heuristic report if even the local API path fails (offline). */
async function clientFallbackReport(t) {
  try {
    const mod = await import('@/lib/report');
    return mod.generateLocalReport(t);
  } catch {
    return {
      dominasi: 'Analisis sedang tidak tersedia secara offline.',
      kekuatan: '—',
      kelemahan: '—',
      karir: '—',
      belajar: '—',
      source: 'local',
    };
  }
}
