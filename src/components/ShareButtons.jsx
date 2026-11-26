'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, MessageCircle, Check, Link2 } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

/**
 * Social sharing: Native Web Share API · WhatsApp · X/Twitter · Copy link.
 */
export default function ShareButtons({ survey, results }) {
  const { play } = useSoundEffects();
  const [copied, setCopied] = useState(false);

  const iq = results?.iq ?? 100;
  const percentile = results?.percentile ?? 50;
  const label = results?.classification?.label || 'Rata-rata';
  const name = survey?.name || 'Saya';

  const text = `🧠 Hasil Tes IQ ${name}: ${iq} IQ (Persentil ${String(percentile).replace('.', ',')} — ${label}) di IQMetry! Uji kecerdasan Numerik, Verbal, Spasial & Logika kamu sekarang.`;
  const url = typeof window !== 'undefined' ? window.location.origin : 'https://iqmetry.app';

  const shareNative = async () => {
    play('tap');
    if (navigator.share) {
      try {
        await navigator.share({ title: 'IQMetry — Hasil Tes IQ', text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  };

  const shareWhatsApp = () => {
    play('tap');
    const u = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    window.open(u, '_blank', 'noopener,noreferrer');
  };

  const shareX = () => {
    play('tap');
    const u = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(u, '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    play('tap');
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const supportsShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass flex flex-col items-center gap-4 rounded-[1.75rem] p-5 text-center sm:p-6"
    >
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Bagikan Hasil Anda</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pamerkan skor IQ ke teman & bandingkan kemampuan kognitif
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {supportsShare && (
          <button type="button" onClick={shareNative} className="btn-primary !py-2.5 !text-xs">
            <Share2 size={15} /> Bagikan
          </button>
        )}
        <button
          type="button"
          onClick={shareWhatsApp}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600 active:scale-95"
        >
          <MessageCircle size={15} /> WhatsApp
        </button>
        <button
          type="button"
          onClick={shareX}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X / Twitter
        </button>
        <button type="button" onClick={copyLink} className="btn-ghost !py-2.5 !text-xs">
          {copied ? <Check size={15} className="text-emerald-500" /> : <Link2 size={15} />}
          {copied ? 'Tersalin!' : 'Salin'}
        </button>
      </div>
    </motion.div>
  );
}
