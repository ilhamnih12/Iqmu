'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CAT_COLOR = {
  Numerik: { hex: '#0ea5e9', bar: 'from-sky-400 to-sky-600' },
  Verbal: { hex: '#10b981', bar: 'from-emerald-400 to-emerald-600' },
  Spasial: { hex: '#8b5cf6', bar: 'from-violet-400 to-violet-600' },
  Logika: { hex: '#f59e0b', bar: 'from-amber-400 to-amber-600' },
};

/**
 * 4-Pillar cognitive breakdown:
 *  - SVG radar (animated polygon)
 *  - horizontal accuracy bars with subscores
 */
export default function CategoryBreakdown({ categories }) {
  const cats = categories || [];
  if (cats.length === 0) return null;

  // ---------- radar geometry ----------
  const SIZE = 280;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 96;
  const n = Math.max(3, cats.length);

  const pointAt = (i, radius) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
  };

  const ringPoints = (frac) =>
    Array.from({ length: n })
      .map((_, i) => {
        const p = pointAt(i, R * frac);
        return `${p.x},${p.y}`;
      })
      .join(' ');

  const valuePoints = cats
    .map((c, i) => {
      const p = pointAt(i, R * Math.max(0.12, c.pct / 100));
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-[1.75rem] p-5 sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ruptur 4 Pilar Kognitif
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Radar & akurasi per kategori (bobot kesulitan)
          </p>
        </div>
        <span className="glass-pill">Persentil per domain</span>
      </div>

      <div className="grid items-center gap-6 md:grid-cols-[280px_1fr]">
        {/* ---------- RADAR ---------- */}
        <div className="relative mx-auto w-full max-w-[280px]">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full">
            {/* rings */}
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <polygon
                key={f}
                points={ringPoints(f)}
                fill="none"
                stroke="currentColor"
                className="text-slate-300/80 dark:text-slate-700/80"
                strokeWidth="1"
              />
            ))}
            {/* axes */}
            {cats.map((c, i) => {
              const p = pointAt(i, R);
              return (
                <line
                  key={c.name}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  stroke="currentColor"
                  className="text-slate-300 dark:text-slate-700"
                  strokeWidth="1"
                />
              );
            })}
            {/* value polygon — draw-on + fade (avoids SVG transform-origin issues) */}
            <motion.polygon
              points={valuePoints}
              fill="url(#radar-fill)"
              stroke="url(#radar-stroke)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 1, pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
            {/* dots + labels */}
            {cats.map((c, i) => {
              const p = pointAt(i, R * Math.max(0.12, c.pct / 100));
              const lp = pointAt(i, R + 26);
              const color = CAT_COLOR[c.name]?.hex || '#6366f1';
              return (
                <g key={c.name}>
                  <circle cx={p.x} cy={p.y} r="4.5" fill={color} stroke="white" strokeWidth="1.5" />
                  <text
                    x={lp.x}
                    y={lp.y}
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="currentColor"
                    className="text-slate-600 dark:text-slate-300"
                  >
                    {c.name}
                  </text>
                </g>
              );
            })}
            <defs>
              <radialGradient id="radar-fill" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.18" />
              </radialGradient>
              <linearGradient id="radar-stroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ---------- BARS ---------- */}
        <div className="space-y-4">
          {cats.map((c, i) => {
            const color = CAT_COLOR[c.name] || CAT_COLOR.Logika;
            return (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    {c.name}
                    <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                      {c.correct}/{c.total} benar
                    </span>
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-800 dark:text-white">
                    {c.pct}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
                  <motion.div
                    className={cn('h-full rounded-full bg-gradient-to-r', color.bar)}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.pct}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: 0.15 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">
                  Subskor indeks: <strong className="text-slate-700 dark:text-slate-300">{c.subscore}</strong>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
