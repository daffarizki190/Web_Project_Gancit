/**
 * ═══════════════════════════════════════════════════════════════════════
 *  RBAC — Role-Based Access Control (Pure Functions)
 *  PT. Centrepark | Gandaria City Project Hub
 * ═══════════════════════════════════════════════════════════════════════
 */

// ─── Types ────────────────────────────────────────────────────────────────

export type RoleKey = "leader" | "cpm" | "supervisor" | "it" | "attendant";

export type ProjectKey = "aura" | "pahamaja" | "smartparking" | "opreport";

export interface RoleDefinition {
  readonly label: string;
  readonly level: number;
  readonly badgeClass: string;
  readonly dotColor: string;
  readonly description: string;
}

export interface UserShape {
  id: number;
  username: string;
  name: string;
  role: RoleKey;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ─── Role Registry ────────────────────────────────────────────────────────

export const ROLES: Record<RoleKey, RoleDefinition> = {
  leader: {
    label: "Leader",
    level: 5,
    badgeClass: "bg-yellow-400/15 text-yellow-300 border-yellow-400/25",
    dotColor: "bg-yellow-400",
    description: "Akses penuh ke semua sistem",
  },
  cpm: {
    label: "CarPark Manager",
    level: 4,
    badgeClass: "bg-purple-400/15 text-purple-300 border-purple-400/25",
    dotColor: "bg-purple-400",
    description: "Manajer operasional parkir",
  },
  supervisor: {
    label: "Supervisor",
    level: 3,
    badgeClass: "bg-blue-400/15 text-blue-300 border-blue-400/25",
    dotColor: "bg-blue-400",
    description: "Akses monitoring & pelaporan",
  },
  it: {
    label: "IT",
    level: 2,
    badgeClass: "bg-cyan-400/15 text-cyan-300 border-cyan-400/25",
    dotColor: "bg-cyan-400",
    description: "Akses sistem & infrastruktur",
  },
  attendant: {
    label: "Attendant",
    level: 1,
    badgeClass: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25",
    dotColor: "bg-emerald-400",
    description: "Akses operasional terbatas",
  },
} as const;

// ─── Project→Role Mapping ─────────────────────────────────────────────────

export const PROJECT_ROLE_MAP: Record<ProjectKey, readonly string[]> = {
  aura: ["leader", "cpm", "supervisor", "it"],
  pahamaja: ["leader", "cpm", "supervisor", "it", "attendant"],
  smartparking: ["leader", "cpm", "supervisor", "it", "attendant"],
  opreport: ["leader", "cpm", "supervisor", "it"],
} as const;

// ─── Pure Functions ───────────────────────────────────────────────────────

/**
 * Apakah role yang diberikan dikenal dalam sistem?
 */
export function isValidRole(role: unknown): role is RoleKey {
  return (
    typeof role === "string" &&
    Object.prototype.hasOwnProperty.call(ROLES, role)
  );
}

/**
 * Apakah user memiliki akses ke proyek tertentu?
 */
export function hasProjectAccess(
  user: { role: string } | null | undefined,
  projectId: string,
): boolean {
  if (!user?.role) return false;
  const allowed = PROJECT_ROLE_MAP[projectId as ProjectKey];
  if (!allowed) return false;
  return (allowed as readonly string[]).includes(user.role);
}

/**
 * Apakah role A memiliki level ≥ role B?
 */
export function isRoleAtLeast(roleA: string, roleB: string): boolean {
  const levelA = ROLES[roleA as RoleKey]?.level ?? 0;
  const levelB = ROLES[roleB as RoleKey]?.level ?? 0;
  return levelA >= levelB;
}

/**
 * Ambil semua project ID yang bisa diakses role tertentu.
 */
export function getAccessibleProjects(role: string): string[] {
  return Object.entries(PROJECT_ROLE_MAP)
    .filter(([, roles]) => (roles as readonly string[]).includes(role))
    .map(([projectId]) => projectId);
}

/**
 * Validasi struktur user object — apakah memiliki field wajib?
 */
export function validateUserShape(user: unknown): ValidationResult {
  const errors: string[] = [];

  if (!user || typeof user !== "object") {
    return { valid: false, errors: ["User harus berupa object."] };
  }

  const u = user as Record<string, unknown>;

  if (typeof u["id"] !== "number")
    errors.push("Field 'id' harus berupa number.");
  if (
    typeof u["username"] !== "string" ||
    (u["username"] as string).trim() === ""
  )
    errors.push("Field 'username' harus berupa string non-kosong.");
  if (typeof u["name"] !== "string" || (u["name"] as string).trim() === "")
    errors.push("Field 'name' harus berupa string non-kosong.");
  if (!isValidRole(u["role"]))
    errors.push(`Field 'role' tidak valid: '${String(u["role"])}'.`);

  return { valid: errors.length === 0, errors };
}
