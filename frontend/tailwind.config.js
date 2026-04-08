/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 - Dark Theme
        "primary": "#aec6ff",
        "on-primary": "#002e6b",
        "primary-container": "#0070f3",
        "on-primary-container": "#ffffff",
        "secondary": "#c0c1ff",
        "on-secondary": "#1000a9",
        "secondary-container": "#3131c0",
        "on-secondary-container": "#b0b2ff",
        "tertiary": "#ffb596",
        "on-tertiary": "#581e00",
        "tertiary-container": "#ca4e00",
        "on-tertiary-container": "#fffeff",
        "error": "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "background": "#131313",
        "on-background": "#e5e2e1",
        "surface": "#131313",
        "on-surface": "#e5e2e1",
        "surface-variant": "#353534",
        "on-surface-variant": "#c1c6d7",
        "outline": "#8b90a0",
        "outline-variant": "#414754",
        "surface-dim": "#131313",
        "surface-bright": "#3a3939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
        "inverse-primary": "#0059c5",
      },
      fontFamily: {
        "headline": ["Inter"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px",
      },
      boxShadow: {
        "glow": "0 0 20px rgba(174, 198, 255, 0.3)",
        "glow-lg": "0 0 30px rgba(0, 112, 243, 0.3)",
      },
      backdropBlur: {
        "xs": "2px",
        "sm": "4px",
        "md": "12px",
      }
    },
  },
  plugins: [],
}

