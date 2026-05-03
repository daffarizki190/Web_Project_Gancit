/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Input Sanitization & Validation (Pure Functions)
 *  PT. Centrepark | Gandaria City Project Hub
 * ═══════════════════════════════════════════════════════════════════════
 */

// ─── Types ────────────────────────────────────────────────────────────────

export interface SanitizeOptions {
  maxLength?: number;
}

export interface PasswordValidationResult {
  strong: boolean;
  errors: string[];
}

// ─── Functions ────────────────────────────────────────────────────────────

/**
 * Sanitasi string dari karakter berbahaya (XSS / HTML injection).
 * Di production: ganti dengan DOMPurify.sanitize().
 */
export function sanitizeInput(
  input: unknown,
  { maxLength = 500 }: SanitizeOptions = {},
): string {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>"'`]/g, "") // strip HTML metacharacters
    .replace(/\0/g, "") // strip null bytes
    .replace(/\s+/g, " "); // normalize whitespace
}

/**
 * Validasi format username.
 * Aturan: alphanumeric, titik, underscore. 3–50 karakter.
 */
export function isValidUsername(username: unknown): boolean {
  if (typeof username !== "string") return false;
  return /^[a-zA-Z0-9._]{3,50}$/.test(username);
}

/**
 * Validasi kekuatan password.
 * Aturan: min 8 karakter, huruf besar, huruf kecil, angka, karakter spesial.
 */
export function validatePasswordStrength(
  password: unknown,
): PasswordValidationResult {
  const errors: string[] = [];

  if (typeof password !== "string" || password.length === 0) {
    return { strong: false, errors: ["Password tidak boleh kosong."] };
  }
  if (password.length < 8) errors.push("Minimal 8 karakter.");
  if (!/[A-Z]/.test(password))
    errors.push("Harus mengandung minimal 1 huruf besar.");
  if (!/[a-z]/.test(password))
    errors.push("Harus mengandung minimal 1 huruf kecil.");
  if (!/[0-9]/.test(password)) errors.push("Harus mengandung minimal 1 angka.");
  if (!/[@$!%*?&_#^]/.test(password))
    errors.push("Harus mengandung minimal 1 karakter spesial (@$!%*?&_#^).");

  return { strong: errors.length === 0, errors };
}

/**
 * Apakah string adalah URL yang aman (https only)?
 */
export function isSafeUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}
