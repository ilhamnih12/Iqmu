/**
 * ============================================================
 *  HEURISTIC AI REPORT FALLBACK
 * ============================================================
 *  Used automatically when /api/analyze-iq cannot reach Gemini
 *  (missing API key, rate limit, timeout, network error).
 *  Produces the same structured shape as the Gemini response so
 *  the results dashboard renders identically in both cases.
 * ============================================================
 */

const CATEGORY_ADVICE = {
  Numerik: {
    drill: 'Latihan deret angka, proporsi, dan soal cerita cepat 15 menit/hari (Mathway-style drills).',
    strength: 'pemrosesan kuantitatif dan pola numerik',
  },
  Verbal: {
    drill: 'Baca 1 artikel padat/hari lalu rangkum dengan 3 kalimat; mainkan teka-teki sinonim-antonim.',
    strength: 'reasoning verbal dan pemahaman linguistik',
  },
  Spasial: {
    drill: 'Mainkan puzzle rotasi mental (mental rotation), origami, dan latihan matriks Raven 10 menit/hari.',
    strength: 'visualisasi spasial dan manipulasi mental bentuk',
  },
  Logika: {
    drill: 'Latihan silogisme formal, truth-teller puzzle, dan penarikan kesimpulan dari premis 10 menit/hari.',
    strength: 'penalaran deduktif dan struktural',
  },
};

const CAREER_MAP = {
  Numerik: [
    'Data Scientist / Analis Kuantitatif',
    'Akuntan Publik / Auditor',
    'Aktuaris',
    'Insinyur / Teknisi',
  ],
  Verbal: [
    'Pengacara / Legal Counsel',
    'Penyunting & Penulis',
    'Humas & Komunikasi',
    'Dosen / Trainer',
  ],
  Spasial: [
    'Arsitek',
    'Desainer Produk / UX',
    'Radiolog / Bedah',
    'Pilot & Navigasi',
  ],
  Logika: [
    'Software Engineer',
    'Konsultan Strategi',
    'Peneliti / Ilmuwan',
    'Manajer Operasi',
  ],
};

const LEARN_MAP = {
  Numerik: 'Visual-kuantitatif: belajar lewat contoh bernomor, grafik, dan latihan berulang dengan umpan balik instan.',
  Verbal: 'Verbal-linguistik: belajar lewat diskusi, membaca aktif, dan menjelaskan konsep dengan kata-kata sendiri.',
  Spasial: 'Visual-spasial: belajar lewat diagram, mind-map, model 3D, dan demo langsung.',
  Logika: 'Analitis-struktural: belajar lewat kerangka logis, flowchart, studi kasus if-then, dan brainstorming terstruktur.',
};

const FIGURE_MAP = {
  Numerik: 'Kemampuan kuantitatif setara dengan pola pikir matematikawan seperti Terence Tao dan Katherine Johnson.',
  Verbal: 'Kemampuan verbal-linguistik setara dengan pola pikir penulis dan negosiator ulung seperti Goenawan Mohamad.',
  Spasial: 'Kemampuan spasial setara dengan pola pikir arsitek dan desainer visioner seperti Zaha Hadid.',
  Logika: 'Kemampuan logis-setara dengan pola pikir ilmuwan komputer seperti Alan Turing dan Grace Hopper.',
};

function pct(n) {
  return `${n}%`;
}

/**
 * @param {Object} telemetry - payload built by buildTelemetry()
 * @returns {Object} structured report identical to Gemini's schema
 */
