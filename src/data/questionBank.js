/**
 * ============================================================
 *  LOCAL PSYCHOMETRIC QUESTION BANK (CRITICAL RELIABILITY LAYER)
 * ============================================================
 *  36 authentic Indonesian IQ questions — 9 per category:
 *  Numerik · Verbal · Spasial · Logika
 *  Including inline <svg> geometric progression / matrix puzzles.
 *
 *  This bank guarantees /api/generate-questions NEVER fails:
 *  Gemini output is merged on top; missing slots are always
 *  filled from here (rate limits, timeouts, missing API key).
 *
 *  Schema (matches Gemini contract):
 *  { id, category, difficulty(1-3), question, svgPattern|null,
 *    options[4], correctAnswer(0-3), explanation }
 * ============================================================
 */

export const ALL_CATEGORIES = ['Numerik', 'Verbal', 'Spasial', 'Logika'];

export const FOCUS_OPTIONS = [
  'Campuran Seimbang (Rekomendasi)',
  'Logika & Matematika',
  'Verbal & Silogisme',
  'Spasial & Visual (Pola Gambar)',
];

/** Focus → category weight map used to tailor the selection. */
const FOCUS_WEIGHTS = {
  'Campuran Seimbang (Rekomendasi)': { Numerik: 0.25, Verbal: 0.25, Spasial: 0.25, Logika: 0.25 },
  'Logika & Matematika': { Numerik: 0.3, Verbal: 0.15, Spasial: 0.2, Logika: 0.35 },
  'Verbal & Silogisme': { Numerik: 0.15, Verbal: 0.35, Spasial: 0.15, Logika: 0.35 },
  'Spasial & Visual (Pola Gambar)': { Numerik: 0.15, Verbal: 0.15, Spasial: 0.35, Logika: 0.35 },
};

const SVG_ATTRS = 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"';

/** Cell frame helper for sequence puzzles. */
function frame(x, inner) {
  return `<rect x="${x}" y="6" width="68" height="68" rx="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="2" fill="none"/>${inner}`;
}

