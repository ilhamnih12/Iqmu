'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  CalendarRange,
  GraduationCap,
  Target,
  Gauge,
  Zap,
  Layers3,
  Rocket,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { FOCUS_OPTIONS } from '@/data/questionBank';
import { cn } from '@/lib/utils';

const AGE_BRACKETS = ['<18', '18-24', '25-34', '35-49', '50+'];

const BACKGROUNDS = [
  'Sains & Teknologi (STEM)',
  'Seni & Kreatif',
  'Bisnis & Sosial',
  'Umum / Pelajar',
];

const MODES = [
  {
    id: 'quick',
    label: 'Quick Blitz',
    count: 10,
    minutes: 5,
    desc: 'Estimasi Cepat — skor kasar dalam 5 menit.',
    icon: Zap,
    tone: 'from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    badge: 'Tercepat',
  },
  {
    id: 'standard',
    label: 'Standard Mensa Style',
    count: 20,
    minutes: 15,
    desc: 'Akurasi Optimal — rekomendasi mayoritas pengguna.',
    icon: Target,
    tone: 'from-indigo-500/15 to-indigo-500/5 text-indigo-600 dark:text-indigo-300 border-indigo-500/50',
    badge: 'Rekomendasi',
    featured: true,
  },
  {
    id: 'deep',
    label: 'Deep Cognitive',
    count: 30,
    minutes: 25,
    desc: 'Analisis Komprehensif — profil kognitif terlengkap.',
    icon: Layers3,
    tone: 'from-violet-500/15 to-violet-500/5 text-violet-600 dark:text-violet-300 border-violet-500/40',
    badge: 'Terlengkap',
  },
];

function Section({ icon: Icon, label, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        <Icon size={14} className="text-indigo-500" />
        {label}
      </div>
      {children}
    </motion.div>
  );
}

export default function SurveyForm({ onStart, loading }) {
  const { play } = useSoundEffects();
  const [name, setName] = useState('');
  const [ageBracket, setAgeBracket] = useState('18-24');
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [focusArea, setFocusArea] = useState(FOCUS_OPTIONS[0]);
  const [modeId, setModeId] = useState('standard');
  const [error, setError] = useState('');

  const mode = MODES.find((m) => m.id === modeId) || MODES[1];

  const submit = (e) => {
    e?.preventDefault?.();
    if (!name.trim()) {
      setError('Nama lengkap wajib diisi untuk sertifikat.');
      play('tick');
      return;
    }
    if (name.trim().length < 2) {
      setError('Nama terlalu pendek.');
      return;
    }
    setError('');
    play('tap');
    onStart({
      name: name.trim(),
      ageBracket,
      background,
      focusArea,
      mode: { id: mode.id, label: mode.label, count: mode.count, minutes: mode.minutes },
    });
  };

  const chip = (active) =>
    cn(
      'rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-200',
      active
        ? 'border-indigo-500/70 bg-indigo-500/15 text-indigo-700 shadow-glow dark:text-indigo-200'
        : 'border-white/25 bg-white/50 text-slate-600 hover:border-indigo-300/60 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-indigo-400/40'
    );

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong mx-auto grid max-w-4xl gap-7 rounded-[2rem] p-6 sm:p-9"
    >
      {/* Name */}
      <Section icon={User} label="Nama Lengkap (untuk sertifikat)" delay={0}>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="cth: Nadhira Putri Ramadhani"
          className="field"
          maxLength={80}
          autoComplete="name"
        />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-xs font-medium text-rose-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </Section>

      {/* Age */}
      <Section icon={CalendarRange} label="Rentang Usia" delay={0.05}>
        <div className="flex flex-wrap gap-2">
          {AGE_BRACKETS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAgeBracket(a);
                play('tap');
              }}
              className={cn(chip(ageBracket === a), 'px-4 py-2')}
            >
              {a === '<18' ? '< 18 tahun' : `${a} tahun`}
            </button>
          ))}
        </div>
      </Section>

      {/* Background */}
      <Section icon={GraduationCap} label="Latar Belakang Kognitif" delay={0.1}>
        <div className="grid gap-2 sm:grid-cols-2">
          {BACKGROUNDS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                setBackground(b);
                play('tap');
              }}
              className={chip(background === b)}
            >
              {b}
            </button>
          ))}
        </div>
      </Section>

      {/* Focus */}
      <Section icon={Target} label="Preferensi Area Fokus" delay={0.15}>
        <div className="grid gap-2 sm:grid-cols-2">
          {FOCUS_OPTIONS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFocusArea(f);
                play('tap');
              }}
              className={cn(chip(focusArea === f), 'flex items-center justify-between gap-2')}
            >
              <span>{f}</span>
              {f.includes('Rekomendasi') && (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-300">
                  Best
                </span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Mode */}
      <Section icon={Gauge} label="Mode Tes & Durasi" delay={0.2}>
        <div className="grid gap-3 md:grid-cols-3">
          {MODES.map((m) => {
            const active = modeId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setModeId(m.id);
                  play('tap');
                }}
                className={cn(
                  'relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200',
                  active
                    ? 'border-indigo-500/70 bg-indigo-500/12 shadow-glow'
                    : 'border-white/25 bg-white/50 hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900/40'
                )}
              >
                {m.featured && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                    {m.badge}
                  </span>
                )}
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br border',
                    m.tone
                  )}
                >
                  <m.icon size={17} />
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{m.label}</span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                  {m.count} Soal · {m.minutes} Menit
                </span>
                <span className="text-[11.5px] leading-snug text-slate-500 dark:text-slate-400">
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full py-4 text-base"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Menyiapkan Soal Adaptif…
          </>
        ) : (
          <>
            <Rocket size={18} />
            Mulai {mode.label} — {mode.count} Soal
            <ArrowRight size={17} />
          </>
        )}
      </motion.button>

      <p className="-mt-3 text-center text-[11px] text-slate-500 dark:text-slate-500">
        Soal dihasilkan hibrida oleh Gemini AI + bank psikometrik lokal. Jika AI sedang sibuk, bank
        lokal langsung mengambil alih — tes tetap berjalan normal.
      </p>
    </motion.form>
  );
}
