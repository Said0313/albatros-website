/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Mirrors the public site's clinical palette (navy + clinical blue).
        ink: "#0C1B3A",
        clinical: "#2E549C",
        soft: "#5E6E8F",
        line: "#E5EAF3",
        panel: "#F4F7FB",
      },
    },
  },
  plugins: [],
};
