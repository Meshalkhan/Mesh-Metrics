const STORAGE_KEY = "mesh_theme";

export function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme() {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "dark" || value === "light" ? value : null;
}

export function resolveTheme(preference) {
  if (preference === "dark" || preference === "light") return preference;
  return getSystemTheme();
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  document.documentElement.setAttribute("data-theme", resolved);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", resolved === "dark" ? "#0f1115" : "#f4f4f4");
  }
}

export function persistTheme(theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function initThemeFromStorage() {
  const stored = getStoredTheme();
  const theme = stored ?? getSystemTheme();
  applyTheme(theme);
  return theme;
}
