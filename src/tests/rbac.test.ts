/**
 * ═══════════════════════════════════════════════════════════════════════
 *  TEST SUITE: RBAC — Role-Based Access Control
 *  File   : src/lib/rbac.js
 *  Runner : Vitest
 *
 *  Role hierarchy (level tinggi → rendah):
 *   5 - Leader
 *   4 - CarPark Manager (cpm)
 *   3 - Supervisor
 *   2 - IT
 *   1 - Attendant
 * ═══════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from "vitest";
import {
  ROLES,
  PROJECT_ROLE_MAP,
  isValidRole,
  hasProjectAccess,
  isRoleAtLeast,
  getAccessibleProjects,
  validateUserShape,
} from "../lib/rbac.js";

// ══════════════════════════════════════════════════════════════════════
//  isValidRole()
// ══════════════════════════════════════════════════════════════════════
describe("isValidRole()", () => {
  it("✅ 'leader' adalah role valid", () =>
    expect(isValidRole("leader")).toBe(true));
  it("✅ 'cpm' adalah role valid", () => expect(isValidRole("cpm")).toBe(true));
  it("✅ 'supervisor' adalah role valid", () =>
    expect(isValidRole("supervisor")).toBe(true));
  it("✅ 'it' adalah role valid", () => expect(isValidRole("it")).toBe(true));
  it("✅ 'attendant' adalah role valid", () =>
    expect(isValidRole("attendant")).toBe(true));

  it("❌ 'admin' bukan role valid", () =>
    expect(isValidRole("admin")).toBe(false));
  it("❌ 'technician' bukan role valid (sudah dihapus)", () =>
    expect(isValidRole("technician")).toBe(false));
  it("❌ string kosong bukan role valid", () =>
    expect(isValidRole("")).toBe(false));
  it("❌ undefined bukan role valid", () =>
    expect(isValidRole(undefined)).toBe(false));
  it("❌ null bukan role valid", () => expect(isValidRole(null)).toBe(false));
  it("❌ case-sensitive — 'Leader' bukan role valid", () =>
    expect(isValidRole("Leader")).toBe(false));
  it("❌ 'CPM' (huruf besar) bukan role valid", () =>
    expect(isValidRole("CPM")).toBe(false));
  it("❌ 'IT' (huruf besar) bukan role valid", () =>
    expect(isValidRole("IT")).toBe(false));
});

// ══════════════════════════════════════════════════════════════════════
//  hasProjectAccess() — per proyek
// ══════════════════════════════════════════════════════════════════════
describe("hasProjectAccess()", () => {
  const leader = { id: 1, role: "leader" };
  const cpm = { id: 5, role: "cpm" };
  const supervisor = { id: 6, role: "supervisor" };
  const it_user = { id: 8, role: "it" };
  const attendant = { id: 9, role: "attendant" };

  // ── A.U.R.A ──────────────────────────────────────────────────────
  describe("proyek: aura", () => {
    it("✅ leader bisa akses aura", () =>
      expect(hasProjectAccess(leader, "aura")).toBe(true));
    it("✅ cpm bisa akses aura", () =>
      expect(hasProjectAccess(cpm, "aura")).toBe(true));
    it("✅ supervisor bisa akses aura", () =>
      expect(hasProjectAccess(supervisor, "aura")).toBe(true));
    it("✅ it bisa akses aura", () =>
      expect(hasProjectAccess(it_user, "aura")).toBe(true));
    it("❌ attendant TIDAK bisa akses aura", () =>
      expect(hasProjectAccess(attendant, "aura")).toBe(false));
  });

  // ── PahamAja ─────────────────────────────────────────────────────
  describe("proyek: pahamaja", () => {
    it("✅ leader bisa akses pahamaja", () =>
      expect(hasProjectAccess(leader, "pahamaja")).toBe(true));
    it("✅ cpm bisa akses pahamaja", () =>
      expect(hasProjectAccess(cpm, "pahamaja")).toBe(true));
    it("✅ supervisor bisa akses pahamaja", () =>
      expect(hasProjectAccess(supervisor, "pahamaja")).toBe(true));
    it("✅ it bisa akses pahamaja", () =>
      expect(hasProjectAccess(it_user, "pahamaja")).toBe(true));
    it("✅ attendant bisa akses pahamaja", () =>
      expect(hasProjectAccess(attendant, "pahamaja")).toBe(true));
  });

  // ── Smart Parking ─────────────────────────────────────────────────
  describe("proyek: smartparking", () => {
    it("✅ leader bisa akses smartparking", () =>
      expect(hasProjectAccess(leader, "smartparking")).toBe(true));
    it("✅ cpm bisa akses smartparking", () =>
      expect(hasProjectAccess(cpm, "smartparking")).toBe(true));
    it("✅ supervisor bisa akses smartparking", () =>
      expect(hasProjectAccess(supervisor, "smartparking")).toBe(true));
    it("✅ it bisa akses smartparking", () =>
      expect(hasProjectAccess(it_user, "smartparking")).toBe(true));
    it("✅ attendant bisa akses smartparking", () =>
      expect(hasProjectAccess(attendant, "smartparking")).toBe(true));
  });

  // ── Operational Report ────────────────────────────────────────────
  describe("proyek: opreport", () => {
    it("✅ leader bisa akses opreport", () =>
      expect(hasProjectAccess(leader, "opreport")).toBe(true));
    it("✅ cpm bisa akses opreport", () =>
      expect(hasProjectAccess(cpm, "opreport")).toBe(true));
    it("✅ supervisor bisa akses opreport", () =>
      expect(hasProjectAccess(supervisor, "opreport")).toBe(true));
    it("✅ it bisa akses opreport", () =>
      expect(hasProjectAccess(it_user, "opreport")).toBe(true));
    it("❌ attendant TIDAK bisa akses opreport", () =>
      expect(hasProjectAccess(attendant, "opreport")).toBe(false));
  });

  // ── Edge cases ────────────────────────────────────────────────────
  describe("edge cases", () => {
    it("❌ null user → false", () =>
      expect(hasProjectAccess(null, "aura")).toBe(false));
    it("❌ user tanpa role → false", () =>
      expect(hasProjectAccess({}, "aura")).toBe(false));
    it("❌ project tidak dikenal → false", () =>
      expect(hasProjectAccess(leader, "xyz")).toBe(false));
    it("❌ project string kosong → false", () =>
      expect(hasProjectAccess(leader, "")).toBe(false));
  });
});

// ══════════════════════════════════════════════════════════════════════
//  isRoleAtLeast()
// ══════════════════════════════════════════════════════════════════════
describe("isRoleAtLeast()", () => {
  // ── Leader (level 5) ──────────────────────────────────────────────
  it("✅ leader >= leader", () =>
    expect(isRoleAtLeast("leader", "leader")).toBe(true));
  it("✅ leader >= cpm", () =>
    expect(isRoleAtLeast("leader", "cpm")).toBe(true));
  it("✅ leader >= supervisor", () =>
    expect(isRoleAtLeast("leader", "supervisor")).toBe(true));
  it("✅ leader >= it", () => expect(isRoleAtLeast("leader", "it")).toBe(true));
  it("✅ leader >= attendant", () =>
    expect(isRoleAtLeast("leader", "attendant")).toBe(true));

  // ── CPM (level 4) ────────────────────────────────────────────────
  it("❌ cpm TIDAK >= leader", () =>
    expect(isRoleAtLeast("cpm", "leader")).toBe(false));
  it("✅ cpm >= cpm", () => expect(isRoleAtLeast("cpm", "cpm")).toBe(true));
  it("✅ cpm >= supervisor", () =>
    expect(isRoleAtLeast("cpm", "supervisor")).toBe(true));
  it("✅ cpm >= it", () => expect(isRoleAtLeast("cpm", "it")).toBe(true));
  it("✅ cpm >= attendant", () =>
    expect(isRoleAtLeast("cpm", "attendant")).toBe(true));

  // ── Supervisor (level 3) ──────────────────────────────────────────
  it("❌ supervisor TIDAK >= leader", () =>
    expect(isRoleAtLeast("supervisor", "leader")).toBe(false));
  it("❌ supervisor TIDAK >= cpm", () =>
    expect(isRoleAtLeast("supervisor", "cpm")).toBe(false));
  it("✅ supervisor >= supervisor", () =>
    expect(isRoleAtLeast("supervisor", "supervisor")).toBe(true));
  it("✅ supervisor >= it", () =>
    expect(isRoleAtLeast("supervisor", "it")).toBe(true));
  it("✅ supervisor >= attendant", () =>
    expect(isRoleAtLeast("supervisor", "attendant")).toBe(true));

  // ── IT (level 2) ──────────────────────────────────────────────────
  it("❌ it TIDAK >= leader", () =>
    expect(isRoleAtLeast("it", "leader")).toBe(false));
  it("❌ it TIDAK >= cpm", () =>
    expect(isRoleAtLeast("it", "cpm")).toBe(false));
  it("❌ it TIDAK >= supervisor", () =>
    expect(isRoleAtLeast("it", "supervisor")).toBe(false));
  it("✅ it >= it", () => expect(isRoleAtLeast("it", "it")).toBe(true));
  it("✅ it >= attendant", () =>
    expect(isRoleAtLeast("it", "attendant")).toBe(true));

  // ── Attendant (level 1) ───────────────────────────────────────────
  it("❌ attendant TIDAK >= leader", () =>
    expect(isRoleAtLeast("attendant", "leader")).toBe(false));
  it("❌ attendant TIDAK >= cpm", () =>
    expect(isRoleAtLeast("attendant", "cpm")).toBe(false));
  it("❌ attendant TIDAK >= supervisor", () =>
    expect(isRoleAtLeast("attendant", "supervisor")).toBe(false));
  it("❌ attendant TIDAK >= it", () =>
    expect(isRoleAtLeast("attendant", "it")).toBe(false));
  it("✅ attendant >= attendant", () =>
    expect(isRoleAtLeast("attendant", "attendant")).toBe(true));

  // ── Invalid role ──────────────────────────────────────────────────
  it("❌ role tidak valid (level 0) TIDAK >= attendant", () =>
    expect(isRoleAtLeast("ghost", "attendant")).toBe(false));
});

// ══════════════════════════════════════════════════════════════════════
//  getAccessibleProjects()
// ══════════════════════════════════════════════════════════════════════
describe("getAccessibleProjects()", () => {
  it("✅ leader dapat akses semua 4 proyek", () => {
    const p = getAccessibleProjects("leader");
    expect(p).toHaveLength(4);
    expect(p).toContain("aura");
    expect(p).toContain("pahamaja");
    expect(p).toContain("smartparking");
    expect(p).toContain("opreport");
  });

  it("✅ cpm dapat akses semua 4 proyek", () => {
    const p = getAccessibleProjects("cpm");
    expect(p).toHaveLength(4);
    expect(p).toContain("aura");
    expect(p).toContain("opreport");
  });

  it("✅ supervisor dapat akses semua 4 proyek", () => {
    expect(getAccessibleProjects("supervisor")).toHaveLength(4);
  });

  it("✅ it dapat akses semua 4 proyek", () => {
    const p = getAccessibleProjects("it");
    expect(p).toHaveLength(4);
    expect(p).toContain("aura");
    expect(p).toContain("opreport");
  });

  it("✅ attendant hanya dapat akses 2 proyek (pahamaja, smartparking)", () => {
    const p = getAccessibleProjects("attendant");
    expect(p).toHaveLength(2);
    expect(p).toContain("pahamaja");
    expect(p).toContain("smartparking");
    expect(p).not.toContain("aura");
    expect(p).not.toContain("opreport");
  });

  it("✅ role tidak dikenal → array kosong", () => {
    expect(getAccessibleProjects("unknown")).toHaveLength(0);
  });

  it("✅ selalu mengembalikan Array", () => {
    for (const role of [
      "leader",
      "cpm",
      "supervisor",
      "it",
      "attendant",
      "ghost",
    ]) {
      expect(Array.isArray(getAccessibleProjects(role))).toBe(true);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════
//  validateUserShape()
// ══════════════════════════════════════════════════════════════════════
describe("validateUserShape()", () => {
  const base = {
    id: 1,
    username: "daffa.rizki",
    name: "Daffa Rizki Ariyanto",
    role: "leader",
  };

  it("✅ user leader valid", () => {
    const { valid, errors } = validateUserShape(base);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("✅ user cpm valid", () => {
    const { valid } = validateUserShape({
      ...base,
      id: 5,
      username: "rizal.maulana",
      name: "Rizal Maulana",
      role: "cpm",
    });
    expect(valid).toBe(true);
  });

  it("✅ user supervisor valid", () => {
    const { valid } = validateUserShape({
      ...base,
      id: 6,
      username: "nuryamin",
      name: "Akhmad Nuryamin",
      role: "supervisor",
    });
    expect(valid).toBe(true);
  });

  it("✅ user it valid", () => {
    const { valid } = validateUserShape({
      ...base,
      id: 8,
      username: "irvandi",
      name: "Irvandi Maulana",
      role: "it",
    });
    expect(valid).toBe(true);
  });

  it("✅ user attendant valid", () => {
    const { valid } = validateUserShape({ ...base, role: "attendant" });
    expect(valid).toBe(true);
  });

  it("❌ null → invalid", () =>
    expect(validateUserShape(null).valid).toBe(false));
  it("❌ string → invalid", () =>
    expect(validateUserShape("user").valid).toBe(false));

  it("❌ id bertipe string → error pada field 'id'", () => {
    const { valid, errors } = validateUserShape({ ...base, id: "1" });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("id"))).toBe(true);
  });

  it("❌ username kosong → error pada field 'username'", () => {
    const { valid, errors } = validateUserShape({ ...base, username: "  " });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("username"))).toBe(true);
  });

  it("❌ role 'admin' tidak valid → error pada field 'role'", () => {
    const { valid, errors } = validateUserShape({ ...base, role: "admin" });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("role"))).toBe(true);
  });

  it("❌ role 'technician' sudah tidak valid", () => {
    const { valid } = validateUserShape({ ...base, role: "technician" });
    expect(valid).toBe(false);
  });

  it("❌ multi-error terkumpul semua", () => {
    const { valid, errors } = validateUserShape({
      id: "x",
      username: "",
      name: 99,
      role: "hacker",
    });
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });

  it("✅ semua 5 role resmi diterima", () => {
    for (const role of ["leader", "cpm", "supervisor", "it", "attendant"]) {
      const { valid } = validateUserShape({ ...base, role });
      expect(valid, `role '${role}' seharusnya valid`).toBe(true);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════
//  Struktur data: ROLES & PROJECT_ROLE_MAP
// ══════════════════════════════════════════════════════════════════════
describe("Struktur Data ROLES", () => {
  it("✅ ada tepat 5 role terdaftar", () => {
    expect(Object.keys(ROLES)).toHaveLength(5);
  });

  it("✅ setiap role punya field: label, level, description", () => {
    for (const [key, role] of Object.entries(ROLES)) {
      expect(role, `'${key}' harus punya label`).toHaveProperty("label");
      expect(typeof role.level, `'${key}'.level harus number`).toBe("number");
      expect(role, `'${key}' harus punya description`).toHaveProperty(
        "description",
      );
    }
  });

  it("✅ hierarki level: leader > cpm > supervisor > it > attendant", () => {
    expect(ROLES.leader.level).toBeGreaterThan(ROLES.cpm.level);
    expect(ROLES.cpm.level).toBeGreaterThan(ROLES.supervisor.level);
    expect(ROLES.supervisor.level).toBeGreaterThan(ROLES.it.level);
    expect(ROLES.it.level).toBeGreaterThan(ROLES.attendant.level);
  });

  it("✅ semua level unik (tidak ada duplikat)", () => {
    const levels = Object.values(ROLES).map((r) => r.level);
    const unique = new Set(levels);
    expect(unique.size).toBe(levels.length);
  });

  it("✅ ada tepat 4 proyek dalam PROJECT_ROLE_MAP", () => {
    expect(Object.keys(PROJECT_ROLE_MAP)).toHaveLength(4);
  });

  it("✅ setiap proyek punya minimal 1 role", () => {
    for (const [project, roles] of Object.entries(PROJECT_ROLE_MAP)) {
      expect(roles.length, `'${project}' harus punya ≥1 role`).toBeGreaterThan(
        0,
      );
    }
  });

  it("✅ semua role dalam PROJECT_ROLE_MAP adalah role yang dikenal sistem", () => {
    const knownRoles = Object.keys(ROLES);
    const allRolesInMap = Object.values(PROJECT_ROLE_MAP).flat();
    for (const role of allRolesInMap) {
      expect(knownRoles, `'${role}' harus terdaftar di ROLES`).toContain(role);
    }
  });

  it("✅ 'technician' sudah tidak ada di PROJECT_ROLE_MAP", () => {
    const allRolesInMap = Object.values(PROJECT_ROLE_MAP).flat();
    expect(allRolesInMap).not.toContain("technician");
  });

  it("✅ 'cpm' terdaftar di semua proyek", () => {
    for (const roles of Object.values(PROJECT_ROLE_MAP)) {
      expect(roles).toContain("cpm");
    }
  });

  it("✅ 'it' terdaftar di semua proyek", () => {
    for (const roles of Object.values(PROJECT_ROLE_MAP)) {
      expect(roles).toContain("it");
    }
  });

  it("✅ 'attendant' hanya ada di pahamaja & smartparking", () => {
    expect(PROJECT_ROLE_MAP.pahamaja).toContain("attendant");
    expect(PROJECT_ROLE_MAP.smartparking).toContain("attendant");
    expect(PROJECT_ROLE_MAP.aura).not.toContain("attendant");
    expect(PROJECT_ROLE_MAP.opreport).not.toContain("attendant");
  });
});
