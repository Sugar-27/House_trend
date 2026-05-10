"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const storageKey = "house-trend-theme";

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(storageKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new CustomEvent("house-trend-theme-change", { detail: theme }));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    applyTheme(preferredTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`切换到${isDark ? "浅色" : "暗黑"}主题`}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{isDark ? "☾" : "☀"}</span>
      <strong>{isDark ? "暗黑" : "浅色"}</strong>
    </button>
  );
}