export const QUESTION_BANK = [
  /* ==========================================================
   *  NUMERIK (9)
   * ========================================================== */
  {
    id: 'num-01',
    category: 'Numerik',
    difficulty: 1,
    question: 'Deret angka berikut: 3, 7, 11, 15, ... Angka apa yang muncul berikutnya?',
    svgPattern: null,
    options: ['17', '18', '19', '21'],
    correctAnswer: 2,
    explanation:
      'Deret aritmetika dengan selisih tetap +4. Setelah 15, hitung 15 + 4 = 19.',
  },
  {
    id: 'num-02',
    category: 'Numerik',
    difficulty: 1,
    question: 'Berapa hasil dari 15% dari 240?',
    svgPattern: null,
    options: ['24', '30', '36', '48'],
    correctAnswer: 2,
    explanation: '15% = 15/100 = 0,15. Maka 0,15 × 240 = 36.',
  },
  {
    id: 'num-03',
    category: 'Numerik',
    difficulty: 2,
    question: 'Deret angka: 2, 6, 18, 54, ... Berapa angka berikutnya?',
    svgPattern: null,
    options: ['108', '144', '162', '216'],
    correctAnswer: 2,
    explanation:
      'Deret geometri dengan rasio ×3 (tiap bilangan dikalikan 3). 54 × 3 = 162.',
  },
  {
    id: 'num-04',
    category: 'Numerik',
    difficulty: 2,
    question:
      'Lima mesin membutuhkan 5 menit untuk membuat 5 produk. Jika 100 mesin bekerja dengan kecepatan sama, berapa menit yang dibutuhkan untuk membuat 100 produk?',
    svgPattern: null,
    options: ['5 menit', '20 menit', '100 menit', '500 menit'],
    correctAnswer: 0,
    explanation:
      'Setiap mesin menghasilkan 1 produk per 5 menit. 100 mesin menghasilkan 100 produk dalam waktu yang sama, yaitu 5 menit. Ini soal penipuan visual — jangan terjebak perkalian silang.',
  },
  {
    id: 'num-05',
    category: 'Numerik',
    difficulty: 2,
    question: 'Deret Fibonacci: 1, 1, 2, 3, 5, 8, ... Angka apa berikutnya?',
    svgPattern: null,
    options: ['11', '12', '13', '15'],
    correctAnswer: 2,
    explanation: 'Setiap angka adalah jumlah dua angka sebelumnya: 5 + 8 = 13.',
  },
  {
    id: 'num-06',
    category: 'Numerik',
    difficulty: 2,
    question:
      'Manakah bilangan yang TIDAK termasuk dalam deret berikut: 4, 9, 16, 25, 36, 49, 50?',
    svgPattern: null,
    options: ['16', '36', '49', '50'],
    correctAnswer: 3,
    explanation:
      'Deret ini adalah kuadrat sempurna: 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49. Angka 50 bukan kuadrat sempurna (7²=49, 8²=64), sehingga ia pengecualian.',
  },
  {
    id: 'num-07',
    category: 'Numerik',
    difficulty: 3,
    question: 'Deret angka: 8, 27, 64, 125, ... Berapa angka berikutnya?',
    svgPattern: null,
    options: ['169', '196', '216', '243'],
    correctAnswer: 2,
    explanation:
      'Deret kubus bilangan bulat: 2³=8, 3³=27, 4³=64, 5³=125, sehingga berikutnya 6³=216.',
  },
  {
    id: 'num-08',
    category: 'Numerik',
    difficulty: 3,
    question:
      'Rasio bilangan A : B adalah 3 : 5. Jika selisih A dan B adalah 16, berapa jumlah A + B?',
    svgPattern: null,
    options: ['56', '64', '72', '80'],
    correctAnswer: 1,
    explanation:
      'A = 3u, B = 5u. Selisih 5u − 3u = 2u = 16 → u = 8. Jadi A = 24, B = 40, dan A + B = 64.',
  },
  {
    id: 'num-09',
    category: 'Numerik',
    difficulty: 3,
    question:
      'Harga sebuah barang naik 20%, lalu mendapat diskon 20%. Berapa persen perubahan harga akhir dibanding harga awal?',
    svgPattern: null,
    options: ['Tidak berubah', 'Naik 4%', 'Turun 4%', 'Turun 8%'],
    correctAnswer: 2,
    explanation:
      'Misal harga awal 100. Naik 20% → 120. Diskon 20% dari 120 → 120 × 0,8 = 96. Harga akhir 96, yaitu turun 4% dari harga awal. Kenaikan dan diskon persentase yang sama tidak saling membatalkan.',
  },

  /* ==========================================================
   *  VERBAL (9)
   * ========================================================== */
  {
    id: 'ver-01',
    category: 'Verbal',
    difficulty: 1,
    question: 'Pilihlah sinonim (persamaan kata) yang paling tepat untuk kata "MAKMUR".',
    svgPattern: null,
    options: ['Miskin', 'Sejahtera', 'Sengsara', 'Sederhana'],
    correctAnswer: 1,
    explanation: 'Makmur berarti sejahtera, senang, dan berkecukupan — persis makna sejahtera.',
  },
  {
    id: 'ver-02',
    category: 'Verbal',
    difficulty: 1,
    question: 'Pilihlah antonim (kebalikan kata) yang paling tepat untuk kata "HEMAT".',
    svgPattern: null,
    options: ['Cermat', 'Boros', 'Telaten', 'Cekatan'],
    correctAnswer: 1,
    explanation: 'Hemat berarti menahan pengeluaran; kebalikannya adalah boros (boros berlebihan).',
  },
  {
    id: 'ver-03',
    category: 'Verbal',
    difficulty: 2,
    question: 'Analogi: DOKTER adalah ke RUMAH SAKIT sebagaimana GURU adalah ke ...?',
    svgPattern: null,
    options: ['Perpustakaan', 'Sekolah', 'Pasar', 'Bandara'],
    correctAnswer: 1,
    explanation:
      'Rumah sakit adalah tempat profesional dokter bekerja. Analoginya, sekolah adalah tempat profesional guru bekerja.',
  },
  {
    id: 'ver-04',
    category: 'Verbal',
    difficulty: 2,
    question:
      'Premis: "Semua siswa belajar dengan sungguh-sungguh." Premis: "Rani adalah seorang siswa." Kesimpulan mana yang PASTI benar?',
    svgPattern: null,
    options: [
      'Rani belajar dengan sungguh-sungguh',
      'Hanya Rani yang belajar dengan sungguh-sungguh',
      'Semua yang belajar dengan sungguh-sungguh adalah siswa',
      'Rani tidak belajar dengan sungguh-sungguh',
    ],
    correctAnswer: 0,
    explanation:
      'Silogisme kategori: semua A adalah B; x termasuk A; maka x termasuk B. "Hanya Rani" dan pembalikan "semua yang belajar adalah siswa" tidak dapat disimpulkan dari premis.',
  },
  {
    id: 'ver-05',
    category: 'Verbal',
    difficulty: 2,
    question: 'Apa makna peribahasa "Air tenang menghanyutkan"?',
    svgPattern: null,
    options: [
      'Air yang tenang selalu lebih dalam',
      'Bahaya sering datang tanpa disadari',
      'Hidup harus selalu bergerak',
      'Ketenangan selalu membawa kebahagiaan',
    ],
    correctAnswer: 1,
    explanation:
      'Peribahasa ini menggambarkan bahwa bahaya atau masalah besar sering datang dari keadaan yang tampak tenang dan tidak disadari.',
  },
  {
    id: 'ver-06',
    category: 'Verbal',
    difficulty: 3,
    question:
      'Premis: "Semua A adalah B." Premis: "Tidak ada B yang merupakan C." Kesimpulan yang VALID adalah ...',
    svgPattern: null,
    options: [
      'Beberapa A adalah C',
      'Tidak ada A yang merupakan C',
      'Semua C adalah A',
      'Beberapa B adalah A',
    ],
    correctAnswer: 1,
    explanation:
      'Jika semua A ada di dalam B, dan B sama sekali tidak menyentuh C, maka A juga tidak menyentuh C. Pilihan "beberapa A adalah C" justru bertentangan, dan "semua C adalah A" merupakan pembalikan yang tidak sah.',
  },
  {
    id: 'ver-07',
    category: 'Verbal',
    difficulty: 2,
    question:
      'Manakah kata yang TIDAK termasuk kelompok yang sama: Catur, Monopoli, Scrabble, Bola Basket?',
    svgPattern: null,
    options: ['Catur', 'Monopoli', 'Scrabble', 'Bola Basket'],
    correctAnswer: 3,
    explanation:
      'Catur, Monopoli, dan Scrabble adalah permainan papan (board game) yang dimainkan duduk. Bola Basket adalah olahraga fisik yang dimainkan bergerak — ia pengecualian.',
  },
  {
    id: 'ver-08',
    category: 'Verbal',
    difficulty: 3,
    question:
      'Hakim memutuskan perkara berdasarkan Undang-Undang. Dengan pola penalaran yang sama, pilot menerbangkan pesawat berdasarkan ...?',
    svgPattern: null,
    options: ['Landasan pacu', 'Rute penerbangan', 'Cuaca hari ini', 'Penumpang'],
    correctAnswer: 1,
    explanation:
      'Hubungan analogi: profesional → pedoman/resmi yang dipakai membuat keputusan. Pedoman resmi pilot dalam menerbangkan pesawat adalah rute/flight plan penerbangan.',
  },
  {
    id: 'ver-09',
    category: 'Verbal',
    difficulty: 3,
    question:
      'Premis: "Beberapa siswa pandai." Premis: "Semua siswa pandai bekerja keras." Kesimpulan mana yang PASTI benar?',
    svgPattern: null,
    options: [
      'Semua yang bekerja keras adalah pandai',
      'Tidak ada yang bekerja keras adalah siswa',
      'Beberapa yang bekerja keras adalah siswa',
      'Semua siswa tidak bekerja keras',
    ],
    correctAnswer: 2,
    explanation:
      'Ada siswa yang pandai, dan semua siswa pandai bekerja keras — maka siswa-siswa tersebut adalah bagian dari yang bekerja keras. "Beberapa yang bekerja keras adalah siswa" pasti benar. Kebalikannya (semua yang bekerja keras adalah pandai) tidak pasti.',
  },

  /* ==========================================================
   *  LOGIKA (9)
   * ========================================================== */
  {
    id: 'log-01',
    category: 'Logika',
    difficulty: 1,
    question: 'Lanjutkan pola huruf: A, C, E, G, ...?',
    svgPattern: null,
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 1,
    explanation: 'Pola melompat satu huruf (A, B, C, D, E, F, G...): setelah G adalah I.',
  },
  {
    id: 'log-02',
    category: 'Logika',
    difficulty: 1,
    question:
      'Premis: "Semua kucing adalah hewan." Premis: "Tom adalah seekor kucing." Kesimpulan?',
    svgPattern: null,
    options: ['Tom adalah hewan', 'Tom bukan hewan', 'Semua hewan adalah kucing', 'Tom bukan kucing'],
    correctAnswer: 0,
    explanation:
      'Modus ponens silogisme kelas: semua kucing ∈ hewan dan Tom ∈ kucing, maka Tom ∈ hewan.',
  },
  {
    id: 'log-03',
    category: 'Logika',
    difficulty: 2,
    question:
      'Aturan: "Jika seseorang lolos seleksi akhir, maka ia akan diwawancarai oleh manajer." Fakta: "Dimas lolos seleksi akhir." Kesimpulan?',
    svgPattern: null,
    options: [
      'Dimas akan diwawancarai manajer',
      'Dimas tidak akan diwawancarai',
      'Manajer adalah peserta seleksi',
      'Wawancara tidak diperlukan',
    ],
    correctAnswer: 0,
    explanation:
      'Ini modus ponens: jika P → Q dan P benar, maka Q pasti benar. Dimas lolos seleksi (P), jadi ia akan diwawancarai (Q).',
  },
  {
    id: 'log-04',
    category: 'Logika',
    difficulty: 2,
    question:
      'Perhatikan pola pasangan bilangan: (2, 3) → 11; (4, 5) → 25; (6, 7) → ...? Berapa hasilnya?',
    svgPattern: null,
    options: ['41', '44', '47', '52'],
    correctAnswer: 2,
    explanation:
      'Aturannya: (a × b) + 5. Cek: (2×3)+5 = 11; (4×5)+5 = 25; maka (6×7)+5 = 42+5 = 47.',
  },
  {
    id: 'log-05',
    category: 'Logika',
    difficulty: 2,
    question:
      'Andi berkata: "Budi berbohong." Budi berkata: "Cici berbohong." Cici berkata: "Andi dan Budi sama-sama berbohong." Siapa yang jujur?',
    svgPattern: null,
    options: ['Hanya Andi', 'Hanya Budi', 'Hanya Cici', 'Andi dan Cici'],
    correctAnswer: 1,
    explanation:
      'Asumsikan Andi jujur → Budi bohong → pernyataan Budi ("Cici berbohong") salah → Cici jujur → Cici berkata Andi BERTIGA bohong... tetapi Andi jujur → kontradiksi. Asumsikan Andi bohong → Budi jujur → Cici bohong → pernyataan Cici ("Andi & Budi bohong") salah karena Budi jujur ✓. Konsisten: hanya Budi yang jujur.',
  },
  {
    id: 'log-06',
    category: 'Logika',
    difficulty: 3,
    question:
      'Premis: "Jika P, maka Q." Fakta: "Terbukti Q benar." Apa yang bisa disimpulkan tentang P?',
    svgPattern: null,
    options: [
      'P pasti benar',
      'P pasti salah',
      'Tidak ada kesimpulan pasti tentang P',
      'P dan Q sama-sama salah',
    ],
    correctAnswer: 2,
    explanation:
      'Ini fallacy affirming consequent. Dari P → Q dan Q benar, P boleh benar BOLEH juga salah (Q bisa disebabkan hal lain). Yang valid hanya: jika P salah → ... tidak ada. Kesimpulan pasti tidak dapat ditarik.',
  },
  {
    id: 'log-07',
    category: 'Logika',
    difficulty: 2,
    question: 'Lanjutkan pola: K2, M4, O8, Q16, ...?',
    svgPattern: null,
    options: ['R32', 'S32', 'T32', 'S64'],
    correctAnswer: 1,
    explanation:
      'Huruf melompat satu (K→M→O→Q→S) dan angkanya menggandakan (2, 4, 8, 16, 32). Jawabannya S32.',
  },
  {
    id: 'log-08',
    category: 'Logika',
    difficulty: 2,
    question:
      'Ani, Budi, Cici, Doni, dan Erna duduk berbaris dari kiri ke kanan. Ani di posisi paling kiri. Budi tepat di tengah (posisi ke-3). Cici langsung di sebelah kanan Budi. Doni berada di antara Ani dan Budi. Di posisi ke-4 duduk siapa?',
    svgPattern: null,
    options: ['Ani', 'Doni', 'Cici', 'Budi'],
    correctAnswer: 2,
    explanation:
      'Posisi: ke-1 Ani, ke-3 Budi (tengah), Doni antara Ani dan Budi → ke-2. Cici di kanan Budi → ke-4. Sisa Erna → ke-5.',
  },
  {
    id: 'log-09',
    category: 'Logika',
    difficulty: 3,
    question:
      'Premis: "Semua A adalah B." Premis: "Beberapa C adalah A." Kesimpulan yang PASTI benar?',
    svgPattern: null,
    options: [
      'Beberapa C adalah B',
      'Semua C adalah B',
      'Tidak ada C yang merupakan B',
      'Semua B adalah C',
    ],
    correctAnswer: 0,
    explanation:
      'Bagian C yang termasuk A pasti berada di dalam B (karena semua A ∈ B). Jadi "beberapa C adalah B" pasti benar. "Semua C adalah B" tidak pasti — C lain mungkin di luar A dan B.',
  },

  /* ==========================================================
   *  SPASIAL (9) — inline SVG geometric puzzles
   * ========================================================== */
  {
    id: 'spa-01',
    category: 'Spasial',
    difficulty: 1,
    question:
      'Perhatikan urutan segitiga berikut. Setiap langkah segitiga berputar 90° searah jarum jam. Segitiga manakah yang muncul berikutnya?',
    svgPattern: `<svg viewBox="0 0 360 84" ${SVG_ATTRS}>
      ${frame(8, '<polygon points="42,20 60,56 24,56" fill="currentColor" fill-opacity="0.18"/>')}
      ${frame(88, '<polygon points="130,38 106,18 106,58" fill="currentColor" fill-opacity="0.18"/>')}
      ${frame(168, '<polygon points="186,20 222,20 204,56" fill="currentColor" fill-opacity="0.18"/>')}
      ${frame(248, '<polygon points="282,38 306,18 306,58" fill="currentColor" fill-opacity="0.18"/>')}
      <text x="346" y="52" font-size="30" font-weight="700" fill="currentColor" text-anchor="middle" stroke="none">?</text>
    </svg>`,
    options: [
      'Segitiga mengarah ke atas',
      'Segitiga mengarah ke kanan',
      'Segitiga mengarah ke bawah',
      'Segitiga mengarah ke kiri',
    ],
    correctAnswer: 0,
    explanation:
      'Rotasi 90° searah jarum jam tiap langkah: atas → kanan → bawah → kiri → kembali mengarah ke ATAS.',
  },
  {
    id: 'spa-02',
    category: 'Spasial',
    difficulty: 1,
    question: 'Lanjutkan pola bentuk berikut: Lingkaran berisi, Persegi garis, Lingkaran berisi, Persegi garis, ...?',
    svgPattern: `<svg viewBox="0 0 360 84" ${SVG_ATTRS}>
      ${frame(8, '<circle cx="42" cy="40" r="20" fill="currentColor" fill-opacity="0.7"/>')}
      ${frame(88, '<rect x="108" y="20" width="40" height="40" rx="4"/>')}
      ${frame(168, '<circle cx="202" cy="40" r="20" fill="currentColor" fill-opacity="0.7"/>')}
      ${frame(248, '<rect x="268" y="20" width="40" height="40" rx="4"/>')}
      <text x="346" y="52" font-size="30" font-weight="700" fill="currentColor" text-anchor="middle" stroke="none">?</text>
    </svg>`,
    options: ['Lingkaran berisi', 'Persegi berisi', 'Lingkaran garis', 'Segitiga berisi'],
    correctAnswer: 0,
    explanation:
      'Pola berulang dua bentuk dengan gaya bergantian: isi → garis → isi → garis → berikutnya ISI, yaitu lingkaran berisi.',
  },
  {
    id: 'spa-03',
    category: 'Spasial',
    difficulty: 2,
    question:
      'Analogi matriks 2×2: panah pada kotak atas berputar 90° searah jarum jam dari kiri ke kanan. Terapkan aturan yang sama pada baris bawah — panah manakah yang mengisi kotak kosong?',
    svgPattern: `<svg viewBox="0 0 240 240" ${SVG_ATTRS}>
      <rect x="10" y="10" width="100" height="100" rx="12" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>
      <rect x="130" y="10" width="100" height="100" rx="12" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>
      <rect x="10" y="130" width="100" height="100" rx="12" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>
      <rect x="130" y="130" width="100" height="100" rx="12" stroke="currentColor" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="6 6"/>
      <g stroke-width="6">
        <line x1="60" y1="72" x2="60" y2="34"/><polygon points="60,24 48,44 72,44" fill="currentColor"/>
        <line x1="168" y1="60" x2="206" y2="60"/><polygon points="216,60 196,48 196,72" fill="currentColor"/>
        <line x1="72" y1="180" x2="34" y2="180"/><polygon points="24,180 44,168 44,192" fill="currentColor"/>
      </g>
      <text x="180" y="196" font-size="34" font-weight="700" fill="currentColor" text-anchor="middle" stroke="none">?</text>
    </svg>`,
    options: [
      'Panah mengarah ke atas',
      'Panah mengarah ke kanan',
      'Panah mengarah ke bawah',
      'Panah mengarah ke kiri',
    ],
    correctAnswer: 0,
    explanation:
      'Aturan baris: rotasi 90° searah jarum jam. Atas → kanan. Pada baris bawah: kiri → putar 90° CW → ATAS.',
  },
  {
    id: 'spa-04',
    category: 'Spasial',
    difficulty: 2,
    question:
      'Perhatikan urutan poligon berikut: segitiga, persegi, segi lima, segi enam. Poligon manakah yang muncul berikutnya?',
    svgPattern: `<svg viewBox="0 0 360 96" ${SVG_ATTRS}>
      ${frame(8, '<polygon points="42,18 62,58 22,58" fill="currentColor" fill-opacity="0.15"/>')}
      ${frame(88, '<rect x="108" y="20" width="40" height="40" fill="currentColor" fill-opacity="0.15"/>')}
      ${frame(168, '<polygon points="202,16 222,31 214,54 190,54 182,31" fill="currentColor" fill-opacity="0.15"/>')}
      ${frame(248, '<polygon points="282,18 300,27 300,47 282,56 264,47 264,27" fill="currentColor" fill-opacity="0.15"/>')}
      <text x="346" y="56" font-size="30" font-weight="700" fill="currentColor" text-anchor="middle" stroke="none">?</text>
    </svg>`,
    options: [
      'Segi tujuh (heptagon)',
      'Segi delapan (oktagon)',
      'Segi enam (heksagon)',
      'Lingkaran',
    ],
    correctAnswer: 0,
    explanation:
      'Jumlah sisi bertambah 1 tiap langkah: 3 → 4 → 5 → 6 → berikutnya 7 sisi (heptagon).',
  },
  {
    id: 'spa-05',
    category: 'Spasial',
    difficulty: 2,
    question:
      'Gambar menunjukkan kisi 3×3. Berapa JUMLAH semua persegi yang dapat ditemukan — termasuk persegi besar yang tersusun dari beberapa persegi kecil?',
    svgPattern: `<svg viewBox="0 0 240 240" ${SVG_ATTRS}>
      <rect x="20" y="20" width="200" height="200" rx="4" fill="currentColor" fill-opacity="0.06"/>
      <line x1="86.67" y1="20" x2="86.67" y2="220"/>
      <line x1="153.33" y1="20" x2="153.33" y2="220"/>
      <line x1="20" y1="86.67" x2="220" y2="86.67"/>
      <line x1="20" y1="153.33" x2="220" y2="153.33"/>
      <rect x="20" y="20" width="200" height="200" rx="4" stroke-width="3.5"/>
    </svg>`,
    options: ['9 persegi', '11 persegi', '14 persegi', '16 persegi'],
    correctAnswer: 2,
    explanation:
      'Persegi 1×1 = 9, persegi 2×2 = 4, persegi 3×3 = 1. Total = 9 + 4 + 1 = 14 persegi.',
  },
  {
    id: 'spa-06',
    category: 'Spasial',
    difficulty: 3,
    question:
      'Matriks 3×3: setiap baris bentuk L berputar 90° searah jarum jam ke kanan (pola bergeser satu langkah per kolom). Bentuk manakah yang mengisi kotak kosong di kanan bawah?',
    svgPattern: `<svg viewBox="0 0 264 264" ${SVG_ATTRS}>
      ${matrixCell(0, 0, 0)}
      ${matrixCell(0, 1, 90)}
      ${matrixCell(0, 2, 180)}
      ${matrixCell(1, 0, 90)}
      ${matrixCell(1, 1, 180)}
      ${matrixCell(1, 2, 270)}
      ${matrixCell(2, 0, 180)}
      ${matrixCell(2, 1, 270)}
      <rect x="184" y="184" width="76" height="76" rx="8" stroke="currentColor" stroke-opacity="0.3" stroke-width="2.5" stroke-dasharray="7 7"/>
      <text x="222" y="236" font-size="32" font-weight="700" fill="currentColor" text-anchor="middle" stroke="none">?</text>
    </svg>`,
    options: [
      '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><rect x="4" y="4" width="72" height="72" rx="8" stroke-opacity="0.2" stroke-width="2"/><polygon points="16,12 36,12 36,44 64,44 64,64 16,64" transform="rotate(90 40 40)" fill="currentColor" fill-opacity="0.7"/></svg>',
      '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><rect x="4" y="4" width="72" height="72" rx="8" stroke-opacity="0.2" stroke-width="2"/><polygon points="16,12 36,12 36,44 64,44 64,64 16,64" fill="currentColor" fill-opacity="0.7"/></svg>',
      '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><rect x="4" y="4" width="72" height="72" rx="8" stroke-opacity="0.2" stroke-width="2"/><polygon points="16,12 36,12 36,44 64,44 64,64 16,64" transform="rotate(180 40 40)" fill="currentColor" fill-opacity="0.7"/></svg>',
      '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><rect x="4" y="4" width="72" height="72" rx="8" stroke-opacity="0.2" stroke-width="2"/><polygon points="16,12 36,12 36,44 64,44 64,64 16,64" transform="rotate(270 40 40)" fill="currentColor" fill-opacity="0.7"/></svg>',
    ],
    correctAnswer: 1,
    explanation:
      'Rotasi per kolom: 0° → 90° → 180°, dan tiap baris dimulai +90° dari baris sebelumnya. Baris ketiga: 180° → 270° → berikutnya 360° = 0° (L normal, tanpa rotasi) — yaitu opsi kedua.',
  },
  {
    id: 'spa-07',
    category: 'Spasial',
    difficulty: 3,
    question:
      'Selembar kertas persegi dilipat dari kanan ke kiri (sisi kanan menutupi sisi kiri), lalu dilubangi tepat di tengah kertas hasil lipatan. Jika kertas dibentangkan kembali, bagaimana posisi lubangnya?',
    svgPattern: `<svg viewBox="0 0 360 148" ${SVG_ATTRS}>
      <rect x="14" y="24" width="100" height="100" rx="6" fill="currentColor" fill-opacity="0.07"/>
      <line x1="64" y1="24" x2="64" y2="124" stroke-dasharray="7 6" stroke-opacity="0.6"/>
      <text x="64" y="140" font-size="12" fill="currentColor" stroke="none" text-anchor="middle" font-weight="600">kertas</text>
      <line x1="160" y1="74" x2="128" y2="74" stroke-width="3"/>
      <polygon points="118,74 132,67 132,81" fill="currentColor" stroke="none"/>
      <text x="140" y="112" font-size="12" fill="currentColor" stroke="none" text-anchor="middle" font-weight="600">lipat</text>
      <rect x="166" y="24" width="50" height="100" rx="6" fill="currentColor" fill-opacity="0.16"/>
      <circle cx="191" cy="74" r="11" stroke-width="3"/>
      <line x1="184" y1="67" x2="198" y2="81"/><line x1="198" y1="67" x2="184" y2="81"/>
      <text x="191" y="16" font-size="11" fill="currentColor" stroke="none" text-anchor="middle" font-weight="600">lipat + lubang</text>
      <line x1="226" y1="74" x2="242" y2="74" stroke-width="3"/>
      <polygon points="250,74 238,67 238,81" fill="currentColor" stroke="none"/>
      <rect x="256" y="24" width="94" height="100" rx="6" fill="currentColor" fill-opacity="0.07"/>
      <line x1="303" y1="24" x2="303" y2="124" stroke-dasharray="7 6" stroke-opacity="0.5"/>
      <circle cx="287" cy="74" r="7" stroke-width="3"/><circle cx="319" cy="74" r="7" stroke-width="3"/>
      <text x="303" y="140" font-size="12" fill="currentColor" stroke="none" text-anchor="middle" font-weight="600">bentangkan?</text>
    </svg>`,
    options: [
      'Satu lubang tepat di tengah kertas',
      'Dua lubang sejajar horizontal, masing-masing di kiri dan kanan titik tengah',
      'Dua lubang berjajar vertikal di sisi kiri',
      'Empat lubang membentuk persegi di tengah',
    ],
    correctAnswer: 1,
    explanation:
      'Saat dilipat kanan-ke-kiri, lubang di tengah kertas hasil lipatan menembus DUA lapis (sisi kiri dan sisi kanan yang terlipat). Saat dibentangkan, lubang terbuka pada dua posisi yang dicerminkan terhadap garis lipatan: kiri dan kanan titik tengah, pada tinggi yang sama.',
  },
  {
    id: 'spa-08',
    category: 'Spasial',
    difficulty: 3,
    question:
      'Manakah bangun datar yang TIDAK dapat mengubin (tessellate) permukaan tanpa celah, jika keempatnya adalah bangun datar beraturan?',
    svgPattern: `<svg viewBox="0 0 360 120" ${SVG_ATTRS}>
      <g transform="translate(14,0)">
        <polygon points="48,22 88,88 8,88" fill="currentColor" fill-opacity="0.14"/>
        <text x="48" y="110" font-size="15" fill="currentColor" stroke="none" text-anchor="middle" font-weight="700">A</text>
      </g>
      <g transform="translate(100,0)">
        <rect x="16" y="26" width="64" height="64" fill="currentColor" fill-opacity="0.14"/>
        <text x="48" y="110" font-size="15" fill="currentColor" stroke="none" text-anchor="middle" font-weight="700">B</text>
      </g>
      <g transform="translate(198,0)">
        <polygon points="48,20 80,38 80,74 48,92 16,74 16,38" fill="currentColor" fill-opacity="0.14"/>
        <text x="48" y="110" font-size="15" fill="currentColor" stroke="none" text-anchor="middle" font-weight="700">C</text>
      </g>
      <g transform="translate(284,0)">
        <polygon points="48,22 84,48 70,90 26,90 12,48" fill="currentColor" fill-opacity="0.14"/>
        <text x="48" y="110" font-size="15" fill="currentColor" stroke="none" text-anchor="middle" font-weight="700">D</text>
      </g>
    </svg>`,
    options: ['A — Segitiga sama sisi', 'B — Persegi', 'C — Segi enam beraturan', 'D — Segi lima beraturan'],
    correctAnswer: 3,
    explanation:
      'Sudut dalam segitiga 60°, persegi 90°, dan segi enam 120° semuanya membagi 360° secara penuh (6×60, 4×90, 3×120). Sudut segi lima beraturan = 108°, dan 360° tidak habis dibagi 108° — sehingga segi lima menyisakan celah dan tidak bisa mengubin.',
  },
  {
    id: 'spa-09',
    category: 'Spasial',
    difficulty: 2,
    question:
      'Perhatikan urutan panah berikut — setiap langkah panah berputar 45° searah jarum jam. Panah manakah yang muncul berikutnya?',
    svgPattern: `<svg viewBox="0 0 360 84" ${SVG_ATTRS}>
      ${frame(8, arrowAt(42, 40, 0))}
      ${frame(88, arrowAt(122, 40, 45))}
      ${frame(168, arrowAt(202, 40, 90))}
      ${frame(248, arrowAt(282, 40, 135))}
      <text x="346" y="52" font-size="30" font-weight="700" fill="currentColor" text-anchor="middle" stroke="none">?</text>
    </svg>`,
    options: [
      'Panah ke bawah',
      'Panah ke kanan atas',
      'Panah ke kiri',
      'Panah ke kanan bawah',
    ],
    correctAnswer: 0,
    explanation:
      'Rotasi tetap 45° searah jarum jam: 0° (atas) → 45° → 90° (kanan) → 135° → berikutnya 180°, yaitu panah ke BAWAH.',
  },
];

