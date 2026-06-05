import { THEME_STORAGE_KEY } from "@/lib/theme";

const themeScript = `
(function () {
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var stored = localStorage.getItem(key);
    var dark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: inline boot script avoids theme flash
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
