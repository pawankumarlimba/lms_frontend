import type { Config } from "tailwindcss";

/**
 * Design tokens for the "Ledger" visual system (see frontend README for the
 * rationale). Every component pulls color/type/spacing from THIS file via
 * Tailwind utility classes - nothing is hardcoded as raw hex/px in JSX.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "var(--color-ink-950)",
          900: "var(--color-ink-900)",
          800: "var(--color-ink-800)",
        },
        navy: {
          700: "var(--color-navy-700)",
          600: "var(--color-navy-600)",
          500: "var(--color-navy-500)",
          400: "var(--color-navy-400)",
        },
        paper: {
          DEFAULT: "var(--color-paper)",
          muted: "var(--color-paper-muted)",
        },
        brass: {
          600: "var(--color-brass-600)",
          500: "var(--color-brass-500)",
          400: "var(--color-brass-400)",
          100: "var(--color-brass-100)",
        },
        slate: {
          700: "var(--color-slate-700)",
          500: "var(--color-slate-500)",
          300: "var(--color-slate-300)",
          200: "var(--color-slate-200)",
        },
        success: {
          600: "var(--color-success-600)",
          100: "var(--color-success-100)",
        },
        danger: {
          600: "var(--color-danger-600)",
          100: "var(--color-danger-100)",
        },
        warning: {
          600: "var(--color-warning-600)",
          100: "var(--color-warning-100)",
        },
        border: "var(--color-border)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-lg": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-md": ["1.875rem", { lineHeight: "1.2" }],
        "heading": ["1.25rem", { lineHeight: "1.3" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
        "body": ["0.9375rem", { lineHeight: "1.6" }],
        "caption": ["0.8125rem", { lineHeight: "1.4" }],
        "label": ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.875rem",
        xl: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(11 18 32 / 0.04), 0 1px 8px 0 rgb(11 18 32 / 0.06)",
        raised: "0 4px 16px 0 rgb(11 18 32 / 0.10)",
      },
      maxWidth: {
        shell: "78rem",
      },
    },
  },
  plugins: [],
};

export default config;
