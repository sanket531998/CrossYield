// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 8px 2px rgba(34, 197, 94, 0.7), 0 0 12px 4px rgba(59, 130, 246, 0.5)",
      },
      animation: {
        glow: "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            boxShadow:
              "0 0 8px 2px rgba(34, 197, 94, 0.4), 0 0 12px 4px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 12px 4px rgba(34, 197, 94, 0.7), 0 0 20px 6px rgba(59, 130, 246, 0.5)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