export function generateLocalReport(telemetry) {
  const t = telemetry;
  const cats = t.perKategori || [];
  const sorted = [...cats].sort((a, b) => b.persen - a.persen);
  const best = sorted[0] || { kategori: 'Logika', persen: 60 };
  const worst = sorted[sorted.length - 1] || best;
  const balanced = sorted.length > 0 && sorted[0].persen - sorted[sorted.length - 1].persen <= 15;

  const iq = t.skorIQ;
  const band =
    iq >= 130
      ? 'zona superior yang sangat langka'
      : iq >= 120
        ? 'zona superior'
        : iq >= 110
          ? 'zona di atas rata-rata'
          : iq >= 90
            ? 'zona rata-rata normal'
            : 'zona yang masih dalam rentang populasi umum';

  const dominance =
    iq >= 120
      ? `Arsitektur kognitif Anda condong ke **${best.kategori}** dengan penguasaan ${pct(best.persen)} pada pilar tersebut — indikasi dominasi ${best.kategori === 'Verbal' || best.kategori === 'Logika' ? 'hemisfer kiri (analitis-verbal)' : 'hemisfer kanan (spasial-intuitif)'}. Secara keseluruhan Anda berada di ${band} dengan skor IQ ${iq} (persentil ${t.persentil}). ${
          balanced ? 'Profil Anda tergolong *seimbang* — jarang ada pilar yang tertinggal jauh, ciri khas pemikir generalis yang kuat.' : `Kesenjangan ${best.kategori}–${worst.kategori} sebesar ${Math.max(0, best.persen - worst.persen)} poin menunjukkan spesialisasi kognitif yang tajam.`
        }`
      : `Pola pemrosesan Anda menonjol pada **${best.kategori}** (${pct(best.persen)}) dan masih memiliki ruang tumbuh pada **${worst.kategori}** (${pct(worst.persen)}). Skor IQ ${iq} menempatkan Anda di ${band}. Dengan latihan terarah, pilar yang tertinggal biasanya menunjukkan perbaikan terukur dalam 4–6 minggu konsisten.`;

  const strengths = `Kekuatan utama Anda terletak pada **${best.kategori}** (${pct(best.persen)} benar${
    best.kategori ? `, ${best.kategori === 'Numerik' ? 'terbukti dari ketepatan menjawab soal deret, proporsi, dan cerita kuantitatif' : best.kategori === 'Verbal' ? 'terbukti dari ketepatan analogi, sinonim, dan inferensi verbal' : best.kategori === 'Spasial' ? 'terbukti dari ketepatan membaca rotasi, progresi, dan matriks visual' : 'terbukti dari ketepatan penalaran deduktif dan pola struktural'}` : ''}). Pola pemecahan masalah Anda cenderung **${iq >= 120 ? 'cepat dan sistematis — Anda mengenali struktur masalah sebelum mengeksekusi' : 'metodatis — Anda membangun jawaban langkah demi langkah dengan tepat'}**. Tingkat ketelitian keseluruhan ${pct(t.akurasi.persen)} dengan hanya ${t.akurasi.kosong} soal terlewat menunjukkan disiplin kognitif yang baik di bawah tekanan waktu (${t.waktu.terpakaiDetik} detik dari ${t.waktu.totalDetik} detik tersedia).`;

  const weakness = `Area latihan prioritas: **${worst.kategori}** (${pct(worst.persen)} benar — ${worst.kategori === t.perKategori?.[0]?.kategori ? 'pilar terlemah' : 'pilar terlemah relatif'}). ${CATEGORY_ADVICE[worst.kategori]?.drill || 'Latihan terstruktur 15 menit/hari.'} Kesalahan Anda${
    t.kesalahan?.length ? ` didominasi soal berkategori ${[...new Set(t.kesalahan.map((m) => m.kategori))].slice(0, 3).join(', ')} — pola umum: ${t.kesalahan[0]?.kesulitan === 3 ? 'soal berbobot tinggi yang menuntut dua langkah penalaran sekaligus' : 'soal tingkat sedang yang membutuhkan ketelitian ekstra'}.` : ' tersebar merata antar kategori.'
  } Rekomendasi: dedikasikan blok latihan khusus ${worst.kategori} 10–15 menit setiap hari selama 30 hari, lalu ulangi tes untuk mengukur progres.`;

  const career = `Berdasarkan profil ${best.kategori}-dominan Anda dengan fondasi ${t.latarBelakang}, jalur karir yang paling selaras: **${(CAREER_MAP[best.kategori] || CAREER_MAP.Logika).slice(0, 3).join('**, **')}**. ${
    best.kategori === worst.kategori ? '' : `Untuk menyeimbangkan profil, bidang ${worst.kategori} juga membuka peluang seperti ${(CAREER_MAP[worst.kategori] || [])[0]}.`
  } Dengan latar belakang ${t.latarBelakang}, kombinasi terbaik adalah memadukan ${CATEGORY_ADVICE[best.kategori]?.strength || 'kekuatan inti'} dengan domain keahlian Anda — misalnya peran analyst/strategist yang menuntut sintesis ${best.kategori} dan ${worst.kategori} sekaligus.`;

  const learning = `${LEARN_MAP[best.kategori] || LEARN_MAP.Logika} Gaya belajar optimal Anda: **${best.kategori === 'Numerik' || best.kategori === 'Logika' ? 'urutan logis — teori singkat → contoh → latihan → refleksi' : 'eksplorasi terbuka — eksposisi → eksperimen → umpan balik'}**, dengan sesi fokus 25 menit (teknik Pomodoro) dan review spaced repetition setiap 3 hari. ${FIGURE_MAP[best.kategori] || FIGURE_MAP.Logika} Mulai dari latihan ${worst.kategori} 10 menit/hari untuk memperluas rentang kognitif Anda.`;

  return {
    dominasi: dominance.replace(/\*\*/g, '').replace(/\*/g, ''),
    kekuatan: strengths.replace(/\*\*/g, '').replace(/\*/g, ''),
    kelemahan: weakness.replace(/\*\*/g, '').replace(/\*/g, ''),
    karir: career.replace(/\*\*/g, '').replace(/\*/g, ''),
    belajar: learning.replace(/\*\*/g, '').replace(/\*/g, ''),
    source: 'local',
  };
}