/* ----------------------------------------------------------
 *  SVG builder helpers (kept after data for readability)
 * ---------------------------------------------------------- */

/** One matrix cell of the 3×3 Raven grid (spa-06). */
function matrixCell(row, col, angle) {
  const x = col * 88;
  const y = row * 88;
  const cx = x + 38;
  const cy = y + 38;
  return `<g>
    <rect x="${x + 2}" y="${y + 2}" width="76" height="76" rx="8" stroke="currentColor" stroke-opacity="0.25" stroke-width="2.5" fill="none"/>
    <polygon points="16,12 36,12 36,44 64,44 64,64 16,64" transform="translate(${x} ${y}) rotate(${angle} 40 40)" fill="currentColor" fill-opacity="0.72" stroke="currentColor" stroke-width="2"/>
  </g>`;
}

/** Arrow centered at (x,y), rotated `deg` clockwise. */
function arrowAt(x, y, deg) {
  return `<g transform="rotate(${deg} ${x} ${y})">
    <line x1="${x}" y1="${y + 16}" x2="${x}" y2="${y - 14}" stroke-width="5"/>
    <polygon points="${x},${y - 24} ${x - 10},${y - 6} ${x + 10},${y - 6}" fill="currentColor" stroke="none"/>
  </g>`;
}

