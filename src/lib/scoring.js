import { clamp } from './utils';

/**
 * ============================================================
 *  IQ SCORING ENGINE — Real psychometric-style bell curve
 * ============================================================
 *  • Difficulty weighting : L1 = 1.0x, L2 = 1.5x, L3 = 2.2x
 *  • Age-adjusted normalization factor (modest, per bracket)
 *  • Time efficiency bonus (fast + accurate) / penalty (fast + wrong)
 *  • Normal distribution mapping: Mean = 100, SD = 15, range 70–160
 *  • Calibration on raw ratio: μ = 0.66, σ = 0.13
 * ============================================================
 */

export const DIFFICULTY_WEIGHT = Object.freeze({ 1: 1, 2: 1.5, 3: 2.2 });

export const DIFFICULTY_LABEL = Object.freeze({ 1: 'Mudah', 2: 'Sedang', 3: 'Sulit' });

export const CATEGORIES = Object.freeze(['Numerik', 'Verbal', 'Spasial', 'Logika']);

/** Modest age normalization — performance relative to age peers. */
export const AGE_FACTOR = Object.freeze({
  '<18': 1.03,
  '18-24': 1.0,
  '25-34': 1.0,
  '35-49': 0.99,
  '50+': 0.97,
});

/** Raw-ratio → z-score calibration (population average performance ≈ 0.66). */
const CALIBRATION_MU = 0.66;
const CALIBRATION_SIGMA = 0.13;

/** Abramowitz & Stegun 7.1.26 error function approximation. */
export function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

/** Standard normal CDF. */
export function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Map a calibrated performance ratio → IQ (mean 100, SD 15, clamped 70–160). */
export function ratioToIq(ratio) {
  const r = clamp(ratio, 0, 1.06);
  const z = (r - CALIBRATION_MU) / CALIBRATION_SIGMA;
  return clamp(Math.round(100 + 15 * z), 70, 160);
}

/** IQ → percentile (0–100, one decimal). */
export function iqToPercentile(iq) {
  const z = (iq - 100) / 15;
  return Math.round(normalCdf(z) * 1000) / 10;
}

/** Classification bands (Indonesian psychometric terminology). */
export function classify(iq) {
  if (iq >= 145) return { label: 'Sangat Superior', en: 'Exceptionally Gifted', tier: 'elite', top: 'Top 0,1%' };
  if (iq >= 130) return { label: 'Sangat Superior', en: 'Very Superior', tier: 'elite', top: 'Top 2%' };
  if (iq >= 120) return { label: 'Superior', en: 'Superior', tier: 'high', top: 'Top 9%' };
  if (iq >= 110) return { label: 'Di Atas Rata-rata', en: 'High Average', tier: 'above', top: 'Top 25%' };
  if (iq >= 90) return { label: 'Rata-rata', en: 'Average', tier: 'avg', top: 'Rata-rata' };
  if (iq >= 80) return { label: 'Di Bawah Rata-rata', en: 'Low Average', tier: 'below', top: 'Bawah rata-rata' };
  return { label: 'Batas Bawah', en: 'Borderline', tier: 'low', top: 'Batas bawah' };
}

/**
 * Compute full psychometric result set.
 *
 * @param {Array}  questions   - normalized question list
 * @param {Array}  answers     - userAnswers[i] = option index | null | undefined
 * @param {Object} opts        - { timeUsedMs, totalAllowedMs, ageBracket }
 * @returns {Object} rich result telemetry
 */
