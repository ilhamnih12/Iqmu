import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { generateLocalReport } from '@/lib/report';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Current free-tier stable Flash model (Google-recommended for new projects).
 * Override via GEMINI_MODEL env var if needed.
 */
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

/**
 * ============================================================
 *  POST /api/analyze-iq
 * ============================================================
 *  Sends the user's exact performance telemetry to
 *  gemini-3.8-flash (Google GenAI SDK) for a deep
 *  psychological/cognitive report. Falls back to a
 *  fully-featured heuristic report if the API key is missing,
 *  rate-limited, or times out — the results dashboard ALWAYS
 *  renders complete.
 * ============================================================
 */

function buildAnalysisPrompt(t) {
  return `Anda adalah psikolog industri-organisasi dan ahli psikometri bersertifikat dengan spesialisasi tes kecerdasan.
Tugas: analisis hasil tes kognitif berikut dan tulis laporan mendalam dalam Bahasa Indonesia.

DATA HASIL TES:
- Nama: ${t.nama}
- Usia: ${t.usia} | Latar belakang: ${t.latarBelakang} | Fokus pilihan: ${t.fokus} | Mode: ${t.mode}
- Skor IQ: ${t.skorIQ} (persentil ${t.persentil}, klasifikasi: ${t.klasifikasi})
- Akurasi: ${t.akurasi.benar}/${t.akurasi.total} benar (${t.akurasi.persen}%), ${t.akurasi.salah} salah, ${t.akurasi.kosong} kosong
- Per kategori: ${JSON.stringify(t.perKategori)}
- Waktu: ${t.waktu.terpakaiDetik} dtk dari ${t.waktu.totalDetik} dtk (efisiensi ${t.waktu.efisiensiPersen}%)
- Contoh kesalahan: ${JSON.stringify(t.kesalahan.slice(0, 6))}

Tulis laporan dengan struktur JSON PERSIS seperti berikut (semua nilai string Bahasa Indonesia, 3-5 kalimat tiap bagian, gaya profesional namun memotivasi, tanpa markdown asterisk):
{
  "dominasi": "Analisis dominasi & arsitektur kognitif (otak kiri vs kanan) berdasarkan profil kategori + skor.",
  "kekuatan": "Kekuatan utama & pola pemecahan masalah spesifik dari data akurasi per kategori.",
  "kelemahan": "Area kelemahan berdasarkan soal yang salah + saran latihan otak konkret (10-15 menit/hari).",
  "karir": "Rekomendasi karir & bidang industri paling cocok, selaras dengan latar belakang pengguna.",
  "belajar": "Gaya belajar optimal + tokoh dunia setara dengan profil kecerdasan ini."
}
HANYA kembalikan JSON valid tersebut, tanpa teks lain.`;
}

function sanitizeReport(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const keys = ['dominasi', 'kekuatan', 'kelemahan', 'karir', 'belajar'];
  const out = {};
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim().length >= 20) out[k] = v.trim();
  }
  return Object.keys(out).length >= 4 ? out : null;
}

async function analyzeWithGemini(telemetry) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('gemini-timeout')), 35000)
  );

  try {
    const result = await Promise.race([
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: buildAnalysisPrompt(telemetry),
        config: {
          responseMimeType: 'application/json',
          temperature: 0.75,
          topP: 0.9,
          maxOutputTokens: 8192,
        },
      }),
      timeout,
    ]);
    const text = (result?.text || '').trim();
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    return sanitizeReport(parsed);
  } catch (err) {
    console.warn('[analyze-iq] Gemini failed, using heuristic report:', err?.message || err);
    return null;
  }
}

export async function POST(request) {
  let telemetry = {};
  try {
    telemetry = await request.json();
  } catch {
    telemetry = {};
  }

  if (!telemetry || typeof telemetry.skorIQ !== 'number') {
    return NextResponse.json({ error: 'Payload tidak valid.' }, { status: 400 });
  }

  const aiReport = await analyzeWithGemini(telemetry);
  const fallback = generateLocalReport(telemetry);

  const report = aiReport
    ? { ...aiReport, source: 'ai' }
    : { ...fallback, source: 'local' };

  return NextResponse.json({ report }, { headers: { 'Cache-Control': 'no-store' } });
}
