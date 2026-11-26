'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

/**
 * Animated SVG arc gauge for the IQ score (70–160).
 * 240° sweep, gradient stroke, count-up number, percentile caption.
 */
export default function IQGauge({ iq, percentile, classification }) {
  const [mounted, setMounted] = useState(false);
  const motionIq = useMotionValue(70);

  useEffect(() => {
    setMounted(true);
    const controls = animate(motionIq, iq, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.25,
    });
    return () => controls.stop();
  }, [iq, motionIq]);

  const display = useTransform(motionIq, (v) => String(Math.round(v)));

  // geometry
  const SIZE = 260;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 100;
  const START = -210; // degrees
  const SWEEP = 240;

  const min = 70;
  const max = 160;
  const frac = Math.min(1, Math.max(0, (iq - min) / (max - min)));
  const angle = START + SWEEP * frac;

  const polar = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  };

  const arcPath = (from, to) => {
    const a = polar(from);
    const b = polar(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${a.x} ${a.y} A ${R} ${R} 0 ${large} 1 ${b.x} ${b.y}`;
  };

  // needle endpoint sweep: START → target angle, derived from a motion value
  const needleDeg = useMotionValue(START);
  useEffect(() => {
    const controls = animate(needleDeg, angle, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.25,
    });
    return () => controls.stop();
  }, [angle, needleDeg]);
  const needleRad = (deg) => (deg * Math.PI) / 180;
  const needleX = useTransform(needleDeg, (d) => CX + (R - 22) * Math.cos(needleRad(d)));
  const needleY = useTransform(needleDeg, (d) => CY + (R - 22) * Math.sin(needleRad(d)));

  const tierTone = {
    elite: 'from-amber-400 to-fuchsia-500',
    high: 'from-indigo-400 to-violet-500',
    above: 'from-sky-400 to-indigo-500',
    avg: 'from-emerald-400 to-cyan-500',
    below: 'from-orange-400 to-amber-500',
    low: 'from-rose-400 to-orange-500',
  };
  const tone = tierTone[classification?.tier] || tierTone.avg;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-indigo-500" stopColor="currentColor" />
              <stop offset="55%" className="text-violet-500" stopColor="currentColor" />
              <stop offset="100%" className="text-fuchsia-500" stopColor="currentColor" />
            </linearGradient>
            <filter id="gauge-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* track */}
          <path
            d={arcPath(START, START + SWEEP)}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* ticks */}
          {Array.from({ length: 10 }).map((_, i) => {
            const t = START + (SWEEP / 9) * i;
            const p1 = polar(t);
            const outer = R + 14;
            const rad = (t * Math.PI) / 180;
            const p2 = { x: CX + outer * Math.cos(rad), y: CY + outer * Math.sin(rad) };
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="currentColor"
                className="text-slate-300 dark:text-slate-700"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* value arc — animated via CSS var width using strokeDasharray */}
          {mounted && (
            <motion.path
              d={arcPath(START, START + SWEEP)}
              fill="none"
              stroke="url(#gauge-grad)"
              strokeWidth="16"
              strokeLinecap="round"
              filter="url(#gauge-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: frac }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            />
          )}

          {/* needle — animated via endpoints (no transform-origin pitfalls) */}
          <motion.line
            x1={CX}
            y1={CY}
            x2={needleX}
            y2={needleY}
            stroke="currentColor"
            className="text-rose-500"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={CX} cy={CY} r="9" className="fill-white dark:fill-slate-900" stroke="currentColor" strokeWidth="3" />

          {/* min / max labels */}
          <text x={CX - 86} y={CY + 84} fontSize="12" fontWeight="700" fill="currentColor" className="text-slate-400" textAnchor="middle">70</text>
          <text x={CX + 86} y={CY + 84} fontSize="12" fontWeight="700" fill="currentColor" className="text-slate-400" textAnchor="middle">160</text>
        </svg>

        {/* center number */}
        <div className="absolute inset-x-0 top-[42%] flex flex-col items-center">
          <motion.span className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text font-mono text-6xl font-extrabold tracking-tight text-transparent">
            {mounted ? display : 70}
          </motion.span>
          <span className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            IQ Score
          </span>
        </div>
      </div>

      {/* classification badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mt-1 flex flex-col items-center gap-2"
      >
        <span
          className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${tone} px-5 py-2 text-sm font-bold text-white shadow-lg`}
        >
          {classification?.label}
        </span>
        <span className="glass-pill !text-xs">
          Persentil {String(percentile).replace('.', ',')} — {classification?.top}
        </span>
      </motion.div>
    </motion.div>
  );
}
