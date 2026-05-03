/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Vitest Global Setup
 *  Dijalankan SEBELUM setiap test file.
 * ═══════════════════════════════════════════════════════════════════════
 */

// Tambahkan custom matchers dari jest-dom ke Vitest
// Contoh: .toBeInTheDocument(), .toHaveTextContent(), .toBeDisabled()
import "@testing-library/jest-dom";
