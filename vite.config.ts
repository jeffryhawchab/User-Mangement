import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteMockServe } from "vite-plugin-mock";
export default defineConfig({
  server: {
    cors: {
      origin: true, // Reflects the request origin
      credentials: true,
    },
  },
  plugins: [
    tailwindcss(),
    viteMockServe({
      mockPath: "mock",
      enable: true,
    }),
  ],
});