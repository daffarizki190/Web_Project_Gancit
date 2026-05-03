/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Security Middleware — Gandaria City Project Hub
 *  PT. Centrepark | Internal Portal v1.0.0
 *
 *  CATATAN: Client-side security hanya lapisan UX tambahan.
 *  Validasi sesungguhnya WAJIB dilakukan di server (backend).
 *
 *  PRODUCTION STACK:
 *  - Auth   : Keycloak / Auth0 / Node.js + Passport.js
 *  - Token  : httpOnly + SameSite=Strict cookie
 *  - HTTPS  : HSTS header (Strict-Transport-Security)
 *  - WAF    : Cloudflare / AWS WAF
 *  - SIEM   : ELK Stack / Splunk
 * ═══════════════════════════════════════════════════════════════════════
 */

// ─── Types ────────────────────────────────────────────────────────────────

export interface UserLike {
  id: number;
  username: string;
  role: string;
}

export interface TokenValidationResult {
  valid: boolean;
  reason: string;
}

export interface SecureNavigationParams {
  projectId: string;
  targetUrl: string;
  user: UserLike | null;
  onDenied?: (reason: string) => void;
  onError?: (err: unknown) => void;
}

export interface SecureHeaders {
  "Content-Type": string;
  "X-CSRF-Token": string;
}

// ─── 1. HTTPS ENFORCEMENT ─────────────────────────────────────────────────

/**
 * Paksa redirect ke HTTPS di lingkungan production.
 */
export function enforceHttps(): void {
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "http:" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) {
    window.location.replace(
      `https://${window.location.host}${window.location.pathname}${window.location.search}`,
    );
    console.warn("[SECURITY] HTTP access detected — redirecting to HTTPS.");
  }
}

// ─── 2. TOKEN VALIDATION ──────────────────────────────────────────────────

const PROJECT_ROLES: Record<string, readonly string[]> = {
  aura: ["leader", "cpm", "supervisor", "it"],
  pahamaja: ["leader", "cpm", "supervisor", "it", "attendant"],
  smartparking: ["leader", "cpm", "supervisor", "it", "attendant"],
  opreport: ["leader", "cpm", "supervisor", "it"],
} as const;

/**
 * Validasi token & role sebelum redirect ke sub-aplikasi.
 */
export async function validateAccessToken(
  projectId: string,
  user: UserLike | null,
): Promise<TokenValidationResult> {
  if (!user?.id || !user.role) {
    return { valid: false, reason: "NO_SESSION — Sesi tidak ditemukan." };
  }

  const sessionData = sessionStorage.getItem("cp_portal_user");
  if (!sessionData) {
    return { valid: false, reason: "TOKEN_MISSING — Token tidak ada di sesi." };
  }

  // PRODUCTION: uncomment untuk verifikasi ke backend
  // const response = await fetch("/api/auth/verify", {
  //   method: "POST",
  //   credentials: "include",
  //   headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() },
  //   body: JSON.stringify({ projectId, userId: user.id }),
  // });
  // const data = await response.json();
  // return { valid: data.authorized, reason: data.reason };

  const allowedRoles = PROJECT_ROLES[projectId];
  if (!allowedRoles) {
    return {
      valid: false,
      reason: "PROJECT_NOT_FOUND — ID proyek tidak valid.",
    };
  }

  if (!(allowedRoles as readonly string[]).includes(user.role)) {
    return {
      valid: false,
      reason: `ACCESS_DENIED — Role '${user.role}' tidak diizinkan untuk '${projectId}'.`,
    };
  }

  console.log(
    `%c[MIDDLEWARE] Access granted — ${user.username} → ${projectId}`,
    "color:#10b981;font-weight:700",
  );
  return { valid: true, reason: "AUTHORIZED" };
}

// ─── 3. CSRF TOKEN ────────────────────────────────────────────────────────

/**
 * Baca CSRF token dari cookie (di-set server saat page load).
 */
