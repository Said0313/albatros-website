import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The admin UI runs on :5173 and proxies /api to the backend on :4000, so the
// browser sees a single origin and the auth cookie stays first-party.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
