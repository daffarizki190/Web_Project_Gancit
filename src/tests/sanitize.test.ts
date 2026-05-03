/**
 * ═══════════════════════════════════════════════════════════════════════
 *  TEST SUITE: Input Sanitization & Validation
 *  File   : src/lib/sanitize.js
 *  Runner : Vitest
 * ═══════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from "vitest";
import {
  sanitizeInput,
  isValidUsername,
  validatePasswordStrength,
  isSafeUrl,
} from "../lib/sanitize.js";

// ══════════════════════════════════════════════════════════════════════
//  sanitizeInput()
// ══════════════════════════════════════════════════════════════════════
describe("sanitizeInput()", () => {
  // ── Input normal ──────────────────────────────────────────────────
  it("✅ mengembalikan string yang sudah di-trim", () => {
    expect(sanitizeInput("  halo  ")).toBe("halo");
  });

  it("✅ teks normal tidak berubah", () => {
    expect(sanitizeInput("admin.leader")).toBe("admin.leader");
  });

  // ── Karakter berbahaya ────────────────────────────────────────────
  it("❌ menghapus karakter < (HTML tag injection)", () => {
    expect(sanitizeInput("<script>")).toBe("script");
  });

  it("❌ menghapus karakter > (HTML tag close)", () => {
    expect(sanitizeInput("alert>")).toBe("alert");
  });

  it('❌ menghapus tanda kutip ganda " (attribute injection)', () => {
    expect(sanitizeInput('nama "Ahmad"')).toBe("nama Ahmad");
  });

  it("❌ menghapus tanda kutip tunggal ' (SQL injection basic)", () => {
    expect(sanitizeInput("O'Brien")).toBe("OBrien");
  });

  it("❌ menghapus backtick ` (template literal injection)", () => {
    expect(sanitizeInput("`cmd`")).toBe("cmd");
  });

  it("❌ menghapus null byte", () => {
    expect(sanitizeInput("test\0end")).toBe("testend");
  });

  it("❌ XSS payload lengkap dibersihkan", () => {
    const xss = '<img src=x onerror="alert(1)">';
    const result = sanitizeInput(xss);
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).not.toContain('"');
  });

  // ── maxLength ─────────────────────────────────────────────────────
  it("✅ memotong string sesuai maxLength default (500)", () => {
    const long = "a".repeat(600);
    expect(sanitizeInput(long)).toHaveLength(500);
  });

  it("✅ memotong string sesuai maxLength kustom", () => {
    const result = sanitizeInput("abcdefghij", { maxLength: 5 });
    expect(result).toBe("abcde");
  });

  // ── Whitespace ────────────────────────────────────────────────────
  it("✅ multiple spasi dinormalisasi menjadi satu spasi", () => {
    expect(sanitizeInput("halo   dunia")).toBe("halo dunia");
  });

  it("✅ tab dan newline di-normalize", () => {
    expect(sanitizeInput("halo\t\ndunia")).toBe("halo dunia");
  });

  // ── Tipe non-string ───────────────────────────────────────────────
  it("✅ number mengembalikan string kosong", () => {
    expect(sanitizeInput(123)).toBe("");
  });

  it("✅ null mengembalikan string kosong", () => {
    expect(sanitizeInput(null)).toBe("");
  });

  it("✅ undefined mengembalikan string kosong", () => {
    expect(sanitizeInput(undefined)).toBe("");
  });

  it("✅ array mengembalikan string kosong", () => {
    expect(sanitizeInput(["a", "b"])).toBe("");
  });
});

// ══════════════════════════════════════════════════════════════════════
//  isValidUsername()
// ══════════════════════════════════════════════════════════════════════
describe("isValidUsername()", () => {
  // ── Valid usernames ───────────────────────────────────────────────
  it("✅ username alfanumerik valid", () => {
    expect(isValidUsername("admin123")).toBe(true);
  });

  it("✅ username dengan titik valid", () => {
    expect(isValidUsername("admin.leader")).toBe(true);
  });

  it("✅ username dengan underscore valid", () => {
    expect(isValidUsername("supervisor_01")).toBe(true);
  });

  it("✅ username dengan huruf besar valid", () => {
    expect(isValidUsername("AdminUser")).toBe(true);
  });

  it("✅ username tepat 3 karakter valid (batas minimum)", () => {
    expect(isValidUsername("abc")).toBe(true);
  });

  it("✅ username tepat 50 karakter valid (batas maksimum)", () => {
    expect(isValidUsername("a".repeat(50))).toBe(true);
  });

  // ── Invalid usernames ─────────────────────────────────────────────
  it("❌ username terlalu pendek (2 karakter)", () => {
    expect(isValidUsername("ab")).toBe(false);
  });

  it("❌ username terlalu panjang (51 karakter)", () => {
    expect(isValidUsername("a".repeat(51))).toBe(false);
  });

  it("❌ username dengan spasi tidak valid", () => {
    expect(isValidUsername("admin user")).toBe(false);
  });

  it("❌ username dengan karakter @ tidak valid", () => {
    expect(isValidUsername("admin@mail")).toBe(false);
  });

  it("❌ username dengan karakter - tidak valid", () => {
    expect(isValidUsername("admin-user")).toBe(false);
  });

  it("❌ string kosong tidak valid", () => {
    expect(isValidUsername("")).toBe(false);
  });

  it("❌ number bukan string tidak valid", () => {
    expect(isValidUsername(1234)).toBe(false);
  });

  it("❌ null tidak valid", () => {
    expect(isValidUsername(null)).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════
//  validatePasswordStrength()
// ══════════════════════════════════════════════════════════════════════
describe("validatePasswordStrength()", () => {
  // ── Password kuat ─────────────────────────────────────────────────
  it("✅ password kuat lulus semua validasi", () => {
    const { strong, errors } = validatePasswordStrength("Leader@2025");
    expect(strong).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("✅ password lain yang kuat", () => {
    // ! bukan dalam set karakter kita, tapi @ ada
    const { strong: s2 } = validatePasswordStrength("Sup3r@Secure");
    expect(s2).toBe(true);
  });

  // ── Terlalu pendek ────────────────────────────────────────────────
  it("❌ password < 8 karakter tidak valid", () => {
    const { strong, errors } = validatePasswordStrength("Ab@1");
    expect(strong).toBe(false);
    expect(errors.some((e) => e.includes("8"))).toBe(true);
  });

  // ── Tidak ada huruf besar ─────────────────────────────────────────
  it("❌ password tanpa huruf besar tidak valid", () => {
    const { strong, errors } = validatePasswordStrength("leader@2025");
    expect(strong).toBe(false);
    expect(errors.some((e) => e.toLowerCase().includes("besar"))).toBe(true);
  });

  // ── Tidak ada huruf kecil ─────────────────────────────────────────
  it("❌ password tanpa huruf kecil tidak valid", () => {
    const { strong, errors } = validatePasswordStrength("LEADER@2025");
    expect(strong).toBe(false);
    expect(errors.some((e) => e.toLowerCase().includes("kecil"))).toBe(true);
  });

  // ── Tidak ada angka ───────────────────────────────────────────────
  it("❌ password tanpa angka tidak valid", () => {
    const { strong, errors } = validatePasswordStrength("Leader@xxxx");
    expect(strong).toBe(false);
    expect(errors.some((e) => e.includes("angka"))).toBe(true);
  });

  // ── Tidak ada karakter spesial ────────────────────────────────────
  it("❌ password tanpa karakter spesial tidak valid", () => {
    const { strong, errors } = validatePasswordStrength("Leader12345");
    expect(strong).toBe(false);
    expect(errors.some((e) => e.includes("spesial"))).toBe(true);
  });

  // ── Password kosong ───────────────────────────────────────────────
  it("❌ password kosong langsung invalid", () => {
    const { strong, errors } = validatePasswordStrength("");
    expect(strong).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("❌ non-string mengembalikan invalid", () => {
    const { strong } = validatePasswordStrength(null);
    expect(strong).toBe(false);
  });

  // ── Akumulasi error ───────────────────────────────────────────────
  it("❌ password yang buruk mengumpulkan banyak error sekaligus", () => {
    const { strong, errors } = validatePasswordStrength("abc");
    expect(strong).toBe(false);
    // kurang panjang, tidak ada besar, tidak ada angka, tidak ada spesial
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});

// ══════════════════════════════════════════════════════════════════════
//  isSafeUrl()
// ══════════════════════════════════════════════════════════════════════
describe("isSafeUrl()", () => {
  // ── URL aman ─────────────────────────────────────────────────────
  it("✅ URL https valid dianggap aman", () => {
    expect(isSafeUrl("https://aura.centrepark.internal")).toBe(true);
  });

  it("✅ URL https dengan path dianggap aman", () => {
    expect(
      isSafeUrl("https://smartparking.centrepark.internal/dashboard"),
    ).toBe(true);
  });

  // ── URL tidak aman ────────────────────────────────────────────────
  it("❌ URL http (bukan https) tidak aman", () => {
    expect(isSafeUrl("http://aura.centrepark.internal")).toBe(false);
  });

  it("❌ URL javascript: tidak aman", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
  });

  it("❌ URL data: tidak aman", () => {
    expect(isSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("❌ URL ftp: tidak aman", () => {
    expect(isSafeUrl("ftp://files.example.com")).toBe(false);
  });

  // ── Bukan URL ─────────────────────────────────────────────────────
  it("❌ string bukan URL mengembalikan false", () => {
    expect(isSafeUrl("bukan-url-sama-sekali")).toBe(false);
  });

  it("❌ string kosong mengembalikan false", () => {
    expect(isSafeUrl("")).toBe(false);
  });

  it("❌ null mengembalikan false", () => {
    expect(isSafeUrl(null)).toBe(false);
  });

  it("❌ number mengembalikan false", () => {
    expect(isSafeUrl(8080)).toBe(false);
  });
});
