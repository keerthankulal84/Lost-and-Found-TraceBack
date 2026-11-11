import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite is only the build tool that runs React. The app runs on port 3000.
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
});
