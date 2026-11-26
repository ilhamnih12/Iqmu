# 🧠 IQMetry — AI-Powered Real IQ Test & Cognitive Assessment Platform

Platform asesmen kognitif interaktif berbasis **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, dan **Google Gemini AI**. Dirancang produksi-ready untuk deploy zero-error di **Vercel**.

![Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)
![Stack](https://img.shields.io/badge/Gemini-1.5%20Flash-4285F4?style=flat-square&logo=google)

## ✨ Fitur Utama

- **Survey Adaptif Pra-Test** — Nama, rentang usia, latar belakang kognitif, preferensi fokus, dan 3 mode durasi (Quick Blitz 10 soal / Standard Mensa 20 soal / Deep Cognitive 30 soal).
- **Generator Soal Hibrida AI** — `POST /api/generate-questions` memanggil `gemini-1.5-flash` (`responseMimeType: "application/json"`) dan **selalu** jatuh ke bank soal lokal berisi **36 soal psikometrik autentik** (termasuk puzzle matriks SVG) — tes tidak pernah gagal, bahkan saat API rate-limit.
- **Arena Tes Bebas Gangguan** — Progress bar, navigator pill, timer hitung mundur (detak jantung < 30 dtk), tandai soal, transisi Framer Motion, auto-submit saat waktu habis.
- **Mesin Skoring Psikometri Nyata** — Bobot kesulitan (1× / 1,5× / 2,2×), normalisasi usia, bonus efisiensi waktu, distribusi bel lonceng (Mean 100, SD 15, rentang 70–160), persentil.
- **Laporan AI Mendalam** — `POST /api/analyze-iq` mengirim telemetri performa ke Gemini: dominasi otak, kekuatan, kelemahan + latihan, rekomendasi karir, gaya belajar & tokoh setara (dengan fallback heuristik lokal).
- **Dashboard Hasil Interaktif** — Gauge IQ animasi, radar 4 pilar (Numerik/Verbal/Spasial/Logika), accordion review jawaban, confetti.
- **Sertifikat Resmi** — Desain glass/emas akademik dengan hash verifikasi unik + QR visual; ekspor **PNG** (html2canvas, high-DPI) & **PDF** landscape A4 (jsPDF); share Web API / WhatsApp / X.
- **Audio Engine Web Audio API** — Suara glass-tap, detak timer kritis, chord akor penyelesaian (tanpa file MP3), toggle mute di navbar.
- **Dark / Light Mode** — Default Calm Dark Slate/Indigo, toggle seamless di navbar glass mengambang.

## 🛠 Teknologi

| Layer | Teknologi |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS 3, glassmorphism custom utilities |
| Animasi | Framer Motion 11, canvas-confetti |
| Ikon | lucide-react |
| AI | `@google/generative-ai` (`gemini-1.5-flash`) |
| Export | html2canvas, jspdf |
| Util | clsx, tailwind-merge |

## 🚀 Menjalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. (Opsional) isi API key Gemini — tanpa ini pun aplikasi tetap jalan
cp .env.example .env.local
#    lalu isi GEMINI_API_KEY=***

# 3. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 🏗 Build Produksi

```bash
npm run build   # build zero-error (eslint & TS errors di-ignore sesuai config Vercel-safe)
npm start
```

## 📦 Deploy ke Vercel

1. Push repo ke GitHub.
2. Import repo di [vercel.com/new](https://vercel.com/new) — Framework preset: **Next.js** (otomatis terdeteksi).
3. (Opsional) Tambahkan environment variable `GEMINI_API_KEY` di Project Settings → Environment Variables.
4. Deploy. Tanpa konfigurasi tambahan.

> Tanpa `GEMINI_API_KEY`, platform tetap 100% fungsional: bank soal lokal + laporan heuristik digunakan otomatis.

## 📁 Struktur

```
src/
├── app/
│   ├── api/
│   │   ├── generate-questions/route.js   # Gemini + local bank hybrid
│   │   └── analyze-iq/route.js           # Gemini deep evaluation
│   ├── globals.css                       # Tailwind + glass utilities + mesh
│   ├── layout.js                         # Root layout, theme script, metadata
│   └── page.js                           # State machine: landing → test → results
├── components/
│   ├── Navbar.jsx                        # Floating glass navbar (theme + mute)
│   ├── BackgroundMesh.jsx                # Ambient gradient mesh
│   ├── Landing.jsx                       # Hero + metodologi
│   ├── SurveyForm.jsx                    # Form adaptif pra-test
│   ├── TestArena.jsx                     # Arena tes distruption-free
│   ├── ResultsDashboard.jsx              # Dashboard hasil lengkap
│   ├── IQGauge.jsx                       # Gauge skor animasi
│   ├── CategoryBreakdown.jsx             # Radar + bar 4 pilar
│   ├── AIReport.jsx                      # Laporan AI accordion
│   ├── AnswerReview.jsx                  # Review tiap soal
│   ├── Certificate.jsx                   # Sertifikat + ekspor PNG/PDF
│   └── ShareButtons.jsx                  # Native share / WA / X
├── data/
│   └── questionBank.js                   # 36 soal psikometrik (fallback kritis)
├── lib/
│   ├── scoring.js                        # Mesin skoring IQ (bell curve)
│   ├── report.js                         # Fallback laporan heuristik
│   └── utils.js                          # cn(), format, hash verifikasi
└── hooks/
    ├── useSoundEffects.js                # Web Audio API engine
    └── UIContext.jsx                     # Sound + mute state bersama
```

## ⚖️ Catatan Metodologi

Skor IQ diturunkan dari bobot benar (bobot kesulitan), faktor normalisasi usia, dan efisiensi waktu terhadap distribusi normal terkalibrasi (μ=0,66; σ=0,13 pada rasio mentah) → skala deviasi standar 100 ± 15 (rentang 70–160). Ini simulasi psikometrik edukatif, **bukan** alat diagnosis klinis.
