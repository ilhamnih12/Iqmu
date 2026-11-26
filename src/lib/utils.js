import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format seconds → "12:45" or "5:03". */
export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${String(rest).padStart(2, '0')}`;
}

/** Format ms → "3,4 dtk" / "1m 12d" Indonesian style. */
export function formatDuration(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  if (total < 60) return `${total} detik`;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m} menit ${s} detik`;
}

/** Deterministic FNV-1a hash (32-bit), returns unsigned int. */
export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Unique verification hash ID for the certificate, e.g. "IQM-7F3A-91BC-22D0".
 * Deterministic from name + score + timestamp seed.
 */
export function verificationHash(name, iq, seed) {
  const base = `${name}|${iq}|${seed}`;
  const a = fnv1a(base);
  const b = fnv1a(`${base}#salt2`);
  const c = fnv1a(`${base}#salt3`);
  const hex = (n, len) => n.toString(16).toUpperCase().padStart(len, '0').slice(-len);
  return `IQM-${hex(a, 4)}-${hex(b, 4)}-${hex(c, 4)}`;
}

/** Simple date formatter → "26 November 2026" */
export function formatDateID(date = new Date()) {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/** Clamp helper. */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Deterministic pseudo-QR visual (21×21) derived from a hash string.
 * Returns a boolean matrix — used for the certificate's "QR" badge.
 */
export function pseudoQrMatrix(seed, size = 21) {
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  let h = fnv1a(String(seed));
  const next = () => {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 0xffffffff;
  };
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      matrix[r][c] = next() > 0.5;
    }
  }
  // Finder patterns (3 corners)
  const drawFinder = (row, col) => {
    for (let r = 0; r < 7; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row + r][col + c] = edge || core;
      }
    }
    // quiet separator
    for (let i = -1; i <= 7; i += 1) {
      if (row - 1 >= 0 && col + i >= 0 && col + i < size) matrix[row - 1][col + i] = false;
      if (row + 7 < size && col + i >= 0 && col + i < size) matrix[row + 7][col + i] = false;
      if (col - 1 >= 0 && row + i >= 0 && row + i < size) matrix[row + i][col - 1] = false;
      if (col + 7 < size && row + i >= 0 && row + i < size) matrix[row + i][col + 7] = false;
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);
  return matrix;
}