export function getCsrfToken(): string {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf_token="));

  if (!match) {
    console.warn("[SECURITY] CSRF token tidak ditemukan di cookie.");
    return "";
  }
  return match.split("=")[1] ?? "";
}

/**
 * Buat header standar untuk setiap mutating request (POST/PUT/DELETE).
 */
export function getSecureHeaders(): SecureHeaders {
  return {
    "Content-Type": "application/json",
    "X-CSRF-Token": getCsrfToken(),
  };
}

// ─── 4. INPUT SANITIZATION ────────────────────────────────────────────────

/**
 * Sanitasi input dari karakter XSS / HTML injection.
 * Di production: ganti dengan DOMPurify.sanitize().
 */
export function sanitizeInput(
  input: string,
  { maxLength = 500 }: { maxLength?: number } = {},
): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>"'`]/g, "")
    .replace(/\0/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Validasi format username (alphanumeric + titik + underscore, 3–50 char).
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9._]{3,50}$/.test(username);
}

// ─── 5. RATE LIMITER (client-side simulation) ─────────────────────────────

const RL_KEY = "cp_login_attempts";
const RL_MAX = 5;
const RL_LOCKOUT = 15 * 60 * 1_000;

interface RLState {
  count: number;
  firstAttempt: number;
}
interface RLResult {
  allowed: boolean;
  attemptsLeft: number;
  lockoutMs: number;
}

export function checkRateLimit(): RLResult {
  const raw = sessionStorage.getItem(RL_KEY);
  const now = Date.now();
  let data: RLState = raw
    ? (JSON.parse(raw) as RLState)
    : { count: 0, firstAttempt: now };

  if (now - data.firstAttempt > RL_LOCKOUT) {
    data = { count: 0, firstAttempt: now };
  }
  if (data.count >= RL_MAX) {
    return {
      allowed: false,
      attemptsLeft: 0,
      lockoutMs: RL_LOCKOUT - (now - data.firstAttempt),
    };
  }
  return { allowed: true, attemptsLeft: RL_MAX - data.count, lockoutMs: 0 };
}

export function recordFailedAttempt(): void {
  const raw = sessionStorage.getItem(RL_KEY);
  const now = Date.now();
  const data: RLState = raw
    ? (JSON.parse(raw) as RLState)
    : { count: 0, firstAttempt: now };
  data.count += 1;
  if (data.count === 1) data.firstAttempt = now;
  sessionStorage.setItem(RL_KEY, JSON.stringify(data));
  console.warn(
    `%c[SECURITY] Login failed — attempt ${data.count}/${RL_MAX}`,
    "color:#f59e0b;font-weight:700",
  );
}

export function resetRateLimit(): void {
  sessionStorage.removeItem(RL_KEY);
}

// ─── 6. SECURE NAVIGATION ─────────────────────────────────────────────────

/**
 * Navigasi aman ke sub-aplikasi dengan validasi token sebelumnya.
 */
export async function navigateSecure({
  projectId,
  targetUrl,
  user,
  onDenied,
  onError,
}: SecureNavigationParams): Promise<void> {
  try {
    enforceHttps();

    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil(rateCheck.lockoutMs / 60_000);
      onDenied?.(
        `Terlalu banyak percobaan. Coba lagi dalam ${minutesLeft} menit.`,
      );
      return;
    }

    const { valid, reason } = await validateAccessToken(projectId, user);
    if (!valid) {
      recordFailedAttempt();
      onDenied?.(reason);
      console.warn(
        `%c[SECURITY] Navigation blocked — ${reason}`,
        "color:#ef4444",
      );
      return;
    }

    resetRateLimit();
    console.log(
      `%c[SECURITY] Navigating to ${targetUrl}`,
      "color:#06b6d4;font-weight:700",
    );
    // Production: window.location.href = targetUrl;
    alert(`[DEMO] Navigasi ke: ${targetUrl}`);
  } catch (err) {
    onError?.(err);
    console.error("[SECURITY] Navigation error:", err);
  }
}
