/**
 * ═══════════════════════════════════════════════════════════════════════
 *  TEST SUITE: Rate Limiter
 *  File   : src/lib/rateLimit.ts
 *  Runner : Vitest
 *
 *  Teknik: Dependency Injection + Mock Storage
 *  - Storage di-inject sebagai parameter (bukan global sessionStorage)
 *  - Waktu (Date.now) di-inject sebagai parameter `now`
 *  → Test bisa mengontrol waktu dan storage secara deterministik
 * ═══════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  type StorageLike,
  RATE_LIMIT_KEY,
  MAX_ATTEMPTS,
  LOCKOUT_DURATION,
  readRateLimitState,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "../lib/rateLimit.ts";

// ── Mock Storage (in-memory, tidak butuh browser) ─────────────────────
function createMockStorage(): StorageLike & { clear: () => void } {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => {
      store.set(key, val);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
  };
}

// ─── Timestamp helpers ────────────────────────────────────────────────
const NOW = 1_700_000_000_000; // timestamp tetap untuk test
const AFTER_15MIN = NOW + LOCKOUT_DURATION + 1; // 1ms setelah lockout habis
const IN_7MIN = NOW + 7 * 60 * 1_000; // di tengah lockout

// ══════════════════════════════════════════════════════════════════════
//  readRateLimitState()
// ══════════════════════════════════════════════════════════════════════
describe("readRateLimitState()", () => {
  let storage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    storage = createMockStorage();
  });

  it("✅ storage kosong → count=0, firstAttempt=now", () => {
    const state = readRateLimitState(storage, NOW);
    expect(state.count).toBe(0);
    expect(state.firstAttempt).toBe(NOW);
  });

  it("✅ membaca state yang tersimpan dengan benar", () => {
    const saved = { count: 3, firstAttempt: NOW };
    storage.setItem(RATE_LIMIT_KEY, JSON.stringify(saved));
    const state = readRateLimitState(storage, IN_7MIN);
    expect(state.count).toBe(3);
    expect(state.firstAttempt).toBe(NOW);
  });

  it("✅ jika lockout period sudah habis, reset otomatis ke 0", () => {
    const old = { count: 5, firstAttempt: NOW };
    storage.setItem(RATE_LIMIT_KEY, JSON.stringify(old));
    const state = readRateLimitState(storage, AFTER_15MIN);
    expect(state.count).toBe(0);
  });

  it("✅ JSON rusak di storage → dikembalikan sebagai state awal", () => {
    storage.setItem(RATE_LIMIT_KEY, "BUKAN_JSON{{{");
    const state = readRateLimitState(storage, NOW);
    expect(state.count).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════
//  checkRateLimit()
// ══════════════════════════════════════════════════════════════════════
describe("checkRateLimit()", () => {
  let storage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    storage = createMockStorage();
  });

  it("✅ storage kosong → allowed=true, attemptsLeft=MAX_ATTEMPTS", () => {
    const result = checkRateLimit(storage, NOW);
    expect(result.allowed).toBe(true);
    expect(result.attemptsLeft).toBe(MAX_ATTEMPTS);
    expect(result.lockoutMs).toBe(0);
  });

  it("✅ setelah 4 percobaan gagal → masih diizinkan, sisa 1 attempt", () => {
    const state = { count: 4, firstAttempt: NOW };
    storage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    const result = checkRateLimit(storage, IN_7MIN);
    expect(result.allowed).toBe(true);
    expect(result.attemptsLeft).toBe(1);
  });

  it("❌ setelah 5 percobaan gagal → TIDAK diizinkan, lockout aktif", () => {
    const state = { count: 5, firstAttempt: NOW };
    storage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    const result = checkRateLimit(storage, IN_7MIN);
    expect(result.allowed).toBe(false);
    expect(result.attemptsLeft).toBe(0);
    expect(result.lockoutMs).toBeGreaterThan(0);
  });

  it("✅ tepat saat lockout habis → sudah diizinkan lagi", () => {
    const state = { count: 5, firstAttempt: NOW };
    storage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    const result = checkRateLimit(storage, AFTER_15MIN);
    expect(result.allowed).toBe(true);
  });

  it("✅ lockoutMs tepat dihitung (di tengah lockout)", () => {
    const state = { count: 5, firstAttempt: NOW };
    storage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    const result = checkRateLimit(storage, IN_7MIN);
    const expectedLockout = LOCKOUT_DURATION - (IN_7MIN - NOW);
    expect(result.lockoutMs).toBe(expectedLockout);
  });

  it("✅ lebih dari MAX_ATTEMPTS juga tetap blocked", () => {
    const state = { count: 99, firstAttempt: NOW };
    storage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    const result = checkRateLimit(storage, IN_7MIN);
    expect(result.allowed).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════
//  recordFailedAttempt()
// ══════════════════════════════════════════════════════════════════════
describe("recordFailedAttempt()", () => {
  let storage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    storage = createMockStorage();
  });

  it("✅ percobaan pertama → count menjadi 1", () => {
    const result = recordFailedAttempt(storage, NOW);
    expect(result.count).toBe(1);
  });

  it("✅ percobaan pertama → firstAttempt diset ke now", () => {
    const result = recordFailedAttempt(storage, NOW);
    expect(result.firstAttempt).toBe(NOW);
  });

  it("✅ percobaan ke-2 → count menjadi 2, firstAttempt tidak berubah", () => {
    storage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ count: 1, firstAttempt: NOW }),
    );
    const result = recordFailedAttempt(storage, IN_7MIN);
    expect(result.count).toBe(2);
    expect(result.firstAttempt).toBe(NOW);
  });

  it("✅ state tersimpan di storage setelah dicatat", () => {
    recordFailedAttempt(storage, NOW);
    const stored = JSON.parse(storage.getItem(RATE_LIMIT_KEY) ?? "{}") as {
      count: number;
    };
    expect(stored.count).toBe(1);
  });

  it("✅ 5x recordFailedAttempt → count menjadi 5", () => {
    let now = NOW;
    for (let i = 0; i < 5; i++) {
      recordFailedAttempt(storage, now);
      now += 1_000;
    }
    const stored = JSON.parse(storage.getItem(RATE_LIMIT_KEY) ?? "{}") as {
      count: number;
    };
    expect(stored.count).toBe(5);
  });
});

// ══════════════════════════════════════════════════════════════════════
//  resetRateLimit()
// ══════════════════════════════════════════════════════════════════════
describe("resetRateLimit()", () => {
  let storage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    storage = createMockStorage();
  });

  it("✅ menghapus data rate limit dari storage", () => {
    storage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ count: 3, firstAttempt: NOW }),
    );
    resetRateLimit(storage);
    expect(storage.getItem(RATE_LIMIT_KEY)).toBeNull();
  });

  it("✅ setelah reset, checkRateLimit kembali mengizinkan", () => {
    storage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ count: 5, firstAttempt: NOW }),
    );
    expect(checkRateLimit(storage, IN_7MIN).allowed).toBe(false);

    resetRateLimit(storage);

    expect(checkRateLimit(storage, IN_7MIN).allowed).toBe(true);
  });

  it("✅ reset pada storage kosong tidak error", () => {
    expect(() => resetRateLimit(storage)).not.toThrow();
  });
});

// ══════════════════════════════════════════════════════════════════════
//  Skenario Integrasi: Full Login Flow
// ══════════════════════════════════════════════════════════════════════
describe("Skenario: Full Login Flow TDD", () => {
  let storage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    storage = createMockStorage();
  });

  it("🔄 skenario: 5x gagal → locked → tunggu 15 menit → izin kembali", () => {
    // ─ Tahap 1: 5x gagal login ───────────────────────────────────────
    let now = NOW;
    for (let i = 0; i < 5; i++) {
      const check = checkRateLimit(storage, now);
      expect(check.allowed).toBe(true);
      recordFailedAttempt(storage, now);
      now += 500;
    }

    // ─ Tahap 2: Percobaan ke-6 → harus diblokir ─────────────────────
    const blockedCheck = checkRateLimit(storage, now);
    expect(blockedCheck.allowed).toBe(false);
    expect(blockedCheck.attemptsLeft).toBe(0);

    // ─ Tahap 3: Di tengah lockout (7 menit) → masih blocked ──────────
    const midLockout = NOW + 7 * 60 * 1_000;
    expect(checkRateLimit(storage, midLockout).allowed).toBe(false);

    // ─ Tahap 4: Setelah 15 menit → diizinkan kembali ─────────────────
    const afterLockout = NOW + LOCKOUT_DURATION + 1;
    expect(checkRateLimit(storage, afterLockout).allowed).toBe(true);
  });

  it("🔄 skenario: gagal → berhasil login → counter direset", () => {
    recordFailedAttempt(storage, NOW);
    recordFailedAttempt(storage, NOW + 1_000);
    recordFailedAttempt(storage, NOW + 2_000);

    const stored = JSON.parse(storage.getItem(RATE_LIMIT_KEY) ?? "{}") as {
      count: number;
    };
    expect(stored.count).toBe(3);

    resetRateLimit(storage);
    expect(storage.getItem(RATE_LIMIT_KEY)).toBeNull();

    const fresh = checkRateLimit(storage, NOW + 3_000);
    expect(fresh.attemptsLeft).toBe(MAX_ATTEMPTS);
  });

  it("🔄 skenario: lockout habis, percobaan baru mulai fresh (count reset)", () => {
    storage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ count: 5, firstAttempt: NOW }),
    );

    const state = readRateLimitState(storage, AFTER_15MIN);
    expect(state.count).toBe(0);
    expect(state.firstAttempt).toBe(AFTER_15MIN);
  });
});
