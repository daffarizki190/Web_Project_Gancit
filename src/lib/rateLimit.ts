/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Rate Limiter (Pure Logic — Storage Injected)
 *  PT. Centrepark | Gandaria City Project Hub
 *
 *  Strategi dependency injection:
 *  Semua fungsi menerima `storage` sebagai parameter sehingga test
 *  dapat menggunakan mock storage tanpa bergantung pada browser API.
 * ═══════════════════════════════════════════════════════════════════════
 */

// ─── Types ────────────────────────────────────────────────────────────────

/** Minimal interface agar kompatibel dengan sessionStorage dan mock storage */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface RateLimitState {
  count: number;
  firstAttempt: number;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  attemptsLeft: number;
  lockoutMs: number;
}

// ─── Constants ────────────────────────────────────────────────────────────

export const RATE_LIMIT_KEY = "cp_login_attempts";
export const MAX_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1_000; // 15 menit dalam ms

// ─── Functions ────────────────────────────────────────────────────────────

/**
 * Baca state rate limiter dari storage.
 * Reset otomatis jika lockout period sudah habis.
 */
export function readRateLimitState(
  storage: StorageLike,
  now: number,
): RateLimitState {
  const raw = storage.getItem(RATE_LIMIT_KEY);
  if (!raw) return { count: 0, firstAttempt: now };

  try {
    const data = JSON.parse(raw) as RateLimitState;
    if (now - data.firstAttempt > LOCKOUT_DURATION) {
      return { count: 0, firstAttempt: now };
    }
    return data;
  } catch {
    return { count: 0, firstAttempt: now };
  }
}

/**
 * Apakah user masih diizinkan untuk mencoba login?
 */
export function checkRateLimit(
  storage: StorageLike,
  now: number,
): RateLimitCheckResult {
  const data = readRateLimitState(storage, now);

  if (data.count >= MAX_ATTEMPTS) {
    const lockoutMs = LOCKOUT_DURATION - (now - data.firstAttempt);
    return {
      allowed: false,
      attemptsLeft: 0,
      lockoutMs: Math.max(0, lockoutMs),
    };
  }

  return {
    allowed: true,
    attemptsLeft: MAX_ATTEMPTS - data.count,
    lockoutMs: 0,
  };
}

/**
 * Catat satu percobaan login yang gagal.
 * Mengembalikan state terbaru.
 */
export function recordFailedAttempt(
  storage: StorageLike,
  now: number,
): RateLimitState {
  const data = readRateLimitState(storage, now);
  const updated: RateLimitState = {
    count: data.count + 1,
    firstAttempt: data.count === 0 ? now : data.firstAttempt,
  };
  storage.setItem(RATE_LIMIT_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Reset rate limiter setelah login berhasil.
 */
export function resetRateLimit(storage: StorageLike): void {
  storage.removeItem(RATE_LIMIT_KEY);
}
