"use client";

import { useTheme } from "@/components/theme-provider";
import { tokens } from "@/lib/design/tokens";

export function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme();

  const labels: Record<"light" | "dark" | "system", string> = {
    light: "Switch to dark mode",
    dark: "Switch to light mode",
    system: "Use system theme",
  };

  const icons: Record<"light" | "dark" | "system", string> = {
    light: "🌙",
    dark: "☀️",
    system: "🖥️",
  };

  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-pressed={theme !== "system"}
      aria-label={labels[theme]}
      title={`${labels[theme]} (currently ${resolved})`}
      className={`
        inline-flex items-center justify-center w-10 h-10 rounded-md
        ${tokens.color.border} ${tokens.color.text}
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        transition-colors duration-200
      `}
    >
      <span aria-hidden="true">{icons[theme]}</span>
      <span className="sr-only">{labels[theme]}</span>
    </button>
  );
}
