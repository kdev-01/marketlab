export const THEME_STORAGE_KEY = "marketlab-theme";

export type ThemeSetting = "light" | "dark" | "system";

export function resolveTheme(setting: ThemeSetting): "light" | "dark" {
  if (setting === "system") {
    if (typeof window === "undefined") {
      return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return setting;
}

export function applyThemeClass(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}
