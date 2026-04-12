import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readDotEnv } from "./src/server/env";
import { ollamaCloudProxy } from "./src/server/ollamaProxy";

const env = readDotEnv(__dirname);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ollamaCloudProxy(env.OLLAMA_KEY || "", env.OLLAMA_MODEL || "gemma3:4b"),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
