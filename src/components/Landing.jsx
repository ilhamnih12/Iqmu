'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  LineChart,
  Award,
  ArrowDown,
  Cpu,
  Timer,
  Layers,
} from 'lucide-react';
import SurveyForm from './SurveyForm';

const METHODOLOGY = [
  {
    icon: LineChart,
    title: 'Skoring Bel Lonceng',
    desc: 'Mean 100, SD 15 (rentang 70–160) dengan bobot kesulitan soal, normalisasi usia, dan bonus efisiensi waktu.',
    accent: 'from-indigo-500/15 to-indigo-500/5 text-indigo-600 dark:text-indigo-300',
  },
  {
    icon: Cpu,
    title: 'Generator Hibrida AI',
    desc: 'Soal adaptif dari Gemini 1.5 Flash yang digabung dengan bank psikometrik lokal 36 soal — tes tidak pernah gagal muat.',
    accent: 'from-violet-500/15 to-violet-500/5 text-violet-600 dark:text-violet-300',
  },
  {
    icon: ShieldCheck,
    title: 'Anti-Rate-Limit',
    desc: 'Lapisan fallback kritis: jika API AI sedang sibuk, bank lokal berisi puzzle matriks SVG langsung mengambil alih.',
    accent: 'from-cyan-500/15 to-cyan-500/5 text-cyan-700 dark:text-cyan-300',
  },
  {
    icon: Award,
    title: 'Sertifikat Resmi',
    desc: 'Sertifikat PNG & PDF resolusi tinggi dengan hash verifikasi unik, QR visual, dan tanda tangan digital.',
    accent: 'from-amber-500/15 to-amber-500/5 text-amber-700 dark:text-amber-300',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Landing({ onStart, loading }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:pt-32">
      {/* ================= HERO ================= */}
      <section className="flex flex-col items-center text-center">
        <motion.span
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass-pill mb-5"
        >
          <Sparkles size={13} className="text-amber-500" />
          Berbasis Metodologi Psikometrik · Didukung Gemini AI
        </motion.span>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
        >
          Ukur Kecerdasan Anda dengan{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Presisi Ilmiah
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
        >
          Tes IQ adaptif 10–30 soal yang mengukur empat pilar kognitif —{' '}
          <strong className="font-semibold text-slate-800 dark:text-white">Numerik, Verbal, Spasial, Logika</strong>{' '}
          — dengan skoring bel lonceng nyata, analisis mendalam AI, dan sertifikat resmi.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#survey" className="btn-primary">
            Mulai Tes Sekarang
            <ArrowDown size={16} />
          </a>
          <span className="glass-pill">
            <Timer size={13} /> 5–25 menit
          </span>
          <span className="glass-pill">
            <Layers size={13} /> 3 mode · 36+ soal
          </span>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="glass mt-12 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-3xl sm:grid-cols-4"
        >
          {[
            ['4', 'Pilar Kognitif'],
            ['100±15', 'Skala Standar'],
            ['36+', 'Bank Soal Autentik'],
            ['2', 'Format Sertifikat'],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center gap-0.5 bg-transparent px-3 py-4">
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-300">{v}</span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {l}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================= METHODOLOGY ================= */}
      <section className="mt-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
        >
          Metodologi Ilmiah
        </motion.h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METHODOLOGY.map((m, i) => (
            <motion.article
              key={m.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              className="glass group rounded-3xl p-5 text-left transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${m.accent} transition-transform duration-300 group-hover:scale-110`}
              >
                <m.icon size={20} />
              </span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">{m.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                {m.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ================= SURVEY ================= */}
      <section id="survey" className="mt-24 scroll-mt-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Survey Adaptif Pra-Test
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            Data ini menyesuaikan tingkat kesulitan, fokus kategori, dan normalisasi usia skor Anda.
          </p>
        </motion.div>

        <SurveyForm onStart={onStart} loading={loading} />
      </section>

      {/* Footer note */}
      <p className="mt-16 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-500">
        Hasil bersifat edukatif dan bukan diagnosis klinis. Dibangun dengan Next.js · Tailwind ·
        Framer Motion · Gemini AI.
      </p>
    </div>
  );
}
