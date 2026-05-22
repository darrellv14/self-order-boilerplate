import type { CSSProperties } from "react";

import { themePresets } from "@/data/mock";

export const defaultTheme = themePresets[0];

export function buildThemeStyle() {
  return {
    "--brand-primary": defaultTheme.primary,
    "--brand-secondary": defaultTheme.secondary,
    "--brand-accent": defaultTheme.accent,
    "--brand-surface": defaultTheme.surface,
    "--brand-surface-alt": defaultTheme.surfaceAlt,
    "--brand-text": defaultTheme.text,
  } as CSSProperties;
}
