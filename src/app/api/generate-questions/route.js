import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { pickLocalQuestions, normalizeQuestion, ALL_CATEGORIES } from '@/data/questionBank';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Current free-tier stable Flash model (Google-recommended for new projects).
 * Override via GEMINI_MODEL env var if needed.
 */
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

/**
 * ============================================================
 *  POST /api/generate-questions
 * ============================================================
 *  Hybrid AI question generator:
 *   1. Tailored prompt → Google GenAI SDK (@google/genai),
 *      gemini-3.8-flash with responseMimeType: "application/json"
 *   2. Validation + sanitization of every AI item
 *   3. Merge with the local 36-question psychometric bank
 *   4. If AI is missing / rate-limited / times out → local bank
 *      is ALWAYS used to fulfil the requested count.
 *
 *  The test therefore NEVER fails to load.
 * ============================================================
 */

const DIFFICULTY_MIX = {
  easy: 0.3,
  medium: 0.5,
  hard: 0.2,
};

function buildPrompt({ ageBracket, background, focusArea, count }) {
  const hard = Math.max(1, Math.round(count * DIFFICULTY_MIX.hard));
  const easy = Math.max(1, Math.round(count * DIFFICULTY_MIX.easy));
  const medium = Math.max(1, count - hard - easy);

  return `Anda adalah psikometrik ahli yang merancang soal tes IQ standar internasional dalam Bahasa Indonesia.

Buat TEPAT ${count} soal tes IQ dengan komposisi:
- ${easy} soal difficulty=1 (mudah), ${medium} soal difficulty=2 (sedang), ${hard} soal difficulty=3 (sulit)
- Kategori soal tersebar merata pada: ${ALL_CATEGORIES.join(', ')}
- Fokus sesuai preferensi pengguna: "${focusArea}"
- Konteks pengguna: usia ${ageBracket}, latar belakang ${background}

KETENTUAN SOAL:
1. "id" unik berformat kategori-nomor (mis. num-11, ver-09, spa-12, log-07).
2. "category" salah satu dari: ${ALL_CATEGORIES.join(', ')}.
3. "difficulty" integer 1, 2, atau 3.
4. "question" teks Bahasa Indonesia yang jelas, tanpa tanda kurung siku bernomor.
5. "svgPattern": Untuk soal Spasial WAJIB berupa string inline SVG valid (diawali <svg, viewBox jelas, memakai currentColor, tanpa atribut xlink, tanpa script) yang menggambarkan pola/matriks. Untuk soal non-spasial isi null.
6. "options" tepat 4 pilihan. Untuk soal Spasial berbasis matriks, boleh berupa 4 string SVG kandidat jawaban (diawali <svg); selain itu teks biasa.
7. "correctAnswer" integer 0-3 (indeks opsi yang benar).
8. "explanation" penjelasan logis singkat dalam Bahasa Indonesia (1-2 kalimat).

HANYA kembalikan JSON valid dengan format:
{ "questions": [ { "id": "...", "category": "...", "difficulty": 1, "question": "...", "svgPattern": null, "options": ["...","...","...","..."], "correctAnswer": 0, "explanation": "..." } ] }
Tanpa markdown, tanpa teks lain di luar JSON.`;
}

function extractJson(text) {
  if (!text) return null;
  let t = text.trim();
  // strip ```json fences if the model added them anyway
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function generateWithGemini(payload) {
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
        contents: buildPrompt(payload),
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 16384,
        },
      }),
      timeout,
    ]);
    const text = result?.text || '';
    const json = extractJson(text);
    if (!json || !Array.isArray(json.questions)) return null;
    return json.questions;
  } catch (err) {
    console.warn('[generate-questions] Gemini failed, falling back to local bank:', err?.message || err);
    return null;
  }
}

export async function POST(request) {
  let payload = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const count = Math.max(1, Math.min(40, Number(payload.count) || 20));
  const ageBracket = String(payload.ageBracket || '18-24');
  const background = String(payload.background || 'Umum / Pelajar');
  const focusArea = String(payload.focusArea || 'Campuran Seimbang (Rekomendasi)');

  // Always compute a solid local baseline first (guaranteed success).
  const localQuestions = pickLocalQuestions({ count, focusArea });

  // Attempt AI enrichment (best effort).
  const aiRaw = await generateWithGemini({ ageBracket, background, focusArea, count });

  const questions = [];
  const usedIds = new Set();

  if (aiRaw) {
    for (let i = 0; i < aiRaw.length && questions.length < count; i += 1) {
      const q = normalizeQuestion(aiRaw[i], i, 'ai');
      if (q && !usedIds.has(q.id)) {
        usedIds.add(q.id);
        questions.push(q);
      }
    }
  }

  const source = questions.length === 0 ? 'local' : questions.length >= count ? 'ai' : 'hybrid';

  // Fill remaining slots from the local bank — NEVER fails.
  for (const q of localQuestions) {
    if (questions.length >= count) break;
    if (usedIds.has(q.id)) continue;
    usedIds.add(q.id);
    questions.push(q);
  }

  // Absolute safety net: if still short (shouldn't happen), pull any bank item.
  if (questions.length < count) {
    const all = pickLocalQuestions({ count: 40, focusArea });
    for (const q of all) {
      if (questions.length >= count) break;
      if (usedIds.has(q.id)) continue;
      usedIds.add(q.id);
      questions.push(q);
    }
  }

  return NextResponse.json(
    {
      questions: questions.slice(0, count),
      source,
      count: Math.min(count, questions.length),
      fallbackAvailable: true,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