/* ----------------------------------------------------------
 *  SELECTION ENGINE — tailored local pick (fast + reliable)
 * ---------------------------------------------------------- */

function largestRemainder(weights, total) {
  const entries = Object.entries(weights);
  const raw = entries.map(([k, w]) => [k, w * total]);
  const floors = raw.map(([k, v]) => [k, Math.floor(v)]);
  let assigned = floors.reduce((s, [, v]) => s + v, 0);
  const remainders = raw
    .map(([k, v], i) => ({ k, r: v - floors[i][1], i }))
    .sort((a, b) => b.r - a.r);
  let idx = 0;
  while (assigned < total && idx < remainders.length * 3) {
    const target = remainders[idx % remainders.length];
    const slot = floors.find(([k]) => k === target.k);
    if (slot) {
      const available = QUESTION_BANK.filter((q) => q.category === slot[0]).length;
      if (slot[1] < available) {
        slot[1] += 1;
        assigned += 1;
      }
    }
    idx += 1;
    if (idx > 1000) break;
  }
  return Object.fromEntries(floors);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Interleave difficulties: easy → medium → hard with light shuffling inside tiers. */
function progressiveOrder(list) {
  const tiers = { 1: [], 2: [], 3: [] };
  list.forEach((q) => tiers[q.difficulty]?.push(q));
  return [...shuffle(tiers[1]), ...shuffle(tiers[2]), ...shuffle(tiers[3])];
}

/**
 * Pick `count` questions from the local bank, tailored to focus area.
 * Always succeeds (count is clamped to bank size).
 *
 * @param {{ count?: number, focusArea?: string }} opts
 */
export function pickLocalQuestions({ count = 20, focusArea = FOCUS_OPTIONS[0] } = {}) {
  const wanted = Math.max(1, Math.min(count, QUESTION_BANK.length));
  const weights = FOCUS_WEIGHTS[focusArea] || FOCUS_WEIGHTS[FOCUS_OPTIONS[0]];

  const perCategory = largestRemainder(weights, wanted);

  const selected = [];
  ALL_CATEGORIES.forEach((cat) => {
    const pool = QUESTION_BANK.filter((q) => q.category === cat);
    const take = Math.min(perCategory[cat] || 0, pool.length);
    // balance difficulties inside the category pick
    const easy = shuffle(pool.filter((q) => q.difficulty === 1));
    const med = shuffle(pool.filter((q) => q.difficulty === 2));
    const hard = shuffle(pool.filter((q) => q.difficulty === 3));
    const mixed = [];
    const maxLen = Math.max(easy.length, med.length, hard.length);
    for (let i = 0; i < maxLen; i += 1) {
      if (easy[i]) mixed.push(easy[i]);
      if (med[i]) mixed.push(med[i]);
      if (hard[i]) mixed.push(hard[i]);
    }
    selected.push(...mixed.slice(0, take));
  });

  // Fill any shortfall (capped categories) from remaining bank
  if (selected.length < wanted) {
    const usedIds = new Set(selected.map((q) => q.id));
    const rest = shuffle(QUESTION_BANK.filter((q) => !usedIds.has(q.id)));
    selected.push(...rest.slice(0, wanted - selected.length));
  }

  return progressiveOrder(selected.slice(0, wanted));
}

/** Quick stats for diagnostics/UI. */
export function getBankStats() {
  const byCat = {};
  ALL_CATEGORIES.forEach((c) => {
    byCat[c] = QUESTION_BANK.filter((q) => q.category === c).length;
  });
  return { total: QUESTION_BANK.length, byCat };
}

/**
 * Validate + sanitize one question object (shared by AI route and client).
 * Returns a normalized question or null if invalid.
 */
export function normalizeQuestion(raw, index = 0, prefix = 'local') {
  if (!raw || typeof raw !== 'object') return null;
  const category = ALL_CATEGORIES.includes(raw.category) ? raw.category : 'Logika';
  const difficulty = [1, 2, 3].includes(Number(raw.difficulty)) ? Number(raw.difficulty) : 2;
  const question = typeof raw.question === 'string' ? raw.question.trim() : '';
  if (question.length < 8) return null;

  const options = Array.isArray(raw.options) ? raw.options.map((o) => String(o).trim()) : [];
  if (options.length !== 4 || options.some((o) => o.length === 0)) return null;

  const correctAnswer = Number(raw.correctAnswer);
  if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) return null;

  let svgPattern = typeof raw.svgPattern === 'string' ? raw.svgPattern.trim() : '';
  if (svgPattern && !/^<svg[\s>]/i.test(svgPattern)) svgPattern = '';
  if (svgPattern && /<script|onload=|onerror=/i.test(svgPattern)) svgPattern = '';

  const explanation =
    typeof raw.explanation === 'string' && raw.explanation.trim().length > 3
      ? raw.explanation.trim()
      : 'Tinjau kembali langkah penalaran Anda untuk menemukan jawaban yang tepat.';

  const id =
    typeof raw.id === 'string' && /^[a-z0-9-]{3,40}$/i.test(raw.id)
      ? raw.id
      : `${prefix}-${Date.now().toString(36)}-${index}`;

  return { id, category, difficulty, question, svgPattern: svgPattern || null, options, correctAnswer, explanation };
}
