/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        vintage: {
          50: '#fdfbf7',
          100: '#fbf8f3',
          200: '#f0eae1',
          300: '#e5ded5',
          400: '#d9cdbd',
          500: '#a67c52',
          600: '#8e653e',
          700: '#754f2d',
          800: '#5c3b20',
          900: '#2b241e',
          terracotta: '#bc473b',
        }
      },
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'Tinos', 'Georgia', 'serif'],
        sans: ['"Times New Roman"', 'Times', 'Tinos', 'Georgia', 'serif'],
        mono: ['"Times New Roman"', 'Times', 'Tinos', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.375rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
        "3xl": "1rem",
      },
    },
  },
  plugins: [],
}