export function computeResults(questions, answers, { timeUsedMs = 0, totalAllowedMs = 1, ageBracket = '18-24' } = {}) {
  const total = questions.length;
  let earnedWeight = 0;
  let maxWeight = 0;
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  const perCategory = {};
  CATEGORIES.forEach((c) => {
    perCategory[c] = { total: 0, correct: 0, weightTotal: 0, weightEarned: 0, wrong: 0 };
  });

  const detail = questions.map((q, i) => {
    const user = answers[i];
    const hasAnswer = user !== null && user !== undefined;
    const isCorrect = hasAnswer && user === q.correctAnswer;
    const weight = DIFFICULTY_WEIGHT[q.difficulty] ?? 1;

    maxWeight += weight;
    if (isCorrect) {
      earnedWeight += weight;
      correct += 1;
    } else if (hasAnswer) {
      wrong += 1;
    } else {
      skipped += 1;
    }

    const cat = perCategory[q.category] || (perCategory[q.category] = { total: 0, correct: 0, weightTotal: 0, weightEarned: 0, wrong: 0 });
    cat.total += 1;
    cat.weightTotal += weight;
    if (isCorrect) {
      cat.correct += 1;
      cat.weightEarned += weight;
    } else if (hasAnswer) {
      cat.wrong += 1;
    }

    return {
      index: i,
      question: q,
      userAnswer: hasAnswer ? user : null,
      isCorrect,
      weight,
    };
  });

  const baseRatio = maxWeight > 0 ? earnedWeight / maxWeight : 0;
  const accuracy = total > 0 ? correct / total : 0;

  // ---------- Time efficiency ----------
  const timeRatio = clamp(timeUsedMs / Math.max(1, totalAllowedMs), 0, 1);
  const speed = 1 - timeRatio; // faster → higher
  const randomClicking = timeRatio < 0.25 && accuracy < 0.4; // degenerate behaviour
  let efficiency = 0;

  if (randomClicking) {
    efficiency = -0.05;
  } else {
    // reward fast AND accurate (up to +5%)
    efficiency += 0.05 * speed * clamp((accuracy - 0.5) / 0.5, 0, 1);
    // slow + poor accuracy → small penalty
    if (timeRatio > 0.92 && accuracy < 0.5) efficiency -= 0.02;
    // finishing suspiciously instantly with perfect accuracy is fine (test too easy) — no penalty
  }

  // ---------- Age normalization ----------
  const ageFactor = AGE_FACTOR[ageBracket] ?? 1.0;

  let adjustedRatio = clamp((baseRatio + efficiency) * ageFactor, 0, 1.06);

  const iq = ratioToIq(adjustedRatio);
  const percentile = iqToPercentile(iq);
  const classification = classify(iq);

  // ---------- Per-category breakdown (ratio + subscore index + %) ----------
  const categories = CATEGORIES.map((name) => {
    const c = perCategory[name];
    const ratio = c.weightTotal > 0 ? c.weightEarned / c.weightTotal : 0;
    const pct = Math.round(ratio * 100);
    // subscore on same IQ-ish scale for the radar (70–160 → normalized to 0–100 for viz)
    const subscore = ratioToIq(clamp(ratio * ageFactor, 0, 1.06));
    return {
      name,
      total: c.total,
      correct: c.correct,
      wrong: c.wrong,
      ratio,
      pct,
      subscore,
    };
  }).filter((c) => c.total > 0);

  const strongest = categories.length
    ? categories.reduce((a, b) => (b.ratio > a.ratio ? b : a))
    : null;
  const weakest = categories.length
    ? categories.reduce((a, b) => (b.ratio < a.ratio ? b : a))
    : null;

  return {
    iq,
    percentile,
    classification,
    correct,
    wrong,
    skipped,
    total,
    accuracy,
    baseRatio,
    efficiency,
    ageFactor,
    adjustedRatio,
    timeUsedMs,
    totalAllowedMs,
    timeRatio,
    randomClicking,
    earnedWeight: round2(earnedWeight),
    maxWeight: round2(maxWeight),
    categories,
    strongest,
    weakest,
    detail,
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Build compact telemetry payload for /api/analyze-iq.
 */
export function buildTelemetry({ survey, results, questions }) {
  const mistakes = results.detail
    .filter((d) => !d.isCorrect)
    .slice(0, 10)
    .map((d) => ({
      kategori: d.question.category,
      kesulitan: d.question.difficulty,
      soal: d.question.question.slice(0, 160),
      jawabanAnda:
        d.userAnswer === null || d.userAnswer === undefined
          ? '(tidak dijawab)'
          : d.question.options[d.userAnswer],
      jawabanBenar: d.question.options[d.question.correctAnswer],
    }));

  return {
    nama: survey.name,
    usia: survey.ageBracket,
    latarBelakang: survey.background,
    fokus: survey.focusArea,
    mode: survey.mode?.label || survey.mode?.id || '-',
    skorIQ: results.iq,
    persentil: results.percentile,
    klasifikasi: results.classification.label,
    akurasi: {
      total: results.total,
      benar: results.correct,
      salah: results.wrong,
      kosong: results.skipped,
      persen: Math.round(results.accuracy * 100),
    },
    perKategori: results.categories.map((c) => ({
      kategori: c.name,
      benar: c.correct,
      total: c.total,
      persen: c.pct,
    })),
    waktu: {
      terpakaiDetik: Math.round(results.timeUsedMs / 1000),
      totalDetik: Math.round(results.totalAllowedMs / 1000),
      efisiensiPersen: Math.round((1 - results.timeRatio) * 100),
    },
    kesalahan: mistakes,
    pertanyaanTerkunci: questions.filter((q, i) => results.detail[i]?.userAnswer !== null && results.detail[i]?.userAnswer !== undefined).length,
  };
}
