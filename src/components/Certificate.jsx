'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileImage, FileText, Loader2, ShieldCheck, GraduationCap } from 'lucide-react';
import { formatDateID, verificationHash, pseudoQrMatrix, cn } from '@/lib/utils';

/**
 * ============================================================
 *  CERTIFICATE OF COGNITIVE ASSESSMENT
 *  Glass/Gold/Modern Academic aesthetic.
 *  Exports: PNG (html2canvas hi-DPI) & PDF (landscape A4, jsPDF)
 * ============================================================
 */

function Signature() {
  return (
    <svg viewBox="0 0 180 54" className="h-12 w-40 text-slate-800 dark:text-slate-100" fill="none">
      <path
        d="M8 38 C 22 10, 34 8, 40 26 C 46 44, 56 44, 64 24 C 70 10, 82 12, 86 30 C 90 46, 104 42, 112 22 C 118 8, 132 12, 138 28 C 142 40, 154 38, 172 20"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M30 46 L 150 44" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function QrVisual({ hash }) {
  const matrix = useMemo(() => pseudoQrMatrix(hash, 21), [hash]);
  const cell = 4;
  const size = matrix.length * cell;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-20 w-20" aria-label="QR verifikasi">
      <rect width={size} height={size} fill="white" rx="4" />
      {matrix.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function Certificate({ survey, results }) {
  const certRef = useRef(null);
  const [busy, setBusy] = useState(null);

  const name = survey?.name || 'Peserta';
  const iq = results?.iq ?? 100;
  const percentile = results?.percentile ?? 50;
  const classification = results?.classification || { label: 'Rata-rata', top: 'Rata-rata' };
  const dateStr = formatDateID(new Date());

  const hash = useMemo(
    () => verificationHash(name, iq, `${results?.correct}-${results?.total}-${dateStr}`),
    [name, iq, results?.correct, results?.total, dateStr]
  );

  const cats = results?.categories || [];

  /** Prepare clean styles for html2canvas (it can't read backdrop-filter). */
  const prepareClone = () => {
    const el = certRef.current;
    if (!el) return null;
    el.classList.add('certificate-export');
    return el;
  };

  const restore = (el) => el?.classList.remove('certificate-export');

  const capture = async (scale = 3) => {
    const el = prepareClone();
    if (!el) throw new Error('Elemen sertifikat tidak ditemukan');
    try {
      const html2canvas = (await import('html2canvas')).default;
      // wait a frame so the class applies
      await new Promise((r) => setTimeout(r, 60));
      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
      });
      return canvas;
    } finally {
      restore(el);
    }
  };

  const downloadPng = async () => {
    setBusy('png');
    try {
      const canvas = await capture(3);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sertifikat-IQ-${name.replace(/\s+/g, '-')}-${iq}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('PNG export failed:', err);
      alert('Gagal membuat PNG. Coba lagi ya.');
    } finally {
      setBusy(null);
    }
  };

  const downloadPdf = async () => {
    setBusy('pdf');
    try {
      const canvas = await capture(3);
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageW = 297;
      const pageH = 210;
      const margin = 8;
      const imgW = pageW - margin * 2;
      const imgH = (canvas.height * imgW) / canvas.width;
      const finalH = Math.min(imgH, pageH - margin * 2);
      const finalW = (canvas.width * finalH) / canvas.height;
      const x = (pageW - finalW) / 2;
      const y = (pageH - finalH) / 2;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, finalW, finalH);
      pdf.save(`Sertifikat-IQ-${name.replace(/\s+/g, '-')}-${iq}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Gagal membuat PDF. Coba lagi ya.');
    } finally {
      setBusy(null);
    }
  };

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
            <GraduationCap size={18} className="text-amber-500" />
            Sertifikat Asesmen Kognitif
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ekspor resolusi tinggi — PNG (3× DPI) & PDF (A4 lanskap)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={downloadPng}
            disabled={!!busy}
            className="btn-primary !px-4 !py-2.5 !text-xs"
          >
            {busy === 'png' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileImage size={14} />
            )}
            Unduh PNG
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={!!busy}
            className="btn-ghost !px-4 !py-2.5 !text-xs"
          >
            {busy === 'pdf' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FileText size={14} />
            )}
            Unduh PDF
          </button>
        </div>
      </div>

      {/* ================= CERTIFICATE ================= */}
      <div
        ref={certRef}
        className={cn(
          'relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-amber-400/60',
          'bg-gradient-to-br from-white via-amber-50/60 to-indigo-50/70',
          'dark:from-[#0f172a] dark:via-[#111a33] dark:to-[#141d3f]',
          'shadow-glass-lg print:shadow-none'
        )}
        style={{ colorScheme: 'light' }}
      >
        {/* gold double frame */}
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-amber-400/50" />
        <div className="pointer-events-none absolute inset-[10px] rounded-lg border border-dashed border-amber-400/30" />

        {/* corner ornaments */}
        {[
          'left-3 top-3',
          'right-3 top-3 rotate-90',
          'right-3 bottom-3 rotate-180',
          'left-3 bottom-3 -rotate-90',
        ].map((pos) => (
          <span
            key={pos}
            className={`pointer-events-none absolute ${pos} h-8 w-8 border-l-2 border-t-2 border-amber-500/70 rounded-tl-md`}
          />
        ))}

        <div className="relative px-7 py-8 text-center sm:px-12 sm:py-10">
          {/* header */}
          <div className="mx-auto mb-1 flex items-center justify-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md">
              <ShieldCheck size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
              IQMetry Psychometric Lab
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold tracking-wide text-slate-900 dark:text-white sm:text-3xl">
            CERTIFICATE OF COGNITIVE ASSESSMENT
          </h2>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Sertifikat Asesmen Kognitif Resmi
          </p>

          <div className="mx-auto my-5 h-px w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <p className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Diberikan kepada
          </p>
          <p className="mt-2 break-words text-2xl font-bold italic text-indigo-700 dark:text-indigo-300 sm:text-3xl">
            {name}
          </p>

          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
            Telah menyelesaikan asesmen kognitif adaptif dengan hasil sebagai berikut:
          </p>

          {/* score row */}
          <div className="mt-5 flex flex-wrap items-stretch justify-center gap-3">
            <div className="min-w-[130px] rounded-xl border border-amber-400/50 bg-white/70 px-5 py-3 dark:bg-slate-900/60">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Skor IQ</p>
              <p className="font-mono text-4xl font-extrabold text-indigo-600 dark:text-indigo-300">
                {iq}
              </p>
            </div>
            <div className="min-w-[130px] rounded-xl border border-amber-400/50 bg-white/70 px-5 py-3 dark:bg-slate-900/60">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Persentil</p>
              <p className="font-mono text-4xl font-extrabold text-violet-600 dark:text-violet-300">
                {String(percentile).replace('.', ',')}
              </p>
            </div>
            <div className="min-w-[170px] rounded-xl border border-amber-400/50 bg-white/70 px-5 py-3 dark:bg-slate-900/60">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Klasifikasi</p>
              <p className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-300">
                {classification.label}
              </p>
            </div>
          </div>

          {/* breakdown */}
          <div className="mx-auto mt-5 grid max-w-lg grid-cols-4 gap-2">
            {cats.map((c) => (
              <div
                key={c.name}
                className="rounded-lg border border-white/40 bg-white/55 px-1.5 py-2 dark:border-white/10 dark:bg-slate-900/50"
              >
                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">{c.name}</p>
                <p className="font-mono text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {c.pct}%
                </p>
              </div>
            ))}
          </div>

          {/* footer: date · hash · signature · QR */}
          <div className="mt-7 grid grid-cols-1 items-end gap-5 sm:grid-cols-3">
            {/* date + hash */}
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Tanggal Terbit
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{dateStr}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                ID Verifikasi
              </p>
              <p className="font-mono text-[12px] font-bold text-indigo-600 dark:text-indigo-300">
                {hash}
              </p>
            </div>

            {/* signature */}
            <div className="flex flex-col items-center">
              <Signature />
              <p className="mt-1 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                Dr. Psychometra Nusantara
              </p>
              <p className="text-[9.5px] uppercase tracking-widest text-slate-500">
                Chief Assessment Officer
              </p>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center gap-1 sm:items-end">
              <QrVisual hash={hash} />
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                Pindai untuk verifikasi
              </p>
            </div>
          </div>

          <p className="mt-6 text-[9.5px] leading-snug text-slate-400 dark:text-slate-500">
            Dokumen ini dibuat secara otomatis oleh sistem IQMetry. Skor merupakan estimasi
            psikometrik edukatif (Mean 100 · SD 15) dan bukan diagnosis klinis.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-500">
        <Download size={12} />
        Ekspor berjalan sepenuhnya di browser Anda — data tidak dikirim ke mana pun.
      </div>
    </motion.div>
  );
}
