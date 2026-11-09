export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { night: "#0c0e1a", panel: "#151929", edge: "#272d4a", violet: { DEFAULT: "#8b5cf6", 400: "#a78bfa" }, lime: "#c6f432", coral: "#ff6b81", amber: "#fbbf24" },
      fontFamily: { display: ["Sora", "system-ui", "sans-serif"], sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
