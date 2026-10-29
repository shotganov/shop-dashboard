import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  // без явного адреса Vite на Windows может слушать только IPv6 (::1)
  server: { host: "127.0.0.1" },
});
